const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db_connect');
const fs = require('fs');
const router = express.Router();

// Setup folders
const folders = {
  profile: 'uploads/profiles',
  plant: 'uploads/plants',
  default: 'uploads/others',
};

// Ensure folders exist
Object.values(folders).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Use memory storage temporarily — we’ll move the file manually after we know the `type`
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), async (req, res) => {
  console.log('Upload endpoint hit'); // <---- add this
  const { type, userId, plantId } = req.body;

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const folder = folders[type] || folders.default;
    const filename = `${type}_${Date.now()}${path.extname(req.file.originalname)}`;
    const fullPath = path.join(folder, filename);

    // Save the file manually
    fs.writeFileSync(fullPath, req.file.buffer);

    const relativePath = `/${fullPath.replace(/\\/g, '/')}`;

    // Save to DB depending on type
    if (type === 'profile' && userId) {
      await db.query(
        'UPDATE users SET profile_image_url = ? WHERE user_id = ?',
        [relativePath, userId]
      );
    } else if (type === 'plant' && plantId) {
      await db.query(
        'UPDATE identified_plants SET image_path = ? WHERE plant_id = ?',
        [relativePath, plantId]
      );
    }

    res.json({ imageUrl: relativePath });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
