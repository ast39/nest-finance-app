import { ApiProperty } from '@nestjs/swagger';

// Объект расчета кредита
export class CreditCheckingDto {
  @ApiProperty({
    title: 'ID',
    description: 'ID расчета',
    type: Number,
    required: true,
  })
  recordId: number;

  @ApiProperty({
    title: 'Автор',
    description: 'Автор расчета',
    type: Number,
    required: true,
  })
  ownerId: number;

  @ApiProperty({
    title: 'Название',
    description: 'Название расчета',
    type: String,
    required: false,
  })
  title: string;

  @ApiProperty({
    title: 'Сумма',
    description: 'Сумма кредита',
    type: Number,
    format: 'float',
    required: true,
  })
  amount: number;

  @ApiProperty({
    title: 'Процент',
    description: 'Процент по кредиту',
    type: Number,
    format: 'float',
    required: true,
  })
  percent: number;

  @ApiProperty({
    title: 'Срок',
    description: 'Срок кредита',
    type: Number,
    format: 'int32',
    required: true,
  })
  period: number;

  @ApiProperty({
    title: 'Платеж',
    description: 'Платеж по кредиту',
    type: Number,
    format: 'float',
    required: true,
  })
  payment: number;

  @ApiProperty({
    title: 'Реальная сумма',
    description: 'Реальная сумма по кредиту',
    type: Number,
    format: 'float',
    required: true,
  })
  realAmount?: number;

  @ApiProperty({
    title: 'Реальный процент',
    description: 'Реальный процент по кредиту',
    type: Number,
    format: 'float',
    required: true,
  })
  realPercent?: number;

  @ApiProperty({
    title: 'Реальный срок',
    description: 'Реальный срок кредита',
    type: Number,
    format: 'float',
    required: true,
  })
  realPeriod?: number;

  @ApiProperty({
    title: 'Реальный платеж',
    description: 'Реальный платеж по кредиту',
    type: Number,
    format: 'float',
    required: true,
  })
  realPayment?: number;

  @ApiProperty({
    title: 'Переплата',
    description: 'Переплата по кредиту',
    type: Number,
    format: 'float',
    required: true,
  })
  percentPayed?: number;

  @ApiProperty({
    title: 'Скрытая переплата',
    description: 'Скрытая переплата по кредиту',
    type: Number,
    format: 'float',
    required: true,
  })
  hiddenOverpayment?: number;

  @ApiProperty({
    title: 'Итоговая переплата',
    description: 'Итоговая переплата по кредиту',
    type: Number,
    format: 'float',
    required: true,
  })
  totalOverpay?: number;
}
