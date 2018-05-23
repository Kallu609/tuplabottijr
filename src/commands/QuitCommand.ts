import TuplabottiJr from '../Bot';
import CommandBase from './CommandBase';

export default class QuitCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/(quit|exit)/, (msg, match) => {
      const chatId = msg.chat.id;

      this.bot.sendMessage(chatId, 'Bye!', this.base.messageOptions);
      this.base.stop();
    });
  }
}