import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  children: ReactNode;
  footer?: ReactNode;
  edges?: Edge[];
};

/** Tela padrão: rolagem, largura máxima, área segura e rodapé fixo opcional. */
export function Screen({ children, footer, edges = ['top', 'left', 'right'] }: Props) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>{children}</View>
      </ScrollView>
      {footer ? (
        <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
          <View style={styles.footerInner}>{footer}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  content: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.lg, paddingTop: Spacing.lg },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, padding: Spacing.lg, alignItems: 'center' },
  footerInner: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.sm },
});
