// scripts/createAdmin.js
const bcrypt = require('bcrypt');
const pool = require('../db_connect'); // adjust path to your connection pool

(async () => {
  try {
    const name = 'Admin';
    const email = 'admin@gmail.com';
    const phone_no = '1234567890';
    const plainPassword = 'admin123'; // Change this to a strong password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const gender = 'male';
    const birth_date = '1990-01-01';
    const role = 'admin';
    const approved = 1;

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Admin user already exists.');
      return;
    }

    await pool.query(`
      INSERT INTO users (name, email, phone_no, password, gender, birth_date, role, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, email, phone_no, hashedPassword, gender, birth_date, role, approved]);

    console.log('Admin user created successfully.');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    pool.end(); // close DB connection
  }
})();
