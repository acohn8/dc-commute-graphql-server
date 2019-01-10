import distance from '@turf/distance';

const sortedStations = (stations, userCoords) => {
  const withDistance = stations.map(station => {
    const stationCoords = [station.lng, station.lat];
    const userDistance = distance(userCoords, stationCoords, {
      unites: 'miles'
    });
    if (userDistance <= 2.0) {
      station.dataValues.distance = userDistance;
      return station;
    }
  });
  const sortedStations = withDistance
    .sort((a, b) => a.dataValues.distance - b.dataValues.distance)
    .filter(Boolean);
  return sortedStations;
};

export default sortedStations;
