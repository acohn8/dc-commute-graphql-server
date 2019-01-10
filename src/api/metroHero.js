import { RESTDataSource } from 'apollo-datasource-rest';
require('dotenv').config();

export class MetroHeroAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://dcmetrohero.com/api/v1/metrorail';
    this.apiKey = process.env.METRO_HERO_KEY;
  }

  willSendRequest(request) {
    request.headers.set('apiKey', this.apiKey);
  }

  async getSystemMetrics() {
    const metricsResponse = await this.get('/metrics');
    const metrics = metricsResponse.lineMetricsByLine;
    const lines = Object.keys(metrics);
    const lineData = lines.map(line => ({
      line: line,
      data: {
        ...metrics[line],
        directionMetricsByDirection: [
          {
            direction: 1,
            data: { ...metrics[line].directionMetricsByDirection[1] }
          },
          {
            direction: 2,
            data: { ...metrics[line].directionMetricsByDirection[2] }
          }
        ]
      }
    }));
    return lineData;
  }

  async getTrainTimes(codes) {
    const times = await this.get(`/stations/trains`);
    const stationTimes = codes.map(code => times[code])[0];
    const directionOne = stationTimes.filter(
      train => train.directionNumber === 1
    );
    const directionTwo = stationTimes.filter(
      train => train.directionNumber === 2
    );
    return [
      {
        direction: 1,
        data: directionOne
      },
      {
        direction: 2,
        data: directionTwo
      }
    ];
  }
}
