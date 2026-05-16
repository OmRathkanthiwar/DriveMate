// src/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Customer = require('../models/Customer');

// Register (type: driver or customer)
router.post('/register', async (req, res) => {
  try {
    const { role, name, email, password, ...rest } = req.body;
    if (!['driver', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    let newUser;
    if (role === 'driver') {
      newUser = new Driver({ role, name, email, password, ...rest });
    } else {
      newUser = new Customer({ role, name, email, password, ...rest });
    }
    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Login – returns JWT
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
