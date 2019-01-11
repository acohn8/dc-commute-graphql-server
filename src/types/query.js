export const typeDef = `
  type Query {
    stations: [Station]
    metroMetrics: [SystemMetric]
    lineMetrics(line: String!): LineMetricData
    sortedStations(lat: Float!, lng: Float!): [Station]
    station(id: ID!): Station
    lines: [Line]
    line(id: ID!): Line
    weather(lat: Float!, lng: Float!): Weather
    train: [Train]
    geocode(location: String!): MapboxPlaceSearch
  }
`;
