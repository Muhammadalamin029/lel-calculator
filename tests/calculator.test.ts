import {
  calculatorReducer,
  DIVIDE_BY_ZERO_MESSAGE,
  formatNumber,
  getExpression,
  initialCalculatorState,
  type CalculatorAction,
  type CalculatorState,
  type Operator,
} from '../src/engine/calculator';

function run(actions: CalculatorAction[], from: CalculatorState = initialCalculatorState) {
  return actions.reduce(calculatorReducer, from);
}

function typeKeys(keys: string[]): CalculatorAction[] {
  return keys.map((key) => {
    if (/^[0-9]$/.test(key)) return { type: 'digit', digit: key } as CalculatorAction;
    if (key === '.') return { type: 'dot' } as CalculatorAction;
    if (key === '=') return { type: 'equals' } as CalculatorAction;
    if (key === 'AC') return { type: 'clear' } as CalculatorAction;
    if (key === 'back') return { type: 'delete' } as CalculatorAction;
    if (key === '+/-') return { type: 'toggleSign' } as CalculatorAction;
    if (key === '%') return { type: 'percent' } as CalculatorAction;
    return { type: 'operator', operator: key as Operator } as CalculatorAction;
  });
}

function calc(keys: string[]) {
  return run(typeKeys(keys));
}

describe('basic arithmetic', () => {
  it.each([
    [['2', '5', '+', '1', '5', '='], '40'],
    [['1', '0', '0', '−', '2', '5', '='], '75'],
    [['1', '2', '×', '8', '='], '96'],
    [['1', '4', '4', '÷', '1', '2', '='], '12'],
    [['5', '.', '5', '+', '2', '.', '2', '5', '='], '7.75'],
    [['1', '0', '+', '5', '='], '15'],
  ])('%p = %p', (keys, expected) => {
    expect(calc(keys as string[]).display).toBe(expected);
  });

  it('shows the expression line', () => {
    expect(getExpression(calc(['2', '5', '+', '1', '5', '=']))).toBe('25 + 15 =');
  });

  it('never exposes NaN or Infinity', () => {
    const states = [
      calc(['5', '÷', '0', '=']),
      calc(['0', '÷', '0', '=']),
      calc(['9', '9', '9', '9', '9', '9', '9', '9', '9', '×', '9', '9', '9', '9', '9', '9', '9', '9', '9', '=']),
    ];
    for (const s of states) {
      expect(s.display).not.toMatch(/NaN|Infinity/i);
    }
  });
});

describe('decimals and negatives', () => {
  it('handles float artefacts (0.1 + 0.2 = 0.3)', () => {
    expect(calc(['0', '.', '1', '+', '0', '.', '2', '=']).display).toBe('0.3');
  });

  it('ignores a second decimal point', () => {
    expect(calc(['1', '.', '.', '5']).display).toBe('1.5');
  });

  it('toggles sign', () => {
    expect(calc(['5', '+/-']).display).toBe('-5');
    expect(calc(['5', '+/-', '+/-']).display).toBe('5');
  });

  it('subtracts to a negative result', () => {
    expect(calc(['5', '−', '9', '=']).display).toBe('-4');
  });

  it('starts entries with a decimal point', () => {
    expect(calc(['.', '5', '+', '.', '5', '=']).display).toBe('1');
  });
});

describe('percentages', () => {
  it('divides a lone entry by 100', () => {
    expect(calc(['5', '0', '%']).display).toBe('0.5');
  });

  it('computes a+b% as a percentage of a', () => {
    expect(calc(['2', '0', '0', '+', '1', '0', '%', '=']).display).toBe('220');
  });
});

describe('division by zero', () => {
  it('shows an error instead of crashing', () => {
    const s = calc(['5', '÷', '0', '=']);
    expect(s.error).toBe(DIVIDE_BY_ZERO_MESSAGE);
    expect(s.display).toBe(DIVIDE_BY_ZERO_MESSAGE);
  });

  it('recovers on the next digit', () => {
    const s = calc(['5', '÷', '0', '=', '3']);
    expect(s.error).toBeNull();
    expect(s.display).toBe('3');
  });

  it('recovers on clear', () => {
    expect(calc(['5', '÷', '0', '=', 'AC']).display).toBe('0');
  });

  it('handles 0 ÷ 0 as an error', () => {
    expect(calc(['0', '÷', '0', '=']).error).not.toBeNull();
  });
});

describe('clear and delete', () => {
  it('AC resets everything', () => {
    const s = calc(['9', '+', '9', '=', 'AC']);
    expect(s).toEqual(initialCalculatorState);
  });

  it('backspace removes digits', () => {
    expect(calc(['1', '2', '3', 'back']).display).toBe('12');
    expect(calc(['1', 'back']).display).toBe('0');
    // Deleting the last digit of a negative entry resets to zero.
    expect(calc(['5', '+/-', 'back']).display).toBe('0');
  });
});

describe('operators', () => {
  it('replaces a pending operator', () => {
    const s = calc(['5', '+', '×', '3', '=']);
    expect(s.display).toBe('15');
    expect(getExpression(s)).toBe('5 × 3 =');
  });

  it('chains intermediate results', () => {
    // 2 + 3 = 5, × 4 = 20 entered as 2 + 3 × 4 =
    expect(calc(['2', '+', '3', '×', '4', '=']).display).toBe('20');
  });

  it('continues from a previous result', () => {
    expect(calc(['1', '0', '+', '5', '=', '+', '5', '=']).display).toBe('20');
  });

  it('ignores equals with no operation', () => {
    expect(calc(['7', '=']).display).toBe('7');
  });
});

describe('repeated calculations', () => {
  it('repeats the last operation on =', () => {
    const keys = ['3', '+', '2', '='];
    expect(calc(keys).display).toBe('5');
    expect(calc([...keys, '=']).display).toBe('7');
    expect(calc([...keys, '=', '=']).display).toBe('9');
  });
});

describe('large values and invalid input', () => {
  it('computes large products without trailing-zero noise', () => {
    expect(calc(['1', '2', '3', '4', '5', '6', '×', '1', '0', '0', '=']).display).toBe(
      '12345600',
    );
  });

  it('uses exponential notation for huge results', () => {
    const s = calc([
      '9', '9', '9', '9', '9', '9', '9', '9', '9',
      '×',
      '9', '9', '9', '9', '9', '9', '9', '9', '9',
      '=',
    ]);
    expect(s.display).toContain('e');
  });

  it('caps entry length', () => {
    const s = calc(Array.from({ length: 20 }, () => '9'));
    expect(s.display.replace(/[-.]/g, '').length).toBeLessThanOrEqual(12);
  });

  it('leading zeros collapse', () => {
    expect(calc(['0', '0', '5']).display).toBe('5');
  });
});

describe('formatNumber', () => {
  it('strips unnecessary trailing zeros', () => {
    expect(formatNumber(15.0)).toBe('15');
    expect(formatNumber(7.75)).toBe('7.75');
    expect(formatNumber(0.30000000000000004)).toBe('0.3');
  });
});
