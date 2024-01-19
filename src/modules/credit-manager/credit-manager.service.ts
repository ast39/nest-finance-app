import { Injectable } from '@nestjs/common';
import {
  AmountZeroException,
  DivisionToZeroException,
  PercentZeroException,
  PeriodZeroException,
} from './exeptions/credit-manager.exeptions';
import { ICalculation } from '../../common/interfaces/credit-calculation.interface';
import { EPaymentType } from '@prisma/client';

@Injectable()
export class CreditManagerService {
  // Расчет ежемесячного платежа
  public async findPayment(credit: ICalculation) {
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
      credit.payment = this.getPayment(credit);
    }

    const details = this.monthlyStatementDiff(credit);

    console.info(credit);
    console.info(details);
  }

  // Высчитать сумму кредита по условиям
  private getAmount(credit: ICalculation): number {
    let step: number = 10000;
    let creditAmount: number = 1;
    const creditPaymentMin: number = credit.payment - credit.payment * 0.0001;
    const creditPaymentMax: number = credit.payment + credit.payment * 0.0001;
    let payment = this.findPaymentByParams(
      creditAmount,
      credit.percent,
      credit.period,
    );

    do {
      payment = this.findPaymentByParams(
        creditAmount,
        credit.percent,
        credit.period,
      );

      if (payment > credit.payment && creditAmount == 1) {
        throw new AmountZeroException();
      }

      if (payment < credit.payment) {
        creditAmount += step;
      }

      if (payment > credit.payment) {
        creditAmount -= step;
        step /= 10;
        creditAmount += step;
      }
    } while (payment < creditPaymentMin || payment > creditPaymentMax);

    return creditAmount;
  }

  // Высчитать процент кредита по условиям
  private getPercent(credit: ICalculation): number
  {
    let step: number = 10;
    let creditPercent: number = 0.1;
    const creditPaymentMin: number = credit.payment - credit.payment * 0.0001;
    const creditPaymentMax: number = credit.payment + credit.payment * 0.0001;
    let payment: number = this.findPaymentByParams(
      credit.amount,
      creditPercent,
      credit.period,
    );

    do {
      payment = this.findPaymentByParams(
        credit.amount,
        creditPercent,
        credit.period,
      );

      if (payment > credit.payment && creditPercent == 0.1) {
        throw new PercentZeroException();
      }

      if (payment < credit.payment) {
        creditPercent += step;
      }

      if (payment > credit.payment) {
        creditPercent -= step;
        step /= 10;
        creditPercent += step;
      }
    } while (payment < creditPaymentMin || payment > creditPaymentMax);

    return creditPercent;
  }

  // Высчитать срок кредита по условиям
  private getPeriod(credit: ICalculation): number {
    let period: number = 0;

    let insetBalance: number = credit.amount;
    let outsetBalance: number = insetBalance;
    let payment: number = credit.payment;

    do {
      const currentPercent = Math.ceil(
        (insetBalance * credit.percent) / 12 / 100,
      );
      const currentBody: number = payment - currentPercent;

      outsetBalance = insetBalance - currentBody;

      if (outsetBalance < 0) {
        const difference: number = Math.abs(outsetBalance);
        payment -= difference;
        outsetBalance = 0;
      }

      if (outsetBalance < credit.payment / 10) {
        payment += outsetBalance;
        outsetBalance = 0;
      }

      insetBalance = outsetBalance;
      period++;
    } while (outsetBalance > 0);

    return period;
  }

  // Высчитать ежемесячный платеж по условиям
  private getPayment(credit: ICalculation): number {
    const monthlyPercent = credit.percent / 12 / 100;

    const part_1 = monthlyPercent * Math.pow(1 + monthlyPercent, credit.period);
    const part_2 = Math.pow(1 + monthlyPercent, credit.period) - 1;

    if (part_2 == 0) {
      throw new DivisionToZeroException();
    }

    return Math.ceil(credit.amount * (part_1 / part_2));
  }

  // Для подбора процента (вспомогательная функция)
  private findPaymentByParams(
    creditAmount: number,
    creditPercent: number,
    creditPeriod: number,
  ): number {
    const monthly_percent = creditPercent / 12 / 100;

    const part_1 =
      monthly_percent * Math.pow(1 + monthly_percent, creditPeriod);
    const part_2 = Math.pow(1 + monthly_percent, creditPeriod) - 1;

    if (part_2 == 0) {
      return 0;
    }

    return Math.ceil(creditAmount * (part_1 / part_2));
  }

  private monthlyStatementDiff(credit: ICalculation): any[] {
    const details: any[] = [];
    let overpay: number = 0;
    let payments: number = 0;

    let insetBalance: number = credit.amount;
    let oldPaymentDate = (Date.now() / 1000) | 0;
    let currentPaymentDate = oldPaymentDate + 3600 * 24;
    const paymentBody = Math.round(credit.amount / credit.period);

    for (let i: number = 1; i <= credit.period; i++) {
      let currentBody: number = paymentBody;
      const currentPercent: number = Math.ceil(
        this.getPercentByPeriod(
          oldPaymentDate,
          currentPaymentDate,
          insetBalance,
          credit.percent,
        ),
      );
      const currentPayment: number = paymentBody + currentPercent;
      let outsetBalance: number = insetBalance - paymentBody;

      if (outsetBalance < 0) {
        const difference = Math.abs(outsetBalance);

        credit.payment -= difference;
        currentBody -= difference;
        outsetBalance = 0;
      }

      if (i == credit.period && outsetBalance > 0) {
        credit.payment += outsetBalance;
        currentBody += outsetBalance;
        outsetBalance = 0;
      }

      details[i] = {
        date_time: currentPaymentDate,
        inset_balance: insetBalance,
        credit_payment: currentPayment,
        payment_percent: currentPercent,
        payment_body: currentBody,
        outset_balance: outsetBalance,
        status: credit.payments.count >= i,
      };

      overpay += currentPercent;
      payments += credit.payment;
      insetBalance = outsetBalance;

      oldPaymentDate = currentPaymentDate;
      currentPaymentDate = this.plusMonth(currentPaymentDate);
    }

    return details;
  }
}
