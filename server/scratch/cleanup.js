// server/scratch/cleanup.js
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Booking = require('../src/models/Booking');
require('dotenv').config({ path: '../.env.local' });

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Delete all except Admin
    const result = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`✅ Deleted ${result.deletedCount} users (Customers/Drivers).`);

    const bookings = await Booking.deleteMany({});
    console.log(`✅ Deleted ${bookings.deletedCount} bookings.`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanup();
