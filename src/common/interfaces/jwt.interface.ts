import { ApiProperty } from '@nestjs/swagger';

export class IJwtToken {
  @ApiProperty({
    title: 'JWT Токен авторизации',
    description: 'JWT токен для авторизации',
    default: '',
    type: String,
  })
  access_token: string;

  @ApiProperty({
    title: 'JWT Токен обновления',
    description: 'JWT токен для обновления авторизации',
    default: '',
    type: String,
  })
  refresh_token: string;
}
