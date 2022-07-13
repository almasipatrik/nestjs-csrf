import { CSRF_MODULE_OPTIONS } from './csrf.constants';
import { CSRFModuleOptions } from './interfaces/csrf-module-options';

export function createCSRFProvider(options: CSRFModuleOptions): any[] {
  return [{ provide: CSRF_MODULE_OPTIONS, useValue: options || {} }];
}
