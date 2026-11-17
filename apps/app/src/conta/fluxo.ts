import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Cadastro em andamento: e-mail, tipo de código e quando foi enviado. Fica salvo no
 * aparelho porque, ao abrir o app de e-mail para ver o código, o Android pode fechar o
 * Bo Vair; ao voltar, a tela do código precisa saber para qual e-mail confirmar.
 */
interface Fluxo {
  email: string;
  tipoCodigo: 'signup' | 'email_change';
  /** Quando o último código foi pedido (ms). */
  enviadoEm: number;
  /** Tentativas erradas desde o último código. */
  erros: number;
}

export const useFluxoConta = create<Fluxo & { set: (p: Partial<Fluxo>) => void }>()(
  persist(
    (set) => ({
      email: '',
      tipoCodigo: 'signup',
      enviadoEm: 0,
      erros: 0,
      set: (p) => set(p),
    }),
    { name: 'bovair.cadastro', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);
