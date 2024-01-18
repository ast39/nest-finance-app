import { ApiProperty } from '@nestjs/swagger';
import { ECreditSubject, EPaymentType } from '@prisma/client';

// Объект расчета кредита
export class CreditCalculationDto {
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
    title: 'Тип платежа',
    description: 'Тип платежа по кредиту',
    enum: EPaymentType,
    required: true,
  })
  paymentType: EPaymentType;

  @ApiProperty({
    title: 'Предмет расчета',
    description: 'Что надо рассчетать',
    enum: ECreditSubject,
    required: true,
  })
  subject: ECreditSubject;

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
}
