import fetch from 'node-fetch';
require('dotenv').config();

const fetchTrains = async stationIds => {
  const trains = await Promise.all(
    stationIds.map(async id => {
      const response = await fetch(
        `https://dcmetrohero.com/api/v1//metrorail/stations/${id}/trains`,
        {
          headers: {
            apiKey: process.env.METRO_HERO_KEY
          }
        }
      );
      const parsedResponse = await response.json();
      return parsedResponse;
    })
  );
  return trains[0];
};

export default fetchTrains;
