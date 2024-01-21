import { Injectable } from '@nestjs/common';
import {
  AmountZeroException,
  PercentZeroException,
  PeriodZeroException,
} from './exeptions/credit-manager.exeptions';
import { EPaymentType } from '@prisma/client';
import { CreditCalculationDto } from '../credit-calculation/dto/credit-calculation.dto';
import { CreditPaymentDto } from '../credit-calculation/dto/credit-payment.dto';
import { CreditManagerCalculationCore } from './credit-manager-calculation.core';
import { CreditManagerCheckingCore } from "./credit-manager-checking.core";

@Injectable()
export class CreditManagerService {
  constructor(
    private creditCoreCalculating: CreditManagerCalculationCore,
    private creditCoreChecking: CreditManagerCheckingCore)
  {}

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

    credit.amount = this.creditCoreCalculating.getAmount(credit);

    return credit.paymentType == EPaymentType.differ
      ? this.creditCoreCalculating.monthlyStatementDiff(credit)
      : this.creditCoreCalculating.monthlyStatementAnn(credit);
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

    credit.percent = this.creditCoreCalculating.getPercent(credit);

    return credit.paymentType == EPaymentType.differ
      ? this.creditCoreCalculating.monthlyStatementDiff(credit)
      : this.creditCoreCalculating.monthlyStatementAnn(credit);
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

    credit.period = this.creditCoreCalculating.getPeriod(credit);

    return credit.paymentType == EPaymentType.differ
      ? this.creditCoreCalculating.monthlyStatementDiff(credit)
      : this.creditCoreCalculating.monthlyStatementAnn(credit);
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
      credit.payment = this.creditCoreCalculating.getPayment(credit);
    }

    return this.creditCoreCalculating.monthlyStatementDiff(credit);
  }

  // Проверка кредита
  public async check(
    credit: CreditCalculationDto,
  ): Promise<CreditPaymentDto[]> {
    const realAmount = this.creditCoreChecking.getAmount(
      credit.percent,
      credit.period,
      credit.payment,
    );
    const realPercent = this.creditCoreChecking.getPercent(
      credit.amount,
      credit.period,
      credit.payment,
    );
    const realPeriod = this.creditCoreChecking.getPeriod(
      credit.amount,
      credit.percent,
      credit.payment,
    );
    const realPayment = this.creditCoreChecking.getPayment(
      credit.amount,
      credit.percent,
      credit.period,
    );

    const details = this.creditCoreChecking.details(credit, realPercent);

    const percentPayed = details
      .map((element) => {
        return element.percent;
      })
      .reduce((percent, x) => percent + x, 0);

    return {
      credit: credit,
      realAmount: realAmount,
      realPercent: realPercent,
      realPeriod: realPeriod,
      realPayment: realPayment,
      percentPayed: percentPayed,
      hiddenOverpayment:
        credit.payment * credit.period - realPayment * credit.period,
      details: details,
    };
  }
}
