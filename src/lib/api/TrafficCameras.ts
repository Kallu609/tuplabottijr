import axios from 'axios';
import { DateTime } from 'luxon';
import config from '../../../config';

export default class TrafficCameras {
  async parseKelikamerat(cameraUrl: string): Promise<string> {
    const response = await axios.get(cameraUrl);
    const parts = response.data.split('","message":"","time_stamp');
    
    const urlEscaped = parts[parts.length - 2].split('"url":"')[1];
    const url = urlEscaped.replace(/\\/g, '');
    return url;
  }

  async parseRoundshot(cameraUrl: string): Promise<string> {
    const dt = DateTime.local().minus({ hours: 1 });
    const url = `${ cameraUrl }${ dt.toFormat('yyyy-LL-dd/HH-55-00/yyyy-LL-dd-HH-55-00') }_quarter.jpg`;
    return url;
  }

  async getTrafficCameras(): Promise<object> {
    const cameras = {};

    for (const city of config.openWeatherMap.cities) {
      if (city.camera.includes('kelikamerat.info')) {
        cameras[city.name] = await this.parseKelikamerat(city.camera);
        continue;
      }
      
      if (city.camera.includes('roundshot')) {
        cameras[city.name] = await this.parseRoundshot(city.camera);
        continue;
      }
    
      cameras[city.name] = city.camera;
    }

    return cameras;
  }
}