import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Escolhas marcadas nas telas (chips do design): motivo da viagem, gostos, ritmo,
 * filtros... Chave = "<tela>:<grupo>" (ex.: "6.1:motivo"). Ficam no aparelho.
 */
interface EscolhasState {
  valores: Record<string, string[]>;
  /** Consentimento específico para usar necessidades (dado sensível, LGPD art. 11). */
  consentimentoNecessidades: boolean;
  definir: (grupo: string, valores: string[]) => void;
  consentir: (sim: boolean) => void;
}

export const useEscolhas = create<EscolhasState>()(
  persist(
    (set) => ({
      valores: {},
      consentimentoNecessidades: false,
      definir: (grupo, valores) => set((s) => ({ valores: { ...s.valores, [grupo]: valores } })),
      consentir: (sim) => set({ consentimentoNecessidades: sim }),
    }),
    { name: 'bovair.escolhas', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);
