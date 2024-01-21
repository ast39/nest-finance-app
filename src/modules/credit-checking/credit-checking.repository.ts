import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { CreditCheckingCreateDto } from './dto/credit-checking.create.dto';
import { CreditCheckingDto } from './dto/credit-checking.dto';
import { ICheckingUnique } from '../../common/interfaces/credit-checking.interface';

@Injectable()
export class CreditCheckingRepository {
  constructor(private prisma: PrismaService) {}

  // Проверка по ID
  async show(
    cursor: ICheckingUnique,
    tx?: IPrismaTR,
  ): Promise<CreditCheckingDto | null> {
    const prisma = tx ?? this.prisma;

    return prisma.creditChecking.findUnique({
      where: cursor,
    });
  }

  // Добавление проверки
  async store(
    ownerId: number,
    data: CreditCheckingCreateDto,
    tx?: IPrismaTR,
  ): Promise<CreditCheckingDto> {
    const prisma = tx ?? this.prisma;

    return prisma.creditChecking.create({
      data: {
        ownerId: ownerId,
        title: data.title,
        amount: data.amount,
        percent: data.percent,
        period: data.period,
        payment: data.payment,
      },
    });
  }

  // Удаление проверки
  async destroy(
    cursor: ICheckingUnique,
    tx?: IPrismaTR,
  ): Promise<CreditCheckingDto> {
    const prisma = tx ?? this.prisma;

    return prisma.creditChecking.delete({
      where: cursor,
    });
  }
}
