export default (sequelize, DataTypes) => {
  const stationCode = sequelize.define('station_codes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    station_id: DataTypes.INTEGER,
    station_code: DataTypes.STRING
  });
  return stationCode;
};
