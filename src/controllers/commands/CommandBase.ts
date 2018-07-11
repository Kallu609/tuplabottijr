import * as low from 'lowdb';
import { Message } from 'node-telegram-bot-api';
import * as TelegramBot from 'node-telegram-bot-api';
import config from '../../../config';
import TuplabottiJr from '../../Bot';
import log from '../../lib/logging';

export default class CommandBase {
  bot: TelegramBot;
  db: IDatabase;

  name: string;
  helpText: string;
  helpArgs: string;
  hidden: boolean;
  disabled: boolean;

  constructor(public base: TuplabottiJr) {
    this.bot = base.bot;
    this.db = base.database.db;
    this.hidden = false;
  }
  
  private parseArguments(message: string | undefined): Array<string> {
    if (message) {
      return message.split(' ').slice(1);
    }

    return [];
  }
  
  async sendMessage(chatId: number, text: string, options?: TelegramBot.SendMessageOptions): Promise<Message> {
    const message = await this.bot.sendMessage(chatId, text, { ...this.base.messageOptions, ...options });
    return message as Message;
  }

  async editMessage(message: Message, newText: string): Promise<Message> {
    const options = {
      chat_id: message.chat.id,
      message_id: message.message_id,
      parse_mode: this.base.messageOptions.parse_mode
    };

    const newMessage = await this.bot.editMessageText(newText, options);
    return newMessage as Message;
  }

  onText(
    regexp: RegExp,
    callback: ((msg: Message, args: Array<string>, match?: RegExpExecArray | null) => void)
  ): void {

    this.bot.onText(regexp, (msg, match) => {    
      if (this.disabled) return;
      
      const deltaMs = Date.now() - (msg.date * 1000);

      if (deltaMs > config.commandTimeout) {
        return;
      }

      const args = this.parseArguments(msg.text);
      
      const getFullname = () => {
        if (msg.chat.type === 'private') {
          const fullName = [msg.chat.first_name, msg.chat.last_name].join(' ').trim();
          return `(${fullName})`;
        }
        
        return '';
      };

      log.info(
        `'${ this.constructor.name }' triggered.\n` +
        `Arguments: [${ args.join(', ') }]\n` +
        `User: ${ msg.chat.id } ${ getFullname() }\n` +
        `Chat: ${ msg.chat.id }`
      );

      callback(msg, args, match);
    });
  }

  showHelp(chatId: number): void {
    this.base.commands.help.getSingleHelpText(chatId, this.name);
  }
}