/** LEL Store brand palette — black / white / subtle gold. No gradients. */

export const GOLD = '#C9A227';
export const GOLD_DARK = '#D4AF37';

export interface Theme {
  mode: 'light' | 'dark';
  background: string;
  surface: string;
  displayText: string;
  expressionText: string;
  brandSubtle: string;
  digitKey: string;
  digitKeyText: string;
  utilityKey: string;
  utilityKeyText: string;
  operatorKey: string;
  operatorKeyText: string;
  operatorKeyActive: string;
  equalsKey: string;
  equalsKeyText: string;
  statusBarStyle: 'dark' | 'light';
}

export const lightTheme: Theme = {
  mode: 'light',
  background: '#FFFFFF',
  surface: '#F4F4F4',
  displayText: '#000000',
  expressionText: '#5C5C5C',
  brandSubtle: '#8A8A8A',
  digitKey: '#F0F0F0',
  digitKeyText: '#000000',
  utilityKey: '#E2E2E2',
  utilityKeyText: '#000000',
  operatorKey: '#111111',
  operatorKeyText: '#FFFFFF',
  operatorKeyActive: GOLD,
  equalsKey: GOLD,
  equalsKeyText: '#000000',
  statusBarStyle: 'dark',
};

export const darkTheme: Theme = {
  mode: 'dark',
  background: '#000000',
  surface: '#101010',
  displayText: '#FFFFFF',
  expressionText: '#A8A8A8',
  brandSubtle: '#8A8A8A',
  digitKey: '#1C1C1E',
  digitKeyText: '#FFFFFF',
  utilityKey: '#2C2C2E',
  utilityKeyText: '#FFFFFF',
  operatorKey: '#F5F5F5',
  operatorKeyText: '#000000',
  operatorKeyActive: GOLD_DARK,
  equalsKey: GOLD_DARK,
  equalsKeyText: '#000000',
  statusBarStyle: 'light',
};
