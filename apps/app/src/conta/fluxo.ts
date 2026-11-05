import { create } from 'zustand';

/** E-mail em uso no fluxo de conta (passa de uma tela para a outra, só em memória). */
export const useFluxoConta = create<{ email: string; tipoCodigo: 'signup' | 'email_change'; set: (p: Partial<{ email: string; tipoCodigo: 'signup' | 'email_change' }>) => void }>((set) => ({
  email: '',
  tipoCodigo: 'signup',
  set: (p) => set(p),
}));
