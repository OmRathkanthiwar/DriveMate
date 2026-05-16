// src/utils/geocoder.js
const axios = require('axios');

const getCoords = async (address) => {
  try {
    const key = process.env.GOOGLE_MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
    
    const { data } = await axios.get(url);
    
    if (data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${data.status}`);
    }

    const { lat, lng } = data.results[0].geometry.location;
    return {
      type: 'Point',
      coordinates: [lng, lat] // MongoDB expects [Longitude, Latitude]
    };
  } catch (err) {
    console.error('Geocoder Error:', err.message);
    // Fallback coordinates (Pune Center) if geocoding fails during dev
    return { type: 'Point', coordinates: [73.8567, 18.5204] };
  }
};

module.exports = { getCoords };
