import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import * as models from './models/index';

const app = express();
app.use(cors());

const schema = gql`
  type Query {
    stations: [Station]
    lines: [Line]
  }

  type Station {
    id: ID!
    name: String!
    lines: [Line]
    codes: [StationCode]
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
`;

const resolvers = {
  Query: {
    stations: async () => {
      const allStations = await models.Station.all({
        include: [
          { model: models.Line },
          { model: models.StationCode, as: 'codes' }
        ]
      });
      return allStations;
    },
    lines: async () => {
      const allLines = await models.Line.all({ include: models.Station });
      return allLines;
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
