import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CryptoClientProxy } from './crypto-client/cryptoClient.proxy';
import { GetEstimateDto } from './dto/getEstimate.dto';
import { GetRatesDto } from './dto/getRates.dto';
import { GetEstimateResponse } from './interfaces/getEstimateResponse.interface';
import { GetRatesResponse } from './interfaces/getRatesResponse.inteface';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject('CRYPTO_CLIENTS')
    private readonly cryptoClients: CryptoClientProxy[],
  ) {}

  onModuleInit() {
    this.cryptoClients.forEach((client: CryptoClientProxy) => {
      client.connect();
      this.logger.log(`Client ${client.constructor.name} connected.`);
    });
  }

  async getEstimate({
    inputCurrency,
    outputCurrency,
    inputAmount,
  }: GetEstimateDto): Promise<GetEstimateResponse> {
    try {
      const rates = await Promise.all(
        this.cryptoClients.map((client: CryptoClientProxy) =>
          Promise.all([
            client.getTicker(inputCurrency, outputCurrency),
            client.clientType,
          ]),
        ),
      );

      const [bestPrice, bestExchange] = rates.reduce(
        (previousValue, currentValue) => {
          const [inputPrice, _currExchange] = currentValue;
          const [previousInputPrice, _prevExchange] = previousValue;

          if (
            parseFloat(inputPrice.price) * inputAmount >
            parseFloat(previousInputPrice.price) * inputAmount
          ) {
            return currentValue;
          } else {
            return previousValue;
          }
        },
      );

      return {
        exchangeName: bestExchange,
        outputAmount: parseFloat(bestPrice.price) * inputAmount,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException("Couldn't get estimate.", {
        cause: error,
        description: error?.message,
      });
    }
  }

  async getRates({
    baseCurrency,
    quoteCurrency,
  }: GetRatesDto): Promise<GetRatesResponse[]> {
    try {
      const rates = await Promise.all(
        this.cryptoClients.map((client: CryptoClientProxy) =>
          Promise.all([
            client.getTicker(baseCurrency, quoteCurrency),
            client.clientType,
          ]),
        ),
      );

      return rates.map((rate) => {
        const [ticker, exchangeName] = rate;

        return {
          exchangeName: exchangeName,
          price: ticker.price,
        };
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException("Couldn't get rates.", {
        cause: error,
        description: error?.message,
      });
    }
  }
}
