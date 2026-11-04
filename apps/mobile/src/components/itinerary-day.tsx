import { SLOT_LABEL_PT, type ItineraryDay } from '@rumar/core';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { ProvenanceBadge } from '@/components/ui/provenance-badge';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const KIND_LABEL: Record<ItineraryDay['kind'], string> = {
  arrival: 'chegada',
  full: 'dia inteiro',
  departure: 'partida',
};

export function ItineraryDayView({ day, compact }: { day: ItineraryDay; compact?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.day, { borderColor: theme.strongBorder }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <AppText variant="board" style={{ color: theme.signal }}>
          Dia {String(day.day).padStart(2, '0')}
        </AppText>
        <AppText variant="eyebrow" style={{ color: theme.onPrimary }}>
          {KIND_LABEL[day.kind]}
          {day.area ? ` · ${day.area}` : ''}
        </AppText>
      </View>
      {day.items.map((item, i) => (
        <View key={`${item.slot}-${i}`} style={[styles.item, i > 0 && { borderTopColor: theme.border, borderTopWidth: 1 }]}>
          <AppText variant="eyebrow" color="accent" style={styles.slot}>
            {SLOT_LABEL_PT[item.slot]}
          </AppText>
          <View style={styles.flex}>
            {item.place ? (
              <>
                <AppText variant="heading">{item.place.name}</AppText>
                {!compact ? <AppText color="textSecondary">{item.place.description}</AppText> : null}
                <View style={styles.reasons}>
                  {item.reasons.map((r) => (
                    <View key={r} style={[styles.reason, { backgroundColor: theme.surfaceMuted }]}>
                      <AppText variant="caption">{r}</AppText>
                    </View>
                  ))}
                </View>
                {!compact ? <ProvenanceBadge provenance={item.place.provenance} /> : null}
              </>
            ) : (
              <AppText color="textSecondary">{item.reasons[0]}</AppText>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  day: { borderWidth: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  item: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.md },
  slot: { width: 76, marginTop: 4 },
  flex: { flex: 1, gap: Spacing.xs },
  reasons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  reason: { paddingHorizontal: Spacing.sm, paddingVertical: 2 },
});
