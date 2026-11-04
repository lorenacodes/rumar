import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = { index?: string; eyebrow: string; title?: string; children?: ReactNode };

/** Cabeçalho de seção no estilo da Buovai: linha fina + "//01 · rótulo". */
export function Section({ index, eyebrow, title, children }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.root}>
      <View style={[styles.rule, { backgroundColor: theme.strongBorder }]} />
      <AppText variant="eyebrow" color="accent">
        {'//'}
        {index ? `${index} · ` : ''}
        {eyebrow}
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
