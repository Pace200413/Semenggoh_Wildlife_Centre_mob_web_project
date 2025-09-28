const express = require('express');
const router = express.Router();
const pool = require('../db_connect');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

// Log login attempt
async function logAttempt(userId, email, success, ip, agent) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `INSERT INTO auth_logs (user_id, email, success, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, email, success ? 1 : 0, ip, agent]
    );
  } finally {
    connection.release();
  }
}

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  let connection;
  try {
    connection = await pool.getConnection();

    const [userResults] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = userResults.length > 0 ? userResults[0] : null;
    const userId = user ? user.user_id : null;
    console.log(user);

    if (userId) {
      const [lockRows] = await connection.query(
        `SELECT 1 FROM accountlockout WHERE user_id = ? AND unlock_at > NOW() LIMIT 1`,
        [userId]
      );

      if (lockRows.length > 0) {
        return res.status(403).json({ message: 'Account is temporarily locked. Try again later.' });
      }
    }

    const isMatch = user ? await bcrypt.compare(password, user.password) : false;
    const success = user && isMatch;

    await logAttempt(userId, email, success, ipAddress, userAgent);

    if (!success) {
      if (userId) {
        const [recentFails] = await connection.query(
          `SELECT COUNT(*) AS failCount FROM auth_logs
           WHERE user_id = ? AND success = 0 AND created_at > NOW() - INTERVAL 15 MINUTE`,
          [userId]
        );

        const failCount = recentFails[0].failCount;
        if (failCount >= MAX_FAILED_ATTEMPTS) {
          await connection.query(
            `INSERT INTO accountlockout (user_id, failed_attempts, locked_at, unlock_at)
             VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MINUTE))
             ON DUPLICATE KEY UPDATE
               failed_attempts = VALUES(failed_attempts),
               unlock_at = VALUES(unlock_at)`,
            [userId, failCount, LOCKOUT_DURATION_MINUTES]
          );

          await connection.query(
            `INSERT INTO securityincident (category, severity, detected_at)
             VALUES (?, ?, NOW())`,
            ['brute force attack', 'High']
          );
        }
      }

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role === 'guide' && !user.approved) {
      return res.status(403).json({ message: 'Your guide account is pending approval.' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        approved: user.approved
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    if (connection) connection.release();
  }
});

// JWT LOGIN
router.post('/jwt-login', async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  let connection;
  try {
    connection = await pool.getConnection();

    const [userResults] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = userResults.length > 0 ? userResults[0] : null;
    const userId = user ? user.user_id : null;

    if (userId) {
      const [lockRows] = await connection.query(
        `SELECT * FROM accountlockout WHERE user_id = ? AND unlock_at > NOW() LIMIT 1`,
        [userId]
      );

      if (lockRows.length > 0) {
        return res.status(403).json({ message: 'Account is temporarily locked. Try again later.' });
      }
    }

    const isMatch = user ? await bcrypt.compare(password, user.password) : false;
    const success = user && isMatch;

    await logAttempt(userId, email, success, ipAddress, userAgent);

    if (!success) {
      if (userId) {
        const [recentFails] = await connection.query(
          `SELECT COUNT(*) AS failCount FROM auth_logs
           WHERE user_id = ? AND success = 0 AND created_at > NOW() - INTERVAL 15 MINUTE`,
          [userId]
        );

        const failCount = recentFails[0].failCount;
        if (failCount >= MAX_FAILED_ATTEMPTS) {
          await connection.query(
            `INSERT INTO accountlockout (user_id, failed_attempts, locked_at, unlock_at)
             VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MINUTE))
             ON DUPLICATE KEY UPDATE
               failed_attempts = VALUES(failed_attempts),
               unlock_at = VALUES(unlock_at)`,
            [userId, failCount, LOCKOUT_DURATION_MINUTES]
          );

          await connection.query(
            `INSERT INTO securityincident (category, severity, detected_at)
             VALUES (?, ?, NOW())`,
            ['brute force attack', 'High']
          );
        }
      }

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role === 'guide' && !user.approved) {
      return res.status(403).json({ message: 'Your guide account is pending approval.' });
    }

    const accessToken = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '15m' }
    );

    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await connection.query(
      `INSERT INTO refresh_token (user_id, token_hash, issued_at, expires_at)
       VALUES (?, ?, NOW(), ?)`,
      [user.user_id, hashedRefreshToken, refreshExpires]
    );

    await connection.query(
      `INSERT INTO session (user_id, session_token, ip_address, user_agent, created_at, expires_at)
       VALUES (?, ?, ?, ?, NOW(), ?)`,
      [user.id, rawRefreshToken, ipAddress, userAgent, refreshExpires]
    );

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        approved: user.approved
      }
    });
  } catch (err) {
    console.error('JWT Login error:', err);
    res.status(500).json({ message: 'Server error during JWT login' });
  } finally {
    if (connection) connection.release();
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();

    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.json({ message: 'If this email exists, a reset link has been sent.' });
    }

    const user = users[0];
    const rawToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    await connection.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))`,
      [user.user_id, tokenHash]
    );

    // Send the rawToken to user's email in production
    console.log(`Password reset token for ${email}: ${rawToken}`);
    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    if (connection) connection.release();
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();

    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid token or email' });
    }

    const user = users[0];
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const [tokens] = await connection.query(
      `SELECT * FROM password_reset_tokens
       WHERE user_id = ? AND token_hash = ? AND used_at IS NULL AND expires_at > NOW()
       ORDER BY expires_at DESC LIMIT 1`,
      [user.user_id, hashedToken]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.query('UPDATE users SET password = ? WHERE user_id = ?', [newHashedPassword, user.user_id]);
    await connection.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?', [tokens[0].id]);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
