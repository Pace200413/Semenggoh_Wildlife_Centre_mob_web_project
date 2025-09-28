const express = require('express');
const router = express.Router();
const pool = require('../db_connect');
const axios = require('axios'); // ✅ Make sure axios is installed

// Utility to send push notification
const sendPushNotification = async (expoPushToken, title, body) => {
  if (!expoPushToken?.startsWith('ExponentPushToken')) return;

  await axios.post('https://exp.host/--/api/v2/push/send', {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
  });
};

router.post('/', async (req, res) => {
  const {
    user_id,
    guide_id,
    booking_date,
    booking_time,
    adult_count,
    child_count,
    emergency_contact_name,
    emergency_contact_no,
    remark,
    payment_method,
    price
  } = req.body;

  const newVisitorCount = (adult_count || 0) + (child_count || 0);

  if (!user_id || !guide_id || !booking_date || !booking_time || !adult_count || !emergency_contact_name || !emergency_contact_no || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('START TRANSACTION');

    // 1. Insert booking
    const bookingQuery = `
      INSERT INTO booking 
      (user_id, guide_id, booking_date, booking_time, adult_count, child_count, emergency_contact_name, emergency_contact_no, remark, status, payment_method, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const bookingValues = [
      user_id,
      guide_id,
      booking_date,
      booking_time,
      adult_count || 1,
      child_count || 0,
      emergency_contact_name,
      emergency_contact_no,
      remark,
      'pending',
      payment_method,
      price
    ];

    const [bookingResult] = await connection.query(bookingQuery, bookingValues);

    await connection.query('COMMIT');

    res.status(201).json({
      message: 'Booking created and quotas updated successfully',
      booking_id: bookingResult.insertId
    });

  } catch (err) {
    if (connection) await connection.query('ROLLBACK');
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});


router.get('/get-booking/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  const { status, date, time } = req.query;

  const connection = await pool.getConnection();
  try {
    const [guide] = await connection.query(
      'SELECT guide_id FROM park_guide WHERE user_id = ?',
      [userId]
    );

    if (guide.length === 0) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    const guideId = guide[0].guide_id;

    let query = 'SELECT * FROM booking WHERE guide_id = ?';
    const params = [guideId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND booking_date = ?';
      params.push(date);
    }

    if (time) {
      query += ' AND booking_time = ?';
      params.push(time);
    }

    const [bookings] = await connection.query(query, params);
    
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    connection.release();
  }
});

router.post('/approve-slot-by-user', async (req, res) => {
  const { userId, bookingIds } = req.body;

  if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
    return res.status(400).json({ error: 'bookingIds must be a non-empty array' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Get guide_id from user_id
    const [guideRows] = await conn.query(
      `SELECT guide_id FROM park_guide WHERE user_id = ?`,
      [userId]
    );

    if (guideRows.length === 0) {
      await conn.rollback();
      await conn.release();
      return res.status(404).json({ error: 'Guide not found' });
    }

    const guideId = guideRows[0].guide_id;

    // Update bookings
    const [result] = await conn.query(
      `UPDATE booking SET status = 'confirmed' 
       WHERE guide_id = ? AND booking_id IN (?)`,
      [guideId, bookingIds]
    );

    await conn.commit();
    await conn.release();

    res.status(200).json({ message: 'Bookings confirmed', affectedRows: result.affectedRows });
  } catch (err) {
    await conn.rollback();
    await conn.release();
    console.error('Approval error:', err);
    res.status(500).json({ error: 'Approval failed' });
  }
});

// PUT /api/bookings/:booking_id/cancel
router.put('/:booking_id/cancel', async (req, res) => {
  const { booking_id } = req.params;
  const { reason } = req.body;

  if (!booking_id || !reason) {
    return res.status(400).json({ error: 'Missing booking ID or reason for cancellation' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('START TRANSACTION');

    // Get the booking info
    const [bookingRows] = await connection.query(`
      SELECT * FROM booking WHERE booking_id = ? AND status != 'cancelled'
    `, [booking_id]);

    if (bookingRows.length === 0) {
      await connection.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found or already cancelled' });
    }

    const booking = bookingRows[0];
    const totalVisitors = booking.adult_count + booking.child_count;

    // Update booking status and log cancellation reason
    await connection.query(`
      UPDATE booking
      SET status = 'cancelled', remark = CONCAT(IFNULL(remark, ''), '\nCancelled: ', ?)
      WHERE booking_id = ?
    `, [reason, booking_id]);

    // Update guide availability
    await connection.query(`
      UPDATE guide_availability
      SET current_bookings = GREATEST(current_bookings - ?, 0)
      WHERE guide_id = ? AND date = ? AND time_slot = ?
    `, [totalVisitors, booking.guide_id, booking.booking_date, booking.booking_time]);

    // Update overall booking quota
    await connection.query(`
      UPDATE booking_quotas
      SET current_visitor_count = GREATEST(current_visitor_count - ?, 0)
      WHERE date = ? AND time_slot = ?
    `, [totalVisitors, booking.booking_date, booking.booking_time]);

    // Create notification for the assigned guide
    const cancelMessage = `A cancellation has been approved for Booking #${booking_id} on ${new Date(booking.booking_date).toLocaleDateString()} ${booking.booking_time} due to ${reason}.`;
    
    let userID = null;
    const [UserID] = await pool.query('SELECT user_id FROM park_guide WHERE guide_id = ?', [booking.guide_id]);
    if (UserID.length > 0) {
      userID = UserID[0].user_id;
    }

    await connection.query(`
      INSERT INTO GuideNotifications (type, sender, recipient, message, date)
      VALUES (?, ?, ?, ?, NOW())
    `, [
      'Cancel Request',
      'System',
      userID, // send to the specific guide
      cancelMessage
    ]);

    await connection.query('COMMIT');
    return res.status(200).json({ message: 'Booking cancelled successfully' });

  } catch (err) {
    if (connection) await connection.query('ROLLBACK');
    console.error('Error cancelling booking:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});

router.post('/comment', async (req, res) => {
  const { userId, activity } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const guideId = activity.guide_id;

    // Update bookings
    const [result] = await conn.query(
      `UPDATE booking SET status = 'commented' 
       WHERE guide_id = ? AND booking_id = ?`,
      [guideId, activity.booking_id]
    );

    const [ratingRows] = await conn.query(
      `SELECT sentiment_category FROM feedback WHERE user_id = ? AND booking_id = ?`,
      [userId, activity.booking_id]
    );

    if (ratingRows.length === 0) {
      await conn.rollback();
      await conn.release();
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    const rating_category = ratingRows[0].sentiment_category;
    let rating;

    if (rating_category==='positive'){
      rating=0.1;
    }else if(rating_category==='negative'){
      rating=(-0.1);
    }else{
      rating=0;
    }
    
    await conn.query(
      `UPDATE park_guide SET rating = LEAST(rating + ?, 5) WHERE guide_id = ?`,
      [rating, guideId]
    );

    await conn.commit();
    res.status(200).json({ message: 'Feedback processed successfully' });
    await conn.release();
  } catch (err) {
    await conn.rollback();
    res.status(404).json({ message: 'Feedback processed error' });
    await conn.release();
  }
});

module.exports = router;
