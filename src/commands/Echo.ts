import * as TelegramBot from 'node-telegram-bot-api';
import CommandBase from './CommandBase';

export default class EchoCommand extends CommandBase {
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    super();

    this.bot = bot;
    this.eventHandler();
  }

  eventHandler(): void {
    this.bot.onText(/\/echo/, (msg, match) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, 'Hello!');
      
      this.commandTriggered(msg);
    });
  }
}