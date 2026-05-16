// src/utils/fareCalculator.js

const calculateFare = (details) => {
  const { totalHours, dayHours, nightHours, distance } = details;
  
  // Admin rates (should ideally be fetched from DB)
  const DAY_RATE = 100; // per hour
  const NIGHT_RATE = 150; // per hour
  const NIGHT_ALLOWANCE = 200;
  const MIN_FARE = 500;

  let fare = (dayHours * DAY_RATE) + (nightHours * NIGHT_RATE);
  
  if (nightHours > 0) {
    fare += NIGHT_ALLOWANCE;
  }

  // Ensure minimum fare
  return Math.max(fare, MIN_FARE);
};

module.exports = { calculateFare };
