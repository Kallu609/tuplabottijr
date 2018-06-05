import axios from 'axios';
import { DateTime } from 'luxon';
import config from '../../../config';

export default class TrafficCamera {
  async getTrafficCameras(): Promise<Array<ITrafficCamera>> {
    const cities = config.openWeatherMap.cities;

    const cameras =
      (await Promise.all(cities.map(async (city): Promise<ITrafficCamera | undefined> => {
        for (const cameraUrl of city.cameraUrls) {
          if (cameraUrl.includes('kelikamerat.info')) {
            try {
              const camera = await this.parseKelikamerat(cameraUrl);
              if (!camera) return;

              return { ...camera, cityName: city.name };
            } catch (e) {
              console.log(`Error ${e.response.status}: ${cameraUrl}`);
              return;
            }
          }

          // Camera URL is a static image, no parsing needed
          return  { url: cameraUrl, cityName: city.name };
        }

        return;
      }))
    ).filter(camera => camera);
    
    return cameras as Array<ITrafficCamera>;
  }

  private async parseKelikamerat(cameraUrl: string): Promise<ITrafficCamera | undefined> {
    const response = await axios.get(cameraUrl);
    const regex = /"url":"(.+?)","message":".*?","time_stamp":"(\d+)/g;
    const lastItem = response.data.match(regex).pop();
    const matches = regex.exec(lastItem);
    
    if (!matches) return;

    const url = matches[1].replace(/\\/g, '');
    const timestamp = Number(matches[2]);
    const camera = { url, timestamp };

    return camera;
  }
}