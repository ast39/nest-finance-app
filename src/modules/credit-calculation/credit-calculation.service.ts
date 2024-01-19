import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreditCalculationRepository } from './credit-calculation.repository';
import { CreditCalculationCreateDto } from './dto/credit-calculation.create.dto';
import { CreditCalculationDto } from './dto/credit-calculation.dto';
import { CalculationNotFoundException } from './exeptions/credit-calculation.exeptions';
import { CreditManagerService } from '../credit-manager/credit-manager.service';
import { ECreditSubject } from '@prisma/client';

@Injectable()
export class CreditCalculationService {
  constructor(
    private prisma: PrismaService,
    private creditCalcRepo: CreditCalculationRepository,
    private creditManagerService: CreditManagerService,
  ) {}

  // Расчет по ID
  async getCalculation(calculationId: number): Promise<CreditCalculationDto> {
    return this.prisma.$transaction(async (tx) => {
      const calculation = await this.creditCalcRepo.show(
        { recordId: calculationId },
        tx,
      );
      if (!calculation) {
        throw new CalculationNotFoundException();
      }

      switch (calculation.subject) {
        case ECreditSubject.amount:
          calculation.payments =
            await this.creditManagerService.findAmount(calculation);
          break;

        case ECreditSubject.percent:
          calculation.payments =
            await this.creditManagerService.findPercent(calculation);
          break;

        case ECreditSubject.period:
          calculation.payments =
            await this.creditManagerService.findPeriod(calculation);
          break;

        case ECreditSubject.payment:
          calculation.payments =
            await this.creditManagerService.findPayment(calculation);
          break;
      }

      calculation.overpay = calculation.payments
        .map((element) => {
          return element.percent;
        })
        .reduce((percent, x) => percent + x, 0);

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
