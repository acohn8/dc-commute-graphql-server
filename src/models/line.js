export default (sequelize, DataTypes) => {
  const Line = sequelize.define('lines', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
  Line.associate = models => {
    Line.belongsToMany(models.Station, { through: models.StationLine });
  };
  return Line;
};
