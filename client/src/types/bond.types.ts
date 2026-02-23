export const CouponFrequency = {
  Annual: 1,
  SemiAnnual: 2,
  Quarterly: 4,
} as const;

export type CouponFrequency =
  (typeof CouponFrequency)[keyof typeof CouponFrequency];

export const BondStatus = {
  Premium: 'premium',
  Discount: 'discount',
  Par: 'par',
} as const;

export type BondStatus = (typeof BondStatus)[keyof typeof BondStatus];

export type BondCalculationRequest = {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: CouponFrequency;
};

export type CashFlowEntry = {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
};

export type BondCalculationResponse = {
  currentYield: number;
  yieldToMaturity: number;
  totalInterest: number;
  bondStatus: BondStatus;
  cashFlowSchedule: CashFlowEntry[];
};

export type BondFormErrors = Partial<
  Record<keyof BondCalculationRequest, string>
>;
