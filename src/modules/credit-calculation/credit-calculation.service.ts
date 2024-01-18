import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreditCalculationRepository } from './credit-calculation.repository';
import { CreditCalculationCreateDto } from './dto/credit-calculation.create.dto';
import { CreditCalculationDto } from './dto/credit-calculation.dto';

@Injectable()
export class CreditCalculationService {
  constructor(
    private prisma: PrismaService,
    private creditCalcRepo: CreditCalculationRepository,
  ) {}

  // Добавление расчета
  async createCalculation(
    ownerId: number,
    data: CreditCalculationCreateDto,
  ): Promise<CreditCalculationDto> {
    return this.prisma.$transaction(async (tx) => {
      return await this.creditCalcRepo.store(ownerId, data, tx);
    });
  }
}
