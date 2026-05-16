// src/db.js - MongoDB connection using Mongoose
require('dotenv').config({ path: '../.env.local' });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/drivemate';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🚀 Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

module.exports = mongoose;
