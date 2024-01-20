import { HttpException, HttpStatus } from '@nestjs/common';

export class CalculationNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Расчет не найден',
        type: 'notification',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class CalculationOtherOwnerException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Это чужой расчет',
        type: 'notification',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
