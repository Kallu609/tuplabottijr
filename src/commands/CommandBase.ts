import * as TelegramBot from 'node-telegram-bot-api';
import config from '../../config';
import TuplabottiJr from '../Bot';
import log from '../lib/logging';

export default class CommandBase {
  bot: TelegramBot;
  regexp: RegExp;

  constructor(public base: TuplabottiJr) {
    this.bot = base.bot;
  }
  
  private parseArguments(match: RegExpExecArray | null): Array<string> {
    return (match) ? match.slice(1) : [];
  }
  
  sendMessage(chatId: number, text: string): void {
    this.bot.sendMessage(chatId, text, this.base.messageOptions);
  }

  onText(regexp: RegExp, callback: ((msg: TelegramBot.Message, match: Array<string>) => void)): void {
    this.bot.onText(regexp, (msg, match) => {
      const now =  Math.floor(Date.now() / 1000);
      const deltaSeconds = now - msg.date;

      if (deltaSeconds < config.commandTimeout) {
        const args = this.parseArguments(match);

        log.info(
          `'${this.constructor.name}' triggered.\n` +
          `Arguments: [${ args.join(', ') }]\n` +
          `From: ${ msg.chat.first_name }.\n` +
          `Chat ID: ${ msg.chat.id }.`
        );

        callback(msg, args);
      }
    });
  }
}