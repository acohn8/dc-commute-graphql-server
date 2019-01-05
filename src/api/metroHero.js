import fetch from 'node-fetch';

const fetchTrains = async stationIds => {
  const trains = await Promise.all(
    stationIds.map(async id => {
      const response = await fetch(
        'https://dcmetrohero.com/api/v1//metrorail/stations/C01/trains',
        {
          headers: {
            apiKey: 'bffa0ad2-d611-4025-a289-2bb5a50ee8e7'
          }
        }
      );
      const parsedResponse = await response.json();
      return parsedResponse;
    })
  );
  return trains;
};

export default fetchTrains;
