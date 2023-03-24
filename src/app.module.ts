import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoClientModule } from './crypto-client/crypto.module';
import { Markets } from './crypto-client/interfaces/clientMetadata.interface';

@Module({
  imports: [
    CryptoClientModule.register([
      {
        name: 'BINANCE_CLIENT',
        market: Markets.BINANCE,
        options: {
          parseExceptions: true,
        },
      },
      {
        name: 'KUCOIN_CLIENT',
        market: Markets.KUCOIN,
        options: {
          environment: 'live',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
