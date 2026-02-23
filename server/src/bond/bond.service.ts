import { Injectable } from '@nestjs/common';

import type { BondCalculationResult, BondParameters } from '@/types/bond.types';
import { BondStatus } from '@/enums/bond-status.enum';
import { PERCENTAGE_DIVISOR } from '@/constants/bond.constants';
import {
  computeAnnualCouponPayment,
  calculateCurrentYield,
  calculateTotalInterest,
  calculateYieldToMaturity,
} from '@/utils/yield-math.util';
import { buildCashFlowSchedule } from '@/utils/cash-flow.util';

@Injectable()
export class BondService {
  calculateBondMetrics(bondParameters: BondParameters): BondCalculationResult {
    const {
      faceValue,
      couponRate,
      marketPrice,
      yearsToMaturity,
      couponFrequency,
    } = bondParameters;

    const annualCouponPayment = computeAnnualCouponPayment(
      faceValue,
      couponRate,
    );
    const periodicCouponPayment = annualCouponPayment / couponFrequency;
    const totalCouponPeriods = yearsToMaturity * couponFrequency;

    const currentYield = calculateCurrentYield(
      annualCouponPayment,
      marketPrice,
    );

    const yieldToMaturity = calculateYieldToMaturity(
      faceValue,
      marketPrice,
      periodicCouponPayment,
      totalCouponPeriods,
      couponFrequency,
    );

    const totalInterest = calculateTotalInterest(
      annualCouponPayment,
      yearsToMaturity,
    );

    const bondStatus = determineBondStatus(marketPrice, faceValue);

    const cashFlowSchedule = buildCashFlowSchedule(
      faceValue,
      periodicCouponPayment,
      totalCouponPeriods,
      couponFrequency,
    );

    return {
      currentYield: currentYield * PERCENTAGE_DIVISOR,
      yieldToMaturity: yieldToMaturity * PERCENTAGE_DIVISOR,
      totalInterest,
      bondStatus,
      cashFlowSchedule,
    };
  }
}

function determineBondStatus(
  marketPrice: number,
  faceValue: number,
): BondStatus {
  if (marketPrice > faceValue) {
    return BondStatus.Premium;
  }

  if (marketPrice < faceValue) {
    return BondStatus.Discount;
  }

  return BondStatus.Par;
}
