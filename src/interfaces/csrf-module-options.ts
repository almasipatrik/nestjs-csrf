import { Type } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common/enums/request-method.enum';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { CookieOptions as ExpressCookieOptions } from 'express';

export interface CSRFModuleOptions {
  encryptionKey: string;
  cookie: CookieOptions;
  expires: number;
  ignoredPaths: string[];
  ignoredMethods: RequestMethod[];
}

export interface CSRFOptionsFactory {
  createJwtOptions(): Promise<CSRFModuleOptions> | CSRFModuleOptions;
}

export interface CSRFModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CSRFOptionsFactory>;
  useClass?: Type<CSRFOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CSRFModuleOptions> | CSRFModuleOptions;
  inject?: any[];
}

export interface CookieOptions extends ExpressCookieOptions {
  key: string;
}
