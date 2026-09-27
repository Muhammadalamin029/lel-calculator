import { Pressable, StyleSheet, Text } from 'react-native';

import type { KeyKind } from '../constants/calculator';
import type { Theme } from '../theme/colors';

interface Props {
  label: string;
  kind: KeyKind;
  active?: boolean;
  accessibilityLabel: string;
  theme: Theme;
  onPress: () => void;
}

export function CalcButton({ label, kind, active, accessibilityLabel, theme, onPress }: Props) {
  const backgroundColor =
    kind === 'digit'
      ? theme.digitKey
      : kind === 'utility'
        ? theme.utilityKey
        : kind === 'equals'
          ? theme.equalsKey
          : active
            ? theme.operatorKeyActive
            : theme.operatorKey;
  const color =
    kind === 'digit'
      ? theme.digitKeyText
      : kind === 'utility'
        ? theme.utilityKeyText
        : kind === 'equals'
          ? theme.equalsKeyText
          : active
            ? '#000000'
            : theme.operatorKeyText;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: pressed ? 0.72 : 1 },
      ]}>
      <Text style={[styles.label, { color }]} maxFontSizeMultiplier={1.5}>
        {label}
      </Text>
      {active && kind === 'operator' ? (
        <Text style={styles.activeDot} accessibilityElementsHidden>
          •
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 30,
    fontWeight: '500',
  },
  activeDot: {
    position: 'absolute',
    bottom: 6,
    fontSize: 12,
    color: '#000000',
  },
});
