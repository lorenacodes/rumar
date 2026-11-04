import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  children: ReactNode;
  footer?: ReactNode;
  edges?: Edge[];
  /** Conteúdo de largura total acima do conteúdo principal (ex.: herói com gradiente). */
  hero?: ReactNode;
  /** Telas dentro das abas: na web a barra de abas fica no topo e precisa de espaço. */
  inTabs?: boolean;
};

/** Tela padrão: rolagem, largura máxima, área segura e rodapé fixo opcional. */
export function Screen({ children, footer, hero, inTabs, edges = ['top', 'left', 'right'] }: Props) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={hero ? edges.filter((e) => e !== 'top') : edges} style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {hero}
        <View style={[styles.content, inTabs && Platform.OS === 'web' && styles.webTabs]}>{children}</View>
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
  scroll: { flexGrow: 1, alignItems: 'center', paddingBottom: Spacing.xxxl },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  webTabs: { paddingTop: 88 },
  footer: { borderTopWidth: 1, padding: Spacing.lg, alignItems: 'center' },
  footerInner: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.sm },
});
