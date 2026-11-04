import { addMonths, formatYearMonthPt, type YearMonth } from '@rumar/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { MoneyInput } from '@/components/ui/money-input';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { catalog } from '@/data/catalog';
import { useStore } from '@/state/store';
import { currentYearMonth } from '@/state/selectors';
import type { PassportStatus } from '@/state/types';

const TOTAL_STEPS = 3;

/** Onboarding de 3 perguntas, sem cadastro. Uma decisão por tela. */
export default function Onboarding() {
  const { dispatch } = useStore();
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
        label={step === TOTAL_STEPS - 1 ? 'Ver para onde dá para ir' : 'Continuar'}
        disabled={!canContinue}
        onPress={() => (step === TOTAL_STEPS - 1 ? finish() : setStep(step + 1))}
        style={styles.next}
      />
    </View>
  );

  return (
    <Screen footer={footer}>
      <AppText variant="caption" color="textSecondary">
        Pergunta {step + 1} de {TOTAL_STEPS}
      </AppText>

      {step === 0 && (
        <>
          <AppText variant="display">Viajar para fora pode estar mais perto do que você imagina.</AppText>
          <AppText color="textSecondary">
            Comece pelo que você consegue guardar. A gente mostra para onde e quando dá para ir.
          </AppText>
          <MoneyInput label="Quanto você consegue guardar por mês?" valueMinor={monthly} onChange={setMonthly} />
          <MoneyInput
            label="Já tem algum valor guardado para a viagem?"
            valueMinor={saved}
            onChange={setSaved}
            hint="Pode deixar em branco. Seu dinheiro continua com você: o Rumar não guarda nem movimenta dinheiro."
          />
        </>
      )}

      {step === 1 && (
        <>
          <AppText variant="title">De onde você sai?</AppText>
          <View style={styles.wrap} accessibilityRole="radiogroup">
            {catalog.origins.map((o) => (
              <Chip key={o.iata} label={o.label} selected={origin === o.iata} onPress={() => setOrigin(o.iata)} />
            ))}
          </View>
          <AppText variant="heading">Quantas pessoas vão viajar?</AppText>
          <View style={styles.wrap} accessibilityRole="radiogroup">
            {[1, 2, 3, 4].map((n) => (
              <Chip key={n} label={n === 1 ? 'Só eu' : `${n} pessoas`} selected={travelers === n} onPress={() => setTravelers(n)} />
            ))}
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <AppText variant="title">Quando você gostaria de ir?</AppText>
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
          <AppText variant="heading">Você tem passaporte válido?</AppText>
          <View style={styles.wrap} accessibilityRole="radiogroup">
            <Chip label="Sim" selected={passport === 'valid'} onPress={() => setPassport('valid')} />
            <Chip label="Não" selected={passport === 'none'} onPress={() => setPassport('none')} />
            <Chip label="Não sei" selected={passport === 'unknown'} onPress={() => setPassport('unknown')} />
          </View>
          {passport !== 'valid' ? (
            <AppText variant="caption" color="textSecondary">
              Sem problema: a gente inclui o custo e o prazo do passaporte no seu plano.
            </AppText>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  next: { flexShrink: 1 },
});
