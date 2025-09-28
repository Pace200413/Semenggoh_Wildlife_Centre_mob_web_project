const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const db = require('../db_connect'); // Make sure this exists

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/plants');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Plant identification endpoint
router.post('/identify-plant', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    const relativeImagePath = `/uploads/plants/${req.file.filename}`;

    const pythonScript = path.join(__dirname, '../scripts/identify_plant.py');
    const pythonProcess = spawn('python', [pythonScript, imagePath]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error('Python script error:', error);
        return res.status(500).json({ error: 'Failed to process image' });
      }

      try {
        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) throw new Error("No JSON object found in output");

        const plantData = JSON.parse(jsonMatch[0]);

        // Save top prediction only
        const topPrediction = plantData.predictions?.[0];
        if (topPrediction) {
          await db.query(
            'INSERT INTO identification_results (image_path, predicted_plant) VALUES (?, ?)',
            [relativeImagePath, topPrediction.name]
          );
        }

        res.json(plantData);
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError, '\nRaw output was:\n', result);
        res.status(500).json({ error: 'Failed to parse plant identification results' });
      }

      // Optional: Delete uploaded image after processing
      // fs.unlink(imagePath, err => {
      //   if (err) console.error('Error deleting file:', err);
      // });
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
