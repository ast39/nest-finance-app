import { Injectable } from '@nestjs/common';
import { CreditCalculationDto } from '../credit-calculation/dto/credit-calculation.dto';
import { CreditPaymentDto } from '../credit-calculation/dto/credit-payment.dto';
import {
  AmountZeroException,
  DivisionToZeroException,
  PercentZeroException,
} from './exeptions/credit-manager.exeptions';

@Injectable()
export class CreditManagerCore {
  // Расчет кредита: неизвестен ежемесячный рлатеж по кредиту
  public getPayment(credit: CreditCalculationDto): number {
    const monthlyPercent = credit.percent / 12 / 100;

    const part_1 = monthlyPercent * Math.pow(1 + monthlyPercent, credit.period);
    const part_2 = Math.pow(1 + monthlyPercent, credit.period) - 1;

    if (part_2 == 0) {
      throw new DivisionToZeroException();
    }

    return Math.ceil(credit.amount * (part_1 / part_2));
  }

  // Расчет кредита: неизвестна сумма кредита
  public getAmount(credit: CreditCalculationDto): number {
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

  // Расчет кредита: неизвестен процент по кредиту
  public getPercent(credit: CreditCalculationDto): number {
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

  // Расчет кредита: неизвестен срок кредита
  public getPeriod(credit: CreditCalculationDto): number {
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

  // График платежей
  public async monthlyStatementDiff(
    credit: CreditCalculationDto,
  ): Promise<CreditPaymentDto[]> {
    const details: CreditPaymentDto[] = [];

    let insetBalance: number = credit.amount;
    let currentPaymentDate = new Date();
    let nextPaymentDate = this.plusMonth(currentPaymentDate);

    const paymentBody = Math.round(credit.amount / credit.period);

    for (let i: number = 1; i <= credit.period; i++) {
      let currentBody: number = paymentBody;

      const currentPercent: number = Math.ceil(
        this.getPercentByPeriod(
          currentPaymentDate,
          nextPaymentDate,
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

      details.push({
        paymentDate: currentPaymentDate,
        insetBalance: insetBalance,
        payment: currentPayment,
        percent: currentPercent,
        body: currentBody,
        outsetBalance: outsetBalance,
        status: false,
      });

      insetBalance = outsetBalance;
      currentPaymentDate = nextPaymentDate;
      nextPaymentDate = this.plusMonth(nextPaymentDate);
    }

    return details;
  }

  // Прибавить ровно месяц к дате
  private plusMonth(date: Date): Date {
    let year: number = date.getFullYear();
    let month: number = date.getMonth();
    let day: number = date.getDate();

    month = month == 11 ? 0 : month + 1;
    year = month == 0 ? year + 1 : year;

    switch (month) {
      case 1:
        day = year % 4 == 0 ? Math.min(day, 29) : Math.min(day, 28);
        break;
      case 3:
      case 5:
      case 10:
      case 8:
        day = Math.min(day, 30);
        break;
      default:
        break;
    }

    return new Date(year, month, day, 9, 0, 0);
  }

  // Сумма процентов между 2мя датами
  private getPercentByPeriod(
    from: Date,
    to: Date,
    amount: number,
    percent: number,
  ): number {
    let percentAmount: number = 0;

    do {
      percentAmount += (amount * percent) / 100 / this.daysInYear(from);
      from.setDate(from.getDate() + 1);
    } while (from.getTime() < to.getTime());
    return percentAmount;
  }

  // Кол-во дней в году (проверка на високосность)
  private daysInYear(payDate: Date): number {
    return payDate.getFullYear() % 4 == 0 ? 366 : 365;
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
}
