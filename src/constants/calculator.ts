import type { Operator } from '../engine/calculator';

export type KeyKind = 'digit' | 'utility' | 'operator' | 'equals';

export interface KeyDef {
  label: string;
  kind: KeyKind;
  accessibilityLabel: string;
}

export const OPERATOR_LABELS: Record<Operator, string> = {
  '+': '+',
  '−': '−',
  '×': '×',
  '÷': '÷',
};

export const KEYPAD: KeyDef[][] = [
  [
    { label: 'AC', kind: 'utility', accessibilityLabel: 'Clear' },
    { label: '±', kind: 'utility', accessibilityLabel: 'Plus minus, toggle sign' },
    { label: '%', kind: 'utility', accessibilityLabel: 'Percent' },
    { label: '÷', kind: 'operator', accessibilityLabel: 'Divide' },
  ],
  [
    { label: '7', kind: 'digit', accessibilityLabel: '7' },
    { label: '8', kind: 'digit', accessibilityLabel: '8' },
    { label: '9', kind: 'digit', accessibilityLabel: '9' },
    { label: '×', kind: 'operator', accessibilityLabel: 'Multiply' },
  ],
  [
    { label: '4', kind: 'digit', accessibilityLabel: '4' },
    { label: '5', kind: 'digit', accessibilityLabel: '5' },
    { label: '6', kind: 'digit', accessibilityLabel: '6' },
    { label: '−', kind: 'operator', accessibilityLabel: 'Minus' },
  ],
  [
    { label: '1', kind: 'digit', accessibilityLabel: '1' },
    { label: '2', kind: 'digit', accessibilityLabel: '2' },
    { label: '3', kind: 'digit', accessibilityLabel: '3' },
    { label: '+', kind: 'operator', accessibilityLabel: 'Plus' },
  ],
  [
    { label: '0', kind: 'digit', accessibilityLabel: '0' },
    { label: '.', kind: 'digit', accessibilityLabel: 'Decimal point' },
    { label: '⌫', kind: 'utility', accessibilityLabel: 'Delete' },
    { label: '=', kind: 'equals', accessibilityLabel: 'Equals' },
  ],
];
