import axios from 'axios';
import { DateTime } from 'luxon';
import config from '../../../config';

export default class TrafficCamera {
  async parseKelikamerat(cameraUrl: string): Promise<ITrafficCamera | boolean> {
    const response = await axios.get(cameraUrl);
    const regex = /"url":"(.+?)","message":".*?","time_stamp":"(\d+)/g;
    const lastItem = response.data.match(regex).pop();
    const matches = regex.exec(lastItem);
    
    if (!matches) return false;

    const url = matches[1].replace(/\\/g, '');
    const timestamp = Number(matches[2]);
    const camera = { url, timestamp };

    return camera;
  }

  async getTrafficCameras(): Promise<Array<ITrafficCamera>> {
    const cameras = [];

    for (const city of config.openWeatherMap.cities) {
      for (const cameraUrl of city.cameraUrls) {
        try {
          if (cameraUrl.includes('kelikamerat.info')) {
            const camera = await this.parseKelikamerat(cameraUrl);
            
            if (typeof camera === 'boolean') {
              continue;
            }

            cameras.push({
              ...camera,
              cityName: city.name 
            });

            continue;
          }
        } catch (e) {
          console.log(`Error ${e.response.status}: ${cameraUrl}`);
          continue;
        }

        // Camera URL is a static image, no parsing needed
        cameras.push({
          url: cameraUrl
        });
      }
    }

    return cameras;
  }
}