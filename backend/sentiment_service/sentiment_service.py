from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pickle
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.base import BaseEstimator, TransformerMixin
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import sys

# Create custom ItemSelector class needed for the model
class ItemSelector(BaseEstimator, TransformerMixin):
    """For data transformers that return a subset of data columns."""
    
    def __init__(self, key):
        self.key = key

    def fit(self, x, y=None):
        return self

    def transform(self, data_dict):
        return data_dict[self.key]
    
class TextFeatureTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X  # Just returns input as-is

class TextFeatureExtractor(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X  # No-op

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define paths to model files
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'Recommendation Model')
MODEL_PATH = os.path.join(MODEL_DIR, 'simple_lr_model.joblib')
MODEL_INFO_PATH = os.path.join(MODEL_DIR, 'model_info.pkl')

# In-memory cache for sentiment predictions to avoid recomputing
SENTIMENT_CACHE = {}

# Load ML model and vectorizer if available
# Redirect print statements to stderr for debugging messages
def debug_print(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

try:
    with open(MODEL_INFO_PATH, 'rb') as f:
        MODEL_INFO = pickle.load(f)
    
    # Load the trained model
    debug_print("Loading recommendation model...")
    try:
        MODEL = joblib.load(MODEL_PATH)
        MODEL_READY = True
        debug_print("Model loaded successfully!")
    except Exception as e:
        debug_print(f"Model could not be loaded with error: {e}")
        debug_print("Falling back to simple sentiment analysis")
        MODEL = None
        MODEL_READY = False
    
    # Extract category mappings for later use
    SENTIMENT_CATEGORIES = MODEL_INFO.get('sentiment_categories', {})
    CATEGORY_NAMES = MODEL_INFO.get('category_names', {})
    
    debug_print(f"Model accuracy: {MODEL_INFO.get('accuracy', 'unknown')}")
    debug_print(f"Sentiment categories: {SENTIMENT_CATEGORIES}")
except Exception as e:
    debug_print(f"Error loading model: {e}")
    # Fallback to a simpler approach if model can't be loaded
    MODEL = None
    MODEL_INFO = None
    SENTIMENT_CATEGORIES = {}
    CATEGORY_NAMES = {}
    MODEL_READY = False

def preprocess_text(text):
    """Basic text preprocessing for model input"""
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def analyze_sentiment_with_model(text, rating):
    """
    Analyze sentiment using the trained recommendation model
    """
    # If model isn't available, use simple analysis instead
    if not MODEL_READY:
        return analyze_sentiment_simple(text, rating)
        
    # Ensure rating is an integer between 1-5
    try:
        rating_int = int(float(rating))
        rating_int = max(1, min(5, rating_int))  # Clamp between 1-5
    except (ValueError, TypeError):
        debug_print(f"Warning: Could not convert rating '{rating}' to integer in model, using default 3")
        rating_int = 3  # Default to neutral if conversion fails
    
    try:
        # Create a cache key from text and the converted rating
        cache_key = f"{text}_{rating_int}"
        
        # Check if we already have a cached result
        if cache_key in SENTIMENT_CACHE:
            return SENTIMENT_CACHE[cache_key]
        
        # For very short texts or extreme ratings, use simplified analysis
        # This avoids unnecessary model calls for obvious cases
        if len(text) < 5:
            if rating_int >= 4:
                sentiment = "positive"
                confidence = 0.8
            elif rating_int <= 2:
                sentiment = "negative"
                confidence = 0.8
            else:
                sentiment = "neutral"
                confidence = 0.6
                
            result = {
                "sentiment": sentiment,
                "confidence": confidence,
                "top_sentiments": [{
                    "sentiment": sentiment,
                    "probability": confidence
                }],
                "model_used": "fast_heuristic",
                "details": {
                    "prediction_class": SENTIMENT_CATEGORIES.get(sentiment, 3),
                    "text": text,
                    "rating": rating
                }
            }
            SENTIMENT_CACHE[cache_key] = result
            return result
        
        # Preprocess the text
        processed_text = preprocess_text(text)
        
        # Prepare input for the model
        X = {
            'text': processed_text,
            'rating': rating_int
        }
        debug_print(f"Model input - text: '{processed_text}', rating: {rating_int}")
        
        # Make prediction (with simplified approach)
        prediction = MODEL.predict([X])[0]
        prediction_proba = MODEL.predict_proba([X])[0]
        
        # Get the sentiment category name
        sentiment = CATEGORY_NAMES.get(str(prediction), "neutral")
        
        # Calculate confidence from probabilities
        confidence = float(prediction_proba.max())
        
        # Get top 3 sentiment probabilities (more efficiently)
        top_indices = prediction_proba.argsort()[-3:][::-1]  # Get indices of top 3 probabilities
        top_sentiments = [
            {
                "sentiment": CATEGORY_NAMES.get(str(i), "unknown"),
                "probability": float(prediction_proba[i])
            }
            for i in top_indices if str(i) in CATEGORY_NAMES
        ]
        
        # Create result
        result = {
            "sentiment": sentiment,
            "confidence": confidence,
            "top_sentiments": top_sentiments,
            "model_used": "recommendation_model",
            "details": {
                "prediction_class": int(prediction),
                "text": processed_text,
                "rating": rating_int
            }
        }
        debug_print(f"Model result - sentiment: {sentiment}, confidence: {confidence}")
        
        # Cache the result for future use
        SENTIMENT_CACHE[cache_key] = result
        return result
        
    except Exception as e:
        print(f"Error using model for prediction: {e}")
        # Fall back to simple sentiment analysis
        return analyze_sentiment_simple(text, rating)

def analyze_sentiment_simple(text, rating):
    """
    Simple rule-based sentiment analysis as a fallback
    """
    # Ensure rating is an integer between 1-5
    try:
        rating_int = int(float(rating))
        rating_int = max(1, min(5, rating_int))  # Clamp between 1-5
    except (ValueError, TypeError):
        debug_print(f"Warning: Could not convert rating '{rating}' to integer, using default 3")
        rating_int = 3  # Default to neutral if conversion fails
    
    # Map ratings to sentiment scores
    rating_map = {
        1: -0.8,  # Very negative
        2: -0.4,  # Negative
        3: 0.0,   # Neutral
        4: 0.4,   # Positive
        5: 0.8    # Very positive
    }
    
    # Get sentiment from rating
    rating_score = rating_map.get(rating_int, 0)
    debug_print(f"Rating {rating} converted to {rating_int}, score: {rating_score}")
    
    # Simple lexicon-based sentiment from text
    positive_words = ['good', 'great', 'excellent', 'amazing', 'awesome', 'love', 'like', 'best', 'not bad']
    negative_words = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'dislike', 'poor', 'not', 'why']
    
    # Count positive and negative words
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    # Calculate text sentiment score
    text_score = 0
    if positive_count > 0 or negative_count > 0:
        text_score = (positive_count - negative_count) / (positive_count + negative_count)
    
    # Combine rating and text sentiment (rating has higher weight)
    combined_score = (0.7 * rating_score) + (0.3 * text_score)
    
    # Determine sentiment category
    if combined_score > 0.5:
        sentiment = "very_positive"
        confidence = min(0.9, 0.5 + combined_score / 2)
    elif combined_score > 0.15:
        sentiment = "positive"
        confidence = min(0.85, 0.4 + combined_score / 2)
    elif combined_score > 0.05:
        sentiment = "mixed_positive"
        confidence = min(0.8, 0.3 + combined_score / 2) 
    elif combined_score >= -0.05:
        sentiment = "needs_improvement"
        confidence = min(0.7, 0.5 - abs(combined_score))
    elif combined_score >= -0.15:
        sentiment = "mixed_negative"
        confidence = min(0.8, 0.3 + abs(combined_score) / 2)
    elif combined_score >= -0.5:
        sentiment = "negative"
        confidence = min(0.85, 0.4 + abs(combined_score) / 2)
    else:
        sentiment = "very_negative"
        confidence = min(0.9, 0.5 + abs(combined_score) / 2)
    
    return {
        "sentiment": sentiment,
        "confidence": confidence,
        "top_sentiments": [
            {"sentiment": sentiment, "probability": confidence},
            {"sentiment": "needs_improvement", "probability": max(0.1, 0.8 - confidence)},
        ],
        "model_used": "simple_rule_based",
        "details": {
            "rating_score": rating_score,
            "text_score": text_score,
            "combined_score": combined_score
        }
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    """Endpoint for sentiment analysis"""
    try:
        data = request.get_json()
        # Validate required fields
        if not all(key in data for key in ['rating', 'text']):
            return jsonify({'error': 'Missing required fields: rating and text'}), 400
            
        # Perform sentiment analysis
        if MODEL_READY:
            result = analyze_sentiment_with_model(data['text'], data['rating'])
        else:
            result = analyze_sentiment_simple(data['text'], data['rating'])
            
        return jsonify(result)
        
    except Exception as e:
        print(f"Error analyzing sentiment: {e}")
        return jsonify({'error': f'Failed to analyze sentiment: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    status = "ok" if MODEL_READY else "limited"
    return jsonify({
        "status": status,
        "model_loaded": MODEL_READY,
        "model_accuracy": MODEL_INFO.get('accuracy', 'unknown') if MODEL_INFO else 'N/A'
    })

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--cli':
        import json
        # Properly handle CLI arguments
        if len(sys.argv) >= 4:
            text = sys.argv[2]  # Get the text argument
            try:
                # Parse as float first to handle potential decimal values, then convert to int
                rating = int(float(sys.argv[3]))  # Get the rating argument as an integer
                # Ensure rating is in valid range
                rating = max(1, min(5, rating))
                debug_print(f"Parsed rating '{sys.argv[3]}' to integer value: {rating}")
            except ValueError:
                rating = 3  # Default rating if conversion fails
                debug_print(f"Warning: Could not convert rating '{sys.argv[3]}' to integer, using default rating 3")
        else:
            text = sys.argv[2] if len(sys.argv) > 2 else ""
            rating = 3  # Default rating
            debug_print(f"Warning: No rating provided, using default rating 3")
            
        # Log the arguments for debugging
        debug_print(f"DEBUG: Processing text: '{text}' with rating: {rating} (type: {type(rating)})")
        
        # Run the sentiment analysis
        if MODEL_READY:
            result = analyze_sentiment_with_model(text, rating)
        else:
            result = analyze_sentiment_simple(text, rating)
        
        debug_print(f"Final sentiment result: {result['sentiment']} with confidence {result['confidence']}")
            
        # ONLY output the JSON result to stdout (this is what Node.js will capture)
        print(json.dumps(result))
        sys.exit(0)

    port = int(os.environ.get('SENTIMENT_SERVICE_PORT', 5000))
    print(f"Starting sentiment service on port {port}")
    print(f"ML model {'loaded' if MODEL_READY else 'NOT loaded - using basic sentiment analysis'}")
    app.run(host='0.0.0.0', port=port)