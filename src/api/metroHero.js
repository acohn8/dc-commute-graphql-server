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

  async getLineMetrics(metroLine) {
    const systemData = await this.getSystemMetrics();
    const lineData = systemData.find(line => line.line === metroLine).data;
    return lineData;
  }

  async getTrainTimes(codes) {
    const times = await this.get(`/stations/trains`);
    const stationTimes = codes.map(code => times[code]).flat();
    const lines = stationTimes.map(train => train.Line);
    const uniqueLines = [...new Set(lines)];
    const byLineAndDirection = uniqueLines.map(line => ({
      line: line,
      data: [
        {
          direction: 1,
          trainData: stationTimes
            .filter(train => train.Line === line && train.directionNumber === 1)
            .flat()
        },
        {
          direction: 2,
          trainData: stationTimes
            .filter(train => train.Line === line && train.directionNumber === 2)
            .flat()
        }
      ]
    }));
    console.log(byLineAndDirection);
    return byLineAndDirection;
  }
}
