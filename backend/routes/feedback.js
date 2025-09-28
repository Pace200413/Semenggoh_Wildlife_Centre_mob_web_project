const express = require('express');
const router = express.Router();
const db = require('../modules/database');
const sentiment = require('../modules/sentiment');
const helpers = require('../modules/helpers');

// routes/feedback.js  (or wherever the /stats route lives)
router.get('/stats', async (req, res) => {
  try {
    const guideId = req.query.guideId;

    const [guideResult] = await db.query(
      'SELECT guide_id FROM park_guide WHERE user_id = ?',
      [guideId]
    );

    if (guideResult.length === 0) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    const guide_id = guideResult.guide_id;

    const where  = guide_id ? 'WHERE b.guide_id = ?' : '';
    const params = guide_id ? [guide_id] : [];

    /* distinct categories (for debugging / completeness) */
    const categories = await db.query(
      `SELECT DISTINCT f.sentiment_category, COUNT(*) AS count
         FROM feedback f
         JOIN booking  b ON b.booking_id = f.booking_id
         ${where}
         GROUP BY f.sentiment_category`,
      params
    );
    console.log('Sentiment categories for guide', guide_id, ':', categories);

    /* aggregated stats */
    const [stats] = await db.query(
      `SELECT 
          COUNT(*)                                AS total_count,
          ROUND(AVG(f.rating),1)                  AS average_rating,
          COUNT(CASE WHEN f.sentiment_category IN ('positive','very_positive','mixed_positive')  THEN 1 END) AS positive_count,
          COUNT(CASE WHEN f.sentiment_category IN ('neutral','needs_improvement','') OR f.sentiment_category IS NULL THEN 1 END) AS neutral_count,
          COUNT(CASE WHEN f.sentiment_category IN ('negative','very_negative','mixed_negative') THEN 1 END) AS negative_count
       FROM feedback f
       JOIN booking  b ON b.booking_id = f.booking_id
       ${where}`,
       params
    );

    const total = stats.total_count || 0;
    const pct   = x => (total ? (x / total) * 100 : 0);

    res.json({
      total,
      average_rating        : stats.average_rating,
      simplified : {
        positive            : stats.positive_count,
        neutral             : stats.neutral_count,
        negative            : stats.negative_count,
        positive_percentage : pct(stats.positive_count),
        neutral_percentage  : pct(stats.neutral_count),
        negative_percentage : pct(stats.negative_count)
      },
      model_info : {
        name         : 'Sentiment Analysis Model',
        accuracy     : 85,
        last_updated : new Date().toISOString().split('T')[0]
      },
      /* optional: raw buckets for the “Detailed Sentiment” table */
      sentiment_counts : {
        positive          : stats.positive_count,
        needs_improvement : stats.neutral_count,
        negative          : stats.negative_count
      },
      sentiment_percentages : {
        positive          : pct(stats.positive_count),
        needs_improvement : pct(stats.neutral_count),
        negative          : pct(stats.negative_count)
      }
    });
  } catch (e) {
    console.error('Error fetching guide stats', e);
    res.status(500).json({ error: 'Failed to fetch feedback statistics' });
  }
});


// Get all feedback
router.get('/', async (req, res) => {
  try {
    // Get all feedback items with explicit column selection to ensure we get all fields
    const guideUserId = req.query.userId; // assuming it's passed as a URL param

    const feedbackItems = await db.query(`
      SELECT 
        f.id, 
        f.user_id, 
        f.booking_id, 
        f.name, 
        f.rating, 
        f.comment, 
        f.sentiment_score, 
        f.sentiment_category, 
        f.recommendation, 
        f.created_at, 
        f.updated_at
      FROM feedback f
      JOIN booking b ON f.booking_id = b.booking_id
      JOIN park_guide pg ON b.guide_id = pg.guide_id
      WHERE pg.user_id = ?
      ORDER BY f.created_at DESC
    `, [guideUserId]);
    
    // Log feedback information for debugging
    console.log(`Retrieved ${feedbackItems.length} feedback items`);
    if (feedbackItems.length > 0) {
      console.log('Sample item fields:', Object.keys(feedbackItems[0]).join(', '));
      console.log('Sample sentiment data:', {
        score: feedbackItems[0].sentiment_score,
        category: feedbackItems[0].sentiment_category
      });
    }
    
    // Ensure each item has the sentiment fields properly formatted
    const formattedItems = feedbackItems.map(item => {
      // Log each item's sentiment_category for debugging
      console.log(`Feedback ID ${item.id}: sentiment_category = '${item.sentiment_category}'`);
      
      return {
        ...item,
        sentiment_score: item.sentiment_score !== null ? parseFloat(item.sentiment_score) : 0,
        // Use neutral consistently instead of neutral
        sentiment_category: item.sentiment_category || 'neutral', 
        // Format dates to ISO strings if needed
        created_at: item.created_at instanceof Date ? item.created_at.toISOString() : item.created_at,
        updated_at: item.updated_at instanceof Date ? item.updated_at.toISOString() : item.updated_at
      };
    });
    
    res.json(formattedItems);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get feedback by ID
router.get('/:id', async (req, res) => {
  try {
    // Get feedback with explicit column selection
    const [feedback] = await db.query(`
      SELECT 
        id, 
        user_id, 
        booking_id, 
        name, 
        rating, 
        comment, 
        sentiment_score, 
        sentiment_category, 
        recommendation, 
        created_at, 
        updated_at
      FROM feedback 
      WHERE id = ?
    `, [req.params.id]);
    
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    // Log feedback details for debugging
    console.log(`Retrieved feedback #${req.params.id}:`, {
      fields: Object.keys(feedback).join(', '),
      sentiment_score: feedback.sentiment_score,
      sentiment_category: feedback.sentiment_category
    });
    
    // Format the feedback item
    const formattedFeedback = {
      ...feedback,
      sentiment_score: feedback.sentiment_score !== null ? parseFloat(feedback.sentiment_score) : 0,
      sentiment_category: feedback.sentiment_category || 'neutral', // Provide a default if null/empty
      // Format dates to ISO strings if needed
      created_at: feedback.created_at instanceof Date ? feedback.created_at.toISOString() : feedback.created_at,
      updated_at: feedback.updated_at instanceof Date ? feedback.updated_at.toISOString() : feedback.updated_at
    };
    
    res.json(formattedFeedback);
  } catch (error) {
    console.error(`Error fetching feedback ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Create new feedback with sentiment analysis
router.post('/', async (req, res) => {
  try {
    // Extract values from request body
    let { user_id, booking_id, rating, comment, name } = req.body;
    
    // Force the name to be 'Anonymous' if it's empty, undefined, or null
    if (!name || name.trim() === '') {
      name = 'Anonymous';
      console.log('Setting default name to Anonymous');
    }
    
    if (!user_id || !booking_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get sentiment score from Python service
    let sentimentScore = 0;
    let sentimentCategory = 'neutral';  // Default to neutral instead of neutral
    
    if (comment) {
      try {
        console.log(`Analyzing sentiment for comment: "${comment}" with rating: ${rating}`);
        
        // Pass both comment and rating to the sentiment analyzer
        const sentimentResult = await sentiment.analyzeSentiment(comment, rating);
        sentimentScore = sentimentResult.score;
        sentimentCategory = sentimentResult.sentiment_category;
        
        console.log('🟢 Sentiment analysis successful:');
        console.log('- Score:', sentimentScore);
        console.log('- Category:', sentimentCategory);
        console.log('- Full result:', JSON.stringify(sentimentResult, null, 2));
      } catch (sentimentError) {
        console.error('🔴 Error analyzing sentiment:', sentimentError);
        // Continue with default sentiment if service fails
      }
    } else {
      console.log('⚠️ No comment provided, using default neutral sentiment');
    }
    
    // Generate recommendation based on feedback
    const recommendation = helpers.generateRecommendation(sentimentCategory, sentimentScore, booking_id);
    
    // Log what we're about to save to the database
    console.log('\n📊 Saving to database with sentiment data:');
    console.log('- Name to save:', name);
    console.log('- Score to save:', sentimentScore);
    console.log('- Category to save:', sentimentCategory);
    
    // Ensure we have a valid sentiment category
    if (!sentimentCategory) {
      console.log('WARNING: sentimentCategory is empty or null, using default value');
      sentimentCategory = 'neutral';
    }
    
    console.log('Final sentiment_category to insert:', sentimentCategory);
    
    // Save feedback to database
    const result = await db.query(
      'INSERT INTO feedback (user_id, booking_id, name, rating, comment, sentiment_score, sentiment_category, recommendation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, booking_id, name, rating, comment, sentimentScore, sentimentCategory, recommendation]
    );
    
    // Create response object
    const responseData = {
      id: result.insertId,
      user_id,
      booking_id, 
      name, // Name is already set to 'Anonymous' if it was empty
      rating,
      comment,
      sentiment_score: sentimentScore,
      sentiment_category: sentimentCategory,
      recommendation,
      created_at: new Date()
    };
    
    // Log the response we're sending
    console.log('\n📱 Sending response data:');
    console.log(JSON.stringify(responseData, null, 2));
    
    // Send the response
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});


module.exports = router;