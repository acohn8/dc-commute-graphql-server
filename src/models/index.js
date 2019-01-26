import station from './station';
import stationCode from './stationCode';
import stationLine from './stationLine';
import line from './line';
import user from './user';
import sequelize from './sequelize';
import Sequelize from 'sequelize';

export const Station = station(sequelize, Sequelize.DataTypes);
export const User = user(sequelize, Sequelize.DataTypes);
export const StationCode = stationCode(sequelize, Sequelize.DataTypes);
export const StationLine = stationLine(sequelize, Sequelize.DataTypes);
export const Line = line(sequelize, Sequelize.DataTypes);

// Station.hasMany(StationCode, { as: 'codes' });
// Station.belongsToMany(Line, { through: StationLine });
// Line.belongsToMany(Station, { through: StationLine });
