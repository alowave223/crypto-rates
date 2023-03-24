import {
  Module,
  DynamicModule,
  OnApplicationShutdown,
  Provider,
  ValueProvider,
} from '@nestjs/common';
import { CryptoClientFactory } from './crypto.factory';
import type { CryptoClientProxy } from './cryptoClient.proxy';
import {
  CryptoModuleAsyncOptions,
  CryptoModuleOptionsFactory,
} from './interfaces/clientAsyncFactorty.interface';
import {
  Closeable,
  CryptoModuleOptions,
} from './interfaces/clientMetadata.interface';

@Module({})
export class CryptoClientModule {
  static register(options: Array<CryptoModuleOptions>): DynamicModule {
    const clients: ValueProvider<CryptoClientProxy>[] = options.map(
      (option) => ({
        provide: option.name,
        useValue: CryptoClientModule.assignOnAppShutdownHook(
          CryptoClientFactory.create({
            market: option.market,
            options: option.options,
          }),
        ),
      }),
    );

    return {
      module: CryptoClientModule,
      providers: [
        {
          provide: 'CRYPTO_CLIENTS',
          useValue: clients.map((client) => client.useValue),
        },
        ...clients,
      ],
      exports: [
        {
          provide: 'CRYPTO_CLIENTS',
          useExisting: 'CRYPTO_CLIENTS',
        },
        ...clients,
      ],
    };
  }

  static registerAsync(
    options: Array<CryptoModuleAsyncOptions>,
  ): DynamicModule {
    const providers: Provider[] = options.reduce(
      (accProviders: Provider[], item) =>
        accProviders
          .concat(this.createAsyncProviders(item))
          .concat(item.extraProviders || []),
      [],
    );
    const imports = options.reduce(
      (accImports, option) =>
        option.imports && !accImports.includes(option.imports)
          ? accImports.concat(option.imports)
          : accImports,
      [],
    );

    return {
      module: CryptoClientModule,
      imports,
      providers: providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(
    options: CryptoModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: CryptoModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: options.name,
        useFactory: this.createFactoryWrapper(options.useFactory),
        inject: options.inject || [],
      };
    }

    return {
      provide: options.name,
      useFactory: this.createFactoryWrapper(
        (optionsFactory: CryptoModuleOptionsFactory) =>
          optionsFactory.createCleientOptions(),
      ),
      inject: [options.useExisting || options.useClass],
    };
  }

  private static createFactoryWrapper(
    useFactory: CryptoModuleAsyncOptions['useFactory'],
  ) {
    return async (...args: any[]) => {
      const clientOptions = await useFactory(...args);
      const clientProxyRef = CryptoClientFactory.create(clientOptions);
      return this.assignOnAppShutdownHook(clientProxyRef);
    };
  }

  private static assignOnAppShutdownHook(
    client: CryptoClientProxy & Closeable,
  ) {
    (client as unknown as OnApplicationShutdown).onApplicationShutdown =
      client.close;
    return client;
  }
}
