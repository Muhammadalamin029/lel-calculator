import { useMemo, useReducer } from 'react';

import {
  calculatorReducer,
  getExpression,
  initialCalculatorState,
  type CalculatorAction,
  type Operator,
} from '../engine/calculator';

/** React binding for the pure calculator engine. Local state is sufficient. */
export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialCalculatorState);

  return useMemo(
    () => ({
      display: state.display,
      expression: getExpression(state),
      error: state.error,
      activeOperator: state.waitingForOperand ? state.operator : null,
      inputDigit: (digit: string) => dispatch({ type: 'digit', digit } satisfies CalculatorAction),
      inputDot: () => dispatch({ type: 'dot' } satisfies CalculatorAction),
      toggleSign: () => dispatch({ type: 'toggleSign' } satisfies CalculatorAction),
      percent: () => dispatch({ type: 'percent' } satisfies CalculatorAction),
      setOperator: (operator: Operator) =>
        dispatch({ type: 'operator', operator } satisfies CalculatorAction),
      equals: () => dispatch({ type: 'equals' } satisfies CalculatorAction),
      clear: () => dispatch({ type: 'clear' } satisfies CalculatorAction),
      deleteLast: () => dispatch({ type: 'delete' } satisfies CalculatorAction),
    }),
    [state],
  );
}

export type Calculator = ReturnType<typeof useCalculator>;
