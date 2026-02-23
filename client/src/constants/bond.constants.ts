import type { CouponFrequency } from '@/types/bond.types';

export const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL as string}/api/v1`;

export const MIN_COUPON_RATE = 0;
export const MAX_COUPON_RATE = 100;
export const MIN_POSITIVE_VALUE = 0;

export const COUPON_FREQUENCY_OPTIONS: {
  label: string;
  value: CouponFrequency;
}[] = [
  { label: 'Semi-Annual', value: 2 },
  { label: 'Annual', value: 1 },
  { label: 'Quarterly', value: 4 },
];

export const DEFAULT_BOND_FORM_VALUES = {
  faceValue: '',
  couponRate: '',
  marketPrice: '',
  yearsToMaturity: '',
  couponFrequency: 2 as CouponFrequency,
};
