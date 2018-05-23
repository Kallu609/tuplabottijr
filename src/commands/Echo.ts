import TuplabottiJr from '../Bot';
import CommandBase from './CommandBase';

export default class EchoCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    this.eventHandler();
  }

  eventHandler(): void {
    this.bot.onText(/\/echo/, (msg, match) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, 'Hello!', this.base.messageOptions);
      
      this.commandTriggered(msg);
    });
  }
}