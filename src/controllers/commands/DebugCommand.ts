import * as schedule from 'node-schedule-tz';
import TuplabottiJr from '../../Bot';
import * as settings from '../../lib/settings';
import CommandBase from './CommandBase';

export default class DebugCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);

    this.name =      'debug';
    this.helpText =  'Show date';
    this.hidden =    true;
    
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/debug/, (msg, args) => {
      const options = settings.read();

      const chatEnabled = this.base.commands.weather.chatsEnabled.includes(msg.chat.id);
      const watchedCryptos = 
        (options.cryptoCompare) ?
        options.cryptoCompare.watchedCurrencies.join(', ') :
        'None';

      const debugText =
        `Current date: ${ (new Date).toString() }\n` +
        `Weather reports enabled: ${ chatEnabled }\n` +
        `Watched cryptos: ${ watchedCryptos }`;

      this.sendMessage(msg.chat.id, debugText);
    });
  }
}