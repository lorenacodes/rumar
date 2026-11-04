import {
  INTEREST_LABEL_PT,
  NEED_LABEL_PT,
  PACE_LABEL_PT,
  type InterestTag,
  type Pace,
  type TravelNeed,
} from '@rumar/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { FontFamily, MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { successFeedback, tapFeedback } from '@/lib/haptics';
import { useStore } from '@/state/store';

const INTERESTS: InterestTag[] = [
  'history_culture',
  'museums_art',
  'food_drink',
  'local_markets',
  'nature_outdoors',
  'beach',
  'photography',
  'nightlife',
  'meet_people',
  'lgbtqia',
  'adventure',
  'shopping',
  'wellness',
  'family_kids',
];

const PACES: { pace: Pace; hint: string }[] = [
  { pace: 'calm', hint: '2 programas por dia, com tempo de sobra' },
  { pace: 'balanced', hint: '3 programas por dia' },
  { pace: 'intense', hint: 'Do café da manhã até a noite' },
];

const NEEDS: TravelNeed[] = ['low_walking', 'step_free', 'quiet'];

/**
 * Perfil de viagem: interesses, ritmo e necessidades.
 * Não perguntamos idade, gênero ou orientação: a pessoa escolhe o que quer viver.
 */
export default function JeitoDeViajar() {
  const { state, dispatch } = useStore();
  const [interests, setInterests] = useState<InterestTag[]>([...(state.persona?.interests ?? [])]);
  const [pace, setPace] = useState<Pace>(state.persona?.pace ?? 'balanced');
  const [needs, setNeeds] = useState<TravelNeed[]>([...(state.persona?.needs ?? [])]);

  const toggle = <T,>(list: T[], value: T): T[] => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const save = () => {
    successFeedback();
    dispatch({ type: 'setPersona', persona: { interests, pace, needs } });
    if (state.goal) router.replace('/roteiro');
    else router.back();
  };

  return (
    <Screen
      edges={['left', 'right']}
      footer={
        <Button
          label={interests.length === 0 ? 'Escolha pelo menos um interesse' : 'Montar meu roteiro'}
          arrow={interests.length > 0}
          disabled={interests.length === 0}
          onPress={save}
        />
      }>
      <AppText variant="display">Como você gosta de viajar?</AppText>
      <AppText color="textSecondary">
        Marque o que tem a ver com você. O roteiro é montado a partir disso, e você pode mudar quando quiser.
      </AppText>

      <Section index="01" eyebrow="o que te move" title="Interesses">
        <View style={styles.grid}>
          {INTERESTS.map((tag) => (
            <ToggleTile
              key={tag}
              label={INTEREST_LABEL_PT[tag]}
              selected={interests.includes(tag)}
              onPress={() => setInterests(toggle(interests, tag))}
            />
          ))}
        </View>
      </Section>

      <Section index="02" eyebrow="seu ritmo" title="Ritmo da viagem">
        <View style={styles.list} accessibilityRole="radiogroup">
          {PACES.map((p) => (
            <ToggleTile
              key={p.pace}
              label={PACE_LABEL_PT[p.pace]}
              hint={p.hint}
              selected={pace === p.pace}
              radio
              onPress={() => setPace(p.pace)}
            />
          ))}
        </View>
      </Section>

      <Section index="03" eyebrow="pra ficar confortável" title="Precisa de algo?">
        <View style={styles.grid}>
          {NEEDS.map((n) => (
            <ToggleTile key={n} label={NEED_LABEL_PT[n]} selected={needs.includes(n)} onPress={() => setNeeds(toggle(needs, n))} />
          ))}
        </View>
      </Section>

      <AppText variant="caption" color="textSecondary">
        🔒 Suas escolhas ficam só neste aparelho. Algumas podem dizer respeito à sua intimidade (como o interesse pela
        cena LGBTQIA+): elas nunca serão enviadas ou compartilhadas sem você autorizar.
      </AppText>
    </Screen>
  );
}

function ToggleTile({
  label,
  hint,
  selected,
  radio,
  onPress,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  radio?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole={radio ? 'radio' : 'checkbox'}
      accessibilityState={radio ? { selected } : { checked: selected }}
      accessibilityLabel={hint ? `${label}. ${hint}` : label}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={[
        styles.tile,
        hint ? styles.tileWide : null,
        { backgroundColor: selected ? theme.primary : theme.surface, borderColor: selected ? theme.primary : theme.border },
      ]}>
      <AppText style={[styles.tileLabel, { color: selected ? theme.onPrimary : theme.text }]}>
        {selected ? '✓ ' : ''}
        {label}
      </AppText>
      {hint ? (
        <AppText variant="caption" style={{ color: selected ? theme.onPrimary : theme.textSecondary }}>
          {hint}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  list: { gap: Spacing.sm },
  tile: { minHeight: MinTouchTarget, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, justifyContent: 'center' },
  tileWide: { width: '100%' },
  tileLabel: { fontFamily: FontFamily.display, fontSize: 13, lineHeight: 18, letterSpacing: 0.2 },
});
