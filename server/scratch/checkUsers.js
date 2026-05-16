// server/scratch/checkUsers.js
const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config({ path: '../.env.local' });

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}).select('name email role');
    console.log('--- Current Users in DB ---');
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}]`));
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
