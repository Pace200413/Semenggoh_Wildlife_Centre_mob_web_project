const pool = require('./db_connect'); // This is your PostgreSQL pool from db.js
const cron = require('node-cron');

// Function to send the "License Expiry" notification
const sendLicenseExpiryNotifications = async () => {
  let connection;

  try {
    connection = await pool.getConnection();

    // Query for licenses expiring within the next 30 days and their user_id
    const [licenses] = await connection.query(`
      SELECT 
          g.guide_id, 
          g.licenseId,
          g.expiry_date,
          p.user_id
      FROM guidelicenses g
      JOIN park_guide p ON g.guide_id = p.guide_id
      WHERE g.expiry_date BETWEEN CURDATE() AND CURDATE() + INTERVAL 1 MONTH
      AND g.status = 'earned';
    `);

    if (licenses.length > 0) {
      // Insert a notification for each expiring license
      for (let license of licenses) {
        
        const message = `Your license will expire on ${new Date(license.expiry_date).toLocaleDateString()}`;
        const subject = `License ${license.licenseId} is going to expired`

        // Insert notification into the notifications table with user_id as recipient
        await connection.query(`
          INSERT INTO guidenotifications (type, sender, recipient, subject, message)
          VALUES ('License Expiry', 'System', ?, ?, ?);
        `, [license.user_id, subject, message]);

        // Optionally, send a push notification (if applicable)
        // sendPushNotification(guide.expoPushToken, 'License Expiry', message);
      }

      console.log('License expiry notifications sent');
    } else {
      console.log('No licenses expiring in the next 30 days');
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  } finally {
    if (connection) connection.release();
  }
};

// Schedule the task to run once every day at midnight
cron.schedule('0 0 * * 1', () => {
  console.log('Checking for expiring licenses...');
  sendLicenseExpiryNotifications();
});