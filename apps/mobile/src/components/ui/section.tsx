import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  /** Mantido por compatibilidade; não é mais exibido (visual menos técnico). */
  index?: string;
  eyebrow: string;
  title?: string;
  children?: ReactNode;
};

/** Cabeçalho de seção: linha fina, rótulo laranja e título. */
export function Section({ eyebrow, title, children }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.root}>
      <View style={[styles.rule, { backgroundColor: theme.strongBorder }]} />
      <AppText variant="eyebrow" color="accent">
        {eyebrow.charAt(0).toUpperCase() + eyebrow.slice(1)}
      </AppText>
      {title ? <AppText variant="title">{title}</AppText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.sm, marginTop: Spacing.sm },
  rule: { height: 1, marginBottom: Spacing.xs },
});
