export default (sequelize, DataTypes) => {
  const Station = sequelize.define('stations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
  return Station;
};
