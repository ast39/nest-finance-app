import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { CreditCalculationCreateDto } from './dto/credit-calculation.create.dto';
import { CreditCalculationDto } from './dto/credit-calculation.dto';

@Injectable()
export class CreditCalculationRepository {
  constructor(private prisma: PrismaService) {}

  // Добавление расчета
  async store(
    ownerId: number,
    data: CreditCalculationCreateDto,
    tx?: IPrismaTR,
  ): Promise<CreditCalculationDto> {
    const prisma = tx ?? this.prisma;

    return prisma.creditCalculation.create({
      data: {
        ownerId: ownerId,
        title: data.title,
        paymentType: data.paymentType,
        subject: data.subject,
        amount: data.amount,
        percent: data.percent,
        period: data.period,
        payment: data.payment,
      },
    });
  }
}
