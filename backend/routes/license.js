// Required modules
const express = require('express');
const router = express.Router();
const pool = require('../db_connect');

// Request license API: Guide selects a license and a park
router.post('/request', async (req, res) => {
  const { guide_id, licenseId, park_id } = req.body;

  if (!guide_id || !licenseId || !park_id) {
    return res.status(400).json({ message: 'Missing required fields: guide_id, licenseId, park_id' });
  }

    let guideId;  // Declare guide_id using 'let' to allow reassigning
    const [guideIDs] = await pool.execute(
      'SELECT guide_id FROM park_guide WHERE user_id = ?',
      [guide_id]
    );

    if(guideIDs.length > 0 ){
        guideId = guideIDs[0].guide_id;
    }

  try {
    // Check if the park exists in the national_park table
    const [park] = await pool.execute('SELECT * FROM national_park WHERE park_id = ?', [park_id]);
    if (park.length === 0) {
      return res.status(404).json({ message: 'Park not found.' });
    }

    // Insert the new license request into guidelicenses table
    await pool.execute(
      `INSERT INTO guidelicenses (guide_id, licenseId, park_id, status, requestedAt) 
       VALUES (?, ?, ?, 'pending', NOW())`,
      [guideId, licenseId, park_id]
    );

    return res.status(201).json({ message: 'License request submitted successfully and awaiting admin approval.' });
  } catch (err) {
    console.error('Error submitting license request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/approve', async (req, res) => {
  const { guide_id, licenseId } = req.body;

  if (!guide_id || !licenseId) {
    return res.status(400).json({ message: 'Missing required fields: guide_id, licenseId' });
  }

  try {
    // Check if the license request exists and is pending
    const [request] = await pool.execute(
      'SELECT * FROM guidelicenses WHERE guide_id = ? AND licenseId = ? AND status = "pending"',
      [guide_id, licenseId]
    );
    
    if (request.length === 0) {
      return res.status(404).json({ message: 'License request not found or already approved.' });
    }

    // Update the license request status to 'earned' and set approval time
    await pool.execute(
      'UPDATE guidelicenses SET status = "earned", approvedAt = NOW(), expiry_date = DATE_ADD(NOW(), INTERVAL 2 YEAR) WHERE guide_id = ? AND licenseId = ?',
      [guide_id, licenseId]
    );

    return res.status(200).json({ message: 'License request approved and status updated to "earned".' });
  } catch (err) {
    console.error('Error approving license request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/pending', async (req, res) => {
  try {
    // Retrieve all pending license requests
    const [requests] = await pool.execute(`
      SELECT 
        gl.guide_id,
        u.name AS guideName,
        gl.licenseId,
        l.licenseName, 
        gl.park_id,
        np.park_name,
        gl.requestedAt AS issuanceDate,
        gl.expiry_date AS expiryDate,
        ch.courseTitle,
        ch.result AS courseStatus,
        ch.completedAt AS assessmentDate
      FROM guidelicenses gl
      JOIN national_park np ON gl.park_id = np.park_id
      LEFT JOIN park_guide pg ON pg.guide_id = gl.guide_id
      LEFT JOIN users u ON u.user_id = pg.user_id
      LEFT JOIN coursehistory ch ON ch.user_id = pg.user_id
      LEFT JOIN licenses l ON l.licenseId = gl.licenseId
      WHERE gl.status = 'pending'
        AND ch.completedAt = (
          SELECT MAX(ch2.completedAt)
          FROM coursehistory ch2
          WHERE ch2.user_id = pg.user_id
        )
    `);

    return res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching pending requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/approved', async (req, res) => {
  try {
    // Retrieve all pending license requests
    const [requests] = await pool.execute(`
      SELECT 
        gl.guide_id,
        u.name AS guideName,
        pg.rating as rating,
        gl.licenseId,
        l.licenseName, 
        gl.park_id,
        np.park_name,
        gl.requestedAt AS issuanceDate,
        gl.expiry_date AS expiryDate,
        ch.courseTitle,
        ch.result AS courseStatus,
        ch.completedAt AS assessmentDate
      FROM guidelicenses gl
      JOIN national_park np ON gl.park_id = np.park_id
      LEFT JOIN park_guide pg ON pg.guide_id = gl.guide_id
      LEFT JOIN users u ON u.user_id = pg.user_id
      LEFT JOIN coursehistory ch ON ch.user_id = pg.user_id
      LEFT JOIN licenses l ON l.licenseId = gl.licenseId
      WHERE gl.status = 'earned'
        AND ch.completedAt = (
          SELECT MAX(ch2.completedAt)
          FROM coursehistory ch2
          WHERE ch2.user_id = pg.user_id
        )
    `);

    return res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching pending requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/status', async (req, res) => {
  const { guide_id, licenseId } = req.query;

  if (!guide_id || !licenseId) {
    return res.status(400).json({ message: 'Missing required fields: guide_id, licenseId' });
  }

  try {
    const [status] = await pool.execute(
      `SELECT status, requestedAt, approvedAt FROM guidelicenses 
       WHERE guide_id = ? AND licenseId = ?`,
      [guide_id, licenseId]
    );

    if (status.length === 0) {
      return res.status(404).json({ message: 'License status not found.' });
    }

    return res.status(200).json(status[0]);
  } catch (err) {
    console.error('Error retrieving license status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/promptable/:guideId', async (req, res) => {
  const { guideId } = req.params;

  try {
    // 1. Get all earned certificates by user
    let guide_id;  // Declare guide_id using 'let' to allow reassigning
    const [guideIDs] = await pool.execute(
      'SELECT guide_id FROM park_guide WHERE user_id = ?',
      [guideId]
    );

    if(guideIDs.length > 0 ){
        guide_id = guideIDs[0].guide_id;
    }

    const [earnedCerts] = await pool.execute(
      'SELECT certificateId FROM guidecertificates WHERE guide_id = ?',
      [guide_id]
    );
    const earnedSet = new Set(earnedCerts.map(e => e.certificateId));

    // 2. Get all licenses and their requirements
    const [allLicenses] = await pool.execute('SELECT licenseId, licenseName FROM licenses');

    const promptableLicenses = [];

    for (const license of allLicenses) {
      const [requirements] = await pool.execute(
        'SELECT certificateId FROM licenserequirements WHERE licenseId = ?',
        [license.licenseId]
      );
      const requiredCerts = requirements.map(r => r.certificateId);

      // Check all certs are earned
      const allMet = requiredCerts.every(id => earnedSet.has(id));
      if (!allMet) continue;

      // 3. Skip if already requested or earned
      const [existing] = await pool.execute(
        `SELECT * FROM guidelicenses 
         WHERE guide_id = ? AND licenseId = ? AND status IN ('pending', 'earned')`,
        [guideId, license.licenseId]
      );
      if (existing.length > 0) continue;

      promptableLicenses.push({
        licenseId: license.licenseId,
        licenseName: license.licenseName,
      });
    }

    return res.status(200).json(promptableLicenses);
  } catch (err) {
    console.error('Error checking promptable licenses:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all national parks
router.get('/national_park', async (req, res) => {
  try {
    // Query to fetch all national parks from the database
    const [parks] = await pool.execute('SELECT park_id, park_name FROM national_park');

    // If no parks found, return an empty array
    if (parks.length === 0) {
      return res.status(404).json({ message: 'No national parks found.' });
    }

    // Send the list of national parks as a response
    return res.status(200).json(parks);
  } catch (err) {
    console.error('Error fetching national parks:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all licenses (pending, earned, etc.) for a specific guide
router.get('/by-guide/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Get guide_id using user_id
    const [[guide]] = await pool.execute('SELECT guide_id FROM park_guide WHERE user_id = ?', [userId]);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    const [licenses] = await pool.execute(`
      SELECT 
        gl.licenseId,
        l.licenseName,
        gl.status,
        gl.requestedAt,
        gl.approvedAt,
        gl.expiry_date,
        np.park_name
      FROM guidelicenses gl
      JOIN licenses l ON gl.licenseId = l.licenseId
      JOIN national_park np ON gl.park_id = np.park_id
      WHERE gl.guide_id = ?
      ORDER BY gl.requestedAt DESC
    `, [guide.guide_id]);

    return res.status(200).json(licenses);
  } catch (err) {
    console.error('Error fetching guide licenses:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint to check and retake courses if rating is low
router.post('/retake-courses/:userId/:licenseId', async (req, res) => {
  const { userId, licenseId } = req.params;

  try {
    // Step 1: Get guide_id from users table if needed
    const [guide] = await pool.execute(
      'SELECT guide_id FROM park_guide WHERE user_id = ?',
      [userId]
    );

    if (guide.length === 0) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    const guideId = guide[0].guide_id;

    // Step 2: Get license details including expiry_date
    const [license] = await pool.execute(
      `SELECT licenseId, expiry_date 
       FROM guidelicenses 
       WHERE guide_id = ? AND licenseId = ? 
       ORDER BY expiry_date DESC 
       LIMIT 1`,
      [guideId, licenseId]
    );

    if (license.length === 0) {
      return res.status(404).json({ message: 'License not found for guide' });
    }

    const licenseDetails = license[0];

    // Step 3: Check if guide needs to retake courses (e.g., due to low rating)
    const [ratingResult] = await pool.execute(
      'SELECT rating FROM park_guide WHERE guide_id = ?',
      [guideId]
    );

    const rating = ratingResult[0]?.rating || 0;

    let coursesToRetake = [];
    let message = 'No retake required';

    if (Number(rating) < 3) {
      // Step 4: Fetch required courses for this license
      const [requiredCourses] = await pool.exexute(
        `SELECT c.courseId, c.courseTitle 
         FROM licenserequirements cr 
         JOIN certificates c ON cr.certificateId = c.certificateId 
         WHERE cr.licenseId = ?`,
        [licenseId]
      );

      // Step 5: Update guidecoursestatus to "enrolled" for those courses
      for (const course of requiredCourses) {
        await pool.execute(
          `UPDATE guidecoursestatus 
           SET status = 'enrolled', updatedAt = NOW() 
           WHERE guide_id = ? AND courseId = ?`,
          [guideId, course.courseId]
        );
      }

      coursesToRetake = requiredCourses;
      message = 'You must retake required courses due to low rating';
    }

    // Final response
    return res.json({
      licenseDetails,
      coursesToRetake,
      message,
    });

  } catch (error) {
    console.error('Error checking retake requirements:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/renew', async (req, res) => {
  const { userId, licenseId } = req.body;

  try {
    const [guideResult] = await pool.execute(
      'SELECT guide_id FROM park_guide WHERE user_id = ?',
      [userId]
    );

    if (guideResult.length === 0) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    const guideId = guideResult[0].guide_id;

    const [licenseResult] = await pool.execute(
      `SELECT id, expiry_date FROM guidelicenses 
       WHERE guide_id = ? AND licenseId = ? 
       ORDER BY expiry_date DESC 
       LIMIT 1`,
      [guideId, licenseId]
    );

    if (licenseResult.length === 0) {
      return res.status(404).json({ message: 'License not found' });
    }

    const licenseIdToUpdate = licenseResult[0].id;
    const currentExpiry = new Date(licenseResult[0].expiry_date);
    const newExpiry = new Date(currentExpiry);
    newExpiry.setFullYear(currentExpiry.getFullYear() + 2);

    await pool.execute(
      `UPDATE guidelicenses 
       SET expiry_date = ?, approvedAt = NOW() 
       WHERE id = ?`,
      [newExpiry.toISOString().split('T')[0], licenseIdToUpdate]
    );

    return res.json({ message: 'License successfully renewed' });

  } catch (error) {
    console.error('Error renewing license:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

// GET license requirements by license ID
router.get('/requirements/:licenseId', async (req, res) => {
  const { licenseId } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();

    const [requirements] = await connection.query(
      `
      SELECT certificateId
      FROM licenserequirements
      WHERE licenseId = ?
      `,
      [licenseId]
    );
    
    // 👉 map to raw numbers
    const certificateIds = requirements.map(r => r.certificateId);
    
    res.json({ certificateIds });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
