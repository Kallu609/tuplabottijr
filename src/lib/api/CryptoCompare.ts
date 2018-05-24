import axios from 'axios';
import config from '../../../config';
import log from '../logging';
import * as cache from './cache';

const API_ENDPOINTS = {
  coinlist:   'https://www.cryptocompare.com/api/data/coinlist/',
  pricemulti: 'https://min-api.cryptocompare.com/data/pricemulti'
};

export default class CryptoCompare {
  coinlist: Array<string>;
  watchedCurrencies: Array<string>;
  fiatCurrencies: Array<string>;
  prices: object;

  constructor() {
    // TODO: Load/save currencies from/to file.
    this.watchedCurrencies = [];
    this.fiatCurrencies = config.fiatCurrencies;
  }

  async init() {
    this.coinlist = await this.getCoinList();
    
    if (!this.coinlist.length) {
      log.error(`Failed to load cryptocurrencies.`);
      process.exit();
    }

    log.info(`Loaded ${ Object.keys(this.coinlist).length } cryptocurrencies`);

    if (this.watchedCurrencies.length) {
      log.info(`Fetching prices`);
      await this.priceUpdater();
      log.info(`Prices fetched`);
    }

    setInterval(() => {
      this.priceUpdater();
    }, config.priceUpdateInterval * 1000);
  }

  async getCoinList(): Promise<string[]> {
    const upToDate = cache.upToDate('coinlist', config.coinlistLifespan);

    if (upToDate) {
      log.info(`Loading list of cryptocurrencies from cache`);
      return JSON.parse(cache.read('coinlist'));
    }

    log.info(`Loading list of cryptocurrencies from API`);
    const response = await axios.get(API_ENDPOINTS.coinlist);

    if (response.data.Response === 'Success') {
      const cryptoCoins = Object.keys(response.data.Data);
      cache.write('coinlist', cryptoCoins);
      return cryptoCoins;
    }

    return [];
  }

  async priceUpdater(): Promise<void> {
    if (this.watchedCurrencies.length === 0) {
      return;
    }

    const currenciesCombined = this.watchedCurrencies.concat(this.fiatCurrencies);
    const currenciesString = currenciesCombined.join(',');
    
    const response =
      await axios.get(API_ENDPOINTS.pricemulti, {
        params: {
          fsyms: currenciesString,
          tsyms: currenciesString
        }
      });

    this.prices = response.data;
  }

  async fetchPrices(cryptoCurrencies: Array<string>): Promise<object> {
    const response =
      await axios.get(API_ENDPOINTS.pricemulti, {
        params: {
          fsyms: cryptoCurrencies.join(','),
          tsyms: this.fiatCurrencies.join(',')
        }
      });

    return response.data;
  }
}