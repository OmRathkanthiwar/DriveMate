// src/index.js - Express server for DriveMate
require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('./db'); // connect to MongoDB

// Routers
const authRouter = require('./routes/auth');
const driverRouter = require('./routes/driver');
const adminRouter = require('./routes/admin');
const bookingRouter = require('./routes/booking');
const otpRouter = require('./routes/otp');
const paymentRouter = require('./routes/payment');
const metadataRouter = require('./routes/metadata');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', metadataRouter);
app.use('/api/auth', authRouter);
app.use('/api/driver', driverRouter);
app.use('/api/admin', adminRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/otp', otpRouter);
app.use('/api/payment', paymentRouter);

// Health-check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
