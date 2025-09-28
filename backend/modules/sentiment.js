const path = require('path');
const { spawn } = require('child_process');

/**
 * Analyzes the sentiment of text using the local Python sentiment service (via spawn)
 * @param {string} text - Text to analyze
 * @param {number} rating - Rating score (1-5), defaults to 3 if not provided
 * @returns {Promise<Object>} - Sentiment analysis result with score and category
 */
async function analyzeSentiment(text, rating = 3) {
  // Simple validation
  if (!text || text.trim() === '') {
    return { score: 0, sentiment_category: 'neutral' };
  }

  // Ensure rating is a number between 1-5
  const validRating = Math.max(1, Math.min(5, parseInt(rating) || 3));

  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../sentiment_service/sentiment_service.py');
    
    // Spawn the Python process with proper arguments
    const pythonProcess = spawn('python', [
      pythonScript, 
      '--cli', 
      text, 
      validRating.toString()
    ]);

    let stdoutData = '';
    let stderrData = '';

    // Collect output data
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
      // Log stderr for debugging purposes
      console.log('Sentiment analysis stderr:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Sentiment script exited with code', code, 'stderr:', stderrData);
        return resolve({ score: 0, sentiment_category: 'neutral' }); // fallback
      }

      try {
        // Process the last line of stdout which should contain the JSON result
        // We're relying on our updated Python script to output ONLY the JSON result
        // without any debug information in stdout
        const lines = stdoutData.split('\n').filter(line => line.trim());
        const jsonLine = lines[lines.length - 1]; // Get the last non-empty line
        
        if (!jsonLine) {
          console.error('No JSON data found in output');
          console.log('Raw stdout:', stdoutData);
          console.log('WARNING: No JSON data found in output, using fallback values');
          return resolve({ score: 0, sentiment_category: 'neutral' }); // fallback
        }
        
        const parsed = JSON.parse(jsonLine);
        
        // Get the sentiment and score from Python service
        const combinedScore = parsed.details?.combined_score || 0;
        const rawSentiment = parsed.sentiment || '';
        
        console.log('DEBUG: Raw sentiment from Python:', rawSentiment);
        console.log('DEBUG: Score from Python:', combinedScore);
        
        // Use score to determine sentiment category - this is simple but reliable
        let sentiment_category;
        
        // Explicitly set categories based on the score
        if (combinedScore > 0.2) {
          sentiment_category = 'positive';
        } else if (combinedScore < -0.2) {
          sentiment_category = 'negative';
        } else {
          // EXPLICITLY set neutral category to neutral
          sentiment_category = 'neutral';
        }
        
        // FORCE LOG sentiment_category to verify it's set correctly
        console.log('IMPORTANT: Final sentiment_category being saved:', sentiment_category);
        
        console.log('DEBUG: Using fixed sentiment_category:', sentiment_category);
        
        console.log('DEBUG: Using sentiment_category:', sentiment_category);
        
        console.log('DEBUG: Mapped sentiment_category:', sentiment_category);
        
        // Create the response object with guaranteed sentiment_category
        const response = {
          score: combinedScore,
          sentiment_category: sentiment_category || 'neutral',  // Extra fallback
          details: parsed.details || {}
        };
        
        // Log the final response to ensure sentiment_category is set
        console.log('DEBUG: Final sentiment response:', JSON.stringify(response));
        
        // Return the response
        resolve(response);
      } catch (parseError) {
        console.error('Failed to parse sentiment response:', parseError);
        console.error('Raw stdout:', stdoutData);
        console.error('Raw stderr:', stderrData);
        resolve({ score: 0, sentiment_category: 'neutral' }); // fallback
      }
    });
  });
}

module.exports = {
  analyzeSentiment
};
