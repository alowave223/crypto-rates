import { Markets } from './interfaces/clientMetadata.interface';
import { GetTickerResponse } from './interfaces/cryptoClientReponses.interface';

export abstract class CryptoClientProxy {
  public abstract clientType: Markets;

  public abstract connect(): any;
  public abstract close(): any;

  public abstract getTicker(
    ...any
  ): Promise<GetTickerResponse> | GetTickerResponse;
}
