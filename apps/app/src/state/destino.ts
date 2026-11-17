import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Destino } from '../lib/lugares';

/** Última cidade explorada no Descobrir (só no aparelho, para abrir onde a pessoa parou). */
export const useDestinoAtual = create<{ destino: Destino | null; escolher: (d: Destino | null) => void }>()(
  persist((set) => ({ destino: null, escolher: (destino) => set({ destino }) }), { name: 'bovair.destino', storage: createJSONStorage(() => localStorage), version: 1 }),
);
