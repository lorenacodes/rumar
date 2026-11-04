import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Spacing } from '@/constants/theme';
import { catalog } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';

/** Aviso obrigatório enquanto o app usar dados simulados. */
export function SimulatedBanner() {
  const theme = useTheme();
  if (!catalog.isSimulated) return null;
  return (
    <View accessibilityRole="alert" style={[styles.banner, { borderColor: theme.warning, backgroundColor: theme.warningSoft }]}>
      <AppText variant="eyebrow" color="warning">
        ⚠ Demonstração · dados simulados
      </AppText>
      <AppText variant="caption">
        Destinos, preços e regras desta versão são fictícios, para testar o app. Não use para planejar uma viagem real.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderWidth: 1, borderLeftWidth: 4, padding: Spacing.md, gap: Spacing.xs },
});
