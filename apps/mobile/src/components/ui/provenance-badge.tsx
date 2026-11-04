import { PROVENANCE_LABEL_PT, type Provenance } from '@rumar/core';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STYLE: Record<Provenance, { fg: ThemeColor; bg: ThemeColor; icon: string }> = {
  quoted: { fg: 'success', bg: 'successSoft', icon: '●' },
  reference: { fg: 'primary', bg: 'primarySoft', icon: '◆' },
  estimate: { fg: 'textSecondary', bg: 'surfaceMuted', icon: '≈' },
  simulated: { fg: 'warning', bg: 'warningSoft', icon: '⚠' },
};

type Props = { provenance: Provenance; asOf?: string };

/** Selo que mostra de onde vem um número. Sempre ícone + texto (não só cor). */
export function ProvenanceBadge({ provenance, asOf }: Props) {
  const theme = useTheme();
  const s = STYLE[provenance];
  const label = PROVENANCE_LABEL_PT[provenance] + (asOf && provenance === 'reference' ? ` de ${formatDate(asOf)}` : '');
  return (
    <View
      accessible
      accessibilityLabel={`Procedência do valor: ${label}`}
      style={[styles.badge, { backgroundColor: theme[s.bg] }]}>
      <AppText variant="caption" color={s.fg} style={styles.text}>
        {s.icon} {label}
      </AppText>
    </View>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
  },
  text: { fontWeight: '600' },
});
