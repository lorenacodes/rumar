import { formatYearMonth, type DestinationViability } from '@rumar/core';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { MinTouchTarget, Palette, Spacing } from '@/constants/theme';
import { formatBrlShort } from '@/lib/format';

const SHORT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

/**
 * Painel de partidas: preto com amarelo de sinalização, como no aeroporto.
 * Cada linha é um destino possível e o mês a partir do qual dá para ir.
 */
export function DepartureBoard({ results, originIata }: { results: readonly DestinationViability[]; originIata: string }) {
  return (
    <View style={styles.board} accessibilityLabel="Painel de partidas possíveis">
      <View style={styles.header}>
        <AppText variant="board" style={styles.headerText}>
          Partidas · {originIata}
        </AppText>
        <AppText variant="board" style={styles.headerText}>
          ✈
        </AppText>
      </View>
      <View style={[styles.row, styles.columns]}>
        <AppText variant="eyebrow" style={[styles.col1, styles.dim]}>
          Destino
        </AppText>
        <AppText variant="eyebrow" style={[styles.col2, styles.dim]} numberOfLines={1}>
          Mês
        </AppText>
        <AppText variant="eyebrow" style={[styles.col3, styles.dim]}>
          Total
        </AppText>
      </View>
      {results.map((r) => {
        const cell = r.firstViable ?? r.cheapest;
        const viable = !!r.firstViable;
        const when = cell ? `${SHORT[cell.month.month - 1]} ${String(cell.month.year).slice(2)}` : '— —';
        const status = viable ? 'Dá pra ir' : cell ? 'Guardar +' : 'Sem dados';
        return (
          <Pressable
            key={r.destination.id}
            accessibilityRole="button"
            accessibilityLabel={`${r.destination.city}: ${status}${cell ? `, ${formatYearMonth(cell.month)}` : ''}${
              cell?.cost ? `, ${formatBrlShort(cell.cost.total)}` : ''
            }`}
            onPress={() => router.push({ pathname: '/destino/[id]', params: { id: r.destination.id } })}
            style={({ pressed }) => [styles.row, styles.line, pressed && styles.pressed]}>
            <View style={styles.col1}>
              <AppText variant="board" style={styles.signal} numberOfLines={1}>
                {r.destination.city}
              </AppText>
              <AppText variant="eyebrow" style={viable ? styles.ok : styles.dim}>
                {viable ? '● ' : '○ '}
                {status}
              </AppText>
            </View>
            <AppText variant="board" style={[styles.col2, styles.signal]}>
              {when}
            </AppText>
            <AppText variant="board" style={[styles.col3, styles.signal]} numberOfLines={1}>
              {cell?.cost ? formatBrlShort(cell.cost.total).replace('R$', '').trim() : '—'}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { backgroundColor: Palette.board, paddingVertical: Spacing.sm },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  headerText: { color: Palette.paper },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  columns: { paddingVertical: Spacing.xs },
  line: { minHeight: MinTouchTarget + 12, borderTopWidth: 1, borderTopColor: Palette.boardLine, paddingVertical: Spacing.sm },
  pressed: { backgroundColor: '#1B1D15' },
  col1: { flex: 1, gap: 2 },
  col2: { width: 70 },
  col3: { width: 72, textAlign: 'right' },
  signal: { color: Palette.signal },
  dim: { color: '#8A8D7C' },
  ok: { color: Palette.lime },
});
