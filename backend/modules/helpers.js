const axios = require('axios');

// Configuration for the Python recommendation service
const RECOMMENDATION_SERVICE_URL = process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:5000';

/**
 * Generates a recommendation based on feedback data
 * @param {number} rating - User rating (1-5)
 * @param {number} sentimentScore - Sentiment score from analysis
 * @param {number} parkId - ID of the park
 * @returns {string} - Personalized recommendation
 */
function generateRecommendation(sentimentCategory, sentimentScore, parkId) {
  // Basic recommendation logic - in production you might call the ML model
  // hosted in your Python service for more sophisticated recommendations
  
  // Simple logic for demonstration
  if (sentimentCategory === 'positive') {
    return "Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.";
  } else if (sentimentCategory === 'neutral') {
    return "Thank you for your feedback. Consider checking out our visitor center for more information about park attractions.";
  } else {
    return "We appreciate your feedback and will work to improve your experience. Our staff is available at the visitor center to assist with any specific concerns.";
  }
}

/**
 * For more advanced ML-based recommendations, uncomment and use this function
 * which calls the Python service that hosts the ML model
 */
/*
async function getMLRecommendation(rating, sentimentScore, parkId, userId) {
  try {
    const response = await axios.post(`${RECOMMENDATION_SERVICE_URL}/recommend`, { 
      rating,
      sentiment_score: sentimentScore,
      park_id: parkId,
      user_id: userId
    });
    
    if (response.status !== 200) {
      throw new Error(`Recommendation service returned status ${response.status}`);
    }
    
    return response.data.recommendation;
  } catch (error) {
    console.error('Error calling recommendation service:', error.message);
    return generateRecommendation(rating, sentimentScore, parkId);
  }
}
*/

/**
 * Format date for display or logging
 */
function formatDate(date) {
  return new Date(date).toLocaleString();
}

module.exports = {
  generateRecommendation,
  // getMLRecommendation, // Uncomment when ready to use
  formatDate
};