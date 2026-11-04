import {
  formatYearMonthPt,
  money,
  requiredMonthly,
  TRAVEL_STYLE_LABEL_PT,
  type DestinationViability,
  type TravelStyle,
} from '@rumar/core';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { DepartureBoard } from '@/components/departure-board';
import { Postcard } from '@/components/postcard';
import { SimulatedBanner } from '@/components/simulated-banner';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { ProvenanceBadge } from '@/components/ui/provenance-badge';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { Spacing } from '@/constants/theme';
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
      <Screen inTabs>
        <AppText variant="eyebrow" color="accent">
          Descobrir
        </AppText>
        <AppText variant="display">Para onde dá pra ir?</AppText>
        <AppText color="textSecondary">Responda 3 perguntas rápidas e veja destinos possíveis para o seu bolso.</AppText>
        <Button label="Começar" arrow onPress={() => router.push('/onboarding')} />
      </Screen>
    );
  }

  const viableCount = results.filter((r) => r.firstViable).length;

  return (
    <Screen inTabs>
      <AppText variant="eyebrow" color="accent">
        Descobrir
      </AppText>
      <AppText variant="display">
        {viableCount > 0 ? `${viableCount} ${viableCount === 1 ? 'viagem cabe' : 'viagens cabem'} no seu plano.` : 'Vamos achar o seu caminho.'}
      </AppText>
      <AppText color="textSecondary">
        Guardando {formatBrlShort(profile.monthlyMinor)}/mês
        {saved > 0 ? ` · ${formatBrlShort(saved)} já guardados` : ''} · {profile.travelers}{' '}
        {profile.travelers === 1 ? 'pessoa' : 'pessoas'}
      </AppText>
      <SimulatedBanner />

      <DepartureBoard results={results} originIata={profile.originIata} />

      <Section index="01" eyebrow="ajuste a viagem">
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
      </Section>

      <Section index="02" eyebrow="cartões-postais" title="Escolha o seu próximo destino" />
      {results.map((r) => (
        <DestinationPostcard key={r.destination.id} result={r} originIata={profile.originIata} monthlyMinor={profile.monthlyMinor} saved={saved} />
      ))}

      <Button label="Refazer as perguntas" variant="ghost" onPress={() => router.push('/onboarding')} />
    </Screen>
  );
}

function DestinationPostcard({
  result,
  originIata,
  monthlyMinor,
  saved,
}: {
  result: DestinationViability;
  originIata: string;
  monthlyMinor: number;
  saved: number;
}) {
  const theme = useTheme();
  const { destination, firstViable, cheapest } = result;
  const asOf = currentYearMonth();
  const cell = firstViable ?? cheapest;

  let headline: string;
  let detail: string | null = null;
  if (firstViable?.cost) {
    headline = `Dá pra ir a partir de ${formatYearMonthPt(firstViable.month)}`;
    detail = `Viagem completa ${formatBrlShort(firstViable.cost.total)}`;
  } else if (cheapest?.cost) {
    const needed = requiredMonthly(money(saved), cheapest.cost.total, asOf, cheapest.month);
    headline = needed
      ? `Com ${formatBrlShort(needed)}/mês, você vai em ${formatYearMonthPt(cheapest.month)}`
      : 'Ainda não cabe no seu ritmo atual';
    detail = `Hoje você guarda ${formatBrlShort(monthlyMinor)}/mês · viagem ${formatBrlShort(cheapest.cost.total)}`;
  } else {
    headline = 'Ainda sem dados para este destino';
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${destination.city}, ${destination.country}. ${headline}. ${detail ?? ''}`}
      onPress={() => router.push({ pathname: '/destino/[id]', params: { id: destination.id } })}
      style={({ pressed }) => [styles.card, { borderColor: theme.strongBorder, opacity: pressed ? 0.9 : 1 }]}>
      <Postcard destination={destination} originIata={originIata} height={210} />
      <View style={[styles.cardBody, { backgroundColor: theme.surface }]}>
        <AppText variant="heading">{headline}</AppText>
        {detail ? <AppText color="textSecondary">{detail}</AppText> : null}
        <View style={styles.cardFooter}>
          {cell?.provenance ? <ProvenanceBadge provenance={cell.provenance} /> : <View />}
          <AppText variant="eyebrow">
            Ver plano ↗
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  card: { borderWidth: 1 },
  cardBody: { padding: Spacing.lg, gap: Spacing.sm },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.xs },
});
