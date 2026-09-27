/**
 * LEL Calculator engine — pure TypeScript, no React Native imports.
 *
 * Explicit state machine + arithmetic. No eval(). Never returns NaN/Infinity.
 */

export type Operator = '+' | '−' | '×' | '÷';

export interface CalculatorState {
  /** Current entry / result as typed (may include leading '-', one '.'). */
  display: string;
  /** Stored first operand for a pending binary operation. */
  operand: number | null;
  /** Pending binary operator. */
  operator: Operator | null;
  /** Next digit starts a fresh entry (after an operator or equals). */
  waitingForOperand: boolean;
  /** Last executed operation, for repeated '=' presses. */
  lastOperator: Operator | null;
  lastOperand: number | null;
  /** True right after '=' so digit entry restarts and operators chain. */
  justEvaluated: boolean;
  /** Human-readable error (e.g. division by zero). Takes over the display. */
  error: string | null;
  /** Expression line shown above the result, e.g. "25 + 15 =". */
  expression: string;
}

export const DIVIDE_BY_ZERO_MESSAGE = "Can't divide by zero";

export const initialCalculatorState: CalculatorState = {
  display: '0',
  operand: null,
  operator: null,
  waitingForOperand: false,
  lastOperator: null,
  lastOperand: null,
  justEvaluated: false,
  error: null,
  expression: '',
};

export type CalculatorAction =
  | { type: 'digit'; digit: string }
  | { type: 'dot' }
  | { type: 'toggleSign' }
  | { type: 'percent' }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }
  | { type: 'clear' }
  | { type: 'delete' };

const MAX_ENTRY_LENGTH = 12;

function parseDisplay(display: string): number {
  const value = Number(display);
  return Number.isFinite(value) ? value : 0;
}

function compute(a: number, operator: Operator, b: number): number {
  switch (operator) {
    case '+':
      return a + b;
    case '−':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b === 0 ? NaN : a / b;
  }
}

/**
 * Format a finite number without unnecessary trailing zeros.
 * Large/small magnitudes fall back to exponential notation.
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (Object.is(value, -0)) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-9)) {
    return value
      .toExponential(6)
      .replace(/(\.\d*?)0+e/, '$1e')
      .replace(/\.e/, 'e');
  }
  // Round to kill binary float artefacts (0.1 + 0.2), then strip zeros.
  const rounded = Number(value.toPrecision(12));
  return String(rounded);
}

function freshEntry(): CalculatorState {
  return {
    ...initialCalculatorState,
    waitingForOperand: false,
    justEvaluated: false,
  };
}

/** Expression for a pending operation: "a op" or "a op b". */
function pendingExpression(operand: number, operator: Operator, entry: string | null): string {
  const left = formatNumber(operand);
  return entry === null ? `${left} ${operator}` : `${left} ${operator} ${entry}`;
}

function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.error) {
    return { ...freshEntry(), display: digit };
  }
  if (state.justEvaluated) {
    return { ...state, display: digit, waitingForOperand: false, justEvaluated: false, expression: '' };
  }
  if (state.waitingForOperand) {
    const base = {
      ...state,
      display: digit,
      waitingForOperand: false,
      justEvaluated: false,
      error: null,
    };
    return state.operand !== null && state.operator !== null
      ? { ...base, expression: pendingExpression(state.operand, state.operator, digit) }
      : base;
  }
  if (state.display.replace(/[-.]/g, '').length >= MAX_ENTRY_LENGTH) return state;
  let display = state.display;
  if (display === '0') display = digit;
  else if (display === '-0') display = `-${digit}`;
  else display = `${display}${digit}`;
  const next = { ...state, display };
  return state.operand !== null && state.operator !== null
    ? { ...next, expression: pendingExpression(state.operand, state.operator, display) }
    : next;
}

function inputDot(state: CalculatorState): CalculatorState {
  if (state.error) return { ...freshEntry(), display: '0.' };
  if (state.justEvaluated) {
    return { ...state, display: '0.', waitingForOperand: false, justEvaluated: false, expression: '' };
  }
  if (state.waitingForOperand) {
    const base = {
      ...state,
      display: '0.',
      waitingForOperand: false,
      justEvaluated: false,
    };
    return state.operand !== null && state.operator !== null
      ? { ...base, expression: pendingExpression(state.operand, state.operator, '0.') }
      : base;
  }
  if (state.display.includes('.')) return state;
  const display = `${state.display}.`;
  const next = { ...state, display };
  return state.operand !== null && state.operator !== null
    ? { ...next, expression: pendingExpression(state.operand, state.operator, display) }
    : next;
}

function withEntryExpression(state: CalculatorState, display: string): CalculatorState {
  const next = { ...state, display };
  return state.operand !== null && state.operator !== null && !state.waitingForOperand
    ? { ...next, expression: pendingExpression(state.operand, state.operator, display) }
    : next;
}

function toggleSign(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  if (state.waitingForOperand || state.justEvaluated) {
    // Starts a negative entry (e.g. second operand after an operator).
    const next: CalculatorState = {
      ...state,
      display: '-0',
      waitingForOperand: false,
      justEvaluated: false,
      expression: '',
    };
    return state.operand !== null && state.operator !== null && state.waitingForOperand
      ? { ...next, expression: pendingExpression(state.operand, state.operator, '-0') }
      : next;
  }
  if (state.display === '0' || state.display === '0.') return state;
  const display = state.display.startsWith('-') ? state.display.slice(1) : `-${state.display}`;
  return withEntryExpression(state, display);
}

function applyPercent(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  const current = parseDisplay(state.display);
  // Inside "a op b", % means a*b/100 (e.g. 200 + 10 % -> 20).
  if (state.operand !== null && state.operator !== null && !state.waitingForOperand) {
    const percentValue = formatNumber((state.operand * current) / 100);
    return withEntryExpression({ ...state, justEvaluated: false }, percentValue);
  }
  const percentDisplay = formatNumber(current / 100);
  if (state.operand !== null && state.operator !== null) {
    return {
      ...state,
      display: percentDisplay,
      waitingForOperand: false,
      justEvaluated: false,
      expression: pendingExpression(state.operand, state.operator, percentDisplay),
    };
  }
  return {
    ...state,
    display: percentDisplay,
    waitingForOperand: false,
    justEvaluated: false,
  };
}

function applyOperator(state: CalculatorState, operator: Operator): CalculatorState {
  if (state.error) return state;
  const current = parseDisplay(state.display);

  // Operator replacement: "5 +" then "×" -> "5 ×".
  if (state.waitingForOperand && state.operand !== null) {
    return {
      ...state,
      operator,
      justEvaluated: false,
      expression: pendingExpression(state.operand, operator, null),
    };
  }

  // Chain: "a op b op" -> evaluate intermediate result first.
  if (state.operator !== null && state.operand !== null && !state.waitingForOperand) {
    const result = compute(state.operand, state.operator, current);
    if (!Number.isFinite(result)) {
      return {
        ...initialCalculatorState,
        error: DIVIDE_BY_ZERO_MESSAGE,
        display: DIVIDE_BY_ZERO_MESSAGE,
      };
    }
    const formatted = formatNumber(result);
    const numericResult = Number(formatted);
    return {
      ...state,
      display: formatted,
      operand: numericResult,
      operator,
      waitingForOperand: true,
      justEvaluated: false,
      lastOperator: null,
      lastOperand: null,
      expression: pendingExpression(numericResult, operator, null),
    };
  }

  return {
    ...state,
    operand: current,
    operator,
    waitingForOperand: true,
    justEvaluated: false,
    expression: pendingExpression(current, operator, null),
  };
}

function applyEquals(state: CalculatorState): CalculatorState {
  if (state.error) return state;

  // Normal: "a op b =".
  if (state.operator !== null && state.operand !== null && !state.waitingForOperand) {
    const current = parseDisplay(state.display);
    const result = compute(state.operand, state.operator, current);
    if (!Number.isFinite(result)) {
      return {
        ...initialCalculatorState,
        error: DIVIDE_BY_ZERO_MESSAGE,
        display: DIVIDE_BY_ZERO_MESSAGE,
      };
    }
    const formatted = formatNumber(result);
    return {
      ...state,
      display: formatted,
      operand: null,
      operator: null,
      waitingForOperand: true,
      lastOperator: state.operator,
      lastOperand: current,
      justEvaluated: true,
      expression: `${formatNumber(state.operand)} ${state.operator} ${formatNumber(current)} =`,
    };
  }

  // Repeat: "a op b = = =" re-applies last op to the running result.
  if (state.lastOperator !== null && state.lastOperand !== null) {
    const current = parseDisplay(state.display);
    const result = compute(current, state.lastOperator, state.lastOperand);
    if (!Number.isFinite(result)) {
      return {
        ...initialCalculatorState,
        error: DIVIDE_BY_ZERO_MESSAGE,
        display: DIVIDE_BY_ZERO_MESSAGE,
      };
    }
    const formatted = formatNumber(result);
    return {
      ...state,
      display: formatted,
      waitingForOperand: true,
      justEvaluated: true,
      expression: `${formatNumber(current)} ${state.lastOperator} ${formatNumber(state.lastOperand)} =`,
    };
  }

  return state;
}

function applyDelete(state: CalculatorState): CalculatorState {
  if (state.error) return { ...initialCalculatorState };
  if (state.waitingForOperand || state.justEvaluated) {
    // After '=' backspace edits the result; after an operator it is a no-op.
    if (state.justEvaluated) {
      const next = state.display.slice(0, -1);
      if (next === '' || next === '-' || next === '-0') {
        return {
          ...state,
          display: '0',
          justEvaluated: false,
          waitingForOperand: false,
          expression: '',
        };
      }
      return {
        ...state,
        display: next,
        justEvaluated: false,
        waitingForOperand: false,
        expression: '',
      };
    }
    return state;
  }
  const next = state.display.slice(0, -1);
  let display = next;
  if (next === '' || next === '-' || next === '-0') display = '0';
  else if (next === '-.') display = '-0.';
  return withEntryExpression(state, display);
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'digit':
      return inputDigit(state, action.digit);
    case 'dot':
      return inputDot(state);
    case 'toggleSign':
      return toggleSign(state);
    case 'percent':
      return applyPercent(state);
    case 'operator':
      return applyOperator(state, action.operator);
    case 'equals':
      return applyEquals(state);
    case 'clear':
      return { ...initialCalculatorState };
    case 'delete':
      return applyDelete(state);
  }
}

/** Expression line shown above the result, e.g. "25 + 15 =". */
export function getExpression(state: CalculatorState): string {
  if (state.error) return '';
  return state.expression;
}
