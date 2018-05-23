import * as TelegramBot from 'node-telegram-bot-api';
import TuplabottiJr from '../Bot';
import log from '../lib/logging';

export default class CommandBase {
  bot: TelegramBot;
  regexp: RegExp;

  constructor(public base: TuplabottiJr) {
    this.bot = base.bot;
  }

  commandTriggered(msg: TelegramBot.Message): void {
    log.info(
      `Command '${this.constructor.name}' triggered.` +
      `From: ${msg.chat.first_name}.` +
      `Chat ID: ${msg.chat.id}.`
    );
  }

  parseArguments(match: RegExpExecArray | null): Array<string> {
    return (match) ? match.slice(1) : [];
  }
}