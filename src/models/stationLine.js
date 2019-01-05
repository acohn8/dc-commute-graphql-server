export default (sequelize, DataTypes) => {
  const stationLine = sequelize.define('station_lines', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    station_id: DataTypes.INTEGER,
    line_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
  return stationLine;
};
