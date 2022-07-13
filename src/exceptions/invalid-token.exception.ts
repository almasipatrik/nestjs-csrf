import { HttpException, HttpStatus } from '@nestjs/common';

const InvalidCSRFException = new HttpException(
  'invalid csrf token',
  HttpStatus.BAD_REQUEST,
);

export default InvalidCSRFException;
