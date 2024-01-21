import { HttpException, HttpStatus } from '@nestjs/common';

export class CheckingNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Проверка не найдена',
        type: 'notification',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class CheckingOtherOwnerException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Это чужая проверка',
        type: 'notification',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
