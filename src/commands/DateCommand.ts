import TuplabottiJr from '../Bot';
import CommandBase from './CommandBase';

export default class DateCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/echo/, (msg, args) => {
      const chatId = msg.chat.id;
      this.sendMessage(chatId, (new Date).toString());
    });
  }
}