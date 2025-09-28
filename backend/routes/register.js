const express = require('express');
const router = express.Router();
const pool = require('../db_connect');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { name, email, phone_no, password, gender, birth_date, role } = req.body;

  // Basic validation (optional but helpful)
  if (!name || !email || !phone_no || !password || !gender || !birth_date || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Validate phone number
  const phoneRegex = /^(\d{3}-?\d{7,8})$/;
  if (!phoneRegex.test(phone_no)) {
    return res.status(400).json({ error: 'Invalid phone number format.' });
  }

  try {
    const conn = await pool.getConnection();
    
    // Start a transaction
    await conn.beginTransaction();

    try {
      const [existingUsers] = await conn.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        // Rollback transaction if user already exists
        await conn.rollback();
        conn.release();
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const approved = role === 'visitor' ? 1 : 0;

      // Insert into users table
      const [result] = await conn.query(`
        INSERT INTO users (name, email, phone_no, password, gender, birth_date, role, approved)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [name, email, phone_no, hashedPassword, gender, birth_date, role, approved]);

      // If the role is 'guide', insert into park_guide table
      if (role === 'guide') {
        await conn.query(`
          INSERT INTO park_guide (user_id)
          VALUES (?)
        `, [result.insertId]);
      }

      // Commit transaction
      await conn.commit();

      res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
      // Rollback transaction in case of error
      await conn.rollback();
      console.error('Register Error:', err);
      res.status(500).json({ message: 'Database error during registration' });
    } finally {
      conn.release();
    }

  } catch (err) {
    console.error('Connection Error:', err);
    res.status(500).json({ message: 'Database connection error' });
  }
});

module.exports = router;
