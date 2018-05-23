
import * as TelegramBot from 'node-telegram-bot-api';
import { ConstructorOptions } from 'node-telegram-bot-api';
import config from '../config';
import CommandHandler from './commands/CommandHandler';
import log from './lib/logging';

export default class TuplabottiJr {
  bot: TelegramBot;
  token: string;
  options: ConstructorOptions;
  commands: CommandHandler;

  constructor() {
    this.create();
    this.start();
  }

  start(): void {
    this.bot.startPolling();
    log.info('Bot started');
  }

  stop(): void {
    this.bot.stopPolling();
    log.info('Bot stopped');
  }

  private create(): void {
    this.setToken();
    this.setOptions();
    
    this.bot = new TelegramBot(this.token, this.options);
    this.commands = new CommandHandler(this.bot);
  }

  private setToken(): void {
    this.token = config.botToken;

    if (!this.token.trim()) {
      log.error('No bot token found. Add it to config.ts');
      process.exit(1);
    }
  }

  private setOptions(): void {
    this.options = {};
  }
}