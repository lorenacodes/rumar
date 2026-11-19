/**
 * Viagem sem internet (D-067): a última versão aberta de cada viagem fica guardada NESTE aparelho (com os lugares
 * do roteiro), para abrir no exterior sem dados móveis. Sai junto com a conta (apagarTudoOffline no "Sair").
 * Guarda no máximo as 5 viagens abertas mais recentemente.
 */
const PREFIXO = 'bovair.offline.';
const MAX = 5;

export interface Copia<T> { salvoEm: number; dados: T; lugares: unknown[] }

export function guardarOffline<T>(id: string, dados: T, lugares: unknown[]) {
  try {
    localStorage.setItem(PREFIXO + id, JSON.stringify({ salvoEm: Date.now(), dados, lugares } satisfies Copia<T>));
    const chaves = Object.keys(localStorage).filter((k) => k.startsWith(PREFIXO));
    if (chaves.length > MAX) {
      const ordem = chaves.map((k) => ({ k, t: (JSON.parse(localStorage.getItem(k) ?? '{}') as { salvoEm?: number }).salvoEm ?? 0 })).sort((a, b) => a.t - b.t);
      for (const { k } of ordem.slice(0, chaves.length - MAX)) localStorage.removeItem(k);
    }
  } catch { /* sem espaço ou armazenamento bloqueado: segue sem cópia */ }
}

export function lerOffline<T>(id: string): Copia<T> | null {
  try {
    const t = localStorage.getItem(PREFIXO + id);
    return t ? (JSON.parse(t) as Copia<T>) : null;
  } catch { return null; }
}

export function apagarTudoOffline() {
  try { for (const k of Object.keys(localStorage)) if (k.startsWith(PREFIXO)) localStorage.removeItem(k); } catch { /* nada a fazer */ }
}

/** Falha de rede (sem internet), e não recusa do servidor. */
export const semRede = (erro: { message?: string } | null | undefined) =>
  (typeof navigator !== 'undefined' && navigator.onLine === false) || /Failed to fetch|NetworkError|Load failed|fetch failed/i.test(erro?.message ?? '');

/** Todas as cópias guardadas (para a lista de viagens sem internet). */
export function copiasOffline<T>(): Copia<T>[] {
  try {
    return Object.keys(localStorage).filter((k) => k.startsWith(PREFIXO)).map((k) => JSON.parse(localStorage.getItem(k) ?? 'null') as Copia<T>).filter(Boolean);
  } catch { return []; }
}
