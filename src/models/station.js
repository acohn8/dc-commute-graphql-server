const station = (sequelize, DataTypes) => {
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
  Station.associate = models => {
    Station.hasMany(models.StationCode, { as: 'codes' });
    Station.belongsToMany(models.Line, { through: models.StationLine });
  };
  return Station;
};

export default station;
