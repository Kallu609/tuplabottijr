import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

export default class QuitCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);

    this.name = 'quit';
    this.helpText = 'Quit bot';
    this.hidden = true;
    this.disabled = true;

    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/quit/, async (msg, args) => {
      const chatId = msg.chat.id;
      const response = 'No vittu morjes xD';

      await this.sendMessage(chatId, response);
      this.base.stop();
    });
  }
}