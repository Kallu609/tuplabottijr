import * as TelegramBot from 'node-telegram-bot-api';
import log from '../lib/logging';

export default class CommandBase {
  commandTriggered(msg: TelegramBot.Message): void {
    log.info(`Command '${this.constructor.name}' triggered. From: ${msg.chat.first_name}. Chat ID: ${msg.chat.id}.`);
  }
}