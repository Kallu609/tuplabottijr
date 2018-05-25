import TuplabottiJr from '../Bot';
import * as settings from '../lib/settings';
import CommandBase from './CommandBase';

export default class DebugCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/debug/, (msg, args) => {
      const chatId = msg.chat.id;
      const options = settings.read();

      const chatEnabled =
        (options.weatherCommand) ?
        options.weatherCommand.chatsEnabled.includes(msg.chat.id)
        : false;

      const watchedCryptos = 
        (options.cryptoCompare) ?
        options.cryptoCompare.watchedCurrencies.join(', ') :
        'None';

      const debugText =
        `Current date: ${ (new Date).toString() }\n` +
        `Weather reports enabled: ${ chatEnabled }\n` +
        `Watched cryptos: ${ watchedCryptos }`;

      this.sendMessage(chatId, debugText);
    });
  }
}