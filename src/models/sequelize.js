import Sequelize from 'sequelize';
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  null,
  {
    host: 'localhost',
    dialect: 'postgres',
    define: {
      timestamps: false,
      underscored: true
    },
    operatorsAliases: false
  }
);

const models = {
  Station: sequelize.import('./station'),
  Line: sequelize.import('./line'),
  StationCode: sequelize.import('./stationCode'),
  StationLine: sequelize.import('./stationLine')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
