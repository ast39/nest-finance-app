import { Injectable } from '@nestjs/common';
import { DivisionToZeroException } from './exeptions/credit-manager.exeptions';
import { CreditCheckingDto } from '../credit-checking/dto/credit-checking.dto';
import { CreditPaymentCheckingDto } from '../credit-checking/dto/credit-payment-checking.dto';

@Injectable()
export class CreditManagerCheckingCore {
  // Проверка кредита: проверяем ежемесячный платеж по кредиту
  public getPayment(
    creditAmount: number,
    creditPercent: number,
    creditPeriod: number,
  ): number {
    const monthlyPercent = creditPercent / 12 / 100;

    const part_1 = monthlyPercent * Math.pow(1 + monthlyPercent, creditPeriod);
    const part_2 = Math.pow(1 + monthlyPercent, creditPeriod) - 1;

    if (part_2 == 0) {
      throw new DivisionToZeroException();
    }

    return Math.ceil(creditAmount * (part_1 / part_2));
  }

  // Проверка кредита: проверяем сумму кредита
  public getAmount(
    creditPercent: number,
    creditPeriod: number,
    creditPayment: number,
  ): number {
    const monthlyPercent = creditPercent / 12 / 100;

    const part_1 = monthlyPercent * Math.pow(1 + monthlyPercent, creditPeriod);
    const part_2 = Math.pow(1 + monthlyPercent, creditPeriod) - 1;

    if (part_2 == 0) {
      throw new DivisionToZeroException();
    }

    return Math.ceil(creditPayment / (part_1 / part_2));
  }

  // Проверка кредита: проверяем процент по кредиту
  public getPercent(
    creditAmount: number,
    creditPeriod: number,
    creditPayment: number,
  ): number {
    let step: number = 10;
    let creditPercent: number = 10;
    const creditPaymentMin: number = creditPayment - creditPayment * 0.0001;
    const creditPaymentMax: number = creditPayment + creditPayment * 0.0001;

    let payment = this.getPayment(creditAmount, creditPercent, creditPeriod);

    do {
      payment = this.getPayment(creditAmount, creditPercent, creditPeriod);

      if (payment < creditPayment) {
        creditPercent = creditPercent + step;
      }

      if (payment > creditPayment) {
        creditPercent = creditPercent - step;
        step = step / 10;
        creditPercent = creditPercent + step;
      }
    } while (payment < creditPaymentMin || payment > creditPaymentMax);

    return Math.round(creditPercent * 100) / 100;
  }

  // Проверка кредита: проверяем срок кредита
  public getPeriod(
    creditAmount: number,
    creditPercent: number,
    creditPayment: number,
  ): number {
    let months: number = 0;
    let insetBalance: number = creditAmount;
    let monthlyOutsetBalance: number = 0;

    do {
      const monthlyInsetBalance: number = Math.ceil(insetBalance);
      const monthlyPercentAmount: number = Math.ceil(
        (insetBalance * creditPercent) / 12 / 100,
      );
      const monthlyBodyAmount: number = Math.ceil(
        creditPayment - monthlyPercentAmount,
      );
      monthlyOutsetBalance = Math.ceil(monthlyInsetBalance - monthlyBodyAmount);

      insetBalance = Math.ceil(monthlyInsetBalance - monthlyBodyAmount);
      months++;
    } while (monthlyOutsetBalance > 0);

    return months;
  }

  // Детализация проверки кредита
  public details(
    credit: CreditCheckingDto,
    realPercent: number,
  ): CreditPaymentCheckingDto[] {
    const details: CreditPaymentCheckingDto[] = [];
    let inset: number = credit.amount;

    for (let month: number = 1; month <= credit.period; month++) {
      if (inset == 0) {
        break;
      }

      inset = Math.ceil(inset);
      const percent = Math.ceil((inset * realPercent) / 12 / 100);

      let body = Math.ceil(credit.payment - percent);
      let payment = Math.ceil(percent + body);
      let outset = Math.ceil(inset - body);

      if (outset < 0 || (month == credit.period && outset > 0)) {
        body = body + outset;
        payment = payment + outset;
        outset = 0;
      }

      inset = outset;

      details.push({
        insetBalance: inset,
        payment: payment,
        percent: percent,
        body: body,
        outsetBalance: outset,
      });
    }

    return details;
  }
}
