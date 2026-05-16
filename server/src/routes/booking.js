// src/routes/booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const { calculateFare } = require('../utils/fareCalculator');
const { getCoords } = require('../utils/geocoder');

// Create booking request (calculate fare)
router.post('/calculate', async (req, res) => {
  try {
    const fare = calculateFare(req.body);
    res.json({ fare });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { startLocation } = req.body;
    const location = await getCoords(startLocation);
    const booking = new Booking({ ...req.body, location });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available bookings (radius filtered)
router.get('/available', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    let query = { status: 'pending' };
    if (lat && lng) {
      query.location = { $near: { $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, $maxDistance: 15000 } };
    }
    const bookings = await Booking.find(query).populate('customerId', 'name');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver Accepts Ride
router.patch('/:id/accept', async (req, res) => {
  try {
    const { driverId } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'accepted', driverId }, { new: true });
    // Set driver to BUSY
    await Driver.findByIdAndUpdate(driverId, { status: 'busy' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer Generates Start OTP
router.patch('/:id/start-otp', async (req, res) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const booking = await Booking.findByIdAndUpdate(req.params.id, { 'otp.start': otp }, { new: true });
    res.json({ message: 'Start OTP generated', otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver Verifies Start OTP & Starts Ride
router.patch('/:id/start', async (req, res) => {
  try {
    const { otp } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (booking.otp.start !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    
    booking.status = 'started';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer Generates End OTP
router.patch('/:id/end-otp', async (req, res) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const booking = await Booking.findByIdAndUpdate(req.params.id, { 'otp.end': otp }, { new: true });
    res.json({ message: 'End OTP generated', otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver Verifies End OTP & Completes Ride
router.patch('/:id/complete', async (req, res) => {
  try {
    const { otp } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (booking.otp.end !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    
    booking.status = 'completed';
    
    // Handle COD logic
    if (booking.paymentMethod === 'cash') {
       booking.codDeadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
    }
    
    await booking.save();
    
    // Set driver to AVAILABLE again
    await Driver.findByIdAndUpdate(booking.driverId, { status: 'available' });
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
