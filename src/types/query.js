export const typeDef = `
  type Query {
    users: [User]
    stations: [Station]
    sortedStations(lat: Float!, lng: Float!): [Station]
    station(id: ID!): Station
    lines: [Line]
    line(id: ID!): Line
    weather(lat: Float!, lng: Float!): Weather
    train: [Train]
    geocode(location: String!): MapboxPlaceSearch
  }
  type Mutation {
    signup(email: String!, password: String!): String!
    login(email: String!, password: String!): String!
  }
`;
