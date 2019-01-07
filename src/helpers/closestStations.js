import distance from '@turf/distance';
import * as models from '../models/index';
import fetchTrains from '../api/metroHero';

const closestStations = stations => {
  const sortedStations = stations.sort((a, b) => a.distance - b.distance);
  const stationsWithTimes = sortedStations.slice(0, 3).map(async station => {
    console.log(station);
    const stationCodes = station.codes.map(
      code => code.dataValues.station_code
    );
    const trains = await fetchTrains(stationCodes);
    station.trains = trains;
    return station;
  });
  return stationsWithTimes;
};

const addDistanceToStations = async (lat, lng) => {
  const allStations = await models.Station.findAll({
    include: [
      { model: models.Line },
      { model: models.StationCode, as: 'codes' }
    ]
  });
  const stationsWithDistance = allStations.map(station => {
    const stationCoords = [station.lng, station.lat];
    const userCoords = [lng, lat];
    const userDistance = distance(userCoords, stationCoords, {
      units: 'miles'
    });
    const stationData = station.dataValues;
    stationData.distance = userDistance;
    return stationData;
  });
  const sortedStations = closestStations(stationsWithDistance);
  return sortedStations;
};

export default addDistanceToStations;
