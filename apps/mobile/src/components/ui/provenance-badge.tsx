import { PROVENANCE_LABEL_PT, type Provenance } from '@rumar/core';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STYLE: Record<Provenance, { fg: ThemeColor; border: ThemeColor; icon: string }> = {
  quoted: { fg: 'success', border: 'success', icon: '●' },
  reference: { fg: 'text', border: 'strongBorder', icon: '◆' },
  estimate: { fg: 'textSecondary', border: 'border', icon: '≈' },
  simulated: { fg: 'warning', border: 'warning', icon: '⚠' },
};

type Props = { provenance: Provenance; asOf?: string };

/** Etiqueta que mostra de onde vem um número. Sempre ícone + texto (não só cor). */
export function ProvenanceBadge({ provenance, asOf }: Props) {
  const theme = useTheme();
  const s = STYLE[provenance];
  const label = PROVENANCE_LABEL_PT[provenance] + (asOf && provenance === 'reference' ? ` · ${formatDate(asOf)}` : '');
  return (
    <View
      accessible
      accessibilityLabel={`Procedência do valor: ${label}`}
      style={[styles.badge, { borderColor: theme[s.border] }]}>
      <AppText variant="eyebrow" color={s.fg} style={styles.text}>
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
  badge: { alignSelf: 'flex-start', borderWidth: 1, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  text: { fontSize: 10, lineHeight: 14 },
});
