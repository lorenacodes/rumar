import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatReaisInput, parseReais } from '@/lib/format';

type Props = {
  label: string;
  /** Centavos. */
  valueMinor: number;
  onChange: (minor: number) => void;
  hint?: string;
};

/** Campo de valor em reais. Aceita apenas dígitos e formata enquanto digita. */
export function MoneyInput({ label, valueMinor, onChange, hint }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.root}>
      <AppText variant="bodyStrong" nativeID={`label-${label}`}>
        {label}
      </AppText>
      <View style={[styles.field, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <AppText variant="heading" color="textSecondary">
          R$
        </AppText>
        <TextInput
          accessibilityLabel={label}
          accessibilityLabelledBy={`label-${label}`}
          keyboardType="number-pad"
          inputMode="numeric"
          value={formatReaisInput(valueMinor)}
          onChangeText={(text) => onChange(parseReais(text))}
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
          maxLength={9}
        />
      </View>
      {hint ? (
        <AppText variant="caption" color="textSecondary">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.xs },
  field: {
    minHeight: MinTouchTarget + 8,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  input: { flex: 1, fontSize: 22, fontWeight: '600', paddingVertical: Spacing.sm },
});
