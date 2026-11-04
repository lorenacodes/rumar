import {
  COST_CATEGORY_LABEL_PT,
  formatYearMonthPt,
  money,
  requiredMonthly,
  type ViabilityCell,
} from '@rumar/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Postcard } from '@/components/postcard';
import { SimulatedBanner } from '@/components/simulated-banner';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ProvenanceBadge } from '@/components/ui/provenance-badge';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { VIABILITY_UI } from '@/components/viability-label';
import { MaxContentWidth, MinTouchTarget, Palette, Spacing } from '@/constants/theme';
import { lookFor } from '@/data/looks';
import { useTheme } from '@/hooks/use-theme';
import { formatBrlShort } from '@/lib/format';
import { successFeedback, tapFeedback } from '@/lib/haptics';
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
  return Math.max(0, cells.findIndex((c) => c.cost !== null));
}

export default function DestinoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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
  const look = lookFor(destination.id);
  const canCreateGoal = !!cell?.cost && (cell.status === 'viable' || cell.status === 'tight' || cell.status === 'not_yet');

  const createGoal = () => {
    if (!cell?.cost) return;
    successFeedback();
    dispatch({
      type: 'setGoal',
      goal: { destinationId: destination.id, departureMonth: cell.month, targetMinor: cell.cost.total.minor, createdAt: todayIso() },
    });
    router.replace('/');
  };

  const hero = (
    <View style={styles.heroWrap}>
      <Postcard
        destination={destination}
        originIata={profile.originIata}
        height={320 + insets.top}
        topInset={insets.top + Spacing.sm + MinTouchTarget + Spacing.md}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/descobrir'))}
        style={[styles.back, { top: insets.top + Spacing.sm, borderColor: look.ink }]}>
        <AppText style={{ color: look.ink, fontSize: 18 }}>←</AppText>
      </Pressable>
    </View>
  );

  const footer =
    canCreateGoal && cell ? (
      <Button label={`Quero ir em ${formatYearMonthPt(cell.month)}`} arrow onPress={createGoal} />
    ) : null;

  return (
    <Screen hero={hero} footer={footer} edges={['top', 'left', 'right']}>
      <SimulatedBanner />

      <Section index="01" eyebrow="quando dá pra ir" title="Escolha o mês">
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
                onPress={() => {
                  tapFeedback();
                  setSelected(i);
                }}
                style={[
                  styles.cell,
                  {
                    backgroundColor: isSelected ? Palette.board : theme[ui.bg],
                    borderColor: isSelected ? Palette.board : theme.border,
                  },
                ]}>
                <AppText variant="board" style={{ color: isSelected ? Palette.orange : theme[ui.fg] }}>
                  {SHORT_MONTHS[c.month.month - 1]}
                </AppText>
                <AppText variant="caption" style={{ color: isSelected ? Palette.paper : theme[ui.fg] }}>
                  {ui.icon} {String(c.month.year).slice(2)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.legend}>
          {(['viable', 'tight', 'not_yet', 'too_soon'] as const).map((s) => (
            <AppText key={s} variant="caption" color={VIABILITY_UI[s].fg === 'success' ? 'success' : 'textSecondary'}>
              {VIABILITY_UI[s].icon} {VIABILITY_UI[s].label}
            </AppText>
          ))}
        </View>
      </Section>

      {cell ? <MonthDetail cell={cell} saved={saved} /> : null}
    </Screen>
  );
}

function MonthDetail({ cell, saved }: { cell: ViabilityCell; saved: number }) {
  const theme = useTheme();
  const asOf = currentYearMonth();
  const month = formatYearMonthPt(cell.month);

  if (cell.status === 'no_data' || !cell.cost) {
    return (
      <Section index="02" eyebrow={month} title="Sem referência de preço">
        <AppText color="textSecondary">Ainda não temos referência de preço para este mês. Preferimos não chutar um valor.</AppText>
      </Section>
    );
  }

  const { cost } = cell;
  const slack = cell.slack?.minor ?? 0;
  let summary: string;
  let tone: 'good' | 'warn' | 'bad';
  if (cell.status === 'too_soon') {
    tone = 'bad';
    summary = 'Não dá tempo de providenciar os documentos obrigatórios até esse mês. Escolha um mês mais adiante.';
  } else if (slack >= 0) {
    tone = 'good';
    summary = `Até lá você terá ${formatBrlShort(cell.available)}. Sobra uma folga de ${formatBrlShort(slack)}.`;
  } else {
    tone = 'warn';
    const needed = requiredMonthly(money(saved), cost.total, asOf, cell.month);
    summary =
      `Até lá você terá ${formatBrlShort(cell.available)}. Faltam ${formatBrlShort(-slack)}.` +
      (needed ? ` Para ir nesse mês, guarde ${formatBrlShort(needed)} por mês.` : '');
  }
  const toneBg = tone === 'good' ? theme.accentSoft : tone === 'warn' ? theme.warningSoft : theme.dangerSoft;
  const toneFg = theme.text;

  return (
    <Section index="02" eyebrow={`a viagem em ${month}`}>
      <View style={styles.totalRow}>
        <View style={styles.flex}>
          <AppText variant="eyebrow" color="textSecondary">
            Viagem completa
          </AppText>
          <AppText style={styles.total}>{formatBrlShort(cost.total)}</AppText>
          {cost.perPerson.minor !== cost.total.minor ? (
            <AppText color="textSecondary">{formatBrlShort(cost.perPerson)} por pessoa</AppText>
          ) : null}
        </View>
        <ProvenanceBadge provenance={cost.provenance} />
      </View>

      <View style={[styles.verdict, { backgroundColor: toneBg }]}>
        <AppText variant="bodyStrong" style={{ color: toneFg }}>
          {summary}
        </AppText>
      </View>

      <AppText variant="eyebrow" color="textSecondary" style={styles.gapTop}>
        O que está incluído
      </AppText>
      <View style={[styles.receipt, { borderColor: theme.strongBorder }]}>
        {cost.lines.map((line, i) => (
          <View
            key={line.category}
            style={[styles.line, { borderTopColor: theme.border }, i === 0 && styles.firstLine]}
            accessible
            accessibilityLabel={`${COST_CATEGORY_LABEL_PT[line.category]}: ${formatBrlShort(line.amount)}. ${line.detail}`}>
            <AppText variant="eyebrow" color="accent" style={styles.lineIndex}>
              {String(i + 1).padStart(2, '0')}
            </AppText>
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{COST_CATEGORY_LABEL_PT[line.category]}</AppText>
              <AppText variant="caption" color="textSecondary">
                {line.detail}
              </AppText>
            </View>
            <AppText variant="board" style={styles.amount}>
              {formatBrlShort(line.amount)}
            </AppText>
          </View>
        ))}
        <View style={[styles.line, styles.totalLine, { borderTopColor: theme.strongBorder }]}>
          <AppText variant="heading" style={styles.flex}>
            Total
          </AppText>
          <AppText variant="heading">{formatBrlShort(cost.total)}</AppText>
        </View>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  heroWrap: { width: '100%' },
  back: {
    position: 'absolute',
    left: Spacing.lg,
    width: MinTouchTarget,
    height: MinTouchTarget,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, maxWidth: MaxContentWidth },
  cell: { width: 62, minHeight: MinTouchTarget + 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  totalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  total: { fontFamily: 'LexendExa_600SemiBold', fontSize: 44, lineHeight: 52, letterSpacing: -2 },
  verdict: { padding: Spacing.md },
  gapTop: { marginTop: Spacing.sm },
  receipt: { borderWidth: 1, paddingHorizontal: Spacing.md },
  line: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', paddingVertical: Spacing.md, borderTopWidth: 1 },
  firstLine: { borderTopWidth: 0 },
  lineIndex: { width: 20, marginTop: 4 },
  totalLine: { borderTopWidth: 2, alignItems: 'center' },
  flex: { flex: 1 },
  amount: { textAlign: 'right' },
});
