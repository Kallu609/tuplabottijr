import TuplabottiJr from '../Bot';
import CryptoCompare from '../lib/CryptoCompare';
import CommandBase from './CommandBase';

export default class PriceCommand extends CommandBase {
  api: CryptoCompare;

  constructor(base: TuplabottiJr) {
    super(base);
    this.api = base.cryptoAPI;

    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/price (\w+)$/, async (msg, args) => {
      const chatId = msg.chat.id;

      if (args.length === 1) {
        const crypto = args[0].toUpperCase();
        
        if (this.api.coinlist.includes(crypto)) {
          const json = await this.api.fetchPrices([crypto]);
          const prices = json[crypto];

          const response = 
            `*Prices for* \`1 ${ crypto }\`\n` + 
            Object.keys(prices).map(currency => {
              const price = prices[currency].toFixed(2);
              return `\`${ currency }: ${ price }\``;
            }).join('\n');

          this.sendMessage(chatId, response);
          return;
        }
        this.sendMessage(chatId, 'No ei ollu');
      }
    });
  }
}