import TuplabottiJr from '../../Bot';
import CryptoCompare from '../../lib/api/CryptoCompare';
import { isNumber } from '../../lib/helpers';
import CommandBase from './CommandBase';

export default class CryptoCommand extends CommandBase {
  api: CryptoCompare;
  coinlist: Array<string>;

  constructor(base: TuplabottiJr) {
    super(base);
    this.api = base.api.crypto;
    this.coinlist = base.api.crypto.coinlist;

    this.name = 'crypto';
    this.helpText = 'Show / convert crypto prices';
    this.helpArgs = '<crypto(s)|x to y>';
    
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/crypto/, (msg, args) => {
      if ((args.length >= 3) && [args[1], args[2]].includes('to')) {
        this.convertPrice(msg.chat.id, args);
        return;
      }

      if (args.length >= 1) {
        this.showPrices(msg.chat.id, args);
        return;
      }
      
      return this.showHelp(msg.chat.id);
    });
  }
  
  async convertPrice(chatId: number, args: Array<string>): Promise<void> {
    const amount = isNumber(args[0]) ? Number(args.shift()) : 1;
    const fromCurrency = args[0].toUpperCase();
    const toCurrencies = args.slice(2).map(crypto => crypto.toUpperCase());
    
    const usableCurrencies = [...this.api.coinlist, ...this.api.fiatCurrencies];

    if (amount < 0) {
      this.sendMessage(chatId, `No negative values`);
      return;
    }

    for (const currency of [fromCurrency, ...toCurrencies]) {
      if (!usableCurrencies.includes(currency)) {
        this.sendMessage(chatId, `Invalid currencies`);
        return;
      }
    }
    
    const message = await this.sendMessage(chatId, '_Loading..._');
    const prices = await this.api.fetchPrices([fromCurrency], toCurrencies);
    
    const response = 
      `*Conversions for* \`${amount} ${fromCurrency}\`\n` +
      toCurrencies.map(currency => {
        const price = (prices[fromCurrency][currency] * amount);
        const priceFixed = price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6
        });

        return `\`${currency}: ${priceFixed}\``;
      }).join('\n');

    this.editMessage(message, response);
  }

  async showPrices(chatId: number, args: Array<string>): Promise<void> {
    const cryptos = args
      .filter(crypto => this.coinlist.includes(crypto.toUpperCase()))
      .map(crypto => crypto.toUpperCase());

    if (!cryptos.length) {
      this.sendMessage(chatId, 'No cryptocurrencies found');
      return;
    }

    const message = await this.sendMessage(chatId, '_Loading..._');
    const prices = await this.api.fiatPrices(cryptos);

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
    .join('\n\n') +
    ((args.length - cryptos.length) ? `\n\n_Invalid arguments: ${args.length - cryptos.length}_` : '');

    this.editMessage(message, response);
  }
}