import axios from 'axios';
import * as cache from './cache';
import log from './logging';

export default class CryptoCompare {
  coinlist: Array<string>;

  async init() {
    this.coinlist = await this.getCoinList();
    
    if (this.coinlist.length === 0) {
      log.error(`Failed to load cryptocurrencies.`);
      process.exit();
    }

    log.info(`Loaded ${ Object.keys(this.coinlist).length } cryptocurrencies`);
  }

  async getCoinList(): Promise<string[]> {
    if (cache.upToDate('coinlist')) {
      log.info(`Loading list of cryptocurrencies from cache`);
      return JSON.parse(cache.read('coinlist'));
    }

    log.info(`Loading list of cryptocurrencies from API`);
    const endPoint = 'https://www.cryptocompare.com/api/data/coinlist/';
    const response = await axios.get(endPoint);

    if (response.data.Response === 'Success') {
      const cryptoCoins = Object.keys(response.data.Data);
      cache.write('coinlist', cryptoCoins);
      return cryptoCoins;
    }

    return [];
  }
}