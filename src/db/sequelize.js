import Sequelize from 'sequelize';

const sequelize = new Sequelize('commuter-api_development', 'adamcohn', null, {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    timestamps: false,
    underscored: true
  }
});

export default sequelize;
