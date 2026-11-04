import type { TravelPersona } from '@rumar/core';

import { INITIAL_STATE, type AppState, type Contribution, type Goal, type TravelerProfile } from '@/state/types';

export type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'setProfile'; profile: TravelerProfile }
  | { type: 'setGoal'; goal: Goal }
  | { type: 'addContribution'; contribution: Contribution }
  | { type: 'removeContribution'; id: string }
  | { type: 'toggleTask'; taskId: string }
  | { type: 'setPersona'; persona: TravelPersona | null }
  | { type: 'reset' };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'setProfile':
      return { ...state, profile: action.profile };
    case 'setGoal':
      // Nova meta: tarefas concluídas da meta anterior deixam de valer.
      return { ...state, goal: action.goal, completedTaskIds: [] };
    case 'addContribution':
      if (!Number.isInteger(action.contribution.amountMinor) || action.contribution.amountMinor === 0) return state;
      return { ...state, contributions: [...state.contributions, action.contribution] };
    case 'removeContribution':
      return { ...state, contributions: state.contributions.filter((c) => c.id !== action.id) };
    case 'toggleTask': {
      const done = state.completedTaskIds.includes(action.taskId);
      return {
        ...state,
        completedTaskIds: done
          ? state.completedTaskIds.filter((id) => id !== action.taskId)
          : [...state.completedTaskIds, action.taskId],
      };
    }
    case 'setPersona':
      return { ...state, persona: action.persona };
    case 'reset':
      return INITIAL_STATE;
  }
}
