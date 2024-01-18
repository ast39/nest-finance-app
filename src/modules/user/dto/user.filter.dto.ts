import { ApiProperty } from '@nestjs/swagger';
import { EUserStatus } from '@prisma/client';

export class UserFilterDto {
  @ApiProperty({
    minimum: 1,
    maximum: 10000,
    title: 'Page',
    description: 'Страница',
    type: Number,
    format: 'int32',
    default: 1,
    required: false,
  })
  page?: number | null;

  @ApiProperty({
    minimum: 1,
    maximum: 10000,
    title: 'Limit',
    description: 'Записей на страницу',
    type: Number,
    format: 'int32',
    default: 10,
    required: false,
  })
  limit?: number | null;

  @ApiProperty({
    title: 'Status',
    description: 'Статус пользователя',
    enum: EUserStatus,
    required: false,
  })
  status?: EUserStatus | null;
}
