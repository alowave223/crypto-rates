import { RestClientOptions } from 'binance';
import { KucoinConfig } from './kucoinConfig.interface';

export type CryptoClientOptions = {
  market: Markets;
  options: RestClientOptions | KucoinConfig;
};

export type CryptoModuleOptions = CryptoClientOptions & {
  name: string | symbol;
};

export enum Markets {
  BINANCE = 'binance',
  KUCOIN = 'kucoin',
}

export interface Closeable {
  close(): void;
}
