import { DEFAULT_BOND_FORM_VALUES } from '@/constants/bond.constants';
import type {
  BondCalculationResponse,
  BondFormErrors,
  CouponFrequency,
} from '@/types/bond.types';

export type BondCalculatorState = {
  faceValue: string;
  couponRate: string;
  marketPrice: string;
  yearsToMaturity: string;
  couponFrequency: CouponFrequency;
  bondFormErrors: BondFormErrors;
  calculationResponse: BondCalculationResponse | null;
  isCalculating: boolean;
  calculationError: string | null;
};

export const INITIAL_BOND_CALCULATOR_STATE: BondCalculatorState = {
  faceValue: DEFAULT_BOND_FORM_VALUES.faceValue,
  couponRate: DEFAULT_BOND_FORM_VALUES.couponRate,
  marketPrice: DEFAULT_BOND_FORM_VALUES.marketPrice,
  yearsToMaturity: DEFAULT_BOND_FORM_VALUES.yearsToMaturity,
  couponFrequency: DEFAULT_BOND_FORM_VALUES.couponFrequency,
  bondFormErrors: {},
  calculationResponse: null,
  isCalculating: false,
  calculationError: null,
};

type UpdateFieldAction = {
  type: 'UPDATE_FIELD';
  fieldName: keyof Pick<
    BondCalculatorState,
    'faceValue' | 'couponRate' | 'marketPrice' | 'yearsToMaturity' | 'couponFrequency'
  >;
  fieldValue: string;
};

type SetValidationErrorsAction = {
  type: 'SET_VALIDATION_ERRORS';
  bondFormErrors: BondFormErrors;
};

type CalculationStartedAction = {
  type: 'CALCULATION_STARTED';
};

type CalculationSucceededAction = {
  type: 'CALCULATION_SUCCEEDED';
  calculationResponse: BondCalculationResponse;
};

type CalculationFailedAction = {
  type: 'CALCULATION_FAILED';
  errorMessage: string;
};

type ResetCalculatorAction = {
  type: 'RESET_CALCULATOR';
};

export type BondCalculatorAction =
  | UpdateFieldAction
  | SetValidationErrorsAction
  | CalculationStartedAction
  | CalculationSucceededAction
  | CalculationFailedAction
  | ResetCalculatorAction;

export function bondCalculatorReducer(
  state: BondCalculatorState,
  action: BondCalculatorAction,
): BondCalculatorState {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const updatedErrors = { ...state.bondFormErrors };
      delete updatedErrors[action.fieldName];

      return {
        ...state,
        [action.fieldName]: action.fieldValue,
        bondFormErrors: updatedErrors,
        calculationError: null,
      };
    }

    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        bondFormErrors: action.bondFormErrors,
      };

    case 'CALCULATION_STARTED':
      return {
        ...state,
        isCalculating: true,
        calculationError: null,
      };

    case 'CALCULATION_SUCCEEDED':
      return {
        ...state,
        isCalculating: false,
        calculationResponse: action.calculationResponse,
      };

    case 'CALCULATION_FAILED':
      return {
        ...state,
        isCalculating: false,
        calculationError: action.errorMessage,
      };

    case 'RESET_CALCULATOR':
      return INITIAL_BOND_CALCULATOR_STATE;
  }
}
