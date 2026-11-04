import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { MoneyInput } from '@/components/ui/money-input';
import { Screen } from '@/components/ui/screen';
import { MinTouchTarget, Spacing } from '@/constants/theme';
import { formatBrlShort, formatDatePt } from '@/lib/format';
import { savedMinor, todayIso } from '@/state/selectors';
import { useStore } from '@/state/store';

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Aporte() {
  const { state, dispatch } = useStore();
  const [amount, setAmount] = useState(state.profile?.monthlyMinor ?? 0);

  const save = () => {
    dispatch({ type: 'addContribution', contribution: { id: newId(), amountMinor: amount, date: todayIso() } });
    router.back();
  };

  return (
    <Screen
      edges={['left', 'right', 'bottom']}
      footer={<Button label="Salvar" disabled={amount <= 0} onPress={save} />}>
      <AppText color="textSecondary">
        Seu dinheiro fica no seu banco. Aqui você só registra quanto separou, para acompanhar a meta.
      </AppText>
      <MoneyInput label="Quanto você guardou?" valueMinor={amount} onChange={setAmount} />
      <AppText variant="bodyStrong">Total guardado até agora: {formatBrlShort(savedMinor(state))}</AppText>

      {state.contributions.length > 0 ? (
        <View style={styles.list}>
          <AppText variant="heading">Registros</AppText>
          {[...state.contributions].reverse().map((c) => (
            <View key={c.id} style={styles.row}>
              <AppText style={styles.flex}>
                {formatDatePt(c.date)} · {formatBrlShort(c.amountMinor)}
              </AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remover registro de ${formatBrlShort(c.amountMinor)}`}
                onPress={() => dispatch({ type: 'removeContribution', id: c.id })}
                style={styles.remove}>
                <AppText color="danger">Remover</AppText>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  remove: { minHeight: MinTouchTarget, justifyContent: 'center', paddingHorizontal: Spacing.sm },
});
