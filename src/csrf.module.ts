import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CSRF_MODULE_OPTIONS } from './config/default.config';
import { createCSRFProvider } from './csrf.providers';
import { CSRFService } from './csrf.service';
import { CSRFInterceptor } from './interceptors/csrf.interceptor';
import {
  CSRFModuleAsyncOptions,
  CSRFModuleOptions,
  CSRFOptionsFactory,
} from './interfaces/csrf-module-options';

@Module({
  providers: [
    CSRFInterceptor,
    CSRFService,
    {
      provide: CSRF_MODULE_OPTIONS,
      useValue: {},
    },
  ],
  exports: [CSRFInterceptor, CSRFService, CSRF_MODULE_OPTIONS],
})
export class CSRFModule {
  static register(options: CSRFModuleOptions): DynamicModule {
    return {
      module: CSRFModule,
      providers: createCSRFProvider(options),
    };
  }

  static registerAsync(options: CSRFModuleAsyncOptions): DynamicModule {
    return {
      module: CSRFModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };
  }

  private static createAsyncProviders(
    options: CSRFModuleAsyncOptions,
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
    options: CSRFModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CSRF_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CSRF_MODULE_OPTIONS,
      useFactory: async (optionsFactory: CSRFOptionsFactory) =>
        await optionsFactory.createJwtOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
