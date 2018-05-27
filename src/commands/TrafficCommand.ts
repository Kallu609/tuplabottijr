import TuplabottiJr from '../Bot';
import TrafficCameras from '../lib/api/TrafficCameras';
import CommandBase from './CommandBase';

export default class TrafficCommand extends CommandBase {
  api: TrafficCameras;

  constructor(base: TuplabottiJr) {
    super(base);
    this.api = this.base.trafficCameraAPI;
    
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/traffic/, (msg, args) => {
      this.sendTrafficCameras(msg.chat.id);
    });
  }

  async sendTrafficCameras(chatId: number): Promise<void> {
    const trafficCameras = await this.api.getTrafficCameras();

    for (const [cityName, url] of Object.entries(trafficCameras)) {
      await this.bot.sendPhoto(chatId, url, {
        caption: `Sääkamera: ${cityName}`
      });
    }
  }
}