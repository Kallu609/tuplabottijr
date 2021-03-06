import config from '../../../config';
import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

export default class IBANCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    
    this.name = 'iban';
    this.helpText = 'Shows IBAN numbers';

    if (config.IBAN.split(';').length === 0) {
      this.disabled = true;
    }

    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/iban/, (msg, args) => {
      const chatId = msg.chat.id;
      const result = config.IBAN.split(';').map(item => {
        const splitted = item.split(':');

        return `*${splitted[0]}*: ${splitted[1]}`;
      }).join('\n');

      this.sendMessage(chatId, result);
    });
  }
}