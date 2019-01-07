export const typeDef = `
  type Query {
    stations: [Station]
    station(id: ID!): Station
    lines: [Line]
    line(id: ID!): Line
    weather(lat: Float!, lng: Float!): Weather
    train: [Train]
    geocode(query: String!): MapboxPlaceSearch
  }
`;
