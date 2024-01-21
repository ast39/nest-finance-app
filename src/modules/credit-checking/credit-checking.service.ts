import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreditCheckingRepository } from './credit-checking.repository';
import { CreditCheckingCreateDto } from './dto/credit-checking.create.dto';
import { CreditCheckingDto } from './dto/credit-checking.dto';
import {
  CheckingNotFoundException,
  CheckingOtherOwnerException,
} from './exeptions/credit-checking.exeptions';
import { CreditManagerService } from '../credit-manager/credit-manager.service';

@Injectable()
export class CreditCheckingService {
  constructor(
    private prisma: PrismaService,
    private creditCheckRepo: CreditCheckingRepository,
    private creditManagerService: CreditManagerService,
  ) {}

  // Проверка по ID
  async getChecking(checkingId: number): Promise<CreditCheckingDto> {
    return this.prisma.$transaction(async (tx) => {
      const checking = await this.creditCheckRepo.show(
        { recordId: checkingId },
        tx,
      );
      if (!checking) {
        throw new CheckingNotFoundException();
      }

      checking.overpay = checking.payments
        .map((element) => {
          return element.percent;
        })
        .reduce((percent, x) => percent + x, 0);

      return checking;
    });
  }

  // Добавление проверки
  async createChecking(
    ownerId: number,
    data: CreditCheckingCreateDto,
  ): Promise<CreditCheckingDto> {
    const credit = await this.creditCheckRepo.store(ownerId, data);

    return this.getChecking(credit.recordId);
  }

  // Удаление проверки
  async deleteChecking(
    userId: number,
    checkingId: number,
  ): Promise<CreditCheckingDto> {
    return this.prisma.$transaction(async (tx) => {
      const checking = await this.creditCheckRepo.show(
        {
          recordId: checkingId,
        },
        tx,
      );

      if (!checking) {
        throw new CheckingNotFoundException();
      }

      if (checking.ownerId != userId) {
        throw new CheckingOtherOwnerException();
      }

      return this.creditCheckRepo.destroy({ recordId: checkingId });
    });
  }
}
