import type { BondStatus } from '@/enums/bond-status.enum';
import type { CouponFrequency } from '@/enums/coupon-frequency.enum';

export type CashFlowEntry = {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
};

export type BondCalculationResult = {
  currentYield: number;
  yieldToMaturity: number;
  totalInterest: number;
  bondStatus: BondStatus;
  cashFlowSchedule: CashFlowEntry[];
};

export type BondParameters = {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: CouponFrequency;
};
