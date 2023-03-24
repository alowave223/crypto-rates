import { Logger } from '@nestjs/common';
import { CryptoClientProxy } from '../cryptoClient.proxy';
import * as Kucoin from 'kucoin-node-api';
import { KucoinConfig } from '../interfaces/kucoinConfig.interface';
import { GetTickerResponse } from '../interfaces/cryptoClientReponses.interface';
import { KucoinGetTickerReponse } from '../interfaces/kucoinResponses.interface';
import { Markets } from '../interfaces/clientMetadata.interface';

export class KucoinClient extends CryptoClientProxy {
  public clientType = Markets.KUCOIN;

  private readonly logger = new Logger(KucoinClient.name);
  private clientConfig: KucoinConfig;
  private client: any;
  private connection = false;

  constructor(options: KucoinConfig) {
    super();
    this.client = Kucoin;
    this.clientConfig = options;
  }

  public connect(): void {
    this.client.init(this.clientConfig);
    this.connection = true;
  }

  public async getTicker(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<GetTickerResponse> {
    const tickerSymbol = [baseCurrency, quoteCurrency].join('-');
    const response: KucoinGetTickerReponse = await this.client
      .getTicker(tickerSymbol)
      .catch((reason) => {
        throw new Error(reason);
      });

    return {
      symbol: tickerSymbol.replace('-', ''),
      price: response.data.price,
    };
  }

  public close() {
    if (this.connection) delete this.client;
  }
}
