import { BinanceClient } from './clients/binance.client';
import { CryptoClientProxy } from './cryptoClient.proxy';
import {
  Closeable,
  CryptoClientOptions,
  Markets,
} from './interfaces/clientMetadata.interface';
import { KucoinClient } from './clients/kucoin.client';
import { RestClientOptions as BinanceConfig } from 'binance';
import { KucoinConfig } from './interfaces/kucoinConfig.interface';

export class CryptoClientFactory {
  static create(options: CryptoClientOptions): CryptoClientProxy & Closeable {
    const { market, options: market_options } = options;

    switch (market) {
      case Markets.BINANCE:
        return new BinanceClient(market_options as BinanceConfig);
      case Markets.KUCOIN:
        return new KucoinClient(market_options as KucoinConfig);
      default:
        throw new Error(`Market ${market} not implemented.`);
    }
  }
}
