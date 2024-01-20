import { Injectable } from '@nestjs/common';
import {
  AmountZeroException,
  PercentZeroException,
  PeriodZeroException,
} from './exeptions/credit-manager.exeptions';
import { EPaymentType } from '@prisma/client';
import { CreditCalculationDto } from '../credit-calculation/dto/credit-calculation.dto';
import { CreditPaymentDto } from '../credit-calculation/dto/credit-payment.dto';
import { CreditManagerCore } from './credit-manager.core';

@Injectable()
export class CreditManagerService {
  constructor(private creditManagerCore: CreditManagerCore) {}

  // Расчет кредита: неизвестна сумма кредита
  public async findAmount(
    credit: CreditCalculationDto,
  ): Promise<CreditPaymentDto[]> {
    if (credit.percent <= 0) {
      throw new PercentZeroException();
    }

    if (credit.period <= 0) {
      throw new PeriodZeroException();
    }

    credit.amount = this.creditManagerCore.getAmount(credit);

    return credit.paymentType == EPaymentType.differ
      ? this.creditManagerCore.monthlyStatementDiff(credit)
      : this.creditManagerCore.monthlyStatementAnn(credit);
  }

  // Расчет кредита: неизвестен процент по кредиту
  public async findPercent(
    credit: CreditCalculationDto,
  ): Promise<CreditPaymentDto[]> {
    if (credit.amount <= 0) {
      throw new AmountZeroException();
    }

    if (credit.period <= 0) {
      throw new PeriodZeroException();
    }

    credit.percent = this.creditManagerCore.getPercent(credit);

    return credit.paymentType == EPaymentType.differ
      ? this.creditManagerCore.monthlyStatementDiff(credit)
      : this.creditManagerCore.monthlyStatementAnn(credit);
  }

  // Расчет кредита: неизвестен срок кредита
  public async findPeriod(
    credit: CreditCalculationDto,
  ): Promise<CreditPaymentDto[]> {
    if (credit.amount <= 0) {
      throw new AmountZeroException();
    }

    if (credit.percent <= 0) {
      throw new PercentZeroException();
    }

    credit.period = this.creditManagerCore.getPeriod(credit);

    return credit.paymentType == EPaymentType.differ
      ? this.creditManagerCore.monthlyStatementDiff(credit)
      : this.creditManagerCore.monthlyStatementAnn(credit);
  }

  // Расчет кредита: неизвестен ежемесячный платеж
  public async findPayment(
    credit: CreditCalculationDto,
  ): Promise<CreditPaymentDto[]> {
    if (credit.amount <= 0) {
      throw new AmountZeroException();
    }

    if (credit.percent <= 0) {
      throw new PercentZeroException();
    }

    if (credit.period <= 0) {
      throw new PeriodZeroException();
    }

    if (credit.paymentType == EPaymentType.differ) {
      credit.payment = credit.amount / credit.period;
    } else {
      credit.payment = this.creditManagerCore.getPayment(credit);
    }

    return this.creditManagerCore.monthlyStatementDiff(credit);
  }
}
