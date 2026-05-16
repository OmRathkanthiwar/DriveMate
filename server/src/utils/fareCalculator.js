// src/utils/fareCalculator.js

const calculateFare = (details) => {
  const { dayHours, nightHours, isNightDrive } = details;
  
  const DAY_RATE = 100; // per hour
  const NIGHT_RATE = 150; // per hour (Active driving)
  const NIGHT_ALLOWANCE = 200; // Flat fee for driver's stay
  const MIN_FARE = 500;

  let fare = (dayHours * DAY_RATE);

  if (isNightDrive) {
    // Active night driving: Apply night rate + allowance
    fare += (nightHours * NIGHT_RATE) + NIGHT_ALLOWANCE;
  } else if (nightHours > 0) {
    // Driver is just staying overnight: Only flat allowance applies
    fare += NIGHT_ALLOWANCE;
  }

  return Math.max(fare, MIN_FARE);
};

module.exports = { calculateFare };
