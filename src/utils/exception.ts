import { HttpException, HttpStatus } from '@nestjs/common';

export const throwHttpException = (
  httpStatus: HttpStatus,
  message?: string,
  errors?: Record<string, unknown>,
) => {
  throw new HttpException({ message, errors }, httpStatus);
};
