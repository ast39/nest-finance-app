import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreditCalculationRepository } from './credit-calculation.repository';
import { CreditCalculationCreateDto } from './dto/credit-calculation.create.dto';
import { CreditCalculationDto } from './dto/credit-calculation.dto';
import { CalculationNotFoundException } from './exeptions/credit-calculation.exeptions';

@Injectable()
export class CreditCalculationService {
  constructor(
    private prisma: PrismaService,
    private creditCalcRepo: CreditCalculationRepository,
  ) {}

  // Расчет по ID
  async getCalculation(
    calculationId: number,
  ): Promise<CreditCalculationDto | null> {
    return this.prisma.$transaction(async (tx) => {
      const calculation = await this.creditCalcRepo.show(
        { recordId: calculationId },
        tx,
      );
      if (!calculation) {
        throw new CalculationNotFoundException();
      }

      return calculation;
    });
  }

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
