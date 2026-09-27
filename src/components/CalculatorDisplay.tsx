import { StyleSheet, Text, View } from 'react-native';

import type { Theme } from '../theme/colors';

interface Props {
  expression: string;
  display: string;
  isError: boolean;
  theme: Theme;
}

export function CalculatorDisplay({ expression, display, isError, theme }: Props) {
  return (
    <View style={styles.container} accessible accessibilityLabel={`Result ${display}`}>
      <Text
        style={[styles.brand, { color: theme.brandSubtle }]}
        maxFontSizeMultiplier={1.5}
        accessibilityElementsHidden>
        LEL STORE
      </Text>
      <Text
        style={[styles.expression, { color: theme.expressionText }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
        maxFontSizeMultiplier={1.5}>
        {expression || ' '}
      </Text>
      <Text
        style={[styles.result, { color: theme.displayText }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.4}
        maxFontSizeMultiplier={2}
        accessibilityRole="text"
        accessibilityLiveRegion="polite">
        {display}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 12,
    minHeight: 140,
  },
  brand: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 8,
  },
  expression: {
    fontSize: 24,
    fontWeight: '400',
    minHeight: 32,
    textAlign: 'right',
  },
  result: {
    fontSize: 72,
    fontWeight: '300',
    textAlign: 'right',
  },
});
