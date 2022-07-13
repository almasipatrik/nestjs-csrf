import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response, Request } from 'express';
import { CSRF_MODULE_OPTIONS } from '../csrf.constants';
import { CSRFModuleOptions } from '../interfaces/csrf-module-options';
import { CSRFService } from '../csrf.service';

@Injectable()
export class CSRFInterceptor implements NestInterceptor {
  constructor(
    @Inject(CSRF_MODULE_OPTIONS)
    private readonly options: CSRFModuleOptions,
    private readonly csrfService: CSRFService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    response.cookie(
      this.options.cookie.key,
      this.csrfService.sign({ ip: request.ip }),
      this.options.cookie,
    );

    return next.handle();
  }
}
