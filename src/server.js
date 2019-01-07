import cors from 'cors';
import distance from '@turf/distance';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

import { typeDef as Query } from './types/query';
import { typeDef as Metro } from './types/metro';
import { typeDef as Weather } from './types/weather';
import { typeDef as Mapbox } from './types/mapbox';
import { MetroHeroAPI } from './api/metroHero';
import { DarkSkyAPI } from './api/weather';
import { MapboxAPI } from './api/mapBox';
import models, { sequelize } from './models/sequelize';

const app = express();
app.use(cors());

const resolvers = {
  Query: {
    stations: (parent, args, { models }) =>
      models.Station.findAll({
        include: [
          { model: models.Line },
          { model: models.StationCode, as: 'codes' }
        ]
      }),
    station: (parent, { id }, { models }) =>
      models.Station.findById(id, {
        include: [
          { model: models.Line },
          { model: models.StationCode, as: 'codes' }
        ]
      }),
    lines: (parent, args, { models }) =>
      models.Line.findAll({
        include: [
          {
            model: models.Station,
            include: { model: models.StationCode, as: 'codes' }
          }
        ]
      }),
    line: (parent, { id }, { models }) =>
      models.Line.findById(id, {
        include: [
          {
            model: models.Station,
            include: { model: models.StationCode, as: 'codes' }
          }
        ]
      }),
    geocode: (parent, { query }, { dataSources }) =>
      dataSources.MapboxAPI.getLocation(query),
    weather: (parent, { lat, lng }, { dataSources }) =>
      dataSources.DarkSkyAPI.getWeather(lat, lng)
  },
  Station: {
    trains: async (station, args, { dataSources }) => {
      const stationCodes = station.codes.map(code => code.station_code);
      return dataSources.MetroHeroAPI.getTrainTimes(stationCodes);
    },
    distance: (station, { lat, lng }) => {
      const stationCoords = [station.lng, station.lat];
      const userCoords = [lng, lat];
      return distance(userCoords, stationCoords, {
        units: 'miles'
      });
    }
  }
};

const server = new ApolloServer({
  typeDefs: [Query, Metro, Weather, Mapbox],
  resolvers,
  context: {
    models
  },
  dataSources: () => ({
    MetroHeroAPI: new MetroHeroAPI(),
    DarkSkyAPI: new DarkSkyAPI(),
    MapboxAPI: new MapboxAPI()
  })
});

server.applyMiddleware({ app, path: '/graphql' });

sequelize.sync().then(async () => {
  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});
