// src/models/Customer.js
const mongoose = require('mongoose');
const User = require('./User');

const CustomerSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  country: { type: String },
  state: { type: String },
  city: { type: String }
});

module.exports = User.discriminator('customer', CustomerSchema);
