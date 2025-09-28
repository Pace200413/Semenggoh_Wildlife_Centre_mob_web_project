const express = require('express');
const router = express.Router();
const pool = require('../db_connect'); // This is your PostgreSQL pool from db.js

router.get('/', async (req, res) => {
  const user_id = req.query.userId;
  const role = req.query.role;
  console.log(role);

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required as query param' });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    // Fetch notifications where the sender is the same as the input user name
    // or the recipient is the same as the input user's guide_id
    const [notifications] = await pool.query(
      `
      SELECT 
        n.*,
        CASE 
          WHEN n.recipient = 'All Guides' THEN 'All Guides'
          WHEN n.recipient = 'Admin' THEN 'Admin'
          ELSE COALESCE(u.name, 'Unknown')
        END AS recipient_name
      FROM GuideNotifications n
      LEFT JOIN users u ON n.recipient = u.user_id
      WHERE 
        n.sender = ? OR n.recipient = ? OR n.recipient = 'Admin' ${role !== 'visitor' ? "OR n.recipient = 'All Guides'" : ""}
      ORDER BY n.date DESC;
      `,
      [user_id, user_id]
    );

    // For each notification, determine the sender's and recipient's user_id
    const notificationsWithIds = await Promise.all(notifications.map(async (notification) => {
      let senderName = 'System';
      if (notification.sender !== 'Admin') {
        const [senderRows] = await pool.query('SELECT name FROM users WHERE user_id = ?', [notification.sender]);
        if (senderRows.length > 0) {
          senderName = senderRows[0].name;
        }
      }else{
        senderName = 'Admin';
      }

      // Return notification with senderUserId and recipientUserId
      return {
        ...notification,
        senderName
      };
    }));

    // Send the notifications with sender and recipient user IDs
    res.json(notificationsWithIds);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});


router.post('/', async (req, res) => {
  const { type, sender, recipient, subject, message } = req.body;

  if (!type || !recipient || !sender) {
    return res.status(400).json({ error: 'Type, sender, and recipient are required fields' });
  }

  if (sender === recipient) {
    return res.status(400).json({ error: 'Sender and recipient cannot be the same person' });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    // Insert notification
    await connection.query(
      `INSERT INTO GuideNotifications (type, sender, recipient, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [type, sender, recipient, subject, message]
    );

    res.status(201).json({ message: 'Notification created' });

  } catch (err) {
    console.error('Error inserting notification:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});


// GET /api/search-users?query=alice
router.get('/search-users', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    const [rows] = await pool.query(
      `SELECT user_id, name, role FROM users 
       WHERE name LIKE ? AND approved = 1 LIMIT 10`,
      [`%${query}%`]
    );
    res.json(rows);
    console.log(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search users' });
  }
});


module.exports = router;
