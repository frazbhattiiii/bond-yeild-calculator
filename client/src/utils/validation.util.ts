import {
  MIN_COUPON_RATE,
  MAX_COUPON_RATE,
  MIN_POSITIVE_VALUE,
} from '@/constants/bond.constants';
import type { BondFormErrors } from '@/types/bond.types';

export function validateBondInputs(
  faceValue: string,
  couponRate: string,
  marketPrice: string,
  yearsToMaturity: string,
): BondFormErrors {
  const bondFormErrors: BondFormErrors = {};

  const parsedFaceValue = Number(faceValue);
  if (!faceValue || isNaN(parsedFaceValue) || parsedFaceValue <= MIN_POSITIVE_VALUE) {
    bondFormErrors.faceValue = 'Face value must be a positive number';
  }

  const parsedCouponRate = Number(couponRate);
  if (
    couponRate === '' ||
    isNaN(parsedCouponRate) ||
    parsedCouponRate < MIN_COUPON_RATE ||
    parsedCouponRate > MAX_COUPON_RATE
  ) {
    bondFormErrors.couponRate = 'Coupon rate must be between 0 and 100';
  }

  const parsedMarketPrice = Number(marketPrice);
  if (
    !marketPrice ||
    isNaN(parsedMarketPrice) ||
    parsedMarketPrice <= MIN_POSITIVE_VALUE
  ) {
    bondFormErrors.marketPrice = 'Market price must be a positive number';
  }

  const parsedYearsToMaturity = Number(yearsToMaturity);
  if (
    !yearsToMaturity ||
    isNaN(parsedYearsToMaturity) ||
    parsedYearsToMaturity <= MIN_POSITIVE_VALUE ||
    !Number.isInteger(parsedYearsToMaturity)
  ) {
    bondFormErrors.yearsToMaturity =
      'Years to maturity must be a positive integer';
  }

  return bondFormErrors;
}

export function hasValidationErrors(bondFormErrors: BondFormErrors): boolean {
  return Object.keys(bondFormErrors).length > 0;
}
