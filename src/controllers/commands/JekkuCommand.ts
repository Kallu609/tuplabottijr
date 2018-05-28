import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

export default class JekkuCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);

    this.name =      'jekku';
    this.helpText =  'Jekuta kaikkia';
    this.hidden =    true;

    this.eventHandler();
  }
  
  eventHandler() {
    this.onText(/^\/jekku$/, async (msg, match) => {
      this.bot.sendMessage(msg.chat.id,
        'hyi vitt* äijä haluu kattoo ku lampaalle tungetaa sormi pyllyy xDDDDDDDDDDD HUUTISTA');
    });
  }
}