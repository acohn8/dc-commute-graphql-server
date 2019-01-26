import cors from 'cors';
import distance from '@turf/distance';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
require('dotenv').config();

import { typeDef as Query } from './types/query';
import { typeDef as Metro } from './types/metro';
import { typeDef as Weather } from './types/weather';
import { typeDef as Mapbox } from './types/mapbox';
import { typeDef as User } from './types/user';
import { MetroHeroAPI } from './api/metroHero';
import { DarkSkyAPI } from './api/weather';
import { MapboxAPI } from './api/mapBox';
import models, { sequelize } from './models/sequelize';
import sortedStations from './helpers/sortedStations';

const app = express();

const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
});
app.use(auth, cors());

const resolvers = {
  Query: {
    users: (parent, args, { models }) => models.User.findAll(),
    stations: (parent, args, { models }) =>
      models.Station.findAll({
        include: [
          { model: models.Line },
          { model: models.StationCode, as: 'codes' }
        ]
      }),
    sortedStations: async (parent, { lat, lng }, { models }) => {
      const allStations = await models.Station.findAll({
        include: [
          { model: models.Line },
          { model: models.StationCode, as: 'codes' }
        ]
      });
      const sorted = sortedStations(allStations, [lng, lat]);
      return sorted;
    },
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
    geocode: (parent, { location }, { dataSources }) =>
      dataSources.MapboxAPI.getLocation(location),
    weather: (parent, { lat, lng }, { dataSources }) =>
      dataSources.DarkSkyAPI.getWeather(lat, lng),
    lineMetrics: (parent, { line }, { dataSources }) =>
      dataSources.MetroHeroAPI.getLineMetrics(line)
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
  },
  Mutation: {
    signup: async (_, { email, password }) => {
      const user = await models.User.create({
        email,
        password: await bcrypt.hash(password, 10)
      });
      return jsonwebtoken.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1y'
      });
    },
    login: async (_, { email, password }) => {
      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        throw new Error('No user found');
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Incorrect password');
      }
      return jsonwebtoken.sign(
        {
          id: user.id,
          email: user.email,
          address: user.address,
          lat: user.lat,
          lng: user.lng
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs: [Query, Metro, Weather, Mapbox, User],
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
