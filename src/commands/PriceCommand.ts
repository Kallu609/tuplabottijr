import TuplabottiJr from '../Bot';
import CryptoCompare from '../lib/api/CryptoCompare';
import CommandBase from './CommandBase';

export default class PriceCommand extends CommandBase {
  api: CryptoCompare;

  constructor(base: TuplabottiJr) {
    super(base);
    this.api = base.cryptoAPI;

    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/price/, async (msg, args) => {
      const chatId = msg.chat.id;

      if (args.length === 0) {
        return this.showHelp(chatId);
      }

      const cryptos = args
          .filter(crypto => this.api.coinlist.includes(crypto.toUpperCase()))
          .map(crypto => crypto.toUpperCase());
      
      if (!cryptos.length) {
        return this.sendMessage(chatId, 'No cryptocurrencies found');  
      }

      const message = await this.sendMessage(chatId, '_Loading..._');
      const prices = await this.api.fetchPrices(cryptos);

      const response = cryptos.map(crypto => {
        const fiatPrices = prices[crypto];

        return `*Fiat prices for* \`1 ${ crypto }\`\n` +
          Object.keys(fiatPrices)
            .map(fiatCurrency => {
              const fiatPrice = fiatPrices[fiatCurrency].toFixed(2);
              return `\`${ fiatCurrency }: ${ fiatPrice }\``;
          })
          .join('\n');
      })
      .join('\n\n');

      this.editMessage(message, response);
    });
  }
}