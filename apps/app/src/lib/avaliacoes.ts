/** Avaliações de quem foi (D-047): nota 1–5, comentário, acessibilidade e gasto por pessoa. */
import { supabase } from './supabase';

export type Acessivel = 'sim' | 'em_parte' | 'nao';
export type Wifi = 'sim' | 'nao';
export interface Avaliacao {
  id: string; nota: number; comentario: string | null; acessivel: Acessivel | null; wifi?: Wifi | null; gasto_centavos: number | null; gasto_moeda: string | null;
  visitou_em: string | null; usuario: string | null; created_at: string; minha: boolean;
}
export const NOME_ACESSIVEL: Record<Acessivel, string> = { sim: 'Acessível', em_parte: 'Acessível em parte', nao: 'Não acessível' };

export async function avaliacoesDoLugar(placeId: string): Promise<Avaliacao[]> {
  const { data, error } = await supabase.rpc('avaliacoes_do_lugar_v2', { p: placeId });
  if (!error) return (data ?? []) as Avaliacao[];
  const velho = await supabase.rpc('avaliacoes_do_lugar', { p: placeId });
  return (velho.data ?? []) as Avaliacao[];
}

export interface Midia { id: string; avaliacao_id: string; tipo: 'lugar' | 'prato' | 'video'; url: string }
/** Fotos e vídeos anexados às avaliações do lugar (até 3 por avaliação, D-072). */
export async function midiasDasAvaliacoes(placeId: string): Promise<Map<string, Midia[]>> {
  const { data } = await supabase.from('fotos_enviadas').select('id, avaliacao_id, tipo, caminho').eq('place_id', placeId).eq('status', 'aprovada').not('avaliacao_id', 'is', null).order('created_at').limit(300);
  const linhas = (data ?? []) as { id: string; avaliacao_id: string; tipo: Midia['tipo']; caminho: string }[];
  if (!linhas.length) return new Map();
  const { data: urls } = await supabase.storage.from('fotos-enviadas').createSignedUrls(linhas.map((l) => l.caminho), 60 * 60 * 6);
  const porCaminho = new Map((urls ?? []).filter((u) => u.signedUrl && u.path).map((u) => [u.path!, u.signedUrl as string]));
  const m = new Map<string, Midia[]>();
  for (const l of linhas) {
    const url = porCaminho.get(l.caminho); if (!url) continue;
    m.set(l.avaliacao_id, [...(m.get(l.avaliacao_id) ?? []), { id: l.id, avaliacao_id: l.avaliacao_id, tipo: l.tipo, url }]);
  }
  return m;
}

/** Média e quantidade de vários lugares de uma vez (para o mural e listas). */
export async function notasDosLugares(ids: string[]): Promise<Map<string, { media: number; quantidade: number }>> {
  if (!ids.length) return new Map();
  const { data } = await supabase.rpc('notas_dos_lugares', { ids: ids.slice(0, 300) });
  return new Map(((data ?? []) as { place_id: string; media: number; quantidade: number }[]).map((r) => [r.place_id, { media: Number(r.media), quantidade: r.quantidade }]));
}

export async function salvarAvaliacao(placeId: string, a: { nota: number; comentario: string; acessivel: Acessivel | null; wifi?: Wifi | null; gastoCentavos: number | null; moeda: string; visitouEm: string | null }): Promise<{ ok: true; id: string } | { ok: false; mensagem: string }> {
  const { data: s } = await supabase.auth.getSession();
  const uid = s.session?.user.id;
  if (!uid) return { ok: false, mensagem: 'Entre na sua conta para avaliar.' };
  const { data, error } = await supabase.from('avaliacoes').upsert({
    place_id: placeId, user_id: uid, nota: a.nota, comentario: a.comentario.trim() || null, acessivel: a.acessivel, wifi: a.wifi ?? null,
    gasto_centavos: a.gastoCentavos, gasto_moeda: a.gastoCentavos != null ? a.moeda : null, visitou_em: a.visitouEm, updated_at: new Date().toISOString(),
  }, { onConflict: 'place_id,user_id' }).select('id').single();
  return error || !data ? { ok: false, mensagem: 'Não deu para salvar a avaliação.' } : { ok: true, id: data.id as string };
}

/** Nota que eu já dei a cada lugar (para não pedir de novo). */
export async function minhasNotas(placeIds: string[]): Promise<Map<string, number>> {
  const { data: s } = await supabase.auth.getSession();
  const uid = s.session?.user.id;
  if (!uid || !placeIds.length) return new Map();
  const { data } = await supabase.from('avaliacoes').select('place_id, nota').eq('user_id', uid).in('place_id', placeIds.slice(0, 200));
  return new Map(((data ?? []) as { place_id: string; nota: number }[]).map((a) => [a.place_id, a.nota]));
}

/** Apaga a avaliação e as fotos/vídeos anexados a ela. */
export async function apagarAvaliacao(id: string) {
  const { data: m } = await supabase.from('fotos_enviadas').select('id, caminho').eq('avaliacao_id', id);
  if (m?.length) {
    await supabase.from('fotos_enviadas').delete().in('id', m.map((x) => x.id as string));
    await supabase.storage.from('fotos-enviadas').remove(m.map((x) => x.caminho as string));
  }
  await supabase.from('avaliacoes').delete().eq('id', id);
}

export async function denunciar(alvo: 'avaliacao' | 'foto', alvoId: string, motivo?: string): Promise<boolean> {
  const { data: s } = await supabase.auth.getSession();
  if (!s.session) return false;
  const { error } = await supabase.from('denuncias').insert({ alvo, alvo_id: alvoId, user_id: s.session.user.id, motivo: motivo ?? null });
  return !error || /duplicate/.test(error.message);
}

/** Resumo para mostrar: média, quantidade, acessibilidade (maioria) e gasto típico (mediana). */
export function resumir(lista: Avaliacao[]) {
  if (!lista.length) return null;
  const media = Math.round((lista.reduce((s, a) => s + a.nota, 0) / lista.length) * 10) / 10;
  const acess = lista.map((a) => a.acessivel).filter((x): x is Acessivel => Boolean(x));
  const conta = (k: Acessivel) => acess.filter((x) => x === k).length;
  const acessivel = acess.length ? (['sim', 'em_parte', 'nao'] as Acessivel[]).sort((x, y) => conta(y) - conta(x))[0]! : null;
  const gastos = lista.filter((a) => a.gasto_centavos != null && a.gasto_moeda).map((a) => ({ v: a.gasto_centavos!, m: a.gasto_moeda! }));
  const moeda = gastos[0]?.m ?? null;
  const mesmos = gastos.filter((g) => g.m === moeda).map((g) => g.v).sort((x, y) => x - y);
  const mediana = mesmos.length ? mesmos[Math.floor(mesmos.length / 2)]! : null;
  const wifis = lista.map((a) => a.wifi).filter((x): x is Wifi => Boolean(x));
  const wifiSim = wifis.filter((x) => x === 'sim').length;
  const wifi = wifis.length ? (wifiSim >= wifis.length - wifiSim ? 'sim' : 'nao') as Wifi : null;
  return { media, quantidade: lista.length, wifi, wifiQuantos: wifis.length, acessivel, acessivelQuantos: acess.length, gastoTipico: mediana, moeda, gastosQuantos: mesmos.length };
}

/** Minhas avaliações (D-061), com nome e cidade do lugar. */
export async function minhasAvaliacoes(): Promise<{ id: string; place_id: string; nota: number; comentario: string | null; created_at: string; nome: string; cidade: string | null; categoria: string | null }[]> {
  const { data: s } = await supabase.auth.getSession();
  const uid = s.session?.user.id;
  if (!uid) return [];
  const { data } = await supabase.from('avaliacoes').select('id, place_id, nota, comentario, created_at').eq('user_id', uid).order('created_at', { ascending: false }).limit(200);
  const lista = (data ?? []) as { id: string; place_id: string; nota: number; comentario: string | null; created_at: string }[];
  if (!lista.length) return [];
  const { data: lugares } = await supabase.from('lugares').select('id, nome, categoria, destino_id').in('id', lista.map((a) => a.place_id));
  const ids = [...new Set((lugares ?? []).map((l) => l.destino_id as string))];
  const { data: destinos } = ids.length ? await supabase.from('destinos').select('id, nome').in('id', ids) : { data: [] };
  const nomeDestino = new Map((destinos ?? []).map((d) => [d.id as string, d.nome as string]));
  const porId = new Map((lugares ?? []).map((l) => [l.id as string, l]));
  return lista.map((a) => { const l = porId.get(a.place_id); return { ...a, nome: (l?.nome as string) ?? 'Lugar', cidade: l ? nomeDestino.get(l.destino_id as string) ?? null : null, categoria: (l?.categoria as string) ?? null }; });
}
