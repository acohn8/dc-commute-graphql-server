import cors from 'cors';
import distance from '@turf/distance';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { MetroHeroAPI } from './api/metroHero';
import { DarkSkyAPI } from './api/weather';
import { MapboxAPI } from './api/mapBox';
import models, { sequelize } from './models/sequelize';

const app = express();
app.use(cors());

const typeDefs = gql`
  type Query {
    stations: [Station]
    station(id: ID!): Station
    lines: [Line]
    line(id: ID!): Line
    weather(lat: Float!, lng: Float!): Weather
    train: [Train]
    geocode(query: String!): MapboxPlaceSearch
  }

  type Station {
    id: ID!
    name: String!
    lat: Float!
    lng: Float!
    lines: [Line!]
    codes: [StationCode!]
    trains: [Train!]
    distance(lat: Float!, lng: Float!): Float
  }

  type StationCode {
    id: ID!
    station_code: String!
  }

  type Line {
    id: ID!
    name: String!
    stations: [Station!]
  }

  type Train {
    trainId: String
    realTrainId: String
    Car: String
    Destination: String
    DestinationCode: String
    DestinationName: String
    Group: String
    Line: String
    LocationCode: String
    LocationName: String
    Min: String
    parentMin: String
    minutesAway: Float
    maxMinutesAway: Float
    directionNumber: Int
    isScheduled: Boolean
    numPositiveTags: Int
    numNegativeTags: Int
    trackNumber: Int
    currentStationCode: String
    currentStationName: String
    PreviousStationCode: String
    previousStationName: String
    secondsSinceLastMoved: Int
    isCurrentlyHoldingOrSlow: Boolean
    secondsOffSchedule: Int
    trainSpeed: Int
    isNotOnRevenueTrack: Boolean
    isKeyedDown: Boolean
    wasKeyedDown: Boolean
    distanceFromNextStation: Int
    lat: Float
    lon: Float
    direction: Int
    observedDate: String
  }

  type Weather {
    latitude: Float!
    longitude: Float!
    timezone: String!
    currently: CurrentWeather
    hourly: HourlyWeather
  }

  type CurrentWeather {
    time: Int!
    summary: String!
    icon: String!
    nearestStormDistance: Int!
    precipIntensity: Float!
    precipIntensityError: Float!
    precipProbability: Float!
    precipType: String!
    temperature: Float!
    apparentTemperature: Float!
    dewPoint: Float!
    humidity: Float!
    pressure: Float!
    windSpeed: Float!
    windGust: Float!
    windBearing: Float!
    cloudCover: Float!
    uvIndex: Int!
    visibility: Float!
    ozone: Float!
  }

  type HourlyWeather {
    summary: String!
    icon: String!
    data: [HourlyData]
  }

  type HourlyData {
    time: Int!
    summary: String!
    icon: String!
    precipIntensity: Float!
    precipProbability: Float!
    precipType: String!
    temperature: Float!
    apparentTemperature: Float!
    dewPoint: Float!
    humidity: Float!
    pressure: Float!
    windSpeed: Float!
    windGust: Float!
    windBearing: Float!
    cloudCover: Float!
    uvIndex: Int!
    visibility: Float!
    ozone: Float!
  }

  type MapboxPlaceSearch {
    type: String
    query: [String]
    features: [MapboxFeature]
  }

  type MapboxFeature {
    id: String
    type: String
    place_type: [String]
    relevance: Int
    text: String
    place_name: String
    matching_place_name: String
    center: [Float]
    geometry: MapboxGeometry
    address: String
    context: [MapboxContext]
  }

  type MapboxGeometry {
    type: String
    coordinates: [Float]
  }

  type MapboxContext {
    id: String
    short_code: String
    wikidata: String
    text: String
  }
`;

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
  typeDefs,
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
