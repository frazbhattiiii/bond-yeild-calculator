import { createContext } from 'react';

import type { BondCalculatorAction, BondCalculatorState } from './bondCalculator.reducer';

export type BondCalculatorContextValue = {
  state: BondCalculatorState;
  dispatch: React.Dispatch<BondCalculatorAction>;
};

export const BondCalculatorContext =
  createContext<BondCalculatorContextValue | null>(null);
