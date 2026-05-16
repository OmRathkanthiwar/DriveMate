// src/utils/fareCalculator.js

const calculateFare = (details) => {
  const { startDate, endDate, isNightDrive, tripType } = details;
  
  if (!startDate || !endDate) return 500;

  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const DAY_RATE = 100;
  const NIGHT_RATE = 150;
  const NIGHT_ALLOWANCE = 200;
  const MIN_FARE = 500;

  const dayFarePerDay = 16 * DAY_RATE;
  let nightFarePerDay = isNightDrive ? (8 * NIGHT_RATE) : NIGHT_ALLOWANCE;

  let totalFare = (dayFarePerDay + nightFarePerDay) * diffDays;

  // ONE-WAY Logic: Add 20% Return Fare
  if (tripType === 'one-way') {
    totalFare = totalFare * 1.20; 
  }

  return Math.max(Math.round(totalFare), MIN_FARE);
};

module.exports = { calculateFare };
