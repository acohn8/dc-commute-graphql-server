export const typeDef = `
  type Station {
    id: ID!
    name: String!
    address: String!
    lat: Float!
    lng: Float!
    lines: [Line!]
    codes: [StationCode!]
    trains: [TrainDirection]
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

  type TrainDirection {
    line: String!
    data: [TrainData!]
  }

  type TrainData {
    direction: Int!
    trainData: [Train]
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

  type SystemMetric {
    line: String
    data: LineMetricData
  }

  type LineMetricData {
    lineCode: String
    expectedNumTrains: Int
    numTrains: Int
    numEightCarTrains: Int
    numDelayedTrains: Int
    numCars: Int
    averageTrainDelay: Int
    medianTrainDelay: Int
    minimumTrainDelay: Int
    maximumTrainDelay: Int
    averageMinimumHeadways: Float
    averageTrainFrequency: Float
    expectedTrainFrequency: Int
    averagePlatformWaitTime: Float
    expectedPlatformWaitTime: Int
    trainFrequencyStatus: String
    platformWaitTimeTrendStatus: String
    averageHeadwayAdherence: Float
    averageScheduleAdherence: Float
    standardDeviationTrainFrequency: Float
    expectedStandardDeviationTrainFrequency: Float
    directionMetricsByDirection: [LineDirection]
    date: String
  }

  type LineDirection {
    direction: Int
    data: LineDirectionMetric
  }

  type LineDirectionMetric {
    lineCode: String
    directionNumber: Int
    direction: String
    towardsStationName: String
    expectedNumTrains: Int
    numTrains: Int
    numEightCarTrains: Int
    numDelayedTrains: Int
    numCars: Int
    averageTrainDelay: Int
    medianTrainDelay: Int
    minimumTrainDelay: Int
    maximumTrainDelay: Int
    averageMinimumHeadways: Float
    averageTrainFrequency: Float
    expectedTrainFrequency: Int
    averagePlatformWaitTime: Float
    expectedPlatformWaitTime: Int
    trainFrequencyStatus: String
    platformWaitTimeTrendStatus: String
    averageHeadwayAdherence: Float
    averageScheduleAdherence: Float
    standardDeviationTrainFrequency: Float
    expectedStandardDeviationTrainFrequency: Float
    date: String
  }
`;
