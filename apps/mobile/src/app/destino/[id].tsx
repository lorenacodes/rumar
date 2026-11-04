import {
  COST_CATEGORY_LABEL_PT,
  formatYearMonthPt,
  requiredMonthly,
  type ViabilityCell,
} from '@rumar/core';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SimulatedBanner } from '@/components/simulated-banner';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ui/provenance-badge';
import { Screen } from '@/components/ui/screen';
import { VIABILITY_UI } from '@/components/viability-label';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatBrlShort } from '@/lib/format';
import { computeDiscovery, currentYearMonth, savedMinor, todayIso } from '@/state/selectors';
import { useStore } from '@/state/store';

const SHORT_MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function pickInitial(cells: readonly ViabilityCell[], preferred: { year: number; month: number } | null): number {
  if (preferred) {
    const i = cells.findIndex((c) => c.month.year === preferred.year && c.month.month === preferred.month);
    if (i >= 0) return i;
  }
  const viable = cells.findIndex((c) => c.status === 'viable');
  if (viable >= 0) return viable;
  const withCost = cells.findIndex((c) => c.cost !== null);
  return Math.max(0, withCost);
}

export default function DestinoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { state, dispatch } = useStore();
  const { profile } = state;
  const saved = savedMinor(state);
  const asOf = currentYearMonth();

  const result = useMemo(
    () => (profile ? computeDiscovery(profile, saved, asOf).find((r) => r.destination.id === id) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, saved, id, asOf.year, asOf.month],
  );
  const [selected, setSelected] = useState<number | null>(null);

  if (!profile || !result) {
    return (
      <Screen>
        <AppText variant="title">Destino não encontrado</AppText>
        <Button label="Voltar para Descobrir" onPress={() => router.replace('/descobrir')} />
      </Screen>
    );
  }

  const index = selected ?? pickInitial(result.cells, profile.preferredMonth);
  const cell = result.cells[index];
  const { destination } = result;
  const canCreateGoal = !!cell?.cost && (cell.status === 'viable' || cell.status === 'tight' || cell.status === 'not_yet');

  const createGoal = () => {
    if (!cell?.cost) return;
    dispatch({
      type: 'setGoal',
      goal: { destinationId: destination.id, departureMonth: cell.month, targetMinor: cell.cost.total.minor, createdAt: todayIso() },
    });
    router.replace('/');
  };

  const footer = canCreateGoal && cell ? (
    <Button label={`Criar minha meta: ${formatYearMonthPt(cell.month)}`} onPress={createGoal} />
  ) : null;

  return (
    <Screen footer={footer} edges={['left', 'right']}>
      <Stack.Screen options={{ title: destination.city }} />
      <View>
        <AppText variant="title">{destination.city}</AppText>
        <AppText color="textSecondary">{destination.country}</AppText>
      </View>
      <SimulatedBanner />

      <AppText variant="heading">Quando dá para ir</AppText>
      <View style={styles.grid} accessibilityRole="radiogroup" accessibilityLabel="Mês da viagem">
        {result.cells.map((c, i) => {
          const ui = VIABILITY_UI[c.status];
          const isSelected = i === index;
          return (
            <Pressable
              key={`${c.month.year}-${c.month.month}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${formatYearMonthPt(c.month)}: ${ui.label}`}
              onPress={() => setSelected(i)}
              style={[
                styles.cell,
                { backgroundColor: theme[ui.bg], borderColor: isSelected ? theme.primary : 'transparent' },
              ]}>
              <AppText variant="caption" color={ui.fg} style={styles.cellMonth}>
                {SHORT_MONTHS[c.month.month - 1]}
              </AppText>
              <AppText variant="caption" color={ui.fg}>
                {ui.icon} {String(c.month.year).slice(2)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.legend}>
        {(['viable', 'tight', 'not_yet', 'too_soon'] as const).map((s) => (
          <AppText key={s} variant="caption" color={VIABILITY_UI[s].fg}>
            {VIABILITY_UI[s].icon} {VIABILITY_UI[s].label}
          </AppText>
        ))}
      </View>

      {cell ? <MonthDetail cell={cell} saved={saved} /> : null}
    </Screen>
  );
}

function MonthDetail({ cell, saved }: { cell: ViabilityCell; saved: number }) {
  const asOf = currentYearMonth();
  const month = formatYearMonthPt(cell.month);

  if (cell.status === 'no_data' || !cell.cost) {
    return (
      <Card>
        <AppText variant="heading">{month}</AppText>
        <AppText color="textSecondary">
          Ainda não temos referência de preço para este mês. Preferimos não chutar um valor.
        </AppText>
      </Card>
    );
  }

  const { cost } = cell;
  const slack = cell.slack?.minor ?? 0;
  let summary: string;
  if (cell.status === 'too_soon') {
    summary = 'Não dá tempo de providenciar os documentos obrigatórios até esse mês. Escolha um mês mais adiante.';
  } else if (slack >= 0) {
    summary = `Até lá você terá ${formatBrlShort(cell.available)}. Sobra uma folga de ${formatBrlShort(slack)}.`;
  } else {
    const needed = requiredMonthly({ minor: saved, currency: 'BRL' }, cost.total, asOf, cell.month);
    summary =
      `Até lá você terá ${formatBrlShort(cell.available)}. Faltam ${formatBrlShort(-slack)}.` +
      (needed ? ` Para ir nesse mês, guarde ${formatBrlShort(needed)} por mês.` : '');
  }

  return (
    <Card>
      <AppText variant="heading">Viagem completa em {month}</AppText>
      <AppText variant="number">{formatBrlShort(cost.total)}</AppText>
      <AppText color="textSecondary">
        {cost.perPerson.minor !== cost.total.minor ? `${formatBrlShort(cost.perPerson)} por pessoa · ` : ''}
        tudo incluído: passagem, hospedagem, comida, transporte, seguro, IOF e reserva
      </AppText>
      <ProvenanceBadge provenance={cost.provenance} />
      <AppText>{summary}</AppText>

      <View style={styles.lines}>
        {cost.lines.map((line) => (
          <View
            key={line.category}
            style={styles.line}
            accessible
            accessibilityLabel={`${COST_CATEGORY_LABEL_PT[line.category]}: ${formatBrlShort(line.amount)}. ${line.detail}`}>
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{COST_CATEGORY_LABEL_PT[line.category]}</AppText>
              <AppText variant="caption" color="textSecondary">
                {line.detail}
              </AppText>
            </View>
            <AppText variant="bodyStrong" style={styles.amount}>
              {formatBrlShort(line.amount)}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="caption" color="textSecondary">
        Toque em “Criar minha meta” para acompanhar quanto falta e o que você precisa providenciar.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  cell: {
    width: 64,
    minHeight: MinTouchTarget + 8,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellMonth: { fontWeight: '700', textTransform: 'uppercase' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  lines: { gap: Spacing.md, marginTop: Spacing.sm },
  line: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  flex: { flex: 1 },
  amount: { fontVariant: ['tabular-nums'] },
});
