import { money, requiredMonthly, type ReadinessTask } from '@rumar/core';
import { Redirect, router } from 'expo-router';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { BoardingPass } from '@/components/boarding-pass';
import { ItineraryDayView } from '@/components/itinerary-day';
import { SimulatedBanner } from '@/components/simulated-banner';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { MinTouchTarget, Spacing } from '@/constants/theme';
import { catalog } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';
import { formatBrlShort, formatDatePt } from '@/lib/format';
import { successFeedback, tapFeedback } from '@/lib/haptics';
import { computeItinerary, computeTripView, currentYearMonth } from '@/state/selectors';
import { useStore } from '@/state/store';

export default function MinhaViagem() {
  const { state, dispatch, ready } = useStore();
  if (!ready) return null;
  if (!state.profile) return <Redirect href="/onboarding" />;

  const view = computeTripView(state);
  if (!state.goal || !view) {
    return (
      <Screen inTabs>
        <AppText variant="eyebrow" color="accent">
          Minha viagem
        </AppText>
        <AppText variant="display">Sua próxima viagem começa com uma escolha.</AppText>
        <AppText color="textSecondary">
          Escolha um destino e um mês. A gente acompanha quanto falta, o que providenciar e avisa a hora certa de cada
          passo.
        </AppText>
        <Button label="Ver para onde dá pra ir" arrow onPress={() => router.push('/descobrir')} />
      </Screen>
    );
  }

  const { goal, profile } = state;
  const { destination, readiness, saved } = view;
  const remaining = Math.max(0, goal.targetMinor - saved);
  const needed = requiredMonthly(money(saved), money(goal.targetMinor), currentYearMonth(), goal.departureMonth);
  const behind = needed !== null && needed.minor > profile.monthlyMinor;
  const origin = catalog.origins.find((o) => o.iata === profile.originIata);
  const pending = readiness.tasks.filter((t) => t.status !== 'done').length;
  const itinerary = computeItinerary(state)?.itinerary;
  const previewDay = itinerary?.days.find((d) => d.kind === 'full') ?? itinerary?.days[0];

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
    <Screen inTabs>
      <AppText variant="eyebrow" color="accent">
        Minha viagem
      </AppText>
      <AppText variant="display">
        {readiness.scores.overall >= 1 ? 'Tudo pronto. Boa viagem!' : `Rumo a ${destination.city}.`}
      </AppText>

      <BoardingPass
        destination={destination}
        originIata={profile.originIata}
        originLabel={origin?.label ?? profile.originIata}
        departureMonth={goal.departureMonth}
        daysToDeparture={readiness.daysToDeparture}
        scores={readiness.scores}
        moneyDetail={`${formatBrlShort(saved)} de ${formatBrlShort(goal.targetMinor)}${remaining > 0 ? ` · faltam ${formatBrlShort(remaining)}` : ''}`}
      />
      <AppText variant="caption" color="textSecondary">
        Data aproximada: início do mês. Os prazos são calculados a partir dela.
      </AppText>

      {behind && needed ? (
        <Card tone="muted">
          <AppText variant="eyebrow" color="warning">
            Atenção ao ritmo
          </AppText>
          <AppText>
            Para chegar a tempo, guarde {formatBrlShort(needed)} por mês. Hoje o plano é {formatBrlShort(profile.monthlyMinor)}.
          </AppText>
        </Card>
      ) : null}
      <Button label="Registrar quanto guardei" variant="outline" onPress={() => router.push('/aporte')} />

      <SimulatedBanner />

      {readiness.nextAction ? (
        <NextAction
          task={readiness.nextAction}
          onDone={() => {
            successFeedback();
            dispatch({ type: 'toggleTask', taskId: readiness.nextAction!.id });
          }}
        />
      ) : null}

      <Section index="02" eyebrow={`plano até o embarque · ${pending} pendentes`} title="O que falta fazer">
        <View>
          {readiness.tasks.map((t, i) => (
            <TaskRow
              key={t.id}
              index={i + 1}
              task={t}
              onToggle={() => {
                tapFeedback();
                dispatch({ type: 'toggleTask', taskId: t.id });
              }}
            />
          ))}
        </View>
      </Section>

      <Section index="03" eyebrow="seu roteiro" title={itinerary ? 'Um gostinho do seu roteiro' : 'Um roteiro com a sua cara'}>
        {itinerary && previewDay ? (
          <>
            <ItineraryDayView day={previewDay} compact />
            <Button label="Ver roteiro completo" arrow onPress={() => router.push('/roteiro')} />
          </>
        ) : (
          <>
            <AppText color="textSecondary">
              Gosta de agito ou de sossego? Museus, natureza, vida noturna, cena LGBTQIA+? Conte o seu jeito e a gente
              monta os dias da viagem pra você.
            </AppText>
            <Button label="Contar meu jeito de viajar" arrow onPress={() => router.push('/jeito-de-viajar')} />
          </>
        )}
      </Section>

      <View style={styles.links}>
        <Button label="Trocar destino ou mês" variant="ghost" onPress={() => router.push('/descobrir')} />
        <Button label="Apagar meus dados deste aparelho" variant="ghost" onPress={reset} />
      </View>
    </Screen>
  );
}

function NextAction({ task, onDone }: { task: ReadinessTask; onDone: () => void }) {
  return (
    <Card tone="highlight">
      <AppText variant="eyebrow" color="onHighlight">
        Seu próximo passo
      </AppText>
      <AppText variant="title" color="onHighlight">
        {task.title}
      </AppText>
      <AppText color="onHighlight">{task.description}</AppText>
      <AppText variant="board" color={task.status === 'overdue' ? 'danger' : 'onHighlight'}>
        {task.status === 'overdue' ? 'Atrasado · era até ' : 'Até '}
        {formatDatePt(task.dueDate)}
        {task.isRecommendation ? ' · sugestão' : ''}
      </AppText>
      <Button label="Marcar como feito" onPress={onDone} style={styles.doneButton} />
    </Card>
  );
}

function TaskRow({ task, index, onToggle }: { task: ReadinessTask; index: number; onToggle: () => void }) {
  const theme = useTheme();
  const done = task.status === 'done';
  const statusColor = task.status === 'overdue' ? 'danger' : task.status === 'due_soon' ? 'warning' : 'textSecondary';
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${task.title}, até ${formatDatePt(task.dueDate)}`}
      onPress={onToggle}
      style={[styles.task, { borderTopColor: theme.border }]}>
      <AppText variant="eyebrow" color="accent" style={styles.taskIndex}>
        {String(index).padStart(2, '0')}
      </AppText>
      <View style={styles.flex}>
        <AppText variant="bodyStrong" color={done ? 'textSecondary' : 'text'} style={done ? styles.doneText : undefined}>
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
      <View
        style={[
          styles.check,
          { borderColor: done ? theme.text : theme.border, backgroundColor: done ? theme.text : 'transparent' },
        ]}>
        {done ? <AppText style={{ color: theme.background, fontSize: 14 }}>✓</AppText> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  task: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    minHeight: MinTouchTarget,
    alignItems: 'flex-start',
  },
  taskIndex: { width: 22, marginTop: 4 },
  check: { width: 26, height: 26, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  flex: { flex: 1, gap: Spacing.xxs },
  doneText: { textDecorationLine: 'line-through' },
  doneButton: { marginTop: Spacing.sm },
  links: { gap: Spacing.xs, marginTop: Spacing.lg },
});
