const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const DB_NAME = process.env.DB_NAME;

async function initDatabase() {
  try {
    // Step 1: Connect without specifying the database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root', // Replace with your actual password
      multipleStatements: true,
    });

    // Step 2: Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);
    console.log(`[Init] Database '${DB_NAME}' ensured.`);

    // Step 3: Use the created database
    await connection.changeUser({ database: DB_NAME });

    // Step 4: Read all .sql files from the folder
    const sqlFolderPath = path.join(__dirname, 'naturalpark_database');
    const sqlFiles = [
      'users.sql',
      'national_park.sql',
      'licenses.sql',
      'training_course.sql',
      'certificates.sql',
      'park_guide.sql',
      'booking.sql',
      'guide_availability.sql',
      'guidecertificates.sql',
      'coursehistory.sql',
      'guidecoursestatus.sql',
      'guidelicenses.sql',
      'licenserequirements.sql',
      'feedback.sql',
      'auth_logs.sql',
      'accountlockout.sql',
      'password_reset_tokens.sql',
      'refresh_token.sql',
      'session.sql',
      'securityincident.sql',
      'booking_quotas.sql',
      'identification_results.sql',
      'iot_sensor_data.sql',
      'guidenotifications.sql',
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(sqlFolderPath, file);
      let rawSQL = fs.readFileSync(filePath, 'utf-8');

      // Replace unsupported collation
      rawSQL = rawSQL.replace('utf8mb4_0900_ai_ci', 'utf8mb4_general_ci');
      rawSQL = rawSQL.replace('CREATE TABLE', 'CREATE TABLE IF NOT EXISTS');
      rawSQL = rawSQL.replace('INSERT', 'INSERT IGNORE');

      // Optional: Log which file is being executed
      console.log(`[Init] Executing SQL from: ${file}`);

      try {
        await connection.query(rawSQL);
      } catch (err) {
        console.error(`[Init][ERROR] Failed to execute ${file}:`, err.message);
      }
    }

    console.log('[Init] All table SQL files executed successfully.');
    await connection.end();
  } catch (err) {
    console.error('Error initializing the database:', err);
    process.exit(1);
  }
}

module.exports = initDatabase;
