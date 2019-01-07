export const typeDef = `
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
`;
