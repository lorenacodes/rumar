import { formatYearMonthPt, money, requiredMonthly, type ReadinessTask } from '@rumar/core';
import { Redirect, router } from 'expo-router';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { SimulatedBanner } from '@/components/simulated-banner';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatBrlShort, formatDatePt, formatPercent } from '@/lib/format';
import { computeTripView, currentYearMonth } from '@/state/selectors';
import { useStore } from '@/state/store';

export default function MinhaViagem() {
  const { state, dispatch, ready } = useStore();
  if (!ready) return null;
  if (!state.profile) return <Redirect href="/onboarding" />;

  const view = computeTripView(state);
  if (!state.goal || !view) {
    return (
      <Screen>
        <AppText variant="title">Sua viagem começa aqui</AppText>
        <AppText color="textSecondary">
          Escolha um destino e um mês para criar sua meta. A gente acompanha quanto falta e o que você precisa
          providenciar.
        </AppText>
        <Button label="Descobrir para onde dá para ir" onPress={() => router.push('/descobrir')} />
      </Screen>
    );
  }

  const { goal, profile } = state;
  const { destination, readiness, saved } = view;
  const remaining = Math.max(0, goal.targetMinor - saved);
  const needed = requiredMonthly(money(saved), money(goal.targetMinor), currentYearMonth(), goal.departureMonth);
  const behind = needed !== null && needed.minor > profile.monthlyMinor;

  const reset = () => {
    const run = () => dispatch({ type: 'reset' });
    if (Platform.OS === 'web') {
      run();
      return;
    }
    Alert.alert('Apagar seus dados?', 'Isso apaga perfil, meta e valores registrados neste aparelho.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: run },
    ]);
  };

  return (
    <Screen>
      <View>
        <AppText variant="caption" color="textSecondary">
          Minha viagem
        </AppText>
        <AppText variant="title">
          {destination.city} · {formatYearMonthPt(goal.departureMonth)}
        </AppText>
        <AppText color="textSecondary">
          {readiness.daysToDeparture > 0 ? `Faltam ${readiness.daysToDeparture} dias` : 'Chegou a hora!'} (data
          aproximada: início do mês)
        </AppText>
      </View>
      <SimulatedBanner />

      <Card>
        <AppText variant="heading">Sua viagem está {formatPercent(readiness.scores.overall)} pronta</AppText>
        <ProgressBar
          label="💰 Dinheiro"
          ratio={readiness.scores.money}
          color="accent"
          detail={`${formatBrlShort(saved)} de ${formatBrlShort(goal.targetMinor)}${remaining > 0 ? ` · faltam ${formatBrlShort(remaining)}` : ''}`}
        />
        <ProgressBar label="📄 Documentos" ratio={readiness.scores.documents} color="primary" />
        <ProgressBar label="✈️ Reservas e preparação" ratio={readiness.scores.plan} color="success" />
        {behind && needed ? (
          <AppText color="warning">
            Para chegar a tempo, guarde {formatBrlShort(needed)} por mês (hoje você planeja{' '}
            {formatBrlShort(profile.monthlyMinor)}).
          </AppText>
        ) : null}
        <Button label="Registrar quanto guardei" variant="secondary" onPress={() => router.push('/aporte')} />
      </Card>

      {readiness.nextAction ? (
        <NextAction task={readiness.nextAction} onDone={() => dispatch({ type: 'toggleTask', taskId: readiness.nextAction!.id })} />
      ) : (
        <Card>
          <AppText variant="heading">Tudo pronto. Boa viagem! ✈️</AppText>
        </Card>
      )}

      <AppText variant="heading">Seu plano até o embarque</AppText>
      {readiness.tasks.map((t) => (
        <TaskRow key={t.id} task={t} onToggle={() => dispatch({ type: 'toggleTask', taskId: t.id })} />
      ))}

      <Button label="Trocar destino ou mês" variant="ghost" onPress={() => router.push('/descobrir')} />
      <Button label="Apagar meus dados deste aparelho" variant="ghost" onPress={reset} />
    </Screen>
  );
}

function NextAction({ task, onDone }: { task: ReadinessTask; onDone: () => void }) {
  const theme = useTheme();
  return (
    <Card style={{ backgroundColor: theme.primarySoft, borderColor: theme.primary }}>
      <AppText variant="caption" color="primary" style={styles.bold}>
        PRÓXIMO PASSO
      </AppText>
      <AppText variant="heading">{task.title}</AppText>
      <AppText color="textSecondary">{task.description}</AppText>
      <AppText variant="bodyStrong" color={task.status === 'overdue' ? 'danger' : 'text'}>
        {task.status === 'overdue' ? 'Atrasado: era até ' : 'Até '}
        {formatDatePt(task.dueDate)}
        {task.isRecommendation ? ' (sugestão)' : ''}
      </AppText>
      <Button label="Marcar como feito" onPress={onDone} />
    </Card>
  );
}

function TaskRow({ task, onToggle }: { task: ReadinessTask; onToggle: () => void }) {
  const theme = useTheme();
  const done = task.status === 'done';
  const statusColor = task.status === 'overdue' ? 'danger' : task.status === 'due_soon' ? 'warning' : 'textSecondary';
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${task.title}, até ${formatDatePt(task.dueDate)}`}
      onPress={onToggle}
      style={[styles.task, { borderColor: theme.border, backgroundColor: theme.surface }]}>
      <View
        style={[
          styles.check,
          { borderColor: done ? theme.success : theme.border, backgroundColor: done ? theme.success : 'transparent' },
        ]}>
        {done ? <AppText style={{ color: theme.onPrimary }}>✓</AppText> : null}
      </View>
      <View style={styles.flex}>
        <AppText variant="bodyStrong" style={done ? styles.doneText : undefined}>
          {task.title}
        </AppText>
        <AppText variant="caption" color={done ? 'textSecondary' : statusColor}>
          Até {formatDatePt(task.dueDate)}
          {task.isRecommendation ? ' · sugestão do Rumar' : ''}
          {task.status === 'overdue' && !done ? ' · atrasado' : ''}
        </AppText>
        {task.requirement ? (
          <AppText variant="caption" color="textSecondary">
            Fonte: {task.requirement.sourceName} · verificado em {formatDatePt(task.requirement.verifiedAt)}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700', letterSpacing: 0.5 },
  task: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: MinTouchTarget,
    alignItems: 'flex-start',
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  flex: { flex: 1, gap: Spacing.xxs },
  doneText: { textDecorationLine: 'line-through' },
});
