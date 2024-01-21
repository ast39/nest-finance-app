import { ApiProperty } from '@nestjs/swagger';

// Объект платежа
export class CreditPaymentCheckingDto {
  @ApiProperty({
    title: 'Входящий долг',
    description: 'Входящий долг',
    type: Number,
    format: 'float',
    required: true,
  })
  insetBalance: number;

  @ApiProperty({
    title: 'Платеж',
    description: 'Платеж',
    type: Number,
    format: 'float',
    required: false,
  })
  payment: number;

  @ApiProperty({
    title: 'Процент в платеже',
    description: 'Процент в платеже',
    type: Number,
    format: 'float',
    required: true,
  })
  percent: number;

  @ApiProperty({
    title: 'Тело в платеже',
    description: 'Тело в платеже',
    type: Number,
    format: 'float',
    required: true,
  })
  body: number;

  @ApiProperty({
    title: 'Исходящий долг',
    description: 'Исходящий долг',
    type: Number,
    format: 'float',
    required: true,
  })
  outsetBalance: number;
}
