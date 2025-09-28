const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a MySQL connection pool
const pool = require('../db_connect');

// Check database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

// Execute database queries
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

// Initialize database with required tables if they don't exist
async function initDatabase() {
  try {
    // Create feedback table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        park_id INT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        sentiment_score DECIMAL(5,4),
        sentiment_category ENUM('positive', 'neutral', 'negative') DEFAULT 'neutral',
        recommendation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_park (park_id),
        INDEX idx_sentiment (sentiment_category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('Database initialized with required tables');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    throw error;
  }
}

// Call init when the module is loaded
(async () => {
  await testConnection();
  await initDatabase();
})();

module.exports = {
  query,
  testConnection,
  initDatabase
};