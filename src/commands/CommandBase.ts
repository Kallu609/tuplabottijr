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
  
  async sendMessage(chatId: number, text: string): Promise<TelegramBot.Message> {
    const message = await this.bot.sendMessage(chatId, text, this.base.messageOptions);
    return message as TelegramBot.Message;
  }

  async editMessage(message: TelegramBot.Message, newText: string): Promise<TelegramBot.Message> {
    const options = {
      chat_id: message.chat.id,
      message_id: message.message_id,
      parse_mode: this.base.messageOptions.parse_mode
    };

    const newMessage = await this.bot.editMessageText(newText, options);
    return newMessage as TelegramBot.Message;
  }

  onText(regexp: RegExp, callback: ((msg: TelegramBot.Message, match: Array<string>) => void)): void {
    this.bot.onText(regexp, (msg, match) => {
      const now =  Math.floor(Date.now() / 1000);
      const deltaSeconds = now - msg.date;

      if (deltaSeconds < config.commandTimeout) {
        const args = this.parseArguments(match);
        
        const usersName =
          (msg.chat.type === 'private') ?
          `(${ msg.chat.first_name ? msg.chat.first_name : '' }` + 
          `${ msg.chat.last_name ? msg.chat.last_name : '' })`
          : '';

        log.info(
          `'${this.constructor.name}' triggered.\n` +
          `Arguments: [${ args.join(', ') }]\n` +
          `User:   ${ msg.chat.id } ${ usersName }\n` +
          `Chat ID:   ${ msg.chat.id }.`
        );

        callback(msg, args);
      }
    });
  }
}