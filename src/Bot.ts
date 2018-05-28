
import * as TelegramBot from 'node-telegram-bot-api';
import { ConstructorOptions, SendMessageOptions } from 'node-telegram-bot-api';
import config from '../config';
import CommandLoader from './controllers/CommandLoader';
import CryptoCompare from './lib/api/CryptoCompare';
import OpenWeatherMap from './lib/api/OpenWeatherMap';
import TrafficCamera from './lib/api/TrafficCamera';
import log from './lib/logging';

export default class TuplabottiJr {
  bot: TelegramBot;
  commands: ICommandList;
  api: IAPIList;
  
  token: string;
  options: ConstructorOptions;
  messageOptions: SendMessageOptions;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    this.commands = {};
    
    this.api = {
      crypto: new CryptoCompare(),
      weather: new OpenWeatherMap(),
      trafficCamera: new TrafficCamera()
    };

    await this.api.crypto.init();

    this.create();
    this.start();
  }

  start(): void {
    this.bot.startPolling();
    log.info('Bot started! :)');
  }

  stop(): void {
    this.bot.stopPolling();
    log.info('Bot stopped');
    process.exit();
  }

  private eventHandler(): void {
    this.bot.on('polling_error', error => log.error(`polling_error: ${error.code}`));
    this.bot.on('webhook_error', error => log.error(`webhook_error: ${error.code}`));
    this.bot.on('error', error => log.error(`error: ${error.code}`));
  }

  private create(): void {
    this.setToken();
    this.setOptions();
    
    this.bot = new TelegramBot(this.token, this.options);
    this.eventHandler();
    new CommandLoader(this);
  }

  private setToken(): void {
    if (!config.botToken) {
      log.error('No bot token found. Add it to config.ts on root directory.');
      return process.exit(1);
    }

    this.token = config.botToken;
  }

  private setOptions(): void {
    this.options = {
      polling: {
        autoStart: false
      }
    };

    this.messageOptions = {
      parse_mode: 'Markdown'
    };
  }
}