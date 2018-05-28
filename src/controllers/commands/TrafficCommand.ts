import TuplabottiJr from '../../Bot';
import TrafficCamera from '../../lib/api/TrafficCamera';
import CommandBase from './CommandBase';

export default class TrafficCommand extends CommandBase {
  api: TrafficCamera;

  constructor(base: TuplabottiJr) {
    super(base);

    this.name =      'traffic';
    this.helpText =  'Show traffic cameras';

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

    for (const [cityName, urls] of Object.entries(trafficCameras)) {
      for (const url of urls) {
        if (url.includes('roundshot')) {
          const captionWithUrl = `${cityName}\n${url}`;
          await this.bot.sendPhoto(chatId, url, { caption: captionWithUrl });
          continue;
        }

        const caption = `${cityName}`;
        await this.bot.sendPhoto(chatId, url, { caption });
      }
    }
  }
}