/** Avaliações de quem foi (D-047): nota 1–5, comentário, acessibilidade e gasto por pessoa. */
import { supabase } from './supabase';

export type Acessivel = 'sim' | 'em_parte' | 'nao';
export interface Avaliacao {
  id: string; nota: number; comentario: string | null; acessivel: Acessivel | null; gasto_centavos: number | null; gasto_moeda: string | null;
  visitou_em: string | null; usuario: string | null; created_at: string; minha: boolean;
}
export const NOME_ACESSIVEL: Record<Acessivel, string> = { sim: 'Acessível', em_parte: 'Acessível em parte', nao: 'Não acessível' };

export async function avaliacoesDoLugar(placeId: string): Promise<Avaliacao[]> {
  const { data } = await supabase.rpc('avaliacoes_do_lugar', { p: placeId });
  return (data ?? []) as Avaliacao[];
}

/** Média e quantidade de vários lugares de uma vez (para o mural e listas). */
export async function notasDosLugares(ids: string[]): Promise<Map<string, { media: number; quantidade: number }>> {
  if (!ids.length) return new Map();
  const { data } = await supabase.rpc('notas_dos_lugares', { ids: ids.slice(0, 300) });
  return new Map(((data ?? []) as { place_id: string; media: number; quantidade: number }[]).map((r) => [r.place_id, { media: Number(r.media), quantidade: r.quantidade }]));
}

export async function salvarAvaliacao(placeId: string, a: { nota: number; comentario: string; acessivel: Acessivel | null; gastoCentavos: number | null; moeda: string; visitouEm: string | null }): Promise<{ ok: true } | { ok: false; mensagem: string }> {
  const { data: s } = await supabase.auth.getSession();
  const uid = s.session?.user.id;
  if (!uid) return { ok: false, mensagem: 'Entre na sua conta para avaliar.' };
  const { error } = await supabase.from('avaliacoes').upsert({
    place_id: placeId, user_id: uid, nota: a.nota, comentario: a.comentario.trim() || null, acessivel: a.acessivel,
    gasto_centavos: a.gastoCentavos, gasto_moeda: a.gastoCentavos != null ? a.moeda : null, visitou_em: a.visitouEm, updated_at: new Date().toISOString(),
  }, { onConflict: 'place_id,user_id' });
  return error ? { ok: false, mensagem: 'Não deu para salvar a avaliação.' } : { ok: true };
}

export async function apagarAvaliacao(id: string) {
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
  return { media, quantidade: lista.length, acessivel, acessivelQuantos: acess.length, gastoTipico: mediana, moeda, gastosQuantos: mesmos.length };
}
