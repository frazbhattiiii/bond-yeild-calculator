import { useContext } from 'react';

import { BondCalculatorContext } from '@/context/bondCalculatorContext';
import type { BondCalculatorState } from '@/context/bondCalculator.reducer';
import { calculateBondYield } from '@/services/bond-calculation.service';
import type { BondCalculationRequest, CouponFrequency } from '@/types/bond.types';
import {
  hasValidationErrors,
  validateBondInputs,
} from '@/utils/validation.util';

type BondCalculatorHook = {
  state: BondCalculatorState;
  updateField: (
    fieldName: keyof Pick<
      BondCalculatorState,
      'faceValue' | 'couponRate' | 'marketPrice' | 'yearsToMaturity' | 'couponFrequency'
    >,
    fieldValue: string,
  ) => void;
  submitCalculation: () => Promise<void>;
  resetCalculator: () => void;
};

export function useBondCalculator(): BondCalculatorHook {
  const context = useContext(BondCalculatorContext);

  if (context === null) {
    throw new Error(
      'useBondCalculator must be used within a BondCalculatorProvider',
    );
  }

  const { state, dispatch } = context;

  function updateField(
    fieldName: keyof Pick<
      BondCalculatorState,
      'faceValue' | 'couponRate' | 'marketPrice' | 'yearsToMaturity' | 'couponFrequency'
    >,
    fieldValue: string,
  ): void {
    dispatch({ type: 'UPDATE_FIELD', fieldName, fieldValue });
  }

  async function submitCalculation(): Promise<void> {
    const bondFormErrors = validateBondInputs(
      state.faceValue,
      state.couponRate,
      state.marketPrice,
      state.yearsToMaturity,
    );

    if (hasValidationErrors(bondFormErrors)) {
      dispatch({ type: 'SET_VALIDATION_ERRORS', bondFormErrors });
      return;
    }

    dispatch({ type: 'CALCULATION_STARTED' });

    const bondRequest: BondCalculationRequest = {
      faceValue: Number(state.faceValue),
      couponRate: Number(state.couponRate),
      marketPrice: Number(state.marketPrice),
      yearsToMaturity: Number(state.yearsToMaturity),
      couponFrequency: Number(state.couponFrequency) as CouponFrequency,
    };

    try {
      const calculationResponse = await calculateBondYield(bondRequest);
      dispatch({ type: 'CALCULATION_SUCCEEDED', calculationResponse });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.';
      dispatch({ type: 'CALCULATION_FAILED', errorMessage });
    }
  }

  function resetCalculator(): void {
    dispatch({ type: 'RESET_CALCULATOR' });
  }

  return { state, updateField, submitCalculation, resetCalculator };
}
