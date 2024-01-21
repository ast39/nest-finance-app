import { ApiProperty } from '@nestjs/swagger';

// Объект добавления проверки кредита
export class CreditCheckingCreateDto {
  @ApiProperty({
    title: 'Название',
    description: 'Название проверки',
    type: String,
    required: false,
  })
  title?: string;

  @ApiProperty({
    title: 'Сумма',
    description: 'Сумма кредита',
    type: Number,
    format: 'float',
    required: true,
    default: null,
  })
  amount: number;

  @ApiProperty({
    title: 'Процент',
    description: 'Процент по кредиту',
    type: Number,
    format: 'float',
    required: true,
    default: null,
  })
  percent: number;

  @ApiProperty({
    title: 'Срок',
    description: 'Срок кредита',
    type: Number,
    format: 'int32',
    required: true,
    default: null,
  })
  period: number;

  @ApiProperty({
    title: 'Платеж',
    description: 'Платеж по кредиту',
    type: Number,
    format: 'float',
    required: true,
    default: null,
  })
  payment: number;
}
