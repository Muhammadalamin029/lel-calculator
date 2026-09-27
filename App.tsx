import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { CalculatorDisplay } from './src/components/CalculatorDisplay';
import { Keypad } from './src/components/Keypad';
import type { KeyDef } from './src/constants/calculator';
import type { Operator } from './src/engine/calculator';
import { useCalculator } from './src/state/useCalculator';
import { darkTheme, lightTheme } from './src/theme/colors';

void SplashScreen.preventAutoHideAsync();

const OPERATORS = new Set(['+', '−', '×', '÷']);

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const calc = useCalculator();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.background).catch(() => undefined);
  }, [theme.background]);

  const handleKey = useCallback(
    (key: KeyDef) => {
      const { label } = key;
      if (/^[0-9]$/.test(label)) {
        calc.inputDigit(label);
      } else if (label === '.') {
        calc.inputDot();
      } else if (label === 'AC') {
        calc.clear();
      } else if (label === '±') {
        calc.toggleSign();
      } else if (label === '%') {
        calc.percent();
      } else if (label === '⌫') {
        calc.deleteLast();
      } else if (label === '=') {
        calc.equals();
      } else if (OPERATORS.has(label)) {
        calc.setOperator(label as Operator);
      }
    },
    [calc],
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
        <StatusBar style={theme.statusBarStyle === 'dark' ? 'dark' : 'light'} />
        <View style={styles.screen}>
          <CalculatorDisplay
            expression={calc.expression}
            display={calc.display}
            isError={calc.error !== null}
            theme={theme}
          />
          <Keypad theme={theme} activeOperator={calc.activeOperator} onKey={handleKey} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
});
