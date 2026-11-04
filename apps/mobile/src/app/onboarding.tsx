import { addMonths, formatYearMonthPt, type YearMonth } from '@rumar/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Satin } from '@/components/satin';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { MoneyInput } from '@/components/ui/money-input';
import { Screen } from '@/components/ui/screen';
import { BrandSunset, MaxContentWidth, Palette, Spacing } from '@/constants/theme';
import { catalog } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';
import { currentYearMonth } from '@/state/selectors';
import { useStore } from '@/state/store';
import type { PassportStatus } from '@/state/types';

const TOTAL_STEPS = 3;

const HEROES = [
  { eyebrow: 'Vamos começar', title: 'Seu próximo carimbo no passaporte começa aqui.' },
  { eyebrow: 'Ponto de partida', title: 'De onde sai o seu voo?' },
  { eyebrow: 'O seu momento', title: 'Quando você se imagina embarcando?' },
] as const;

/** Onboarding de 3 perguntas, sem cadastro. Uma decisão por tela. */
export default function Onboarding() {
  const { dispatch } = useStore();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [saved, setSaved] = useState(0);
  const [origin, setOrigin] = useState(catalog.origins[0]?.iata ?? 'GRU');
  const [travelers, setTravelers] = useState(1);
  const [preferred, setPreferred] = useState<YearMonth | null>(null);
  const [passport, setPassport] = useState<PassportStatus>('none');

  const now = currentYearMonth();
  const months = Array.from({ length: 12 }, (_, i) => addMonths(now, i + 2));
  const canContinue = step !== 0 || monthly > 0 || saved > 0;
  const hero = HEROES[step] ?? HEROES[0];

  const finish = () => {
    dispatch({
      type: 'setProfile',
      profile: {
        originIata: origin,
        monthlyMinor: monthly,
        initialSavedMinor: saved,
        travelers,
        nights: 6,
        style: 'economic',
        passport,
        preferredMonth: preferred,
      },
    });
    router.replace('/descobrir');
  };

  const footer = (
    <View style={styles.footerRow}>
      {step > 0 ? <Button label="Voltar" variant="ghost" onPress={() => setStep(step - 1)} /> : <View />}
      <Button
        label={step === TOTAL_STEPS - 1 ? 'Ver para onde dá pra ir' : 'Continuar'}
        arrow
        disabled={!canContinue}
        onPress={() => (step === TOTAL_STEPS - 1 ? finish() : setStep(step + 1))}
        style={styles.next}
      />
    </View>
  );

  const heroView = (
    <Satin colors={BrandSunset} style={{ ...styles.hero, paddingTop: insets.top + Spacing.xl }}>
      <View style={styles.heroInner}>
        <View style={styles.heroTop}>
          <AppText variant="heading" style={styles.onSatin}>
            rumar
          </AppText>
          <View style={styles.dots} accessibilityLabel={`Pergunta ${step + 1} de ${TOTAL_STEPS}`}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: i <= step ? Palette.ink : 'rgba(14,15,11,.25)' }]} />
            ))}
          </View>
        </View>
        <AppText variant="eyebrow" style={styles.onSatin}>
          {hero.eyebrow}
        </AppText>
        <AppText variant="display" style={styles.onSatin}>
          {hero.title}
        </AppText>
      </View>
    </Satin>
  );

  return (
    <Screen hero={heroView} footer={footer}>
      {step === 0 && (
        <>
          <AppText color="textSecondary">
            Você não precisa ter o dinheiro todo hoje. Diga quanto consegue separar e a gente mostra para onde, e
            quando, dá para ir.
          </AppText>
          <MoneyInput label="Consigo guardar por mês" valueMinor={monthly} onChange={setMonthly} suffix="/mês" />
          <MoneyInput
            label="Já tenho guardado (opcional)"
            valueMinor={saved}
            onChange={setSaved}
            hint="Seu dinheiro continua com você. O Rumar não guarda nem movimenta dinheiro."
          />
        </>
      )}

      {step === 1 && (
        <>
          <AppText variant="eyebrow" color="textSecondary">
            Aeroporto de saída
          </AppText>
          <View style={styles.wrap} accessibilityRole="radiogroup">
            {catalog.origins.map((o) => (
              <Chip key={o.iata} label={`${o.iata} · ${o.label}`} selected={origin === o.iata} onPress={() => setOrigin(o.iata)} />
            ))}
          </View>
          <AppText variant="eyebrow" color="textSecondary" style={styles.gapTop}>
            Quem vai
          </AppText>
          <View style={styles.wrap} accessibilityRole="radiogroup">
            {[1, 2, 3, 4].map((n) => (
              <Chip key={n} label={n === 1 ? 'Só eu' : `${n} pessoas`} selected={travelers === n} onPress={() => setTravelers(n)} />
            ))}
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <AppText variant="eyebrow" color="textSecondary">
            Mês da viagem
          </AppText>
          <View style={styles.wrap} accessibilityRole="radiogroup">
            <Chip label="Sou flexível" selected={preferred === null} onPress={() => setPreferred(null)} />
            {months.map((m) => (
              <Chip
                key={`${m.year}-${m.month}`}
                label={formatYearMonthPt(m)}
                selected={preferred?.year === m.year && preferred.month === m.month}
                onPress={() => setPreferred(m)}
              />
            ))}
          </View>
          <AppText variant="eyebrow" color="textSecondary" style={styles.gapTop}>
            Passaporte válido?
          </AppText>
          <View style={styles.wrap} accessibilityRole="radiogroup">
            <Chip label="Sim" selected={passport === 'valid'} onPress={() => setPassport('valid')} />
            <Chip label="Não" selected={passport === 'none'} onPress={() => setPassport('none')} />
            <Chip label="Não sei" selected={passport === 'unknown'} onPress={() => setPassport('unknown')} />
          </View>
          {passport !== 'valid' ? (
            <AppText variant="caption" style={{ color: theme.textSecondary }}>
              Sem problema: o custo e o prazo do passaporte entram no seu plano.
            </AppText>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', minHeight: 300, alignItems: 'center' },
  heroInner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto' },
  onSatin: { color: Palette.ink },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 22, height: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  gapTop: { marginTop: Spacing.md },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.md },
  next: { flexShrink: 1 },
});
