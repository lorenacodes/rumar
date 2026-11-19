/**
 * Viagens no banco (Supabase): criar, carregar, editar o roteiro, hospedagem, gastos,
 * participantes e histórico. As regras de acesso (RLS) garantem que só participantes veem
 * e só dono/editores alteram; aqui o app só chama.
 */
import { nivelDoOrcamento, type Nivel, type NivelDoOrcamento } from './nivel';
import { regrasDaDieta } from './comida';
import { supabase } from './supabase';
import { lugarPorId, LUGARES, DESTINO_CURADORIA } from './catalogo';
import { candidatosRoteiro, lugaresPorIds } from './lugares';
import { mesclar, type Pessoa } from './grupo';
import { planejar, type Preferencias } from './planejador';
import type { Diagnostico } from './linhaDoTempo';

export interface Viagem {
  id: string;
  user_id: string;
  destino: string;
  data_ida: string;
  noites: number;
  viajantes: number;
  orcamento_centavos: number | null;
  visibilidade: 'privada' | 'amigos' | 'publica';
  data_definida?: boolean;
  moeda_destino?: string | null;
  guardado_centavos?: number;
  capacidade_mensal_centavos?: number | null;
  reserva_pct?: number;
  diagnostico?: Diagnostico;
  encerrada_em?: string | null;
  avaliacao?: number | null;
  comentario?: string | null;
  moeda_planejamento?: string;
  destino_id?: string | null;
  /** Nível escolhido na viagem; nulo = deduzido do orçamento (lib/nivel). */
  nivel?: Nivel | null;
}
export interface TarefaSalva { id: string; chave: string | null; etapa: string; titulo: string | null; descricao: string | null; prazo: string | null; ordem: number; feita: boolean }
export interface Aporte { id: string; valor_centavos: number; data: string; nota: string | null }
export interface GastoReal { id: string; data: string; categoria: string; descricao: string; valor_centavos: number; moeda: string; forma: string; taxa: number | null; taxa_fonte: string | null; valor_ref_centavos: number | null; moeda_ref: string | null; pago_por?: string | null; dividido_entre?: string[] | null; criado_por?: string | null }
export interface Item { id: string; trip_id: string; dia: number; periodo: string; ordem: number; place_id: string; situacao: string; adicionado_por: string | null; feito?: boolean; hora?: string | null }
export interface Membro { user_id: string; papel: 'dono' | 'editor' | 'leitor'; status: 'convidado' | 'ativo'; nome: string }
export interface Hospedagem { hotel_id: string; nome: string; endereco: string | null; lat: number | null; lon: number | null; foto: string | null; nota: number | null; checkin: string; checkout: string; total_centavos: number; moeda: string; fonte: string; cotado_em: string; cafe_incluso?: boolean | null }
export interface Gasto { id: string; categoria: string; descricao: string; valor_centavos: number; moeda: string }
export interface Evento { id: number; texto: string; created_at: string; autor: string | null }

export interface ViagemCompleta {
  viagem: Viagem;
  itens: Item[];
  membros: Membro[];
  hospedagem: Hospedagem | null;
  gastos: Gasto[];
  eventos: Evento[];
  papel: 'dono' | 'editor' | 'leitor' | null;
  pessoas: Pessoa[];
  tarefas: TarefaSalva[];
  aportes: Aporte[];
  gastosReais: GastoReal[];
}

export async function eu(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

async function registrar(tripId: string, texto: string) {
  const uid = await eu();
  if (uid) await supabase.from('trip_events').insert({ trip_id: tripId, autor: uid, texto: texto.slice(0, 200) });
}

/** Viagens em que participo (dono, editor, leitor ou convite pendente) e as compartilhadas por amigos. */
export async function listarViagens(): Promise<{ minhas: (Viagem & { papel: string; status: string })[]; deAmigos: Viagem[] }> {
  const uid = await eu();
  if (!uid) return { minhas: [], deAmigos: [] };
  const [membros, todas, amizades] = await Promise.all([
    supabase.from('trip_members').select('trip_id, papel, status').eq('user_id', uid),
    supabase.from('trips').select('id, user_id, destino, destino_id, data_ida, noites, viajantes, orcamento_centavos, visibilidade').order('data_ida'),
    supabase.from('friendships').select('requester, addressee').eq('status', 'aceita'),
  ]);
  // Viagem pública de quem não é amigo não entra aqui (aparece só no perfil da pessoa, D-055).
  const amigos = new Set((amizades.data ?? []).map((a) => (a.requester === uid ? a.addressee : a.requester) as string));
  const meu = new Map((membros.data ?? []).map((m) => [m.trip_id as string, m]));
  const viagens = (todas.data ?? []) as Viagem[];
  return {
    minhas: viagens.filter((v) => meu.has(v.id)).map((v) => ({ ...v, papel: meu.get(v.id)!.papel as string, status: meu.get(v.id)!.status as string })),
    deAmigos: viagens.filter((v) => !meu.has(v.id) && amigos.has(v.user_id)),
  };
}

/** Preferências de quem está na viagem (para o roteiro do grupo). */
export async function pessoasDaViagem(tripId: string): Promise<Pessoa[]> {
  const { data } = await supabase.rpc('preferencias_do_grupo_v2', { t: tripId });
  return ((data ?? []) as (Record<string, unknown> & { display_name: string; estilo: string | null })[]).map((r) => ({
    nome: r.display_name,
    preferencias: r.estilo ? ({ estilo: r.estilo, gostos: r.gostos, ritmo: r.ritmo, evitar: r.evitar, orcamento: r.orcamento, gratuitos: r.gratuitos, periodo: r.periodo, local: r.local, deslocamento: r.deslocamento, dieta: r.dieta ?? 'tudo', cozinhasAmo: r.cozinhas_amo ?? [], cozinhasEvito: r.cozinhas_evito ?? [], provar: r.provar ?? true } as unknown as Preferencias) : null,
  }));
}

/** Viagem para outro país (moeda diferente da do planejamento): passagem pesa mais no orçamento. */
export const viagemInternacional = (v: Viagem) => Boolean(v.moeda_destino && v.moeda_destino !== (v.moeda_planejamento ?? 'BRL'));

/** Nível de gasto da viagem: escolhido pela pessoa, ou deduzido do orçamento por pessoa por dia. */
export function nivelDaViagem(v: Viagem): { nivel: Nivel; escolhido: boolean; calculo: NivelDoOrcamento | null } | null {
  const calculo = nivelDoOrcamento(v.orcamento_centavos, v.viajantes, v.noites, v.moeda_planejamento ?? 'BRL', viagemInternacional(v));
  if (v.nivel) return { nivel: v.nivel, escolhido: true, calculo };
  return calculo ? { nivel: calculo.nivel, escolhido: false, calculo } : null;
}

/** Gera (ou refaz) o roteiro com as preferências de todos os participantes. */
export async function montarRoteiro(v: Viagem, pessoas: Pessoa[], reserva: Preferencias | null): Promise<void> {
  const base = mesclar(pessoas) ?? reserva;
  if (!base) return;
  // O orçamento da viagem manda no nível de gasto (D-030); sem orçamento, vale o jeito de viajar.
  const prefs = { ...base, orcamento: nivelDaViagem(v)?.nivel ?? base.orcamento };
  // Paris tem curadoria; as demais cidades usam os lugares já coletados da base.
  const destinoId = v.destino_id ?? (v.destino === 'Paris' ? DESTINO_CURADORIA : null);
  const candidatos = destinoId === DESTINO_CURADORIA || !destinoId ? LUGARES : await candidatosRoteiro(destinoId, prefs.orcamento, [...(prefs.cozinhasAmo ?? []), ...regrasDaDieta(prefs.dieta).favorece]);
  if (!candidatos.length) {
    await registrar(v.id, 'Roteiro vazio: ainda não há lugares coletados nesta cidade (pedido de coleta registrado).');
    return;
  }
  const { data: hosp } = await supabase.from('trip_lodging').select('lat, lon').eq('trip_id', v.id).maybeSingle();
  const inicio = typeof hosp?.lat === 'number' && typeof hosp?.lon === 'number' ? { lat: hosp.lat, lon: hosp.lon } : null;
  const dias = planejar(candidatos, prefs, { destino: v.destino, dataIda: v.data_ida, noites: v.noites, inicio });
  const uid = await eu();
  const linhas = dias.flatMap((d) => d.paradas.filter((p) => p.lugar).map((p, i) => ({ trip_id: v.id, dia: d.numero, periodo: p.periodo, ordem: i, hora: p.hora, place_id: p.lugar!.id, adicionado_por: uid })));
  await supabase.from('trip_items').delete().eq('trip_id', v.id);
  if (linhas.length) await supabase.from('trip_items').insert(linhas);
  await registrar(v.id, pessoas.length > 1 ? `Roteiro refeito com as preferências de ${pessoas.length} pessoas.` : 'Roteiro montado com o seu jeito de viajar.');
}

export async function criarViagem(dados: { destino: string; destinoId?: string | null; dataIda: string; noites: number; viajantes: number; orcamento: number | null; dataDefinida?: boolean; moedaDestino?: string | null; guardado?: number; capacidadeMensal?: number | null; diagnostico?: Diagnostico; moedaPlanejamento?: string }, prefs: Preferencias | null): Promise<string | null> {
  const uid = await eu();
  if (!uid) return null;
  const { data, error } = await supabase
    .from('trips')
    .insert({ user_id: uid, destino: dados.destino, destino_id: dados.destinoId ?? null, data_ida: dados.dataIda, noites: dados.noites, viajantes: dados.viajantes, orcamento_centavos: dados.orcamento, data_definida: dados.dataDefinida ?? true, moeda_destino: dados.moedaDestino ?? null, guardado_centavos: dados.guardado ?? 0, capacidade_mensal_centavos: dados.capacidadeMensal ?? null, diagnostico: dados.diagnostico ?? {}, moeda_planejamento: dados.moedaPlanejamento ?? 'BRL' })
    .select('id, user_id, destino, data_ida, noites, viajantes, orcamento_centavos, visibilidade, data_definida, moeda_destino, guardado_centavos, capacidade_mensal_centavos, reserva_pct, diagnostico, encerrada_em, avaliacao, comentario, moeda_planejamento, destino_id, nivel')
    .single();
  if (error || !data) return null;
  await registrar(data.id as string, 'Viagem criada.');
  await montarRoteiro(data as Viagem, await pessoasDaViagem(data.id as string), prefs);
  return data.id as string;
}

/** Viagem que a pessoa já fez fora do app (D-060): só para guardar fotos e lembranças. Sem roteiro nem custos. */
export async function registrarViagemFeita(dados: { destino: string; destinoId: string | null; dataIda: string; noites: number; viajantes: number; visibilidade?: 'privada' | 'amigos' }): Promise<string | null> {
  const uid = await eu();
  if (!uid) return null;
  const { data, error } = await supabase.from('trips')
    .insert({ user_id: uid, destino: dados.destino, destino_id: dados.destinoId, data_ida: dados.dataIda, noites: dados.noites, viajantes: dados.viajantes, orcamento_centavos: null, data_definida: true, encerrada_em: new Date().toISOString(), diagnostico: { registrada: true }, visibilidade: dados.visibilidade ?? 'privada' })
    .select('id').single();
  if (error || !data) return null;
  await registrar(data.id as string, 'Registrou uma viagem que já fez.');
  return data.id as string;
}

export async function carregarViagem(id: string): Promise<ViagemCompleta | null> {
  const uid = await eu();
  if (!uid) return null; // sem conta: nada a buscar (evita 9 pedidos recusados)
  const [v, itens, membros, hosp, gastos, eventos, tarefas, aportes, reais] = await Promise.all([
    supabase.from('trips').select('id, user_id, destino, data_ida, noites, viajantes, orcamento_centavos, visibilidade, data_definida, moeda_destino, guardado_centavos, capacidade_mensal_centavos, reserva_pct, diagnostico, encerrada_em, avaliacao, comentario, moeda_planejamento, destino_id, nivel').eq('id', id).maybeSingle(),
    supabase.from('trip_items').select('*').eq('trip_id', id).order('dia').order('ordem'),
    supabase.from('trip_members').select('user_id, papel, status').eq('trip_id', id),
    supabase.from('trip_lodging').select('*').eq('trip_id', id).maybeSingle(),
    supabase.from('trip_expenses').select('id, categoria, descricao, valor_centavos, moeda').eq('trip_id', id).order('created_at'),
    supabase.from('trip_events').select('id, texto, created_at, autor').eq('trip_id', id).order('created_at', { ascending: false }).limit(30),
    supabase.from('trip_tasks').select('id, chave, etapa, titulo, descricao, prazo, ordem, feita').eq('trip_id', id).order('ordem'),
    supabase.from('trip_savings').select('id, valor_centavos, data, nota').eq('trip_id', id).order('data'),
    supabase.from('trip_spend').select('id, data, categoria, descricao, valor_centavos, moeda, forma, taxa, taxa_fonte, valor_ref_centavos, moeda_ref, pago_por, dividido_entre, criado_por').eq('trip_id', id).order('data').order('created_at'),
  ]);
  if (!v.data) return null;
  // Lugares da base (outras cidades) usados no roteiro: traz os dados para o app.
  await lugaresPorIds(((itens.data ?? []) as Item[]).map((i) => i.place_id));
  const nomes = await Promise.all(
    (membros.data ?? []).map(async (m) => {
      const { data } = await supabase.rpc('perfil_publico', { alvo: m.user_id });
      return { ...(m as Omit<Membro, 'nome'>), nome: ((data as { display_name: string }[] | null)?.[0]?.display_name ?? 'Participante') as string };
    }),
  );
  const meu = nomes.find((m) => m.user_id === uid && m.status === 'ativo');
  return {
    viagem: v.data as Viagem,
    itens: (itens.data ?? []) as Item[],
    membros: nomes as Membro[],
    hospedagem: (hosp.data as Hospedagem | null) ?? null,
    gastos: (gastos.data ?? []) as Gasto[],
    eventos: (eventos.data ?? []) as Evento[],
    papel: (meu?.papel as ViagemCompleta['papel']) ?? null,
    pessoas: await pessoasDaViagem(id),
    tarefas: (tarefas.data ?? []) as TarefaSalva[],
    aportes: ((aportes.data ?? []) as Aporte[]).map((a) => ({ ...a, valor_centavos: Number(a.valor_centavos) })),
    gastosReais: ((reais.data ?? []) as GastoReal[]).map((g) => ({ ...g, valor_centavos: Number(g.valor_centavos), taxa: g.taxa === null ? null : Number(g.taxa), valor_ref_centavos: g.valor_ref_centavos === null ? null : Number(g.valor_ref_centavos) })),
  };
}

// ---------------------------------------------------------------- edição do roteiro
const nome = (placeId: string) => lugarPorId(placeId)?.nome ?? placeId;

export async function removerItem(it: Item) {
  await supabase.from('trip_items').delete().eq('id', it.id);
  await registrar(it.trip_id, `Tirou ${nome(it.place_id)} do dia ${it.dia}.`);
}
export async function adicionarItem(tripId: string, placeId: string, dia: number, periodo: string, sugestao = false, hora: string | null = null, primeiro = false) {
  const uid = await eu();
  const { data: ult } = await supabase.from('trip_items').select('ordem').eq('trip_id', tripId).eq('dia', dia).order('ordem', { ascending: false }).limit(1);
  const ordem = primeiro ? -1 : ((ult?.[0]?.ordem as number | undefined) ?? -1) + 1;
  const { error } = await supabase.from('trip_items').insert({ trip_id: tripId, dia, periodo, ordem, hora, place_id: placeId, adicionado_por: uid, situacao: sugestao ? 'sugerido' : 'confirmado' });
  if (!error) await registrar(tripId, `${sugestao ? 'Sugeriu' : 'Adicionou'} ${nome(placeId)} no dia ${dia}.`);
  return !error;
}
/** O hotel serve café da manhã? (D-054) Some com a sugestão de café quando "sim". */
export async function marcarCafeIncluso(tripId: string, sim: boolean | null) {
  await supabase.from('trip_lodging').update({ cafe_incluso: sim }).eq('trip_id', tripId);
}
export async function moverItem(it: Item, dia: number, ordem: number) {
  await supabase.from('trip_items').update({ dia, ordem }).eq('id', it.id);
  if (dia !== it.dia) await registrar(it.trip_id, `Mudou ${nome(it.place_id)} para o dia ${dia}.`);
}
export async function trocarItem(it: Item, novoPlaceId: string) {
  await supabase.from('trip_items').update({ place_id: novoPlaceId }).eq('id', it.id);
  await registrar(it.trip_id, `Trocou ${nome(it.place_id)} por ${nome(novoPlaceId)} no dia ${it.dia}.`);
}
export async function confirmarSugestao(it: Item) {
  await supabase.from('trip_items').update({ situacao: 'confirmado' }).eq('id', it.id);
  await registrar(it.trip_id, `Confirmou ${nome(it.place_id)}.`);
}

// ---------------------------------------------------------------- viagem, hospedagem e gastos
export async function atualizarViagem(id: string, parcial: Partial<Pick<Viagem, 'data_ida' | 'noites' | 'viajantes' | 'orcamento_centavos' | 'visibilidade' | 'data_definida' | 'guardado_centavos' | 'capacidade_mensal_centavos' | 'reserva_pct' | 'nivel' | 'diagnostico' | 'encerrada_em' | 'avaliacao' | 'comentario'>>, texto?: string) {
  await supabase.from('trips').update({ ...parcial, updated_at: new Date().toISOString() }).eq('id', id);
  await registrar(id, texto ?? (parcial.visibilidade ? ({ amigos: 'Mostrou o roteiro para os amigos.', publica: 'Deixou o roteiro público.', privada: 'Deixou a viagem só para o grupo.' } as const)[parcial.visibilidade] : 'Atualizou os dados da viagem.'));
}

export interface Hotel { id: string; nome: string; foto: string | null; endereco: string; lat: number; lon: number; estrelas: number | null; nota: number | null; avaliacoes: number | null; comodidades: string[]; total: number; porNoite: number }
export interface Busca { fonte: string; cotadoEm: string; moeda: string; noites: number; hoteis: Hotel[] }

/** A busca de hotéis está ligada? (a função responde 503 "nao_configurado" sem a chave) */
export async function hoteisLigados(): Promise<boolean> {
  const { error } = await supabase.functions.invoke('hoteis', { body: {} });
  if (!error) return true;
  try {
    const corpo = await (error as { context?: Response }).context?.json();
    return corpo?.erro !== 'nao_configurado';
  } catch {
    return true;
  }
}

export async function buscarHoteis(p: { lat: number; lon: number; checkin: string; checkout: string; adultos: number }): Promise<{ ok: true; dados: Busca } | { ok: false; mensagem: string }> {
  const { data, error } = await supabase.functions.invoke('hoteis', { body: p });
  if (error) {
    let mensagem = 'Não conseguimos buscar hotéis agora. Tente de novo.';
    try {
      const corpo = await (error as { context?: Response }).context?.json();
      if (corpo?.mensagem) mensagem = corpo.mensagem;
    } catch {
      /* resposta sem corpo */
    }
    return { ok: false, mensagem };
  }
  return { ok: true, dados: data as Busca };
}
export async function escolherHotel(tripId: string, h: Hotel, busca: Busca, checkin: string, checkout: string) {
  const uid = await eu();
  await supabase.from('trip_lodging').upsert({ trip_id: tripId, hotel_id: h.id, nome: h.nome, endereco: h.endereco, lat: h.lat, lon: h.lon, foto: h.foto, nota: h.nota, checkin, checkout, total_centavos: h.total, moeda: busca.moeda, fonte: busca.fonte, cotado_em: busca.cotadoEm, escolhido_por: uid });
  await registrar(tripId, `Escolheu a hospedagem ${h.nome}.`);
}
/** Hospedagem que a pessoa já reservou (D-054): da base de lugares da cidade, sem preço inventado. */
export async function procurarHospedagem(destinoId: string, termo: string): Promise<{ id: string; nome: string; endereco: string | null; lat: number; lon: number }[]> {
  const t = termo.trim().replace(/[,()%]/g, '');
  if (t.length < 3) return [];
  const { data } = await supabase.from('lugares').select('id, nome, endereco, lat, lon').eq('destino_id', destinoId).eq('categoria', 'hospedagem').ilike('nome', `%${t}%`).limit(8);
  return (data ?? []) as { id: string; nome: string; endereco: string | null; lat: number; lon: number }[];
}
export async function informarHospedagem(tripId: string, h: { id: string; nome: string; endereco: string | null; lat: number; lon: number }, checkin: string, checkout: string, cafe: boolean | null) {
  const uid = await eu();
  await supabase.from('trip_lodging').upsert({ trip_id: tripId, hotel_id: `lugar:${h.id}`, nome: h.nome, endereco: h.endereco, lat: h.lat, lon: h.lon, checkin, checkout, total_centavos: 0, moeda: 'BRL', fonte: 'informado por você', cotado_em: new Date().toISOString(), escolhido_por: uid, cafe_incluso: cafe });
  await registrar(tripId, `Informou a hospedagem ${h.nome}.`);
}
export async function adicionarGasto(tripId: string, g: { categoria: string; descricao: string; valor: number }) {
  const uid = await eu();
  await supabase.from('trip_expenses').insert({ trip_id: tripId, categoria: g.categoria, descricao: g.descricao, valor_centavos: g.valor, moeda: 'BRL', pago_por: uid });
  await registrar(tripId, `Informou um gasto: ${g.descricao}.`);
}
export async function removerGasto(tripId: string, id: string) {
  await supabase.from('trip_expenses').delete().eq('id', id);
  await registrar(tripId, 'Removeu um gasto informado.');
}

// ---------------------------------------------------------------- participantes
export async function convidar(tripId: string, userId: string, papel: 'editor' | 'leitor') {
  const uid = await eu();
  const { error } = await supabase.from('trip_members').insert({ trip_id: tripId, user_id: userId, papel, status: 'convidado', convidado_por: uid });
  if (!error) await registrar(tripId, 'Convidou um amigo para a viagem.');
  return !error;
}
export async function aceitarConvite(tripId: string) {
  const uid = await eu();
  await supabase.from('trip_members').update({ status: 'ativo' }).eq('trip_id', tripId).eq('user_id', uid);
  await registrar(tripId, 'Entrou na viagem.');
}
export async function sairDaViagem(tripId: string) {
  const uid = await eu();
  await supabase.from('trip_members').delete().eq('trip_id', tripId).eq('user_id', uid);
}
export async function mudarPapel(tripId: string, userId: string, papel: 'editor' | 'leitor') {
  await supabase.from('trip_members').update({ papel }).eq('trip_id', tripId).eq('user_id', userId);
}

/** Atualiza ao vivo quando outro participante muda algo. */
export function acompanhar(tripId: string, aoMudar: () => void): () => void {
  const canal = supabase.channel(`viagem-${tripId}`);
  for (const tabela of ['trip_items', 'trip_events', 'trip_lodging', 'trip_members', 'trip_expenses', 'trip_tasks', 'trip_savings', 'trip_spend']) {
    canal.on('postgres_changes' as never, { event: '*', schema: 'public', table: tabela, filter: `trip_id=eq.${tripId}` } as never, aoMudar as never);
  }
  canal.subscribe();
  return () => void supabase.removeChannel(canal);
}

// ---------------------------------------------------------------- linha do tempo, economia e gastos reais
/** "Fui aqui" (D-061): põe o lugar na viagem já marcado como feito. */
export async function adicionarVisitado(tripId: string, placeId: string, periodo: string): Promise<boolean> {
  const uid = await eu();
  const { data: ja } = await supabase.from('trip_items').select('id').eq('trip_id', tripId).eq('place_id', placeId).limit(1);
  if (ja?.length) { await supabase.from('trip_items').update({ feito: true }).eq('id', ja[0]!.id); return true; }
  const { data: ult } = await supabase.from('trip_items').select('ordem').eq('trip_id', tripId).eq('dia', 1).order('ordem', { ascending: false }).limit(1);
  const { error } = await supabase.from('trip_items').insert({ trip_id: tripId, dia: 1, periodo, ordem: ((ult?.[0]?.ordem as number | undefined) ?? -1) + 1, place_id: placeId, adicionado_por: uid, situacao: 'confirmado', feito: true });
  if (!error) await registrar(tripId, `Registrou que foi em ${nome(placeId)}.`);
  return !error;
}
export async function marcarFeito(it: Item, feito: boolean) {
  await supabase.from('trip_items').update({ feito }).eq('id', it.id);
  if (feito) await registrar(it.trip_id, `Marcou ${nome(it.place_id)} como feito.`);
}
export async function mudarHora(it: Item, hora: string | null) {
  await supabase.from('trip_items').update({ hora: hora || null }).eq('id', it.id);
  await registrar(it.trip_id, `Mudou o horário de ${nome(it.place_id)}${hora ? ` para ${hora}` : ''}.`);
}

/** Marca (ou desmarca) uma tarefa do sistema pela chave. */
export async function marcarTarefaSistema(tripId: string, chave: string, etapa: string, feita: boolean, titulo: string) {
  const uid = await eu();
  await supabase.from('trip_tasks').upsert({ trip_id: tripId, chave, etapa, feita, feita_em: feita ? new Date().toISOString() : null, criado_por: uid }, { onConflict: 'trip_id,chave' });
  if (feita) await registrar(tripId, `Concluiu: ${titulo}.`);
}
export async function marcarTarefaPessoal(t: TarefaSalva, tripId: string, feita: boolean) {
  await supabase.from('trip_tasks').update({ feita, feita_em: feita ? new Date().toISOString() : null }).eq('id', t.id);
  if (feita) await registrar(tripId, `Concluiu: ${t.titulo}.`);
}
export async function criarTarefa(tripId: string, dados: { etapa: string; titulo: string; prazo: string | null; ordem: number }) {
  const uid = await eu();
  const { error } = await supabase.from('trip_tasks').insert({ trip_id: tripId, etapa: dados.etapa, titulo: dados.titulo.slice(0, 120), prazo: dados.prazo, ordem: dados.ordem, criado_por: uid });
  if (!error) await registrar(tripId, `Criou a tarefa: ${dados.titulo.slice(0, 60)}.`);
  return !error;
}
export async function ordenarTarefas(pares: { id: string; ordem: number }[]) {
  await Promise.all(pares.map((p) => supabase.from('trip_tasks').update({ ordem: p.ordem }).eq('id', p.id)));
}
export async function removerTarefa(tripId: string, id: string) {
  await supabase.from('trip_tasks').delete().eq('id', id);
  await registrar(tripId, 'Removeu uma tarefa pessoal.');
}

export async function adicionarAporte(tripId: string, valor: number, nota: string | null) {
  const uid = await eu();
  const { error } = await supabase.from('trip_savings').insert({ trip_id: tripId, valor_centavos: valor, nota, criado_por: uid });
  if (!error) await registrar(tripId, valor > 0 ? 'Registrou um depósito na economia da viagem.' : 'Registrou uma retirada da economia da viagem.');
  return !error;
}
export async function removerAporte(tripId: string, id: string) {
  await supabase.from('trip_savings').delete().eq('id', id);
  await registrar(tripId, 'Removeu um registro da economia.');
}

export async function adicionarGastoReal(tripId: string, g: Omit<GastoReal, 'id'>) {
  const uid = await eu();
  const { error } = await supabase.from('trip_spend').insert({ trip_id: tripId, ...g, criado_por: uid });
  if (!error) await registrar(tripId, `Anotou um gasto: ${g.descricao}.`);
  return !error;
}
export async function removerGastoReal(tripId: string, id: string) {
  await supabase.from('trip_spend').delete().eq('id', id);
  await registrar(tripId, 'Removeu um gasto anotado.');
}
