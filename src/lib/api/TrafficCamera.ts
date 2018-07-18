import axios from 'axios';

export default class TrafficCamera {
  async getTrafficCameras(cameraUrls: Array<string>): Promise<Array<ITrafficCamera>> {
    const cameras = [];

    for (const cameraUrl of cameraUrls) {
      if (cameraUrl.includes('kelikamerat.info')) {
        try {
          const camera = await this.parseKelikamerat(encodeURI(cameraUrl));
          
          if (camera) {
            cameras.push(camera);
          }
        } catch (e) {
          console.log(`Error (Camera URL: ${cameraUrl}):\n${e}`);
        }
      } else {
        // Camera URL is a static image, no parsing needed
        cameras.push({ url: cameraUrl });
      }
    }
    
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
    const cameraName = response.data
      .split('<div class="bar-content-selected">')[1]
      .split('</div>')[0].trim();
    const cityName = cameraUrl.split('/')[5];
    
    const camera = { cameraName, cityName, url, timestamp };
    return camera;
  }
}