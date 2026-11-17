/**
 * Junta os dados de uma viagem para a linha do tempo e o dinheiro: tudo é recalculado a
 * cada mudança (data, destino, orçamento, diagnóstico, depósitos). Nada fica "congelado".
 */
import DESTINOS from '../../dados/destinos.json';
import { etapaAtual, gerarTarefas, internacional, TAXA_PASSAPORTE, type Contexto, type Etapa, type Tarefa } from '../../lib/linhaDoTempo';
import { converter, paisPorCodigo, paisPorNome, taxa, type Pais } from '../../lib/moedas';
import { diasEntre, planejarPoupanca, type Plano } from '../../lib/poupanca';
import { lugarPorId } from '../../lib/catalogo';
import { IDIOMA_DO_PAIS } from '../../lib/aulas';
import type { TarefaSalva, ViagemCompleta } from '../../lib/viagens';
import PRECOS from '../../dados/precos-paris.json';

export interface Perfil { paisResidencia: string; paisPassaporte: string; moedaReferencia: string; idiomasFalados?: string[] }

export interface TarefaVista extends Tarefa {
  feita: boolean;
  /** Tarefa pessoal (criada pela pessoa, pode reordenar e apagar). */
  pessoal?: TarefaSalva;
}

export interface Jornada {
  ctx: Contexto;
  tarefas: TarefaVista[];
  etapa: Etapa;
  diasParaIda: number;
  paisDestino: Pais | null;
  moedaDestino: string;
  moedaPlano: string;
  /** Custo provável na moeda de planejamento (null se faltar câmbio). */
  estimativa: number | null;
  documentos: number;
  guardado: number;
  plano: Plano | null;
}

export const hojeISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function paisDoDestino(nome: string): Pais | null {
  const d = (DESTINOS as { destinos: { nome: string; pais: string }[] }).destinos.find((x) => x.nome === nome);
  return paisPorNome(d?.pais) ?? null;
}

const reservaveis = new Set(Object.entries((PRECOS as { lugares: Record<string, { reserva?: boolean }> }).lugares).filter(([, p]) => p.reserva).map(([id]) => id));

export function montarJornada(v: ViagemCompleta, provavelBRL: number | null, perfil: Perfil, hoje = hojeISO(), paisCodigo?: string): Jornada {
  const vg = v.viagem;
  const paisDestino = (paisCodigo ? paisPorCodigo(paisCodigo) : null) ?? paisDoDestino(vg.destino);
  const residencia = paisPorCodigo(perfil.paisResidencia) ?? paisPorCodigo('BR')!;
  const moedaDestino = vg.moeda_destino ?? paisDestino?.moeda ?? 'BRL';
  const moedaPlano = vg.moeda_planejamento ?? 'BRL';
  const diag = vg.diagnostico ?? {};
  const guardado = (vg.guardado_centavos ?? 0) + v.aportes.reduce((s, a) => s + a.valor_centavos, 0);
  // Sem nenhum preço com fonte (custo 0), não há meta: nunca dizer "meta atingida" com R$ 0.
  const estimativa = !provavelBRL ? null : converter(provavelBRL, taxa('BRL', moedaPlano));
  const atracoes = [...new Set(v.itens.filter((i) => reservaveis.has(i.place_id)).map((i) => lugarPorId(i.place_id)?.nome).filter(Boolean) as string[])];

  const base: Omit<Contexto, 'meta'> = {
    hoje, dataIda: vg.data_ida, noites: vg.noites, dataDefinida: vg.data_definida ?? true,
    destino: { nome: vg.destino, pais: paisDestino }, residencia, passaporte: perfil.paisPassaporte, diagnostico: diag,
    temOrcamento: Boolean(vg.orcamento_centavos), temHospedagem: Boolean(v.hospedagem), atracoesComReserva: atracoes,
    guardado, encerrada: Boolean(vg.encerrada_em),
    idioma: paisDestino && IDIOMA_DO_PAIS[paisDestino.codigo] ? { nome: IDIOMA_DO_PAIS[paisDestino.codigo]!.nome, jaFala: (perfil.idiomasFalados ?? []).includes(IDIOMA_DO_PAIS[paisDestino.codigo]!.falado) } : null,
  };
  // Taxa do passaporte entra na meta só se a tarefa de passaporte existir (sem passaporte válido).
  const precisaPassaporte = gerarTarefas({ ...base, meta: 0 }).some((t) => t.chave === 'passaporte');
  const documentos = precisaPassaporte && internacional(base) && residencia.codigo === 'BR' ? converter(TAXA_PASSAPORTE.centavos, taxa('BRL', moedaPlano)) ?? 0 : 0;
  const plano = estimativa === null ? null : planejarPoupanca({ hoje, dataIda: vg.data_ida, estimativa, documentos, reservaPct: vg.reserva_pct ?? 10, guardado, capacidadeMensal: vg.capacidade_mensal_centavos ?? null });
  const ctx: Contexto = { ...base, meta: plano?.meta ?? 0 };

  const salvas = new Map(v.tarefas.filter((t) => t.chave).map((t) => [t.chave!, t]));
  const sistema: TarefaVista[] = gerarTarefas(ctx).map((t) => ({ ...t, feita: Boolean(t.automatica) || Boolean(salvas.get(t.chave)?.feita) }));
  const pessoais: TarefaVista[] = v.tarefas
    .filter((t) => !t.chave)
    .map((t) => ({ chave: `p-${t.id}`, etapa: t.etapa as Etapa, titulo: t.titulo ?? '', descricao: t.descricao ?? '', prazo: t.prazo ?? undefined, tipoPrazo: t.prazo ? ('viagem' as const) : undefined, prazoTexto: t.prazo ? 'Prazo que você definiu' : undefined, prioridade: 'media' as const, feita: t.feita, pessoal: t }));
  const tarefas = [...sistema, ...pessoais];
  const etapa = etapaAtual(ctx, (e) => tarefas.filter((t) => t.etapa === e && !t.feita && !t.informativa).length);
  return { ctx, tarefas, etapa, diasParaIda: diasEntre(hoje, vg.data_ida), paisDestino, moedaDestino, moedaPlano, estimativa, documentos, guardado, plano };
}
