import { useReducer } from 'react';

import {
  bondCalculatorReducer,
  INITIAL_BOND_CALCULATOR_STATE,
} from './bondCalculator.reducer';
import { BondCalculatorContext } from './bondCalculatorContext';

export function BondCalculatorProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, dispatch] = useReducer(
    bondCalculatorReducer,
    INITIAL_BOND_CALCULATOR_STATE,
  );

  return (
    <BondCalculatorContext value={{ state, dispatch }}>
      {children}
    </BondCalculatorContext>
  );
}
