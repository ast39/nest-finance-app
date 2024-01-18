import { ApiProperty } from '@nestjs/swagger';
import { ECreditSubject, EPaymentType } from '@prisma/client';

// Объект добавления расчета кредита
export class CreditCalculationCreateDto {
  @ApiProperty({
    title: 'Название',
    description: 'Название расчета',
    type: String,
    required: false,
  })
  title?: string;

  @ApiProperty({
    title: 'Тип платежа',
    description: 'Тип платежа по кредиту',
    enum: EPaymentType,
    required: false,
    default: EPaymentType.annuitent,
  })
  paymentType?: EPaymentType;

  @ApiProperty({
    title: 'Предмет расчета',
    description: 'Что надо рассчетать',
    enum: ECreditSubject,
    required: false,
    default: ECreditSubject.payment,
  })
  subject?: ECreditSubject;

  @ApiProperty({
    title: 'Сумма',
    description: 'Сумма кредита',
    type: Number,
    format: 'float',
    required: false,
    default: null,
  })
  amount?: number;

  @ApiProperty({
    title: 'Процент',
    description: 'Процент по кредиту',
    type: Number,
    format: 'float',
    required: false,
    default: null,
  })
  percent?: number;

  @ApiProperty({
    title: 'Срок',
    description: 'Срок кредита',
    type: Number,
    format: 'int32',
    required: false,
    default: null,
  })
  period?: number;

  @ApiProperty({
    title: 'Платеж',
    description: 'Платеж по кредиту',
    type: Number,
    format: 'float',
    required: false,
    default: null,
  })
  payment?: number;
}
