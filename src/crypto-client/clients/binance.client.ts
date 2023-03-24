import { Logger } from '@nestjs/common';
import { MainClient, RestClientOptions, SymbolPrice } from 'binance';
import { CryptoClientProxy } from '../cryptoClient.proxy';
import { Markets } from '../interfaces/clientMetadata.interface';
import { GetTickerResponse } from '../interfaces/cryptoClientReponses.interface';

export class BinanceClient extends CryptoClientProxy {
  public clientType = Markets.BINANCE;

  private readonly logger = new Logger(BinanceClient.name);
  private clientConfig: RestClientOptions;
  private connection = false;
  private client: MainClient;

  constructor(options: RestClientOptions) {
    super();
    this.clientConfig = options;
  }

  public connect(): void {
    this.client = new MainClient(this.clientConfig);

    this.client
      .getSymbolPriceTicker({ symbol: 'BTCUSDT' })
      .then(() => {
        this.connection = true;
      })
      .catch((reason) => {
        this.connection = false;
        this.logger.error(reason);
      });
  }

  public close() {
    if (this.connection) delete this.client;
  }

  public async getTicker(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<GetTickerResponse> {
    if (!this.connection) throw new Error('Binance client is not connected.');
    const tickerSymbol = [baseCurrency, quoteCurrency].join('');

    const response = (await this.client
      .getSymbolPriceTicker({
        symbol: tickerSymbol,
      })
      .catch((reason) => {
        throw new Error(reason?.message);
      })) as SymbolPrice;

    return {
      symbol: tickerSymbol,
      price: response.price as string,
    };
  }
}
