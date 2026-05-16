// src/utils/fareCalculator.js

const calculateFare = (details) => {
  const { startDate, endDate, isNightDrive } = details;
  
  if (!startDate || !endDate) return 500;

  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate total days (minimum 1 day)
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const DAY_RATE = 100; // per hour
  const NIGHT_RATE = 150; // per hour
  const NIGHT_ALLOWANCE = 200;
  const MIN_FARE = 500;

  // Each day consists of:
  // 16 Day Hours (Fixed)
  // 8 Night Hours (Optional)
  
  const dayFarePerDay = 16 * DAY_RATE; // 1600
  let nightFarePerDay = 0;

  if (isNightDrive) {
    nightFarePerDay = (8 * NIGHT_RATE); // 1200 (No extra allowance when active)
  } else {
    nightFarePerDay = NIGHT_ALLOWANCE; // Just ₹200 for the driver's stay
  }

  let totalFare = (dayFarePerDay + nightFarePerDay) * diffDays;

  return Math.max(totalFare, MIN_FARE);
};

module.exports = { calculateFare };
