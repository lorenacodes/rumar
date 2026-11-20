/** Viagens que ocupam os mesmos dias. O dia da volta pode ser o dia da ida da próxima (emendar viagens). */

function dataMais(dataIda: string, dias: number): string {
  const [a, m, d] = dataIda.split('-').map(Number);
  return new Date(Date.UTC(a!, m! - 1, d! + dias)).toISOString().slice(0, 10);
}

export interface Periodo { id?: string; destino?: string; data_ida: string; noites: number; data_definida?: boolean; registrada?: boolean; status?: string }

export function cruzam(a: Periodo, b: Periodo): boolean {
  const fimA = dataMais(a.data_ida, a.noites); const fimB = dataMais(b.data_ida, b.noites);
  return a.data_ida < fimB && b.data_ida < fimA;
}

/** Viagens minhas (ativas) que se cruzam com o período; ignora a própria viagem. */
export function viagensNoMesmoPeriodo<T extends Periodo>(nova: Periodo, lista: T[], ignorarId?: string): T[] {
  return lista.filter((v) => v.id !== ignorarId && (v.status ?? 'ativo') === 'ativo' && cruzam(nova, v));
}

/** "Paris (18 a 23 jan)" — para o aviso. */
export function textoConflito(v: Periodo): string {
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const f = (iso: string) => { const [, m, d] = iso.split('-').map(Number); return `${d} ${MES[m! - 1]}`; };
  return `${v.destino ?? 'outra viagem'} (${f(v.data_ida)} a ${f(dataMais(v.data_ida, v.noites))})`;
}
