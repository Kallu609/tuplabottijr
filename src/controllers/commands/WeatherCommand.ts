import axios from 'axios';
import * as _ from 'lodash';
import TuplabottiJr from '../../Bot';
import OpenWeatherMap from '../../lib/api/OpenWeatherMap';
import CommandBase from './CommandBase';

export default class WeatherCommand extends CommandBase {
  api: OpenWeatherMap;
  chatsEnabled: Array<number>;

  constructor(base: TuplabottiJr) {
    super(base);

    this.name = 'weather';
    this.helpText = 'Show weather';
    this.helpArgs = '[enable|disable] [list] [add <place>]';

    this.api = this.base.api.weather;

    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/(sää|weather)/, async (msg, args) => {
      if (args.length === 0) {
        this.sendWeatherData(msg.chat.id);
        return;
      }

      const arg = args[0].toLowerCase();

      if (['enable', 'disable'].includes(arg)) {
        this.setChatNotifications(msg.chat.id, (arg === 'enable'));
        return;
      }

      if (args.length === 1 && arg === 'list') {
        const chat = this.getChat(msg.chat.id);
        const joined = (chat && chat.weather.cities.length > 0) ? chat.weather.cities.join('\n') : 'None yet!';

        this.sendMessage(msg.chat.id, `*Active places for your chat*\n\`${ joined }\``);
        return;
      }

      if (args.length >= 2 && arg === 'add') {
        const cities = args.slice(1);
        const tempMessage = await this.sendMessage(msg.chat.id, '_Validating places..._');
        const validCities = await this.api.validateCities(cities);
        
        if (!validCities.length) {
          return;
        }

        const chat = this.getChat(msg.chat.id);

        const newCities = validCities
          .map(city => (!chat.weather.cities.includes(city)) ? city : undefined)
          .filter(city => city)
          .join('\n');

        chat.weather.cities = _.union(chat.weather.cities, validCities);
        
        if (newCities) {
          this.editMessage(tempMessage, `*Added these new places*\n\`${ newCities }\``);
          return;
        }

        this.editMessage(tempMessage, '❗️ No valid places');
        return;
      }

      if (args.length >= 2 && arg === 'remove') {
        const removals = args.slice(1).map(x => x.toLowerCase());
        const chat = this.getChat(msg.chat.id);
        const citiesPrev = chat.weather.cities;

        chat.weather.cities = chat.weather.cities.filter(city => !removals.includes(city.toLowerCase()));
        this.sendMessage(msg.chat.id, `Removed ${citiesPrev.length - chat.weather.cities.length} places`);

        return;
      }
              
      if (args.length === 1) {
        try {
          const weatherReport = await this.api.getWeatherReport([arg]);
          if (weatherReport) {
            this.sendMessage(msg.chat.id, weatherReport);
            return;
          }
        } catch (e) {
          this.sendMessage(msg.chat.id, '🚫 Could not find place with that name.\nPerhaps try \`/help weather\`');
          return;
        }
      }

      this.showHelp(msg.chat.id);
    });
  }

  getChat(chatId: number): IDBChat {
    const chat = _.find(this.db.chats, {chatId});

    if (chat) {
      return chat as IDBChat;
    } else {
      const newChat: IDBChat = {
        chatId,
        weather: {
          cities: [],
          enabled: false
        }
      };
      
      if (!this.db.chats) {
        this.db.chats = [];
      }

      console.log(this.db);
      this.db.chats.push(newChat);
      return newChat;
    }
  }

  setChatNotifications(chatId: number, state: boolean): void {
    const chat = this.getChat(chatId);
    chat.weather.enabled = state;

    this.sendMessage(chatId,
      (state) ?
      `✅ Weather notifications enabled for this chat.\n` +
      `Please type \`/${this.name} add [city]\` to add cities.`
      :
      `🚫 Weather notifications disabled for this chat.\n` +
      `Type \`/${this.name} enable\` to enable again.`
    );
  }

  async sendWeatherData(chatId: number): Promise<void> {
    const chat = this.getChat(chatId);
  
    if (!chat || chat.weather.cities.length === 0) {
      this.sendMessage(chatId, 'No places added!\nType \`/weather add <place>\` to add place.');
      return;
    }

    const message = await this.sendMessage(chatId, 'Loading weather data...');
    
    try {
      const weatherReport = await this.api.getWeatherReport(chat.weather.cities);
      this.editMessage(message, weatherReport);
    } catch (e) {
      this.editMessage(message, 'Could not load weather, please try again');
    }
  }

  async scheduleJob(): Promise<void> {
    for (const chatId of this.chatsEnabled) {
      const response = await axios.get('http://thecatapi.com/api/images/get');
      const redirectUrl = response.request.res.responseUrl;
      const chat = this.getChat(chatId);
      const weatherReport = await this.api.getWeatherReport(chat.weather.cities);

      await this.sendMessage(chatId, '_Hyvää huomenta pojat :3_', {
        disable_notification: true
      });

      await this.base.bot.sendPhoto(chatId, redirectUrl, {
        caption: 'Tän päivän kissekuva',
        disable_notification: true
      });

      await this.base.commands.traffic.sendTrafficCameras(chatId);
      await this.sendMessage(chatId, weatherReport);
    }
  }
}