
import * as TelegramBot from 'node-telegram-bot-api';
import { ConstructorOptions, SendMessageOptions } from 'node-telegram-bot-api';
import config from '../config';
import CommandHandler from './commands/CommandHandler';
import log from './lib/logging';

export default class TuplabottiJr {
  bot: TelegramBot;
  commands: CommandHandler;

  token: string;
  options: ConstructorOptions;
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
    this.bot.on('polling_error', error => log.error(error.code));
    this.bot.on('webhook_error', error => log.error(error.code));
    this.bot.on('error', error => log.error(error.code));
  }

  private create(): void {
    this.setToken();
    this.setOptions();
    
    this.bot = new TelegramBot(this.token, this.options);
    this.eventHandler();

    this.commands = new CommandHandler(this);
  }

  private setToken(): void {
    if (!process.env.BOT_TOKEN) {
      log.error('No bot token found. Add BOT_TOKEN to \'.env\' file');
      return process.exit(1);
    }

    this.token = process.env.BOT_TOKEN;
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