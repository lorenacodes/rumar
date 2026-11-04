import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { FontFamily, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatReaisInput, parseReais } from '@/lib/format';

type Props = {
  label: string;
  /** Centavos. */
  valueMinor: number;
  onChange: (minor: number) => void;
  hint?: string;
  suffix?: string;
};

/** Campo de valor em reais, grande e direto, com linha de base. */
export function MoneyInput({ label, valueMinor, onChange, hint, suffix }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.root}>
      <AppText variant="eyebrow" color="textSecondary">
        {label}
      </AppText>
      <View style={[styles.field, { borderBottomColor: theme.strongBorder }]}>
        <AppText style={[styles.currency, { color: theme.textSecondary }]}>R$</AppText>
        <TextInput
          accessibilityLabel={label}
          keyboardType="number-pad"
          inputMode="numeric"
          value={formatReaisInput(valueMinor)}
          onChangeText={(text) => onChange(parseReais(text))}
          placeholder="0"
          placeholderTextColor={theme.border}
          style={[styles.input, { color: theme.text }]}
          maxLength={9}
        />
        {suffix ? <AppText style={[styles.currency, { color: theme.textSecondary }]}>{suffix}</AppText> : null}
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
  field: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm, borderBottomWidth: 2, paddingBottom: Spacing.xs },
  currency: { fontFamily: FontFamily.display, fontSize: 18 },
  input: {
    flex: 1,
    fontFamily: FontFamily.display,
    fontSize: 40,
    letterSpacing: -1.5,
    paddingVertical: Spacing.xs,
    minHeight: 56,
  },
});
