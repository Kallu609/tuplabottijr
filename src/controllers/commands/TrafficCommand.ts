import TuplabottiJr from '../../Bot';
import TrafficCamera from '../../lib/api/TrafficCamera';
import CommandBase from './CommandBase';

export default class TrafficCommand extends CommandBase {
  api: TrafficCamera;

  constructor(base: TuplabottiJr) {
    super(base);

    this.name = 'traffic';
    this.helpText = 'Show traffic cameras';

    this.api = this.base.api.trafficCamera;
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/traffic/, (msg, args) => {
      this.sendTrafficCameras(msg.chat.id);
    });
  }

  async sendTrafficCameras(chatId: number): Promise<void> {
    const trafficCameras = await this.api.getTrafficCameras();

    for (const trafficCamera of trafficCameras) {
      let caption;

      if (trafficCamera.timestamp) {
        const time = new Date(trafficCamera.timestamp * 1000);
        const timestamp = ('0' + time.getHours()).slice(-2) + ':' +
                          ('0' + time.getMinutes()).slice(-2);

        caption = `[${timestamp}] ${trafficCamera.cityName}`;
      } else {
        caption = `${trafficCamera.cityName}`;
      }

      await this.bot.sendPhoto(chatId, trafficCamera.url, {
        caption, disable_notification: true
      });
    }
  }
}