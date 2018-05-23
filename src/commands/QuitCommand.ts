import TuplabottiJr from '../Bot';
import CommandBase from './CommandBase';

export default class QuitCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/quit/, (msg, args) => {
      const chatId = msg.chat.id;
      const response = 'No vittu morjes xD';

      this.sendMessage(chatId, response);
      this.base.stop();
    });
  }
}