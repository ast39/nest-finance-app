import { Injectable } from "@nestjs/common";
import { CreditCalculationDto } from "../credit-calculation/dto/credit-calculation.dto";
import { CreditPaymentDto } from "../credit-calculation/dto/credit-payment.dto";
import { DivisionToZeroException, PercentZeroException } from "./exeptions/credit-manager.exeptions";

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

    return creditPercent;
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
  public details(credit: CreditCalculationDto, realPercent: number) {
    const details: [] = [];
    let inset: number = credit.amount;

    for (let month: number = 1; month <= credit.period; month++) {
      if (inset == 0) {
        break;
      }

      const monthlyDetails = {
        inset: Math.ceil(inset),
        percent: Math.ceil((inset * realPercent) / 12 / 100),
        body: 0,
        payment: 0,
        outset: 0,
      };

      monthlyDetails.body = Math.ceil(credit.payment - monthlyDetails.percent);
      monthlyDetails.payment = Math.ceil(
        monthlyDetails.percent + monthlyDetails.body,
      );
      monthlyDetails.outset = Math.ceil(
        monthlyDetails.inset - monthlyDetails.body,
      );

      if (
        monthlyDetails.outset < 0 ||
        (month == credit.period && monthlyDetails.outset > 0)
      ) {
        monthlyDetails.body = monthlyDetails.body + monthlyDetails.outset;
        monthlyDetails.payment = monthlyDetails.payment + monthlyDetails.outset;
        monthlyDetails.outset = 0;
      }

      inset = monthlyDetails.outset;

      details.push(monthlyDetails);
    }

    return details;
  }
}
