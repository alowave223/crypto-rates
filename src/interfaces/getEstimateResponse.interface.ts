import { Markets } from 'src/crypto-client/interfaces/clientMetadata.interface';

export interface GetEstimateResponse {
  exchangeName: Markets;
  outputAmount: number;
}
