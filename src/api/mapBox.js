import { RESTDataSource } from 'apollo-datasource-rest';
require('dotenv').config();

export class MapboxAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://api.mapbox.com/geocoding/v5/mapbox.places`;
  }

  async getLocation(location) {
    if (location) {
      const response = await this.get(
        `/${location}.json?access_token=${
          process.env.MAPBOX_KEY
        }&country=us&proximity=-77.0366%2C%2038.895&autocomplete=true&language=`
      );
      const parsedResponse = await JSON.parse(response);
      return parsedResponse;
    }
  }
}
