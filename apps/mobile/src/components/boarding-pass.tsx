import { formatYearMonthPt, type Destination, type ReadinessScores, type YearMonth } from '@rumar/core';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Palette, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { lookFor } from '@/data/looks';
import { formatPercent } from '@/lib/format';

const SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

type Props = {
  destination: Destination;
  originIata: string;
  originLabel: string;
  departureMonth: YearMonth;
  daysToDeparture: number;
  scores: ReadinessScores;
  moneyDetail: string;
};

/** Cartão de embarque da viagem: o coração da tela "Minha viagem". */
export function BoardingPass({ destination, originIata, originLabel, departureMonth, daysToDeparture, scores, moneyDetail }: Props) {
  const look = lookFor(destination.id);
  const theme = useTheme();
  return (
    <View
      style={[styles.pass, { borderColor: theme.border }]}
      accessible
      accessibilityLabel={`Cartão de embarque: ${originIata} para ${destination.city}, ${formatYearMonthPt(
        departureMonth,
      )}. Faltam ${daysToDeparture} dias. Viagem ${formatPercent(scores.overall)} pronta.`}>
      <View style={[styles.stripe, { backgroundColor: look.palette[0] }]} />
      <View style={styles.body}>
        <View style={styles.rowBetween}>
          <AppText variant="eyebrow" style={styles.orange}>
            Seu cartão de embarque
          </AppText>
          <AppText variant="eyebrow" style={styles.dim}>
            rumar
          </AppText>
        </View>
        <View style={styles.route}>
          <View style={styles.flex}>
            <AppText style={styles.iata}>{originIata}</AppText>
            <AppText variant="caption" style={styles.dim} numberOfLines={1}>
              {originLabel}
            </AppText>
          </View>
          <AppText style={styles.plane}>✈</AppText>
          <View style={[styles.flex, styles.right]}>
            <AppText style={styles.iata}>{destination.mainAirportIata}</AppText>
            <AppText variant="caption" style={styles.dim} numberOfLines={1}>
              {destination.city}
            </AppText>
          </View>
        </View>
        <View style={styles.fields}>
          <Field label="Embarque" value={`${SHORT[departureMonth.month - 1]} de ${departureMonth.year}`} />
          <Field label="Faltam" value={daysToDeparture > 0 ? `${daysToDeparture} dias` : 'É hoje!'} />
          <Field label="Pronta" value={formatPercent(scores.overall)} highlight />
        </View>
      </View>

      <View style={styles.perforation}>
        <View style={[styles.notch, styles.notchLeft, { backgroundColor: theme.background }]} />
        <View style={styles.dashes} />
        <View style={[styles.notch, styles.notchRight, { backgroundColor: theme.background }]} />
      </View>

      <View style={styles.stub}>
        <ProgressBar label="Dinheiro guardado" ratio={scores.money} detail={moneyDetail} fill={Palette.orange} empty={Palette.boardLine} textColor={Palette.paper} mutedColor="#ABA594" />
        <ProgressBar label="Documentos" ratio={scores.documents} fill={Palette.sun} empty={Palette.boardLine} textColor={Palette.paper} />
        <ProgressBar label="Reservas e preparativos" ratio={scores.plan} fill={Palette.paper} empty={Palette.boardLine} textColor={Palette.paper} />
      </View>
    </View>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.field}>
      <AppText variant="caption" style={styles.dim}>
        {label}
      </AppText>
      <AppText variant="board" style={highlight ? styles.orange : styles.paper} numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pass: { backgroundColor: Palette.board, overflow: 'hidden', borderWidth: 1 },
  stripe: { height: 6 },
  body: { padding: Spacing.lg, gap: Spacing.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  route: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  flex: { flex: 1 },
  right: { alignItems: 'flex-end' },
  iata: { fontFamily: 'LexendExa_600SemiBold', fontSize: 40, lineHeight: 46, letterSpacing: -1.5, color: Palette.paper },
  plane: { fontSize: 22, color: Palette.orange },
  fields: { flexDirection: 'row', gap: Spacing.md },
  field: { flex: 1, gap: 2 },
  orange: { color: Palette.orange },
  paper: { color: Palette.paper },
  dim: { color: '#9A9585' },
  perforation: { height: 24, justifyContent: 'center' },
  dashes: {
    marginHorizontal: 18,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#4A4D40',
  },
  notch: { position: 'absolute', width: 24, height: 24, borderRadius: 12, top: 0 },
  notchLeft: { left: -12 },
  notchRight: { right: -12 },
  stub: { padding: Spacing.lg, paddingTop: Spacing.sm, gap: Spacing.md },
});
