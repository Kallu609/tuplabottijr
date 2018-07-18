import axios from 'axios';
import * as _ from 'lodash';
import TuplabottiJr from '../../Bot';
import OpenWeatherMap from '../../lib/api/OpenWeatherMap';
import CommandBase from './CommandBase';

export default class WeatherCommand extends CommandBase {
  api: OpenWeatherMap;

  constructor(base: TuplabottiJr) {
    super(base);

    this.name = 'weather';
    this.helpText = 'Show weather';
    this.helpArgs = '[enable|disable|list] [add|remove <place>]';

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
        const joined = (chat && chat.weather.places.length > 0) ? chat.weather.places.join('\n') : 'None yet!';

        this.sendMessage(msg.chat.id, `*Added places for this chat*\n\`${ joined }\``);
        return;
      }

      if (args.length >= 2 && arg === 'add') {
        const places = args.slice(1);
        const tempMessage = await this.sendMessage(msg.chat.id, '_Validating places..._');
        const validPlaces = await this.api.validatePlaces(places);
        
        if (!validPlaces.length) {
          this.editMessage(tempMessage, '❗️ No valid places');
          return;
        }

        const chat = this.getChat(msg.chat.id);

        const newPlaces = validPlaces
          .map(place => !chat.weather.places.includes(place) ? place : undefined)
          .filter(place => place);
        
        if (!newPlaces.length) {
          this.editMessage(tempMessage,
            `❗️ ${ places.length === 1 ? 'That place is' : 'Those places are' } already added`);
          return;
        }
        
        this.db.get('chats')
          .find({ chatId: msg.chat.id })
          .set('weather.places', _.union(chat.weather.places, newPlaces))
          .write();
          
        this.editMessage(tempMessage, `*Added these new places*\n\`${ newPlaces.join('\n') }\``);
        return;
      }

      if (args.length >= 2 && arg === 'remove') {
        const removals = args.slice(1).map(x => x.toLowerCase());
        const chat = this.getChat(msg.chat.id);
        const placesFiltered = chat.weather.places.filter(place => !removals.includes(place.toLowerCase()));
        const removeCount = chat.weather.places.length - placesFiltered.length;

        this.db.get('chats')
               .find({ chatId: msg.chat.id })
               .set('weather.places', placesFiltered)
               .write();
        
        this.sendMessage(msg.chat.id,
          `Removed ${removeCount} place${ removeCount > 1 ? 's' : '' }`
        );
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
  
    if (!chat || chat.weather.places.length === 0) {
      this.sendMessage(chatId, 'No places added!\nType \`/weather add <place>\` to add place.');
      return;
    }

    const message = await this.sendMessage(chatId, 'Loading weather data...');
    
    try {
      const weatherReport = await this.api.getWeatherReport(chat.weather.places);
      this.editMessage(message, weatherReport);
    } catch (e) {
      console.log(e);
      this.editMessage(message, 'Could not load weather, please try again');
    }
  }

  async scheduleJob(): Promise<void> {
    const chats = this.db.get('chats').value() as Array<IDBChat>;

    for (const chat of chats) {
      if (!chat.weather.enabled) {
        return;
      }

      const response = await axios.get('http://thecatapi.com/api/images/get');
      const redirectUrl = response.request.res.responseUrl;

      /*await this.base.bot.sendPhoto(chat.chatId, redirectUrl, {
        caption: 'Tän päivän kissekuva',
        disable_notification: true
      });*/
      
      if (chat.traffic.cameras.length) {
        const cameraUrls = chat.traffic.cameras.map(camera => camera.url);
        await this.base.commands.traffic.sendTrafficCameras(chat.chatId, cameraUrls);
      }
      
      if (chat.weather.places.length) {
        const weatherReport = await this.api.getWeatherReport(chat.weather.places);
        await this.sendMessage(chat.chatId, weatherReport);
      }
    }
  }
}