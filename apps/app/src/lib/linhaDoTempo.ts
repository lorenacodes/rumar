/**
 * Linha do tempo da viagem: da ideia à volta.
 *
 * As tarefas do sistema são CALCULADAS a partir dos dados da viagem (datas, destino,
 * diagnóstico, orçamento). Mudou a data ou o destino, a lista e os prazos mudam juntos.
 * No banco fica só o que a pessoa marcou (feita) e as tarefas pessoais.
 *
 * Prazos — nunca inventados. Cada prazo tem um tipo:
 *   oficial      → regra oficial aplicada às datas da viagem (ex.: validade do passaporte)
 *   viagem       → antes da ida / no dia (decorre da própria viagem)
 *   sugestao     → margem de segurança sugerida pelo Bo Vair, dita assim (não é prazo oficial)
 *   a_confirmar  → depende de quem presta o serviço (PF, companhia aérea, atração)
 */
import { diasEntre, somarMeses } from './poupanca';
import type { Pais } from './moedas';

export type Etapa = 'concepcao' | 'documentos' | 'economia' | 'reservas' | 'antes' | 'durante' | 'volta';
export const ETAPAS: { id: Etapa; nome: string }[] = [
  { id: 'concepcao', nome: 'Ideia' },
  { id: 'documentos', nome: 'Documentos' },
  { id: 'economia', nome: 'Economia' },
  { id: 'reservas', nome: 'Reservas' },
  { id: 'antes', nome: 'Antes de partir' },
  { id: 'durante', nome: 'Durante' },
  { id: 'volta', nome: 'Volta' },
];

export interface Fonte { nome: string; url: string; consultadoEm: string }
export type TipoPrazo = 'oficial' | 'viagem' | 'sugestao' | 'a_confirmar';
export interface Tarefa {
  chave: string;
  etapa: Etapa;
  titulo: string;
  descricao: string;
  orientacao?: string;
  prazo?: string;
  tipoPrazo?: TipoPrazo;
  prazoTexto?: string;
  prioridade: 'alta' | 'media' | 'baixa';
  /** Concluída automaticamente pelos dados (ex.: hospedagem escolhida). */
  automatica?: boolean;
  /** Só informação (não há o que fazer). */
  informativa?: boolean;
  fonte?: Fonte;
  /** Leva para uma parte do app. */
  ir?: string;
}

export interface Diagnostico {
  passaporte?: 'sim' | 'nao' | 'vencido';
  validadePassaporte?: string;
  seguro?: 'sim' | 'nao';
  passagem?: 'sim' | 'nao';
  conexao?: 'sim' | 'nao' | 'nao_sei';
}

export interface Contexto {
  hoje: string;
  dataIda: string;
  noites: number;
  dataDefinida: boolean;
  destino: { nome: string; pais: Pais | null };
  residencia: Pais;
  /** País do passaporte (regras de visto dependem dele, não da residência). */
  passaporte: string;
  diagnostico: Diagnostico;
  temOrcamento: boolean;
  temHospedagem: boolean;
  atracoesComReserva: string[];
  meta: number;
  guardado: number;
  encerrada: boolean;
  /** Idioma do destino quando a pessoa não o fala (ou só revisa). */
  idioma?: { nome: string; jaFala: boolean } | null;
}

const C = '2026-11-17';
export const FONTES = {
  pf: { nome: 'Polícia Federal — Passaporte', url: 'https://www.gov.br/pt-br/servicos/passaporte', consultadoEm: C },
  pfPrazo: { nome: 'Polícia Federal — Entrega, prazos e acompanhamento', url: 'https://www.gov.br/pf/pt-br/assuntos/passaporte/ajuda/duvidas_/entrega/entrega-prazos-e-acompanhamento', consultadoEm: C },
  consular: { nome: 'Itamaraty — Portal Consular (orientações por país)', url: 'https://www.gov.br/mre/pt-br/assuntos/portal-consular', consultadoEm: C },
  etias: { nome: 'União Europeia — ETIAS (site oficial)', url: 'https://travel-europe.europa.eu/etias_pt', consultadoEm: C },
  ees: { nome: 'União Europeia — Sistema de Entrada/Saída (EES)', url: 'https://travel-europe.europa.eu/ees_pt', consultadoEm: C },
  schengen: { nome: 'União Europeia — Documentos de viagem para não europeus', url: 'https://europa.eu/youreurope/citizens/travel/entry-exit/non-eu-nationals/index_pt.htm', consultadoEm: C },
  saude: { nome: 'Ministério da Saúde — Saúde do viajante', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-do-viajante', consultadoEm: C },
  receita: { nome: 'Receita Federal — Guia do viajante (bagagem e cotas)', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/guia-do-viajante', consultadoEm: C },
} satisfies Record<string, Fonte>;

/** Taxa do passaporte comum (PF, consultada em 17/11/2026). Em centavos. */
export const TAXA_PASSAPORTE = { centavos: 25_725, fonte: FONTES.pf };

/** Países do espaço Schengen que o app conhece. */
const SCHENGEN = new Set(['PT', 'FR', 'ES', 'IT', 'DE', 'NL', 'CH']);

const menos = (iso: string, dias: number) => new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10) - dias)).toISOString().slice(0, 10);
export const dataBR = (iso: string) => iso.split('-').reverse().join('/');

export function dataVolta(c: Pick<Contexto, 'dataIda' | 'noites'>) {
  return menos(c.dataIda, -c.noites);
}

/** Passaporte vale o suficiente para o destino? null = não dá para saber (sem validade ou sem regra). */
export function passaporteValido(c: Contexto): { ok: boolean | null; precisaAte?: string } {
  if (c.diagnostico.passaporte !== 'sim') return { ok: false };
  const pais = c.destino.pais?.codigo ?? '';
  if (!SCHENGEN.has(pais)) return { ok: c.diagnostico.validadePassaporte ? c.diagnostico.validadePassaporte > dataVolta(c) : null, precisaAte: dataVolta(c) };
  // Schengen: válido por pelo menos 3 meses após a data prevista de saída.
  const precisaAte = somarMeses(dataVolta(c), 3);
  if (!c.diagnostico.validadePassaporte) return { ok: null, precisaAte };
  return { ok: c.diagnostico.validadePassaporte >= precisaAte, precisaAte };
}

export const internacional = (c: Pick<Contexto, 'destino' | 'residencia'>) => (c.destino.pais?.codigo ?? c.residencia.codigo) !== c.residencia.codigo;

export function gerarTarefas(c: Contexto): Tarefa[] {
  const t: Tarefa[] = [];
  const volta = dataVolta(c);
  const intl = internacional(c);
  const pais = c.destino.pais?.codigo ?? '';
  const schengenBR = SCHENGEN.has(pais) && c.passaporte === 'BR';
  const d = c.diagnostico;

  // ---- Ideia
  t.push({ chave: 'destino', etapa: 'concepcao', titulo: `Destino: ${c.destino.nome}`, descricao: intl ? 'Viagem internacional.' : 'Viagem nacional.', prioridade: 'alta', automatica: true });
  t.push(c.dataDefinida
    ? { chave: 'datas', etapa: 'concepcao', titulo: 'Datas definidas', descricao: `${dataBR(c.dataIda)} a ${dataBR(volta)}.`, prioridade: 'alta', automatica: true }
    : { chave: 'datas', etapa: 'concepcao', titulo: 'Fechar as datas', descricao: `Hoje a data é uma previsão (${dataBR(c.dataIda)}). Prazos e metas usam essa previsão e mudam quando você fixar a data.`, prioridade: 'alta', ir: 'editar' });
  t.push(c.temOrcamento
    ? { chave: 'orcamento', etapa: 'concepcao', titulo: 'Orçamento definido', descricao: 'Avisamos se o custo estimado passar dele.', prioridade: 'media', automatica: true }
    : { chave: 'orcamento', etapa: 'concepcao', titulo: 'Definir quanto pode gastar', descricao: 'Com um limite, o app avisa quando o roteiro passa dele e sugere trocas.', prioridade: 'media', ir: 'dinheiro' });

  // ---- Documentos (só o que vale para este destino)
  if (intl) {
    const pv = passaporteValido(c);
    if (d.passaporte === undefined) {
      t.push({ chave: 'diagnostico', etapa: 'documentos', titulo: 'Responder: você tem passaporte?', descricao: 'Com 3 perguntas rápidas o app mostra só os documentos que você precisa.', prioridade: 'alta', ir: 'diagnostico' });
    } else if (pv.ok === false) {
      const sugerido = menos(c.dataIda, 60);
      t.push({
        chave: 'passaporte', etapa: 'documentos', prioridade: 'alta', fonte: FONTES.pfPrazo,
        titulo: d.passaporte === 'sim' ? 'Renovar o passaporte' : 'Tirar o passaporte',
        descricao: d.passaporte === 'sim' && pv.precisaAte ? `O seu vence em ${dataBR(d.validadePassaporte!)}; para ${c.destino.nome} ele precisa valer até pelo menos ${dataBR(pv.precisaAte)}.` : 'Agende no site da Polícia Federal, pague a taxa (GRU) e compareça ao atendimento.',
        orientacao: `Taxa do passaporte comum: R$ 257,25 (consulta em ${dataBR(C)}). A PF informa o prazo de entrega no atendimento, e a disponibilidade de agendamento muda de cidade para cidade.`,
        prazo: sugerido < c.hoje ? c.hoje : sugerido, tipoPrazo: 'sugestao',
        prazoTexto: sugerido < c.hoje ? 'O quanto antes: faltam menos de 60 dias para a viagem' : 'Margem de segurança sugerida pelo Bo Vair (60 dias antes da ida), não é prazo oficial',
      });
    } else if (pv.ok === null) {
      t.push({ chave: 'validade', etapa: 'documentos', titulo: 'Informar a validade do passaporte', descricao: pv.precisaAte ? `Para ${c.destino.nome}, ele precisa valer até pelo menos ${dataBR(pv.precisaAte)}.` : 'Confira a validade exigida pelo país de destino.', prioridade: 'alta', ir: 'diagnostico', fonte: SCHENGEN.has(pais) ? FONTES.schengen : FONTES.consular, prazo: pv.precisaAte, tipoPrazo: 'oficial', prazoTexto: SCHENGEN.has(pais) ? 'Regra Schengen: 3 meses após a saída prevista' : undefined });
    } else {
      t.push({ chave: 'passaporte-ok', etapa: 'documentos', titulo: 'Passaporte válido para a viagem', descricao: `Vence em ${dataBR(d.validadePassaporte!)}${pv.precisaAte ? `; precisa valer até ${dataBR(pv.precisaAte)}` : ''}.`, prioridade: 'baixa', automatica: true, fonte: SCHENGEN.has(pais) ? FONTES.schengen : FONTES.consular });
    }

    if (schengenBR) {
      t.push({ chave: 'visto', etapa: 'documentos', titulo: 'Visto: brasileiros não precisam para turismo de até 90 dias', descricao: 'Vale para até 90 dias em qualquer período de 180 dias no espaço Schengen. A fronteira pode pedir passagem de volta, reservas, meios de se manter e seguro.', prioridade: 'baixa', informativa: true, fonte: FONTES.consular });
      t.push({ chave: 'etias', etapa: 'documentos', titulo: 'ETIAS (autorização eletrônica): ainda não está em funcionamento', descricao: 'A União Europeia anunciará a data de início com meses de antecedência. Até lá, não é exigido. Desconfie de sites que cobram por ele.', prioridade: 'baixa', informativa: true, fonte: FONTES.etias });
      t.push({ chave: 'ees', etapa: 'documentos', titulo: 'Registro biométrico na fronteira (EES)', descricao: 'Na primeira entrada, a fronteira registra digitais e foto. Pode levar mais tempo na fila.', prioridade: 'baixa', informativa: true, fonte: FONTES.ees });
    } else {
      t.push({ chave: 'visto', etapa: 'documentos', titulo: 'Conferir se precisa de visto', descricao: `As regras dependem do país do seu passaporte e do destino. Confira a página de ${c.destino.nome} no Portal Consular ou no consulado.`, prioridade: 'alta', fonte: FONTES.consular, tipoPrazo: 'a_confirmar', prazoTexto: 'Prazo a confirmar com o consulado' });
    }

    if (d.seguro !== 'sim') {
      t.push({ chave: 'seguro', etapa: 'documentos', titulo: 'Contratar seguro-viagem', descricao: schengenBR ? 'Para o espaço Schengen, a orientação é cobertura médica mínima de 30 mil euros, válida em todos os países e todas as datas da viagem. A fronteira pode pedir o comprovante.' : 'Confira se o destino exige seguro e qual cobertura mínima.', prioridade: schengenBR ? 'alta' : 'media', fonte: FONTES.consular, prazo: menos(c.dataIda, 1), tipoPrazo: 'viagem', prazoTexto: 'Antes da ida, cobrindo todas as datas' });
    }
    t.push({ chave: 'saude', etapa: 'documentos', titulo: 'Conferir vacinas e cuidados de saúde', descricao: 'Veja as recomendações para o destino. Algumas vacinas precisam ser tomadas com antecedência.', prioridade: 'media', fonte: FONTES.saude, tipoPrazo: 'a_confirmar', prazoTexto: 'Prazo depende da vacina: confirme no posto de saúde' });
    if (d.conexao === 'sim' || d.conexao === 'nao_sei') {
      t.push({ chave: 'conexao', etapa: 'documentos', titulo: 'Conferir regras do país da conexão', descricao: 'Alguns países pedem visto de trânsito, mesmo sem sair do aeroporto. Confira com a companhia aérea e o Portal Consular.', prioridade: 'media', fonte: FONTES.consular, tipoPrazo: 'a_confirmar', prazoTexto: 'Prazo a confirmar' });
    }
  }

  // ---- Economia
  t.push(c.meta > 0 && c.guardado >= c.meta
    ? { chave: 'meta', etapa: 'economia', titulo: 'Meta de economia atingida', descricao: 'Tudo o que a estimativa pede (com a reserva) já está guardado.', prioridade: 'alta', automatica: true }
    : { chave: 'meta', etapa: 'economia', titulo: 'Juntar o valor da viagem', descricao: 'Veja quanto falta, quanto guardar por mês e registre cada depósito.', prioridade: 'alta', ir: 'dinheiro', prazo: menos(c.dataIda, 1), tipoPrazo: 'viagem', prazoTexto: 'Até a ida' });
  if (intl) t.push({ chave: 'como-levar', etapa: 'economia', titulo: 'Decidir como levar o dinheiro', descricao: 'Espécie, cartão, conta internacional ou pré-pago: veja custos (IOF, spread) e simule a divisão.', prioridade: 'media', ir: 'dinheiro' });

  // ---- Reservas (com as datas reais)
  t.push(d.passagem === 'sim'
    ? { chave: 'passagem', etapa: 'reservas', titulo: 'Passagem comprada', descricao: 'Informe o valor em Dinheiro para entrar no total.', prioridade: 'alta', automatica: true }
    : { chave: 'passagem', etapa: 'reservas', titulo: 'Comprar a passagem', descricao: `Ida em ${dataBR(c.dataIda)}, volta em ${dataBR(volta)}. Depois, informe o valor em Dinheiro.`, prioridade: 'alta', tipoPrazo: 'a_confirmar', prazoTexto: 'Sem prazo oficial; preços variam com a antecedência' });
  t.push(c.temHospedagem
    ? { chave: 'hospedagem', etapa: 'reservas', titulo: 'Hospedagem escolhida', descricao: 'Confira a política de cancelamento na reserva.', prioridade: 'alta', automatica: true }
    : { chave: 'hospedagem', etapa: 'reservas', titulo: 'Escolher a hospedagem', descricao: `Check-in em ${dataBR(c.dataIda)}, check-out em ${dataBR(volta)}.`, prioridade: 'alta', ir: 'hospedagem' });
  if (c.atracoesComReserva.length) {
    t.push({ chave: 'ingressos', etapa: 'reservas', titulo: 'Reservar atrações com horário marcado', descricao: c.atracoesComReserva.join(', ') + '.', orientacao: 'Compre no site oficial de cada atração. A abertura de vendas é definida por cada uma.', prioridade: 'media', tipoPrazo: 'a_confirmar', prazoTexto: 'Prazo de venda a confirmar no site de cada atração', ir: 'roteiro' });
  }

  // ---- Antes de partir
  const vespera = menos(c.dataIda, 1);
  if (intl) t.push({ chave: 'cartao', etapa: 'antes', titulo: 'Habilitar o cartão para uso no exterior', descricao: 'Alguns bancos pedem para avisar ou liberar compras internacionais no aplicativo.', prioridade: 'media', prazo: vespera, tipoPrazo: 'viagem', prazoTexto: 'Antes da ida' });
  t.push({ chave: 'docs-mao', etapa: 'antes', titulo: 'Separar documentos e reservas', descricao: intl ? 'Passaporte, seguro, passagens, reserva da hospedagem e comprovante de volta, em papel e no celular.' : 'Documento com foto, passagens e reserva da hospedagem.', prioridade: 'alta', prazo: vespera, tipoPrazo: 'viagem', prazoTexto: 'Até a véspera' });
  t.push({ chave: 'checkin', etapa: 'antes', titulo: 'Fazer o check-in do voo', descricao: 'A janela de check-in on-line e a antecedência para chegar ao aeroporto são definidas pela companhia aérea.', prioridade: 'alta', tipoPrazo: 'a_confirmar', prazoTexto: 'Confira na sua companhia aérea' });
  if (c.idioma) t.push({ chave: 'idioma', etapa: 'antes', titulo: c.idioma.jaFala ? `Revisar o ${c.idioma.nome} de viagem` : `Aprender frases básicas em ${c.idioma.nome}`, descricao: 'Aulas curtas por tema: cumprimentar, pedir comida, perguntar o caminho, números, transporte, hotel, compras e emergência.', prioridade: c.idioma.jaFala ? 'baixa' : 'media', prazo: vespera, tipoPrazo: 'viagem', prazoTexto: 'Comece já: 15 minutos por dia até a viagem (sugestão)', ir: 'idioma' });
  t.push({ chave: 'offline', etapa: 'antes', titulo: 'Salvar o essencial fora do app', descricao: 'O app precisa de internet para mostrar a viagem: tire print do roteiro e anote o endereço e o telefone da hospedagem.', prioridade: 'baixa', prazo: vespera, tipoPrazo: 'viagem', prazoTexto: 'Até a véspera' });

  // ---- Durante
  t.push({ chave: 'roteiro-dia', etapa: 'durante', titulo: 'Seguir o roteiro e marcar o que já fez', descricao: 'Mude horários e troque lugares no próprio roteiro.', prioridade: 'media', ir: 'roteiro', prazo: volta, tipoPrazo: 'viagem', prazoTexto: 'Durante a viagem' });
  t.push({ chave: 'anotar-gastos', etapa: 'durante', titulo: 'Anotar os gastos na moeda local', descricao: 'O app converte e compara com o planejado.', prioridade: 'media', ir: 'dinheiro', prazo: volta, tipoPrazo: 'viagem', prazoTexto: 'Durante a viagem' });

  // ---- Volta
  t.push({ chave: 'ida-aeroporto', etapa: 'volta', titulo: 'Planejar o trajeto até o aeroporto', descricao: 'Do último lugar do roteiro ou da hospedagem. Considere o horário do check-out.', prioridade: 'alta', prazo: volta, tipoPrazo: 'viagem', prazoTexto: 'No dia da volta' });
  t.push({ chave: 'checkin-volta', etapa: 'volta', titulo: 'Check-in do voo de volta', descricao: 'Janela de check-in e antecedência no aeroporto: confira na companhia aérea.', prioridade: 'alta', tipoPrazo: 'a_confirmar', prazoTexto: 'Confira na sua companhia aérea' });
  if (intl && c.residencia.codigo === 'BR') {
    t.push({ chave: 'receita', etapa: 'volta', titulo: 'Conferir a cota da Receita Federal', descricao: 'Chegando de avião, a cota de isenção é de US$ 1.000 por pessoa (individual, não se soma à de familiares). O que passar é tributado em 50% e precisa ser declarado.', orientacao: 'Compras no free shop de saída entram na cota da bagagem. A cota do free shop de chegada tem regra própria: confira no guia.', prioridade: 'media', fonte: FONTES.receita, prazo: volta, tipoPrazo: 'viagem', prazoTexto: 'Na chegada ao Brasil' });
  }
  t.push(c.encerrada
    ? { chave: 'encerrar', etapa: 'volta', titulo: 'Viagem encerrada', descricao: 'Planejado × real e sua avaliação estão guardados.', prioridade: 'media', automatica: true }
    : { chave: 'encerrar', etapa: 'volta', titulo: 'Encerrar a viagem', descricao: 'Lance os últimos gastos, compare planejado × real e avalie o planejamento.', prioridade: 'media', ir: 'encerrar' });
  return t;
}

/** Em que etapa a viagem está hoje. */
export function etapaAtual(c: Contexto, pendentes: (e: Etapa) => number): Etapa {
  const volta = dataVolta(c);
  if (c.encerrada || c.hoje > volta) return 'volta';
  if (c.hoje >= c.dataIda) return 'durante';
  if (diasEntre(c.hoje, c.dataIda) <= 14) return 'antes';
  for (const e of ['concepcao', 'documentos', 'economia', 'reservas'] as Etapa[]) if (pendentes(e) > 0) return e;
  return 'antes';
}
