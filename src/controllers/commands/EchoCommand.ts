import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

export default class EchoCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    
    this.name =      'echo';
    this.helpText =  'Echoes to you';
    this.hidden =    true;

    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/echo/, (msg, args) => {
      const chatId = msg.chat.id;
      this.sendMessage(chatId, 'Hello!');
    });
  }
}