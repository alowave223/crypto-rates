import { Markets } from 'src/crypto-client/interfaces/clientMetadata.interface';

export interface GetRatesResponse {
  exchangeName: Markets;
  price: string;
}
