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

  async getTrainTimes(codes) {
    const times = await this.get(`/stations/trains`);
    const stationTimes = codes.map(code => times[code]);
    return stationTimes[0];
  }
}
