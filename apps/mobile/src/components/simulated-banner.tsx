import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { catalog } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';

/** Aviso obrigatório enquanto o app usar dados simulados. */
export function SimulatedBanner() {
  const theme = useTheme();
  if (!catalog.isSimulated) return null;
  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: theme.warningSoft, borderColor: theme.warning }]}>
      <AppText variant="bodyStrong" color="warning">
        ⚠ Versão de demonstração
      </AppText>
      <AppText variant="caption" color="text">
        Destinos, preços e regras desta versão são simulados para testar o app. Não use para planejar uma viagem real.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.xs },
});
