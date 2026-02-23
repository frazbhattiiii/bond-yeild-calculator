import {
  CONVERGENCE_THRESHOLD,
  INITIAL_YIELD_ESTIMATE,
  NEWTON_RAPHSON_MAX_ITERATIONS,
  PERCENTAGE_DIVISOR,
} from '@/constants/bond.constants';

export function computeBondPriceAtYield(
  periodicCouponPayment: number,
  faceValue: number,
  totalCouponPeriods: number,
  periodicYield: number,
): number {
  let discountedCouponSum = 0;

  for (let periodIndex = 1; periodIndex <= totalCouponPeriods; periodIndex++) {
    discountedCouponSum +=
      periodicCouponPayment / Math.pow(1 + periodicYield, periodIndex);
  }

  const discountedFaceValue =
    faceValue / Math.pow(1 + periodicYield, totalCouponPeriods);

  return discountedCouponSum + discountedFaceValue;
}

export function computeBondPriceDerivative(
  periodicCouponPayment: number,
  faceValue: number,
  totalCouponPeriods: number,
  periodicYield: number,
): number {
  let derivativeSum = 0;

  for (let periodIndex = 1; periodIndex <= totalCouponPeriods; periodIndex++) {
    derivativeSum +=
      (periodIndex * periodicCouponPayment) /
      Math.pow(1 + periodicYield, periodIndex + 1);
  }

  const faceValueDerivative =
    (totalCouponPeriods * faceValue) /
    Math.pow(1 + periodicYield, totalCouponPeriods + 1);

  return derivativeSum + faceValueDerivative;
}

export function hasConverged(
  previousYield: number,
  currentYield: number,
): boolean {
  return Math.abs(currentYield - previousYield) < CONVERGENCE_THRESHOLD;
}

export function computeAnnualCouponPayment(
  faceValue: number,
  couponRate: number,
): number {
  return faceValue * (couponRate / PERCENTAGE_DIVISOR);
}

export function calculateCurrentYield(
  annualCouponPayment: number,
  marketPrice: number,
): number {
  return annualCouponPayment / marketPrice;
}

export function calculateTotalInterest(
  annualCouponPayment: number,
  yearsToMaturity: number,
): number {
  return annualCouponPayment * yearsToMaturity;
}

export function calculateYieldToMaturity(
  faceValue: number,
  marketPrice: number,
  periodicCouponPayment: number,
  totalCouponPeriods: number,
  paymentsPerYear: number,
): number {
  let periodicYield = INITIAL_YIELD_ESTIMATE / paymentsPerYear;

  for (
    let iteration = 0;
    iteration < NEWTON_RAPHSON_MAX_ITERATIONS;
    iteration++
  ) {
    const estimatedPrice = computeBondPriceAtYield(
      periodicCouponPayment,
      faceValue,
      totalCouponPeriods,
      periodicYield,
    );

    const priceDifference = estimatedPrice - marketPrice;

    const priceDerivative = computeBondPriceDerivative(
      periodicCouponPayment,
      faceValue,
      totalCouponPeriods,
      periodicYield,
    );

    const previousYield = periodicYield;
    periodicYield += priceDifference / priceDerivative;

    if (hasConverged(previousYield, periodicYield)) {
      return periodicYield * paymentsPerYear;
    }
  }

  return periodicYield * paymentsPerYear;
}
