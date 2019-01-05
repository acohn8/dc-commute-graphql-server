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

export default sequelize;
