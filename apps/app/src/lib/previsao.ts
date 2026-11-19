/**
 * Previsão de quando a pessoa junta o dinheiro da viagem (D-077).
 * Conta simples e transparente: guardado hoje + o que consegue guardar por mês, mês a mês, até a meta.
 * Não prevê juros nem inflação (dito na tela).
 */
import { mesesAte, somarMeses } from './poupanca';

export interface PontoPrevisao { mes: number; data: string; valor: number }
export interface Previsao {
  pontos: PontoPrevisao[];
  /** Meses até juntar tudo (null = não junta em 5 anos ou sem valor por mês). */
  mesesAteMeta: number | null;
  dataMeta: string | null;
  mesesAteViagem: number;
  /** Quanto terá guardado na data da viagem. */
  naViagem: number;
  /** Quanto precisaria guardar por mês para chegar na data. */
  mensalNecessario: number;
  cabe: boolean;
}

export function preverPoupanca(e: { hoje: string; dataIda: string; meta: number; guardado: number; mensal: number }): Previsao {
  const mesesAteViagem = mesesAte(e.hoje, e.dataIda);
  const falta = Math.max(0, e.meta - e.guardado);
  const mesesAteMeta = falta === 0 ? 0 : e.mensal > 0 ? Math.ceil(falta / e.mensal) : null;
  const ate = Math.min(60, Math.max(mesesAteViagem, mesesAteMeta ?? mesesAteViagem, 1));
  const pontos: PontoPrevisao[] = [];
  for (let m = 0; m <= ate; m++) pontos.push({ mes: m, data: somarMeses(e.hoje, m), valor: Math.min(e.meta, e.guardado + e.mensal * m) });
  const naViagem = Math.min(e.meta, e.guardado + e.mensal * mesesAteViagem);
  return {
    pontos,
    mesesAteMeta: mesesAteMeta !== null && mesesAteMeta <= 60 ? mesesAteMeta : null,
    dataMeta: mesesAteMeta !== null && mesesAteMeta <= 60 ? somarMeses(e.hoje, mesesAteMeta) : null,
    mesesAteViagem,
    naViagem,
    mensalNecessario: mesesAteViagem > 0 ? Math.ceil(falta / mesesAteViagem) : falta,
    cabe: naViagem >= e.meta,
  };
}

/** "mar de 2027" */
export const mesAno = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' }).replace('.', '');
