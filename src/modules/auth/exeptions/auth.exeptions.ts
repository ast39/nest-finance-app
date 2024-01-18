import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongAuthDataException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Неверный E-Mail или пароль',
        type: 'notification',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenIsAbsentException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Токен не был передан',
        type: 'notification',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenExpireException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Токен просрочен',
        type: 'notification',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
