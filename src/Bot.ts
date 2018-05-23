
import * as TelegramBot from 'node-telegram-bot-api';
import { ConstructorOptions, SendMessageOptions } from 'node-telegram-bot-api';
import config from '../config';
import CommandHandler from './commands/CommandHandler';
import log from './lib/logging';

export default class TuplabottiJr {
  bot: TelegramBot;
  token: string;
  options: ConstructorOptions;
  commands: CommandHandler;
  messageOptions: SendMessageOptions;

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

  private eventHandler(): void {
    this.bot.on('polling_error', error => log.error(error));
    this.bot.on('webhook_error', error => log.error(error));
    this.bot.on('error', error => log.error(error));
  }

  private create(): void {
    this.setToken();
    this.setOptions();
    
    this.bot = new TelegramBot(this.token, this.options);
    this.eventHandler();
    this.commands = new CommandHandler(this);
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
    this.messageOptions = {
      parse_mode: 'Markdown'
    };
  }
}