const express = require('express');
const router = express.Router();
const db = require('../db_connect');

// Get available guides for a specific date and time
router.get('/', async (req, res) => {
  const { date, time } = req.query;

  try {
    // If no date/time provided, get all guides
    if (!date || !time) {
      const getAllGuidesQuery = `
        SELECT 
          pg.guide_id,
          pg.rating,
          u.name,
          u.gender,
          u.email,
          u.phone_no,
          u.profile_image_url,
          ga.max_group_size,
          ga.current_bookings,
          (ga.max_group_size - ga.current_bookings) as available_slots
        FROM park_guide pg
        JOIN users u ON pg.user_id = u.user_id
        LEFT JOIN guide_availability ga ON pg.guide_id = ga.guide_id
        WHERE u.role = 'guide' AND u.approved = 1
        AND (ga.status = 'available' OR ga.status IS NULL)
      `;

      const [guideRows] = await db.query(getAllGuidesQuery);
      return res.json({ guides: guideRows });
    }

    // Get available guides for specific date and time
    const guideQuery = `
      SELECT DISTINCT
        pg.guide_id,
        pg.rating,
        u.name,
        u.email,
        u.phone_no,
        u.profile_image_url,
        ga.max_group_size,
        ga.current_bookings,
        (ga.max_group_size - ga.current_bookings) as available_slots
      FROM park_guide pg
      JOIN users u ON pg.user_id = u.user_id
      INNER JOIN guide_availability ga ON pg.guide_id = ga.guide_id 
        AND ga.date = ? 
        AND ga.time_slot = ?
        AND ga.status = 'available'
      WHERE u.role = 'guide' AND u.approved = 1
    `;

    const [guideRows] = await db.query(guideQuery, [date, time]);
    return res.json({ guides: guideRows });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Update availability after booking
router.post('/update', async (req, res) => {
  const { guide_id, date, time, visitor_count } = req.body;

  if (!guide_id || !date || !time || !visitor_count) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let connection;
  try {
    // Get a connection from the pool
    connection = await db.getConnection();
    
    // Start transaction
    await connection.query('START TRANSACTION');

    // First, check and update guide availability
    const updateGuideQuery = `
      UPDATE guide_availability
      SET current_bookings = current_bookings + ?,
          status = CASE 
            WHEN (max_group_size - (current_bookings + ?)) <= 0 THEN 'fully_booked'
            ELSE 'available'
          END
      WHERE guide_id = ? 
      AND date = ? 
      AND time_slot = ?
      AND status = 'available'
      AND (max_group_size - current_bookings) >= ?
    `;

    const [guideResult] = await connection.query(updateGuideQuery, [visitor_count, visitor_count, guide_id, date, time, visitor_count]);

    if (guideResult.affectedRows === 0) {
      await connection.query('ROLLBACK');
      return res.status(400).json({ error: 'Guide is not available or group size exceeded' });
    }

    // Then, update booking quota
    const updateQuotaQuery = `
      UPDATE booking_quotas
      SET current_visitor_count = current_visitor_count + ?,
          status = CASE 
            WHEN (max_total_visitors - (current_visitor_count + ?)) <= 0 THEN 'fully_booked'
            ELSE 'available'
          END
      WHERE date = ? 
      AND time_slot = ?
      AND status = 'available'
      AND (max_total_visitors - current_visitor_count) >= ?
    `;

    const [quotaResult] = await connection.query(updateQuotaQuery, [visitor_count, visitor_count, date, time, visitor_count]);

    if (quotaResult.affectedRows === 0) {
      await connection.query('ROLLBACK');
      return res.status(400).json({ error: 'Time slot is not available or quota exceeded' });
    }

    // If both updates succeeded, commit the transaction
    await connection.query('COMMIT');
    console.log('Transaction successful: Updated availability for guide', guide_id, 'on', date, time);
    return res.json({ message: 'Availability updated successfully' });
  } catch (err) {
    // Rollback the transaction if there's an error
    if (connection) {
      await connection.query('ROLLBACK');
    }
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

// Endpoint to fetch booking history for a user
router.get('/booking-history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const conn = await db.getConnection();

    // Query to fetch the bookings with details from all 3 tables: users, park_guide, and booking
    const [bookingHistory] = await conn.query(`
      SELECT 
        b.booking_id as booking_id,
        b.booking_date as booking_date,
        b.booking_time as booking_time,
        b.adult_count as adult_count,
        b.child_count as child_count,
        b.emergency_contact_name as emergency_contact_name,
        b.emergency_contact_no as emergency_contact_no,
        b.remark as remark,
        b.status as status,
        b.payment_method as payment_method,
        b.price as price,
        pg.guide_id as guide_id,
        p.name as guide_name,
        p.profile_image_url as guide_image,
        p.gender as gender
      FROM booking b
      JOIN park_guide pg ON b.guide_id = pg.guide_id
      JOIN users u ON b.user_id = u.user_id
      LEFT JOIN users p ON pg.user_id = p.user_id
      WHERE u.user_id = ?;
    `, [userId]);

    conn.release();

    if (bookingHistory.length === 0) {
      console.log('No booking history found for this user.' );
    }

    res.json(bookingHistory);
  } catch (err) {
    console.error('Error fetching booking history:', err);
    res.status(500).json({ message: 'Database error while fetching booking history.' });
  }
});

router.get('/pending', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT user_id AS id, name, email, gender, profile_image_url
      FROM users
      WHERE role = 'guide' AND approved = 0
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching pending guides:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/approve-all', async (req, res) => {
  try {
    const [result] = await db.query(`
      UPDATE users
      SET approved = 1
      WHERE role = 'guide' AND approved = 0
    `);
    res.status(200).json({
      message: 'All pending guides have been approved.',
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error('Error approving guides:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/guide-id', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId query parameter' });
  }

  let connection;
  try {
    connection = await db.getConnection();

    const [rows] = await connection.query(
      'SELECT guide_id FROM park_guide WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Guide not found for this userId' });
    }

    // success ➜ send the guide_id
    res.json({ guide_id: rows[0].guide_id });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router; 