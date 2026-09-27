import { StyleSheet, View } from 'react-native';

import { KEYPAD, type KeyDef } from '../constants/calculator';
import type { Operator } from '../engine/calculator';
import type { Theme } from '../theme/colors';
import { CalcButton } from './CalcButton';

interface Props {
  theme: Theme;
  activeOperator: Operator | null;
  onKey: (key: KeyDef) => void;
}

export function Keypad({ theme, activeOperator, onKey }: Props) {
  return (
    <View style={styles.container}>
      {KEYPAD.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key) => (
            <CalcButton
              key={key.label}
              label={key.label}
              kind={key.kind}
              active={key.kind === 'operator' && activeOperator === key.label}
              accessibilityLabel={key.accessibilityLabel}
              theme={theme}
              onPress={() => onKey(key)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
