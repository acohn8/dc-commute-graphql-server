export const typeDef = `
  type Station {
    id: ID!
    name: String!
    address: String!
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
`;
