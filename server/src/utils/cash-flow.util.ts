import { CouponFrequency } from '@/enums/coupon-frequency.enum';
import type { CashFlowEntry } from '@/types/bond.types';

const MONTHS_PER_YEAR = 12;

function computeMonthsBetweenPayments(
  paymentsPerYear: CouponFrequency,
): number {
  return MONTHS_PER_YEAR / paymentsPerYear;
}

function formatPaymentDateLabel(
  periodNumber: number,
  monthsBetweenPayments: number,
): string {
  const monthOffset = periodNumber * monthsBetweenPayments;
  return `Month ${monthOffset}`;
}

export function buildCashFlowSchedule(
  faceValue: number,
  periodicCouponPayment: number,
  totalCouponPeriods: number,
  paymentsPerYear: CouponFrequency,
): CashFlowEntry[] {
  const monthsBetweenPayments = computeMonthsBetweenPayments(paymentsPerYear);

  const cashFlowSchedule: CashFlowEntry[] = [];

  for (
    let periodNumber = 1;
    periodNumber <= totalCouponPeriods;
    periodNumber++
  ) {
    const isFinalPeriod = periodNumber === totalCouponPeriods;

    cashFlowSchedule.push({
      period: periodNumber,
      paymentDate: formatPaymentDateLabel(periodNumber, monthsBetweenPayments),
      couponPayment: periodicCouponPayment,
      cumulativeInterest: periodicCouponPayment * periodNumber,
      remainingPrincipal: isFinalPeriod ? 0 : faceValue,
    });
  }

  return cashFlowSchedule;
}
