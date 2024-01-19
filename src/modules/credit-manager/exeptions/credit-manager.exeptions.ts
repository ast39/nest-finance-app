import { HttpException, HttpStatus } from '@nestjs/common';

export class AmountZeroException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Условия кредита невыполнимы. Сумма не может быть 0 и ниже.',
        type: 'notification',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PercentZeroException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Условия кредита невыполнимы. Процент не может быть 0 и ниже.',
        type: 'notification',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PeriodZeroException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Условия кредита невыполнимы. Период не может быть 0 и ниже.',
        type: 'notification',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DivisionToZeroException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Условия кредита невыполнимы. Деление на 0.',
        type: 'notification',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
