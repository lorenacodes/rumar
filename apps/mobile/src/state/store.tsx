import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';

import { reducer, type Action } from '@/state/reducer';
import { localRepository, type StateRepository } from '@/state/storage';
import { INITIAL_STATE, type AppState } from '@/state/types';

type StoreValue = { state: AppState; dispatch: (action: Action) => void; ready: boolean };

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({
  children,
  repository = localRepository,
}: {
  children: ReactNode;
  repository?: StateRepository;
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;
    repository.load().then((loaded) => {
      if (cancelled) return;
      dispatch({ type: 'hydrate', state: loaded });
      hydrated.current = true;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  useEffect(() => {
    if (hydrated.current) void repository.save(state);
  }, [state, repository]);

  const value = useMemo(() => ({ state, dispatch, ready }), [state, ready]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore precisa estar dentro de <StoreProvider>');
  return value;
}
