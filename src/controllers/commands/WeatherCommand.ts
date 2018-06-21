import axios from 'axios';
import TuplabottiJr from '../../Bot';
import OpenWeatherMap from '../../lib/api/OpenWeatherMap';
import * as settings from '../../lib/settings';
import CommandBase from './CommandBase';

export default class WeatherCommand extends CommandBase {
  api: OpenWeatherMap;
  chatsEnabled: Array<number>;

  constructor(base: TuplabottiJr) {
    super(base);

    this.name = 'weather';
    this.helpText = 'Show weather';
    this.helpArgs = '[enable | disable]';

    this.api = this.base.api.weather;
    this.loadEnabledChats();
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/(sää|weather)/, (msg, args) => {
      if (args.length === 0) {
        this.sendWeatherData(msg.chat.id);
        return;
      }

      const arg = args[0].toLowerCase();

      if (arg === 'enable') {
        if (!this.chatsEnabled.includes(msg.chat.id)) {
          this.chatsEnabled.push(msg.chat.id);
          this.saveEnabledChats();
        }

        this.sendMessage(msg.chat.id, 'Weather notifications enabled for this chat.');
        return;
      }

      if (arg === 'disable') {
        const index = this.chatsEnabled.indexOf(msg.chat.id);

        if (index !== -1) {
          this.chatsEnabled.splice(index, 1);
          this.saveEnabledChats();
        }

        this.sendMessage(msg.chat.id, 'Weather notifications disabled for this chat.');
        return;
      }
            
      this.showHelp(msg.chat.id);
    });
  }

  saveEnabledChats(): void {
    settings.write({
      weatherCommand: {
        chatsEnabled: this.chatsEnabled
      }
    });
  }

  loadEnabledChats(): void {
    const data = settings.read();
    this.chatsEnabled = (data.weatherCommand) ? data.weatherCommand.chatsEnabled : [];
  }

  async sendWeatherData(chatId: number): Promise<void> {
    const message = await this.sendMessage(chatId, 'Loading weather data...');
    
    try {
      const weatherReport = await this.api.getWeatherReport();
      this.editMessage(message, weatherReport);
    } catch (e) {
      this.editMessage(message, 'Could not load weather, please try again');
    }
  }

  async scheduleJob(): Promise<void> {
    for (const chatId of this.chatsEnabled) {
      await this.sendMessage(chatId, '_Hyvää huomenta pojat :3_');

      const response = await axios.get('http://thecatapi.com/api/images/get');
      const redirectUrl = response.request.res.responseUrl;

      await this.base.bot.sendPhoto(chatId, redirectUrl, {
        caption: 'Tän päivän kissekuva'
      });

      await this.base.commands.traffic.sendTrafficCameras(chatId);
      const weatherReport = await this.api.getWeatherReport();
      await this.sendMessage(chatId, weatherReport);
    }
  }
}