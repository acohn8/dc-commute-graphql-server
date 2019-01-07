import { RESTDataSource } from 'apollo-datasource-rest';
require('dotenv').config();

export class DarkSkyAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://api.darksky.net/forecast/${
      process.env.DARKSKY_KEY
    }`;
  }

  async getWeather(lat, lng) {
    const response = await this.get(`/${lat},${lng}`);
    return response;
  }
}
