
import * as TelegramBot from 'node-telegram-bot-api';
import { ConstructorOptions, SendMessageOptions } from 'node-telegram-bot-api';
import config from '../config';
import CommandLoader from './controllers/CommandLoader';
import Schedules from './controllers/Schedules';
import CryptoCompare from './lib/api/CryptoCompare';
import OpenWeatherMap from './lib/api/OpenWeatherMap';
import TrafficCamera from './lib/api/TrafficCamera';
import Database from './lib/Database';
import log from './lib/logging';

export default class TuplabottiJr {
  bot: TelegramBot;
  db: Database;
  commands: ICommandList;
  api: IAPIList;
  
  token: string;
  options: ConstructorOptions;
  messageOptions: SendMessageOptions;

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    console.log(`
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█   ▀█▀ █ █ █▀█ █   █▀█ █▀▄ █▀█ ▀█▀ ▀█▀ █   █
█    █  █ █ █▀▀ █   █▀█ █▀▄ █ █  █   █  █   █
█    ▀  ▀▀▀ ▀   ▀▀▀ ▀ ▀ ▀▀  ▀▀▀  ▀   ▀  ▀   █
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
 `);

    this.commands = {};
    this.db = new Database();

    await this.loadAPIs();
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
  
  private async loadAPIs(): Promise<void> {
    this.api = {
      crypto: new CryptoCompare(),
      weather: new OpenWeatherMap(),
      trafficCamera: new TrafficCamera()
    };

    await this.api.crypto.init();
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
    new Schedules(this);
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