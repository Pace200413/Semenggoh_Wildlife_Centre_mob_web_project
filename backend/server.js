const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
require('dotenv').config();

const initDatabase = require('./create_table'); // ← Make sure this exports a function

(async () => {
  try {
    await initDatabase(); // Ensure DB and tables are created BEFORE anything else

    require('./auto_generate_availability'); // Run scheduled tasks
    require('./auto_check_expiry');

    const registerRoute = require('./routes/register');
    const bookingRoute = require('./routes/bookingRoute');
    const guideAvailabilityRoute = require('./routes/guideAvailability');
    const plantIdentification = require('./routes/plantIdentification');
    const sensorRoute = require('./routes/sensor');
    const userRoutes = require('./routes/userRoutes');
    const uploadRoutes = require('./routes/upload');
    const trainingCourseRoutes = require('./routes/training_course');
    const authRoutes = require('./routes/auth');
    const feedbackRoutes = require('./routes/feedback');
    const notificationRoutes = require('./routes/notification');
    const licenseRoutes = require('./routes/license');
    const db = require('./db_connect');
    const API_URL = 'http://172.17.8.43';

    const app = express();
    const PORT = process.env.PORT || 3000;
    const NODE_ENV = process.env.NODE_ENV || 'development';

    // // Schedule the cron job to run daily at midnight
    // cron.schedule('0 0 * * *', 
    const updateCompletedBookings = async () => {
      let connection;
      try {
        connection = await db.getConnection();  // Get connection from pool
        
        // Query to find bookings that have passed their date and are still confirmed (not cancelled)
        const [bookingsToUpdate] = await connection.query(`
          SELECT booking_id, booking_date, status
          FROM booking
          WHERE booking_date < CURDATE() AND status = 'confirmed'
        `);
    
        // Check if there are any bookings to update
        if (bookingsToUpdate.length > 0) {
          // Update each booking status to 'completed'
          const bookingIds = bookingsToUpdate.map(b => b.booking_id);

          const [updateResult] = await connection.query(`
            UPDATE booking
            SET status = 'completed'
            WHERE booking_id IN (?) 
          `, [bookingIds]);

          console.log(`${updateResult.affectedRows} booking(s) marked as completed.`);
        }
      } catch (err) {
        console.error('Error updating completed bookings:', err);
      } finally {
        if (connection) {
          connection.release();  // Always release the connection back to the pool
        }
      }
    }
    // );
    // Run the cron job immediately when server starts
    updateCompletedBookings();

    // Schedule the cron job to run daily at midnight (or any interval you prefer)
    cron.schedule('0 0 * * *', updateCompletedBookings);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads', 'plants');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Configure CORS based on environment
    const corsOptions = {
      origin: NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') || [`${API_URL}:3000`]
        : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    };

    app.use(cors(corsOptions));
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

    // Add request logging middleware for non-production environments
    if (NODE_ENV !== 'production') {
      app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        console.log('Request headers:', req.headers);
        if (!req.url.includes('/api/plants')) {
          console.log('Request body:', req.body);
        }
        next();
      });
    }

    // Test route
    app.get('/test', (req, res) => {
      res.json({ message: 'Server is working!', environment: NODE_ENV });
    });

    // Routes
    app.use('/api/register', registerRoute);
    app.use('/api/bookings', bookingRoute);
    app.use('/api/guides', guideAvailabilityRoute);
    app.use('/api/plants', plantIdentification);
    app.use('/api/iot', sensorRoute);
    app.use('/api/users', userRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/uploads', express.static('uploads')); // serve uploaded files
    app.use('/api/training_course', trainingCourseRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/feedback', feedbackRoutes);
    app.use('/api/notification', notificationRoutes);
    app.use('/api/license', licenseRoutes);

    // 404 handler
    app.use((req, res) => {
      console.log('404 - Route not found:', req.method, req.url);
      res.status(404).json({ error: 'Route not found' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Server error:', err);
      const statusCode = err.statusCode || 500;
      const message = NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
      res.status(statusCode).json({ error: message });
    });

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server running on ${API_URL}:${PORT} (${NODE_ENV} mode)`);
      if (NODE_ENV !== 'production') {
        console.log('Available routes:');
        console.log('- GET /test');
        console.log('- GET /api/guides');
        console.log('- POST /api/guides/update');
        console.log('- POST /api/register');
        console.log('- GET /api/bookings');
        console.log('- POST /api/identify-plant');
      }
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();
