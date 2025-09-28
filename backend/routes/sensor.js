const express = require('express');
const router = express.Router();
const pool = require('../db_connect'); // adjust path as needed

router.post('/insert', async (req, res) => {
  let sensorData = req.body;

  // If it's not an array, wrap it in one
  if (!Array.isArray(sensorData)) {
    sensorData = [sensorData];
  }

  // Validate each entry (optional, but recommended)
  const valid = sensorData.every(entry =>
    entry.device && entry.event && entry.timestamp &&
    entry.temperature !== undefined &&
    entry.humidity !== undefined &&
    entry.pressure !== undefined &&
    entry.angle_status && entry.mode
  );

  if (!valid) {
    return res.status(400).json({ error: 'Invalid sensor data format' });
  }

  const formattedData = sensorData.map(entry => [
    new Date(entry.timestamp * 1000),  // Convert UNIX timestamp to JS Date
    entry.device,
    entry.event,
    entry.temperature,
    entry.humidity,
    entry.pressure,
    entry.angle_status,
    entry.mode
  ]);

  const query = `
    INSERT INTO iot_sensor_data (timestamp, device, event, temperature, humidity, pressure, angle_status, mode)
    VALUES ?
  `;

  try {
    const connection = await pool.getConnection();
    await connection.query(query, [formattedData]);

    // Use the first entry for the notification
    const first = sensorData[0];
    const timestamp = new Date(first.timestamp * 1000).toISOString();
    const subject = `⚠️ Intrusion Detected by ${first.device}`;
    const message = `An intrusion was detected by device ${first.device} at ${new Date(timestamp).toLocaleDateString()}. Event: ${first.event}. Temperature: ${first.temperature}°C, Humidity: ${first.humidity}%, Pressure: ${first.pressure} hPa, Angle Status: ${first.angle_status}, Mode: ${first.mode}`;

    await connection.query(
      `INSERT INTO GuideNotifications (type, sender, recipient, subject, message)
        VALUES (?, ?, ?, ?, ?)`,
      ['IoT Alert', 'System', 'Admin', subject, message]
    );

    connection.release();
    console.log('Success');
    res.status(201).json({ message: 'Sensor data inserted successfully' });
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).json({ error: 'Failed to insert sensor data', details: error.message });
  }
});

// GET latest sensor events (limit query param)
router.get('/logs', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  try {
    const [rows] = await pool.query(
      `SELECT sensorlog_id, timestamp, device, event, temperature, humidity, pressure, angle_status, mode 
       FROM iot_sensor_data 
       ORDER BY timestamp DESC LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching sensor logs:', err);
    res.status(500).json({ message: 'Failed to fetch sensor logs' });
  }
});

// GET summary stats for dashboard
router.get('/stats', async (req, res) => {
  try {
    // Count distinct devices
    const [[{ totalDevices }]] = await pool.query(`SELECT COUNT(DISTINCT device) AS totalDevices FROM iot_sensor_data`);

    // Count total intrusion events (assuming event like 'intrusion' means intrusion detected)
    const [[{ totalIntrusions }]] = await pool.query(`SELECT COUNT(*) AS totalIntrusions FROM iot_sensor_data WHERE event LIKE '%motion%'`);

    // Latest timestamp
    const [[{ lastUpdate }]] = await pool.query(`SELECT MAX(timestamp) AS lastUpdate FROM iot_sensor_data`);

    res.json({ totalDevices, totalIntrusions, lastUpdate });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// GET device list with last event time and status (based on last event)
router.get('/devices', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT device,
             MAX(timestamp) as lastSeen,
             -- Determine device status based on last event's mode or angle_status or event
             SUBSTRING_INDEX(GROUP_CONCAT(event ORDER BY timestamp DESC), ',', 1) AS lastEvent
      FROM iot_sensor_data
      GROUP BY device
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).json({ message: 'Failed to fetch devices' });
  }
});

// GET recent intrusion alerts
router.get('/alerts', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  try {
    // Assuming any event containing 'intrusion' means an alert
    const [rows] = await pool.query(
      `SELECT sensorlog_id, timestamp, device, event, temperature, humidity, pressure, angle_status, mode
       FROM iot_sensor_data
       WHERE event LIKE '%motion%'
       ORDER BY timestamp DESC
       LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// GET /api/iot/sensor-data?limit=50
router.get('/sensor-data', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  
  const sql = `
    SELECT timestamp, temperature, humidity, pressure
    FROM iot_sensor_data
    ORDER BY timestamp DESC
    LIMIT ?
  `;
  
  console.log(sql);
  pool.query(sql, [limit], (err, results) => {
    if (err) {
      console.error('Error fetching sensor data:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Optional: Reverse to ascending order for timeline consistency
    const data = results.reverse();
    res.json(data);
  });
});

module.exports = router;
