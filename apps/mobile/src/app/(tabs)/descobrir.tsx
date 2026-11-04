import {
  formatYearMonthPt,
  requiredMonthly,
  TRAVEL_STYLE_LABEL_PT,
  type DestinationViability,
  type TravelStyle,
} from '@rumar/core';
import { Link, router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SimulatedBanner } from '@/components/simulated-banner';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { ProvenanceBadge } from '@/components/ui/provenance-badge';
import { Screen } from '@/components/ui/screen';
import { VIABILITY_UI } from '@/components/viability-label';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatBrlShort } from '@/lib/format';
import { computeDiscovery, currentYearMonth, savedMinor } from '@/state/selectors';
import { useStore } from '@/state/store';

const STYLES: TravelStyle[] = ['economic', 'intermediate', 'comfort'];
const NIGHTS = [4, 6, 8, 10];

export default function Descobrir() {
  const { state, dispatch } = useStore();
  const { profile } = state;
  const saved = savedMinor(state);
  const asOf = currentYearMonth();

  const results = useMemo(
    () => (profile ? computeDiscovery(profile, saved, asOf) : []),
    // asOf muda só de mês em mês; comparar por valor evita recalcular a cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, saved, asOf.year, asOf.month],
  );

  if (!profile) {
    return (
      <Screen>
        <AppText variant="title">Para onde dá para ir?</AppText>
        <AppText color="textSecondary">Responda 3 perguntas rápidas para ver destinos possíveis.</AppText>
        <Button label="Começar" onPress={() => router.push('/onboarding')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="title">Para onde e quando dá para ir</AppText>
      <AppText color="textSecondary">
        Guardando {formatBrlShort(profile.monthlyMinor)} por mês
        {saved > 0 ? `, com ${formatBrlShort(saved)} já guardados` : ''} · {profile.travelers}{' '}
        {profile.travelers === 1 ? 'pessoa' : 'pessoas'} · {profile.nights} noites
      </AppText>
      <SimulatedBanner />

      <View style={styles.wrap} accessibilityRole="radiogroup" accessibilityLabel="Estilo de viagem">
        {STYLES.map((s) => (
          <Chip
            key={s}
            label={TRAVEL_STYLE_LABEL_PT[s]}
            selected={profile.style === s}
            onPress={() => dispatch({ type: 'setProfile', profile: { ...profile, style: s } })}
          />
        ))}
      </View>
      <View style={styles.wrap} accessibilityRole="radiogroup" accessibilityLabel="Número de noites">
        {NIGHTS.map((n) => (
          <Chip
            key={n}
            label={`${n} noites`}
            selected={profile.nights === n}
            onPress={() => dispatch({ type: 'setProfile', profile: { ...profile, nights: n } })}
          />
        ))}
      </View>

      {results.map((r) => (
        <DestinationCard key={r.destination.id} result={r} monthlyMinor={profile.monthlyMinor} saved={saved} />
      ))}

      <Link href="/onboarding" asChild>
        <Button label="Refazer as perguntas" variant="ghost" />
      </Link>
    </Screen>
  );
}

function DestinationCard({ result, monthlyMinor, saved }: { result: DestinationViability; monthlyMinor: number; saved: number }) {
  const theme = useTheme();
  const { destination, firstViable, cheapest } = result;
  const highlight = firstViable ?? cheapest;
  const status = firstViable ? 'viable' : cheapest?.status ?? 'no_data';
  const ui = VIABILITY_UI[status];
  const asOf = currentYearMonth();

  let headline: string;
  let detail: string | null = null;
  if (firstViable?.cost) {
    headline = `Dá para ir a partir de ${formatYearMonthPt(firstViable.month)}`;
    detail = `Viagem completa: ${formatBrlShort(firstViable.cost.total)}`;
  } else if (cheapest?.cost) {
    const needed = requiredMonthly(
      { minor: saved, currency: 'BRL' },
      cheapest.cost.total,
      asOf,
      cheapest.month,
    );
    headline = `Com ${formatBrlShort(monthlyMinor)}/mês, ainda não cabe nos próximos meses`;
    detail = needed
      ? `Guardando ${formatBrlShort(needed)}/mês, dá para ir em ${formatYearMonthPt(cheapest.month)} (${formatBrlShort(cheapest.cost.total)})`
      : null;
  } else {
    headline = 'Ainda não temos dados suficientes para este destino';
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${destination.city}, ${destination.country}. ${headline}. ${detail ?? ''}`}
      onPress={() => router.push({ pathname: '/destino/[id]', params: { id: destination.id } })}>
      <Card>
        <View style={styles.cardHeader}>
          <View style={styles.flex}>
            <AppText variant="heading">{destination.city}</AppText>
            <AppText variant="caption" color="textSecondary">
              {destination.country}
            </AppText>
          </View>
          <View style={[styles.status, { backgroundColor: theme[ui.bg] }]}>
            <AppText variant="caption" color={ui.fg} style={styles.statusText}>
              {ui.icon} {ui.label}
            </AppText>
          </View>
        </View>
        <AppText variant="bodyStrong">{headline}</AppText>
        {detail ? <AppText color="textSecondary">{detail}</AppText> : null}
        {highlight?.provenance ? <ProvenanceBadge provenance={highlight.provenance} /> : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  flex: { flex: 1 },
  status: { borderRadius: Radius.pill, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xxs },
  statusText: { fontWeight: '600' },
});
