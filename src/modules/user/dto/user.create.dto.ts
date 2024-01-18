import { ApiProperty } from '@nestjs/swagger';
import { EUserStatus } from '@prisma/client';

// Объект добавления пользователя
export class UserCreateDto {
  @ApiProperty({
    title: 'E-mail',
    description: 'E-mail пользователя',
    type: String,
    required: true,
  })
  email: string;

  @ApiProperty({
    title: 'Пароль',
    description: 'Пароль пользователя',
    type: String,
    required: false,
  })
  password?: string;

  @ApiProperty({
    title: 'Имя',
    description: 'Имя пользователя',
    type: String,
    required: false,
  })
  name?: string;

  @ApiProperty({
    title: 'Статус',
    description: 'Статус пользователя',
    enum: EUserStatus,
    required: false,
    default: EUserStatus.active,
  })
  status?: EUserStatus;
}
