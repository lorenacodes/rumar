import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  ratio: number;
  detail?: string;
  /** Cor dos segmentos preenchidos. */
  fill?: string;
  /** Cor dos segmentos vazios. */
  empty?: string;
  textColor?: string;
  mutedColor?: string;
};

const SEGMENTS = 20;

/** Barra segmentada, como um indicador de painel. */
export function ProgressBar({ label, ratio, detail, fill, empty, textColor, mutedColor }: Props) {
  const theme = useTheme();
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  const filled = Math.round((pct / 100) * SEGMENTS);
  return (
    <View
      style={styles.root}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}>
      <View style={styles.row}>
        <AppText variant="eyebrow" style={{ color: textColor ?? theme.text }}>
          {label}
        </AppText>
        <AppText variant="board" style={{ color: textColor ?? theme.text }}>
          {pct}%
        </AppText>
      </View>
      <View style={styles.track}>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <View
            key={i}
            style={[styles.segment, { backgroundColor: i < filled ? fill ?? theme.accent : empty ?? theme.surfaceMuted }]}
          />
        ))}
      </View>
      {detail ? (
        <AppText variant="caption" style={{ color: mutedColor ?? theme.textSecondary }}>
          {detail}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { flexDirection: 'row', gap: 2, height: 10 },
  segment: { flex: 1 },
});
