// src/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Customer = require('../models/Customer');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL.split('@')[1],
  api_key: process.env.CLOUDINARY_URL.split('://')[1].split(':')[0],
  api_secret: process.env.CLOUDINARY_URL.split(':')[2].split('@')[0]
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'drivemate_users',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// Register (with 5-Field Cloudinary Upload)
router.post('/register', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'licenseFile', maxCount: 1 },
  { name: 'panCard', maxCount: 1 }
]), async (req, res) => {
  try {
    const { role, name, email, password, ...rest } = req.body;
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    let newUser;
    const photoUrls = {
      profile: req.files['profilePhoto']?.[0]?.path,
      addressProof: req.files['addressProof']?.[0]?.path,
      aadhaarCard: req.files['aadhaarCard']?.[0]?.path,
      license: req.files['licenseFile']?.[0]?.path,
      panCard: req.files['panCard']?.[0]?.path,
    };

    if (role === 'driver') {
      newUser = new Driver({ 
        role, name, email, password, 
        contactNo: req.body.phone,
        photos: Object.values(photoUrls).filter(url => !!url), // Save all 4 URLs
        ...rest 
      });
    } else {
      newUser = new Customer({ role, name, email, password, ...rest });
    }
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Register Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.json({ token, role: user.role, name: user.name, id: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
