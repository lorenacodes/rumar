import AsyncStorage from '@react-native-async-storage/async-storage';

import { INITIAL_STATE, type AppState } from '@/state/types';

/**
 * Persistência do estado. Hoje: apenas no aparelho (AsyncStorage).
 * Quando houver backend, uma implementação remota entra atrás da mesma interface.
 */
export interface StateRepository {
  load(): Promise<AppState>;
  save(state: AppState): Promise<void>;
  clear(): Promise<void>;
}

const KEY = 'rumar.state.v1';

function isAppState(value: unknown): value is AppState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<AppState>;
  return v.version === 1 && Array.isArray(v.contributions) && Array.isArray(v.completedTaskIds);
}

export const localRepository: StateRepository = {
  async load() {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (!raw) return INITIAL_STATE;
      const parsed: unknown = JSON.parse(raw);
      return isAppState(parsed) ? parsed : INITIAL_STATE;
    } catch (error) {
      // Estado corrompido ou armazenamento indisponível: recomeça sem travar o app.
      console.warn('[rumar] Falha ao carregar o estado local', error);
      return INITIAL_STATE;
    }
  },
  async save(state) {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('[rumar] Falha ao salvar o estado local', error);
    }
  },
  async clear() {
    await AsyncStorage.removeItem(KEY);
  },
};
