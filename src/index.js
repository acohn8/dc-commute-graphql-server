import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import * as models from './models/index';
import fetchTrains from './api/metroHero';
import fetchWeather from './api/weather';
import addDistanceToStations from './helpers/closestStations';

const app = express();
app.use(cors());

const schema = gql`
  type Query {
    stations: [Station]
    station(id: ID!): Station
    lines: [Line]
    line(id: ID!): Line
    weather(lat: Float!, lng: Float!): Weather
    trainAndWeather(lat: Float!, lng: Float!): TrainAndWeather
  }

  type Station {
    id: ID!
    name: String!
    lat: Float!
    lng: Float!
    lines: [Line]
    codes: [StationCode]
    trains: [Train]
    distance: Float
  }

  type StationCode {
    id: ID!
    station_code: String!
  }

  type Line {
    id: ID!
    name: String!
    stations: [Station]
  }

  type Train {
    trainId: String
    realTrainId: String
    car: String
    destination: String
    destinationCode: String
    destinationName: String
    group: String
    line: String
    locationCode: String
    locationName: String
    min: String
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

  type TrainAndWeather {
    stations: [Station]
    weather: Weather
  }
`;

const resolvers = {
  Query: {
    stations: async () => {
      const allStations = await models.Station.findAll({
        include: [
          { model: models.Line },
          { model: models.StationCode, as: 'codes' }
        ]
      });
      return allStations;
    },
    station: async (parent, { id }) => {
      const station = await models.Station.findById(id, {
        include: [
          { model: models.Line },
          { model: models.StationCode, as: 'codes' }
        ]
      });
      const stationCodes = station.codes.map(
        code => code.dataValues.station_code
      );
      const trains = await fetchTrains(stationCodes);
      station.trains = trains;
      return station;
    },
    lines: async () => {
      const allLines = await models.Line.all({ include: models.Station });
      return allLines;
    },
    line: async (parent, { id }) => {
      const line = await models.Line.findById(id, {
        include: [{ model: models.Station }]
      });
      return line;
    },
    weather: async (parent, { lat, lng }) => {
      const weather = await fetchWeather(lat, lng);
      return { weather };
    },
    trainAndWeather: async (parent, { lat, lng }) => {
      const weather = await fetchWeather(lat, lng);
      const stations = await addDistanceToStations(lat, lng);
      return { weather: weather, stations: stations };
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
