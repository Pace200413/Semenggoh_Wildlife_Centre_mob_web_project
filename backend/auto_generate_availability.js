const cron = require('node-cron');
const pool = require('./db_connect');

const MAX_BOOKING_QUOTA = 50;
const MAX_GUIDES_PER_SLOT = 5;
const GUIDE_GROUP_SIZE = 10;

async function runAutoGeneration() {
  let connection;
  try {
    connection = await pool.getConnection();

    const [allGuides] = await connection.query(`SELECT guide_id FROM park_guide`);
    const [timeSlots] = await connection.query(`SELECT DISTINCT time_slot FROM guide_availability LIMIT 3`);

    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (7 - today.getDay())); // upcoming Sunday

    const guideValues = [];
    const quotaValues = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(nextSunday);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      for (const slot of timeSlots) {
        const selectedGuides = allGuides.sort(() => 0.5 - Math.random()).slice(0, MAX_GUIDES_PER_SLOT);

        for (const guide of selectedGuides) {
          guideValues.push([
            guide.guide_id,
            dateStr,
            slot.time_slot,
            0,
            GUIDE_GROUP_SIZE,
            'available'
          ]);
        }

        quotaValues.push([
          dateStr,
          slot.time_slot,
          0,
          MAX_BOOKING_QUOTA,
          'available'
        ]);
      }
    }

    await connection.query(`
      INSERT IGNORE INTO guide_availability
      (guide_id, date, time_slot, current_bookings, max_group_size, status)
      VALUES ?
    `, [guideValues]);

    await connection.query(`
      INSERT IGNORE INTO booking_quotas
      (date, time_slot, current_visitor_count, max_total_visitors, status)
      VALUES ?
    `, [quotaValues]);

    console.log('✅ Guide availability and booking quotas generated successfully for the next week.');
  } catch (err) {
    console.error('❌ Failed to auto-generate availability:', err);
  } finally {
    if (connection) connection.release();
  }
}

async function checkIfNextWeekAlreadyGenerated() {
  const connection = await pool.getConnection();

  try {
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (7 - today.getDay()));

    const nextSaturday = new Date(nextSunday);
    nextSaturday.setDate(nextSaturday.getDate() + 6);

    const start = nextSunday.toISOString().split('T')[0];
    const end = nextSaturday.toISOString().split('T')[0];

    const [rows] = await connection.query(
      `SELECT COUNT(*) AS count FROM booking_quotas WHERE date BETWEEN ? AND ?`,
      [start, end]
    );

    return rows[0].count > 0;
  } catch (err) {
    console.error('❌ Failed to check existing data:', err);
    return true; // Fail-safe: assume data exists to avoid duplication
  } finally {
    connection.release();
  }
}

// Run on server start if it's Sunday
(async () => {
  const today = new Date();
  if (today.getDay() === 0) {
    const alreadyGenerated = await checkIfNextWeekAlreadyGenerated();
    if (!alreadyGenerated) {
      console.log('🕒 Today is Sunday and next week data not found — running auto-generation...');
      await runAutoGeneration();
    } else {
      console.log('⏹️ Next week’s data already exists — skipping generation.');
    }
  }
})();

// Also run every Sunday at 2:00 AM
cron.schedule('0 2 * * 0', async () => {
  const alreadyGenerated = await checkIfNextWeekAlreadyGenerated();
  if (!alreadyGenerated) {
    await runAutoGeneration();
  } else {
    console.log('⏹️ Scheduled task skipped — next week’s data already exists.');
  }
});
