import { ModuleMetadata, Type, Provider, InjectionToken } from '@nestjs/common';
import { CryptoModuleOptions } from './clientMetadata.interface';

export interface CryptoModuleOptionsFactory {
  createCleientOptions(): Promise<CryptoModuleOptions> | CryptoModuleOptions;
}

export interface CryptoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CryptoModuleOptionsFactory>;
  useClass?: Type<CryptoModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CryptoModuleOptions> | CryptoModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
  name: InjectionToken;
}
