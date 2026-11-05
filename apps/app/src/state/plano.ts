import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Plano montado sem cadastro (telas 1.x). Fica só no aparelho até a pessoa
 * guardar na conta (5.3). Nunca guarda a data de nascimento: só "maior de 18".
 */
export interface Plano {
  maior18: boolean;
  cidade: string;
  idiomaApp: 'pt' | 'en' | 'es' | 'fr';
  idiomasFalados: string[];
  /** Centavos por mês. */
  mensal: number;
  /** Centavos já guardados. */
  guardado: number;
  avisos: { preco: boolean; prazos: boolean; resumo: boolean } | null;
}

interface PlanoState extends Plano {
  atualizar: (parcial: Partial<Plano>) => void;
  limpar: () => void;
}

export const PLANO_INICIAL: Plano = {
  maior18: false,
  cidade: '',
  idiomaApp: 'pt',
  idiomasFalados: ['Português'],
  mensal: 0,
  guardado: 0,
  avisos: null,
};

export const usePlano = create<PlanoState>()(
  persist(
    (set) => ({
      ...PLANO_INICIAL,
      atualizar: (parcial) => set(parcial),
      limpar: () => set(PLANO_INICIAL),
    }),
    { name: 'rumar.plano', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);

/** Plano de exemplo da Ana S. (especificação, "Decisões fixas"). */
export const PLANO_ANA: Plano = {
  maior18: true,
  cidade: 'Aracaju, Brasil',
  idiomaApp: 'pt',
  idiomasFalados: ['Português', 'Inglês'],
  mensal: 60000,
  guardado: 200000,
  avisos: { preco: true, prazos: true, resumo: false },
};
