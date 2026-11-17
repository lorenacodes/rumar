/**
 * Plano de economia da viagem.
 *   meta   = estimativa completa (orçamento + documentos + reserva de emergência)
 *   falta  = meta − guardado
 *   mensal = falta ÷ meses até a viagem      (semanal = falta ÷ semanas, opcional)
 * Se a capacidade mensal informada não cobre o mensal, mostramos alternativas com números,
 * sem prometer nada: adiar, reduzir o custo ou guardar mais.
 */

export interface EntradaPoupanca {
  hoje: string;
  dataIda: string;
  /** Custo provável da viagem na moeda de referência (centavos). */
  estimativa: number;
  /** Custos de documentos ainda a pagar (ex.: taxa do passaporte). */
  documentos: number;
  reservaPct: number;
  guardado: number;
  capacidadeMensal: number | null;
}

export interface Alternativa { tipo: 'adiar' | 'reduzir' | 'guardar_mais'; texto: string }

export interface Plano {
  meta: number;
  reserva: number;
  falta: number;
  meses: number;
  semanas: number;
  mensal: number;
  semanal: number;
  progresso: number;
  compativel: boolean | null;
  alternativas: Alternativa[];
}

const dia = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
export const diasEntre = (de: string, ate: string) => Math.round((dia(ate) - dia(de)) / 86_400_000);

/** Meses inteiros completos até a data (mínimo 0). Ex.: 17/11 → 10/01 = 1 mês. */
export function mesesAte(hoje: string, data: string): number {
  const a = new Date(dia(hoje));
  const b = new Date(dia(data));
  let m = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
  if (b.getUTCDate() < a.getUTCDate()) m -= 1;
  return Math.max(0, m);
}

export function somarMeses(iso: string, meses: number): string {
  const d = new Date(dia(iso));
  d.setUTCMonth(d.getUTCMonth() + meses);
  return d.toISOString().slice(0, 10);
}

export function planejarPoupanca(e: EntradaPoupanca, fmt: (c: number) => string = String): Plano {
  const reserva = Math.round(((e.estimativa + e.documentos) * e.reservaPct) / 100);
  const meta = e.estimativa + e.documentos + reserva;
  const falta = Math.max(0, meta - e.guardado);
  const meses = mesesAte(e.hoje, e.dataIda);
  const semanas = Math.max(0, Math.floor(diasEntre(e.hoje, e.dataIda) / 7));
  // Sem um mês inteiro pela frente, o que falta precisa estar guardado agora.
  const mensal = falta === 0 ? 0 : Math.ceil(falta / Math.max(1, meses));
  const semanal = falta === 0 ? 0 : Math.ceil(falta / Math.max(1, semanas));
  const compativel = e.capacidadeMensal === null ? null : falta === 0 || e.capacidadeMensal >= mensal;
  const alternativas: Alternativa[] = [];
  if (compativel === false && e.capacidadeMensal !== null) {
    const cap = e.capacidadeMensal;
    if (cap > 0) {
      const mesesNecessarios = Math.ceil(falta / cap);
      alternativas.push({ tipo: 'adiar', texto: `Guardando ${fmt(cap)} por mês, você junta o que falta em ${mesesNecessarios} ${mesesNecessarios === 1 ? 'mês' : 'meses'}: viagem a partir de ${somarMeses(e.hoje, mesesNecessarios).split('-').reverse().join('/')}.` });
    }
    const cabe = e.guardado + cap * Math.max(0, meses);
    const custoQueCabe = Math.max(0, Math.floor(cabe / (1 + e.reservaPct / 100)) - e.documentos);
    alternativas.push({ tipo: 'reduzir', texto: `Mantendo a data, o custo da viagem precisaria caber em cerca de ${fmt(custoQueCabe)} (hoje: ${fmt(e.estimativa)}). Dá para tirar noites, trocar a hospedagem ou atrações pagas.` });
    alternativas.push({ tipo: 'guardar_mais', texto: `Ou guardar ${fmt(mensal)} por mês em vez de ${fmt(cap)}.` });
  }
  return { meta, reserva, falta, meses, semanas, mensal, semanal, progresso: meta ? Math.min(1, e.guardado / meta) : 0, compativel, alternativas };
}
