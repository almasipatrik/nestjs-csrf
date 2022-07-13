import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CSRFService } from '../csrf.service';
import { CSRFModuleOptions } from '../interfaces/csrf-module-options';
import { CSRF_MODULE_OPTIONS } from '../csrf.constants';
import InvalidCSRFException from '../exceptions/invalid-token.exception';
import { RequestMethod } from '@nestjs/common/enums/request-method.enum';

@Injectable()
export class CSRFGuard implements CanActivate {
  constructor(
    private readonly csrfService: CSRFService,
    @Inject(CSRF_MODULE_OPTIONS)
    private readonly options: CSRFModuleOptions,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (
      !this.options.ignoredPaths.includes(request.path) &&
      !this.options.ignoredMethods.includes(RequestMethod[request.method])
    ) {
      const cookie = request.cookies[this.options.cookie.key];
      if (!cookie) throw InvalidCSRFException;
      this.verifyCSRF(request.cookies[this.options.cookie.key], request.ip);
    }

    return true;
  }

  private verifyCSRF(token: string, requestIP: string) {
    const { ip, expires } = JSON.parse(this.csrfService.verify(token));
    if (requestIP !== ip && new Date() > expires) throw InvalidCSRFException;
  }
}
