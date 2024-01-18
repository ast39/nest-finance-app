import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
    required: true,
  })
  password: string;
}
