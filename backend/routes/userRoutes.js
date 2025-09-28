const express = require('express');
const router = express.Router();
const pool = require('../db_connect'); // MySQL pool

// GET user by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  let connection;
  try {
    connection = await pool.getConnection();

    const query = `
      SELECT user_id, name, email, phone_no, birth_date, gender, profile_image_url
      FROM users
      WHERE user_id = ?
    `;

    const [results] = await connection.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]);

  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// PATCH user info
router.patch('/:id', async (req, res) => {
  const userId = req.params.id;
  const allowedFields = ['name', 'email', 'phone_no', 'birth_date', 'gender', 'profile_image_url'];
  
  // Filter out only the allowed fields from the request body
  const fieldsToUpdate = Object.entries(req.body)
    .filter(([key, _]) => allowedFields.includes(key));
  
  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  
  const setClause = fieldsToUpdate.map(([key]) => `${key} = ?`).join(', ');
  const values = fieldsToUpdate.map(([_, value]) => value);
  
  let connection;
  try {
    connection = await pool.getConnection();
  
    const updateQuery = `
      UPDATE users
      SET ${setClause}
      WHERE user_id = ?
    `;
    const [result] = await connection.query(updateQuery, [...values, userId]);
  
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Database update failed', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// GET users by approval status and role
router.get('/', async (req, res) => {
  const { approved, role } = req.query;

  if (!approved || !role) {
    return res.status(400).json({ error: 'Missing approved or role query parameters' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const query = `
      SELECT 
        u.user_id, 
        u.name, 
        u.email, 
        u.phone_no, 
        u.birth_date, 
        u.gender, 
        u.profile_image_url, 
        u.approved, 
        u.role,
        g.guide_id,
        g.rating
      FROM users u
      JOIN park_guide g ON u.user_id = g.user_id
      WHERE u.approved = ? AND u.role = ?
    `;

    const [results] = await connection.query(query, [approved, role]);

    res.json(results);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});
module.exports = router;
