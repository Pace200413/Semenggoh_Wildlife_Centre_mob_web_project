const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pool = require('../db_connect');
const axios = require('axios');

router.post('/save', async (req, res) => {
  const newCourse = req.body;
  const filePath = path.join(__dirname, '..', 'data', 'course.json');
  const dirPath = path.dirname(filePath);

  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Ensure file exists
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
  }

  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Error reading file' });
    }

    let courses = [];
    try {
      courses = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing course.json:', parseErr);
      return res.status(500).json({ message: 'Invalid JSON format in course.json' });
    }

    // Add new course to list
    courses.push(newCourse);

    // Write updated courses to file
    fs.writeFile(filePath, JSON.stringify(courses, null, 2), 'utf8', async (err) => {
      if (err) {
        console.error('Error writing to course file:', err);
        return res.status(500).json({ message: 'Error saving course' });
      }

      // Generate certificate data
      const certificateName = `Certificate for ${newCourse.courseTitle}`;
      const courseId = newCourse.id;
      const courseTitle = newCourse.courseTitle;
      const requiredForLicense = newCourse.requiredFor || null;

      try {
        await pool.execute(
          `INSERT INTO Certificates (certificateName, courseId, courseTitle, requiredForLicense)
           VALUES (?, ?, ?, ?)`,
          [certificateName, courseId, courseTitle, requiredForLicense]
        );

        if (requiredForLicense) {
          const [licenseRows] = await pool.execute(
            'SELECT licenseId FROM licenses WHERE licenseName = ?',
            [requiredForLicense]
          );
          console.log(`License: ${licenseRows}`);
          if (licenseRows.length > 0) {
            const licenseId = licenseRows[0].licenseId;

            const [certRows] = await pool.execute(
              'SELECT certificateId FROM certificates WHERE certificateName = ?',
              [certificateName]
            );
            
            if(certRows.length > 0) {
              const cert_id = certRows[0].certificateId;
              await pool.execute(
                'INSERT IGNORE INTO licenserequirements (licenseId, certificateId) VALUES (?, ?)',
                [licenseId, cert_id]
              );
            }
          }
        }

        console.log('Course and certificate saved successfully.');
        res.status(200).json({ message: 'Course and certificate saved successfully!' });

      } catch (dbErr) {
        console.error('Error inserting certificate:', dbErr);

        // Course saved but cert insert failed — maybe due to duplicate courseId
        res.status(500).json({ message: 'Course saved, but certificate creation failed.', error: dbErr.message });
      }
    });
  });
});

// Helper function to read courses data from the JSON file
const getCourses = () => {
  const filePath = path.join(__dirname, '..', 'data', 'course.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading file:', err);
    return [];
  }
};

// GET /courses?user_id=12
router.get('/courses', async (req, res) => {
  const user_id = req.query.userId;
  
  let guide_id = 0;
  const [guideID] = await pool.query('SELECT guide_id FROM park_guide WHERE user_id = ?', [user_id]);
  if (guideID.length > 0) {
    guide_id = guideID[0].guide_id;
  }

  try {
    const courses = getCourses();

    // Fetch status info from database
    const [rows] = await pool.execute(
      'SELECT courseId, status FROM GuideCourseStatus WHERE guide_id = ?',
      [guide_id]
    );

    const statusMap = {};
    rows.forEach(row => {
      statusMap[String(row.courseId)] = row.status;
    });

    // Merge status into course objects
    const coursesWithStatus = courses.map(course => ({
      ...course,
      status: statusMap[String(course.id)] || 'upcoming' // fallback if no status
    }));
    
    res.status(200).json(coursesWithStatus);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});


/**
 * Update Existing Course
 */
router.put('/update', (req, res) => {
  const updatedCourse = req.body;
  const courses = getCourses();
  const index = courses.findIndex(c => c.id === updatedCourse.id);
  const filePath = path.join(__dirname, '..', 'data', 'course.json');

  if (index === -1) {
    return res.status(404).json({ message: 'Course not found' });
  }

  courses[index] = { ...courses[index], ...updatedCourse };

  // Save the updated array back to the file
  fs.writeFileSync(
    filePath,
    JSON.stringify(courses, null, 2)
  );

  console.log('Updated course:', updatedCourse);
  res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
});

router.put('/update-status', async (req, res) => {
  const { user_id, courseId, status } = req.body;

  let guide_id;
  const [guideID] = await pool.query('SELECT guide_id FROM park_guide WHERE user_id = ?', [user_id]);
  if (guideID.length > 0) {
    guide_id = guideID[0].guide_id;
  }

  if (!user_id || !courseId || !status) {
    return res.status(400).json({ error: 'guide_id, courseId, and status are required.' });
  }

  const validStatuses = ['upcoming', 'enrolled', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  try {
    const sql = `
      INSERT INTO GuideCourseStatus (guide_id, courseId, status)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE status = VALUES(status), updatedAt = CURRENT_TIMESTAMP;
    `;

    const [result] = await pool.execute(sql, [guide_id, courseId, status]);

    res.json({ success: true, message: 'Status updated.', result });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/course-history', async (req, res) => {
  const { userId, courseId, courseTitle, result, certificate } = req.body;

  if (!userId || !courseId || !courseTitle || !result) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('START TRANSACTION');

    // 1. Insert course history
    const courseHistoryQuery = `
      INSERT INTO CourseHistory (user_id, courseId, courseTitle, result, certificate, completedAt)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const courseHistoryValues = [
      userId,
      courseId,
      courseTitle, // Assuming course title is available
      result,
      certificate || null,
    ];

    const [courseHistoryResult] = await connection.query(courseHistoryQuery, courseHistoryValues);

    // 2. Insert a notification if the user passed the course and has a certificate
    if (result === 'Passed' && certificate) {
      const notificationMessage = `You are now a certified guide for ${certificate} as of ${new Date().toLocaleDateString()}`;

      const notificationQuery = `
        INSERT INTO guidenotifications (sender, recipient, type, subject, message)
        VALUES (?, ?, ?, ?, ?)
      `;
      const notificationValues = [
        'System', // sender is the user who passed the course
        userId, // recipient is also the user who passed
        'Certification',
        `Certificate Issued: ${certificate}`,
        notificationMessage,
      ];

      await connection.query(notificationQuery, notificationValues);

      const [certRows] = await pool.execute(
        'SELECT certificateId FROM certificates WHERE certificateName = ?',
        [certificate]
      ); 

      if(certRows.length > 0) {
        const cert_id = certRows[0].certificateId;

        const [guideIDs] = await pool.execute(
          'SELECT guide_id FROM park_guide WHERE user_id = ?',
          [userId]
        ); 

        if(guideIDs.length > 0){
          const guide_id = guideIDs[0].guide_id
          await pool.execute(
            'INSERT IGNORE INTO guidecertificates (guide_id, certificateId) VALUES (?, ?)',
            [guide_id, cert_id]
          );
        }
      }
    }

    // Commit the transaction if both operations were successful
    await connection.query('COMMIT');
    res.status(201).json({
      message: 'Course history saved and notification sent successfully!',
    });

  } catch (err) {
    if (connection) await connection.query('ROLLBACK');
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});


// GET course history for a user
router.get('/course-history/:userId', async (req, res) => {
  const { userId } = req.params;
  const { status, courseId } = req.query;

  const connection = await pool.getConnection();
  try {
    let query = 'SELECT * FROM CourseHistory WHERE user_id = ?';
    const params = [userId];

    if (status) {
      query += ' AND result = ?';
      params.push(status);
    }

    if (courseId) {
      query += ' AND courseId = ?';
      params.push(courseId);
    }

    const [courseHistoryRows] = await connection.query(query, params);

    res.json(courseHistoryRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    connection.release();
  }
});

// PUT to update the result of a course completion (if necessary)
router.put('/course-history/:courseHistoryId', async (req, res) => {
  const { courseHistoryId } = req.params;
  const { result, certificate } = req.body;

  if (!result) {
    return res.status(400).json({ error: 'Result field is required' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('START TRANSACTION');

    // 1. Update course history
    const updateQuery = `
      UPDATE CourseHistory 
      SET result = ?, certificate = ? 
      WHERE id = ?
    `;
    const updateValues = [result, certificate || null, courseHistoryId];

    const [updateResult] = await connection.query(updateQuery, updateValues);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Course history not found' });
    }

    // Optionally, you can send a push notification after updating the result

    await connection.query('COMMIT');
    res.status(200).json({ message: 'Course history updated successfully' });

  } catch (err) {
    if (connection) await connection.query('ROLLBACK');
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// GET /certificates?userId=...
router.get('/certificates', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Fetch guide_id for the given user
    const [guideID] = await pool.query('SELECT guide_id FROM park_guide WHERE user_id = ?', [userId]);
    if (guideID.length === 0) {
      return res.status(404).json({ error: 'Guide not found for userId' });
    }
    const guide_id = guideID[0].guide_id;

    // Fetch certificates the guide has earned
    const [certificates] = await pool.execute(`
      SELECT c.certificateId, c.certificateName, c.courseId, c.courseTitle, gc.earnedAt
      FROM certificates c
      JOIN guidecertificates gc ON c.certificateId = gc.certificateId
      WHERE gc.guide_id = ?`, [guide_id]);

    if (certificates.length === 0) {
      return res.status(404).json({ error: 'No certificates found for this user' });
    }

    // Return the list of certificates the user has earned
    res.status(200).json(certificates);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ message: 'Error fetching certificates' });
  }
});

router.get('/guide-course-status', async (req, res) => {
  const guideId = req.query.guide_id;

  if (!guideId) {
    return res.status(400).json({ error: 'guide_id (user_id) query param is required' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Get course status joined with coursehistory for details using certificateId as join key
    const [statusRows] = await connection.query(
      `SELECT gc.*, ch.courseTitle, ch.result AS course_status
       FROM guidecoursestatus gc
       JOIN coursehistory ch ON gc.courseId = ch.courseId
       WHERE gc.guide_id = ?`,
      [guideId]
    );

    res.json(statusRows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});

router.get('/guide-cert-ids', async (req, res) => {
  const guideId = req.query.guide_id;

  if (!guideId) {
    return res.status(400).json({ error: 'guide_id query param is required' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [certRows] = await connection.query(
      `SELECT certificateId FROM guidecertificates WHERE guide_id = ?`,
      [guideId]
    );

    const certificateIds = certRows.map(row => row.certificateId);

    res.json({ certificateIds });

  } catch (err) {
    console.error('[guide-cert-ids] DB error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// Assume you have this map somewhere (licenseId to licenseName)
const licenseNamesById = {
  1: 'Junior Guide',
  2: 'Senior Guide',
  3: 'Master',
};

const nextLicenseByName = {
  'Junior Guide': 'Senior Guide',
  'Senior Guide': 'Master',
  'Master': null,
};

router.get('/recommended_courses', async (req, res) => {
  const userId = req.query.guide_id;
  if (!userId) return res.status(400).json({ error: 'user_id required' });

  let connection;
  try {
    connection = await pool.getConnection();

    // Get guide info and rating
    const [guideRows] = await connection.execute(`
      SELECT pg.guide_id, pg.rating, pg.user_id
      FROM park_guide pg
      WHERE pg.guide_id = ?
    `, [userId]);
    if (guideRows.length === 0) return res.status(404).json({ error: 'Guide not found' });
    const guide = guideRows[0];

    // Get guide's current licenseId (latest)
    const [licenseRows] = await connection.execute(`
      SELECT licenseId
      FROM guidelicenses
      WHERE guide_id = ?
      ORDER BY earnedAt DESC
      LIMIT 1
    `, [guide.guide_id]);

    let nextLicenseId;
    let currentLicenseName;
    let nextLicenseName;

    if (licenseRows.length > 0){
      const currentLicenseId = licenseRows[0].licenseId;
      currentLicenseName = licenseNamesById[currentLicenseId];
      
      if (!currentLicenseName) return res.json({ recommendedCourses: [] });
      
      nextLicenseName = nextLicenseByName[currentLicenseName];
      if (!nextLicenseName) return res.json({ recommendedCourses: [] }); // Already at highest license
      
      // Find next licenseId from name
      nextLicenseId = Object.keys(licenseNamesById).find(
        key => licenseNamesById[key] === nextLicenseName
      );
    }else{
      nextLicenseId = 1;
      currentLicenseName = 'None';
      nextLicenseName = 'Junior Guide';
    }
    
    // Get required courses for the next license
    const [requiredCourses] = await connection.execute(`
      SELECT certificateId
      FROM licenserequirements
      WHERE licenseId = ?
    `, [nextLicenseId]);
    
    // Step 1: Extract certificateIds
    const certificateIds = requiredCourses.map(row => row.certificateId);
    if (certificateIds.length === 0) return res.json({ recommendedCourses: [] });

    // Step 2: Get corresponding courseIds from certificates table
    const certPlaceholders = certificateIds.map(() => '?').join(', ');
    const [certificates] = await connection.execute(`
      SELECT certificateId, courseId
      FROM certificates
      WHERE certificateId IN (${certPlaceholders})
    `, certificateIds);

    // Step 3: Map certificateId => courseId
    const courseIds = certificates.map(row => row.courseId);
    if (courseIds.length === 0) return res.json({ recommendedCourses: [] });

    const coursePlaceholders = courseIds.map(() => '?').join(', ');
    const [courseStatusRows] = await connection.execute(`
      SELECT courseId, status
      FROM guidecoursestatus
      WHERE guide_id = ? AND courseId IN (${coursePlaceholders})
    `, [guide.guide_id, ...courseIds]);
    
    // Map courseId => status
    const statusMap = {};
    courseStatusRows.forEach(({ courseId, status }) => {
      statusMap[courseId] = status;
    });

    // Get uncompleted (upcoming) course IDs = required - enrolled/completed
    const upcomingCourseIds = courseIds.filter(
      id => !Object.keys(statusMap).includes(String(id))
    );
    // Only recommend if guide rating < 3.5
    if (guide.rating >= 3.5) {
      return res.json({ recommendedCourses: [] });
    }

    // Read courses JSON file, filter by uncompleted and requiredFor === nextLicenseId
    const allCourses = getCourses();

    const recommendedCourses = allCourses.filter(course =>
      upcomingCourseIds.includes(course.id) &&
      course.requiredFor === nextLicenseName
    );

    res.json({
      guideId: guide.guide_id,
      userId: guide.user_id,
      rating: guide.rating,
      currentLicense: currentLicenseName,
      nextLicense: nextLicenseName,
      recommendedCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) await connection.release();
  }
});

// POST /assign-course
router.post('/assign-course', async (req, res) => {
  const { guide_id, courseId } = req.body;

  // --- 1. basic validation ---------------------------------------------------
  if (!guide_id || !courseId) {
    return res.status(400).json({
      success: false,
      error: 'guide_id and courseId are required.',
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('START TRANSACTION');   // begin atomic block

    // --- 2. upsert into GuideCourseStatus ------------------------------------
    await connection.execute(
      `
        INSERT INTO GuideCourseStatus (guide_id, courseId, status)
        VALUES (?, ?, 'enrolled')
        ON DUPLICATE KEY UPDATE
          status    = VALUES(status),
          updatedAt = CURRENT_TIMESTAMP
      `,
      [guide_id, courseId]
    );

    // --- 3. look up user_id for this guide -----------------------------------
    const [guideRows] = await connection.execute(
      'SELECT user_id FROM park_guide WHERE guide_id = ?',
      [guide_id]
    );
    if (guideRows.length === 0) {
      await connection.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Guide not found.' });
    }
    const user_id = guideRows[0].user_id;

    // --- 4. optional: grab the course title from your JSON file --------------
    const allCourses = getCourses();                    // helper you already wrote
    const course = allCourses.find(c => c.id === courseId);
    const courseTitle = course ? course.courseTitle : `Course ${courseId}`;

    // --- 5. insert notification ---------------------------------------------
    await connection.execute(
      `
        INSERT INTO guidenotifications
          (sender, recipient, type, subject, message)
        VALUES
          ('Admin', ?, 'Course Issued', ?, ?)
      `,
      [
        user_id,
        `Course Assigned: ${courseTitle}`,
        `You have been enrolled in “${courseTitle}”.`
      ]
    );

    await connection.query('COMMIT');                  // all good
    return res.status(200).json({
      success: true,
      message: 'Course assigned and notification sent.',
    });

  } catch (err) {
    if (connection) await connection.query('ROLLBACK');
    console.error('Error in /assign-course:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });

  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
