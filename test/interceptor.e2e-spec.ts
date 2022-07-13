import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CSRF_MODULE_OPTIONS } from '../src/csrf.constants';
import { CSRFService } from '../src/csrf.service';
import { createTestModule } from './helpers/create-test.module';

describe('CSRF Interceptor', () => {
  let app: INestApplication;
  let csrfService: CSRFService;

  beforeAll(async () => {
    app = await createTestModule();

    csrfService = app.get(CSRFService);
  });

  afterAll(() => app.close());

  test('Test GET endpoint to set CSRF cookie', () => {
    return request(app.getHttpServer())
      .get('/login')
      .expect(HttpStatus.OK);
  });

  test('Test POST endpoint to validate CSRF token', () => {
    const csrfToken = csrfService.sign({ ip: '::ffff:127.0.0.1' });
    return request(app.getHttpServer())
      .post('/form-submit')
      .set('Cookie', `_csrf=${csrfToken};`)
      .expect(HttpStatus.CREATED);
  });
});
