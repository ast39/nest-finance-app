import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'Пользователь не найден',
        type: 'notification',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserEmailExistException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        email: 'Пользователь с таким email уже существует',
        type: 'notification',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
