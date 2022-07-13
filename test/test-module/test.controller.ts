import { CSRFGuard } from './../../src/guards/csrf.guard';
import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CSRFInterceptor } from '../../src/interceptors/csrf.interceptor';

@UseInterceptors(CSRFInterceptor)
@Controller()
export class TestController {
  @Get('login')
  login() {}

  @UseGuards(CSRFGuard)
  @Post('form-submit')
  formSubmit() {}
}
