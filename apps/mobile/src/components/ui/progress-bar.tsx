import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = { label: string; ratio: number; color?: ThemeColor; detail?: string };

export function ProgressBar({ label, ratio, color = 'primary', detail }: Props) {
  const theme = useTheme();
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  return (
    <View
      style={styles.root}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}>
      <View style={styles.row}>
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText variant="bodyStrong" color={color}>
          {pct}%
        </AppText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.surfaceMuted }]}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: theme[color] }]} />
      </View>
      {detail ? (
        <AppText variant="caption" color="textSecondary">
          {detail}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 10, borderRadius: Radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Radius.pill },
});
