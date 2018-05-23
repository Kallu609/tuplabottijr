import { EventEmitter } from 'events';
import * as TelegramBot from 'node-telegram-bot-api';
import EchoCommand from './Echo';

const commands = [
  EchoCommand
];

export default class CommandHandler {
  bot: TelegramBot;
  eventEmitter: EventEmitter;

  constructor(bot: TelegramBot) {
    this.bot = bot;
    this.eventEmitter = new EventEmitter();

    this.initCommands();
  }

  initCommands(): void {
    for (const Command of commands) {
      new Command(this.bot);
    }
  }
}