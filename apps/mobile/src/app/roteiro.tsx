import { INTEREST_LABEL_PT, PACE_LABEL_PT } from '@rumar/core';
import { router } from 'expo-router';

import { ItineraryDayView } from '@/components/itinerary-day';
import { SimulatedBanner } from '@/components/simulated-banner';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { computeItinerary } from '@/state/selectors';
import { useStore } from '@/state/store';

export default function Roteiro() {
  const { state } = useStore();
  const result = computeItinerary(state);

  if (!result || !state.persona) {
    return (
      <Screen edges={['left', 'right']}>
        <AppText variant="title">Vamos montar seu roteiro</AppText>
        <AppText color="textSecondary">Primeiro, conte como você gosta de viajar.</AppText>
        <Button label="Contar meu jeito de viajar" arrow onPress={() => router.replace('/jeito-de-viajar')} />
      </Screen>
    );
  }

  const { destination, itinerary } = result;
  const { persona } = state;

  return (
    <Screen edges={['left', 'right']}>
      <AppText variant="eyebrow" color="accent">
        {`//roteiro · ${destination.city}`}
      </AppText>
      <AppText variant="display">Feito do seu jeito.</AppText>
      <AppText color="textSecondary">
        Ritmo {PACE_LABEL_PT[persona.pace].toLowerCase()} ·{' '}
        {persona.interests.map((i) => INTEREST_LABEL_PT[i].toLowerCase()).join(', ')}
      </AppText>
      <SimulatedBanner />

      {itinerary.uncoveredInterests.length > 0 ? (
        <Card tone="muted">
          <AppText variant="bodyStrong">
            Ainda não temos lugares de {itinerary.uncoveredInterests.map((i) => INTEREST_LABEL_PT[i].toLowerCase()).join(', ')}{' '}
            para este destino.
          </AppText>
          <AppText variant="caption" color="textSecondary">
            Preferimos deixar esse horário livre a sugerir um lugar que não conferimos.
          </AppText>
        </Card>
      ) : null}

      {itinerary.days.map((day) => (
        <ItineraryDayView key={day.day} day={day} />
      ))}

      <Button label="Mudar meu jeito de viajar" variant="outline" onPress={() => router.push('/jeito-de-viajar')} />
    </Screen>
  );
}
