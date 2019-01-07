import fetch from 'node-fetch';
require('dotenv').config();

const fetchWeather = async (lat, lng) => {
  const response = await fetch(
    `https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${lat},${lng}`
  );
  const parsedResponse = await response.json();
  return parsedResponse;
};

export default fetchWeather;
