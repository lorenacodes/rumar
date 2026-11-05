import { createContext, useContext, type ReactNode } from 'react';

/**
 * Modo demonstração (rota /dev/telas): as telas mostram os dados de exemplo da
 * Ana S., exatamente como no design. Fora dele, os campos começam vazios.
 */
const DemoContext = createContext(false);

export function DemoProvider({ children }: { children: ReactNode }) {
  return <DemoContext.Provider value>{children}</DemoContext.Provider>;
}

export function useDemo(): boolean {
  return useContext(DemoContext);
}

/** Valor inicial de um campo: o do design no modo demonstração, vazio no app. */
export function useValorInicial<T>(demo: T, real: T): T {
  return useDemo() ? demo : real;
}

export const ANA = {
  nome: 'Ana S.',
  iniciais: 'AS',
  email: 'ana@exemplo.com',
  cidade: 'Aracaju, Brasil',
} as const;
