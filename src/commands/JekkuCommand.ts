import * as TelegramBot from 'node-telegram-bot-api';
import TuplabottiJr from '../Bot';
import CommandBase from './CommandBase';

const frames = [
  '🐑👈',
  '🐑   👈',
  '🐑      👈',
  '🐑         👈',
  '🐑            👈',
  '🐑         👈',
  '🐑      👈',
  '🐑   👈',
  '🐑👈',
];

export default class JekkuCommand extends CommandBase {
  timer: NodeJS.Timer;
  frameCounter: number;
  oldMessage: TelegramBot.Message;

  constructor(base: TuplabottiJr) {
    super(base);
    this.eventHandler();
  }

  async updateMessage(): Promise<void> {
    const frame = frames[this.frameCounter];

    if (this.frameCounter >= frames.length) {
      return;
    }

    this.oldMessage = await this.editMessage(this.oldMessage, frame);

    setTimeout(() => {
      this.frameCounter++;
      this.updateMessage();
    }, 500);
  }
  
  eventHandler() {
    this.onText(/^\/jekku$/, async (msg, match) => {
      const chatId = msg.chat.id;
      this.oldMessage = await this.sendMessage(chatId, frames[0]);

      this.frameCounter = 1;
      this.updateMessage();
    });
  }
}