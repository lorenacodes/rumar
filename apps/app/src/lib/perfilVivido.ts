/** Perfil do que a pessoa viveu: nota da cidade, lugares que amou e conexões (só dados reais, com RLS). */
import { supabase } from './supabase';

export interface NotaCidade { trip_id: string; nota: number; comentario: string | null }
export const MAX_COMENTARIO_CIDADE = 140;

/** Notas de cidade da pessoa nestas viagens (a RLS só devolve o que quem vê pode ver). */
export async function notasDaCidade(userId: string, tripIds: string[]): Promise<Map<string, NotaCidade>> {
  if (!tripIds.length) return new Map();
  const { data } = await supabase.from('avaliacoes_cidade').select('trip_id, nota, comentario').eq('user_id', userId).in('trip_id', tripIds.slice(0, 200));
  return new Map(((data ?? []) as NotaCidade[]).map((n) => [n.trip_id, n]));
}

export async function salvarNotaCidade(userId: string, tripId: string, nota: number, comentario: string): Promise<boolean> {
  const texto = comentario.replace(/\s+/g, ' ').trim().slice(0, MAX_COMENTARIO_CIDADE) || null;
  const { error } = await supabase.from('avaliacoes_cidade')
    .upsert({ user_id: userId, trip_id: tripId, nota: Math.round(Math.min(5, Math.max(1, nota))), comentario: texto, updated_at: new Date().toISOString() }, { onConflict: 'user_id,trip_id' });
  return !error;
}

export async function apagarNotaCidade(userId: string, tripId: string): Promise<boolean> {
  const { error } = await supabase.from('avaliacoes_cidade').delete().eq('user_id', userId).eq('trip_id', tripId);
  return !error;
}

export interface LugarAmado { id: string; nome: string; foto: string | null; nota: number; categoria: string | null }
/** Lugares que a pessoa avaliou com 4 ou 5 (avaliações já são públicas no app), com foto do próprio lugar. */
export async function lugaresAmados(userId: string, limite = 12): Promise<LugarAmado[]> {
  const { data } = await supabase.from('avaliacoes').select('place_id, nota, updated_at').eq('user_id', userId).gte('nota', 4)
    .order('nota', { ascending: false }).order('updated_at', { ascending: false }).limit(60);
  const linhas = (data ?? []) as { place_id: string; nota: number }[];
  if (!linhas.length) return [];
  const { data: lug } = await supabase.from('lugares').select('id, nome, foto, categoria').in('id', [...new Set(linhas.map((l) => l.place_id))]);
  const info = new Map(((lug ?? []) as { id: string; nome: string; foto: string | null; categoria: string | null }[]).map((l) => [l.id, l]));
  const vistos = new Set<string>();
  const lista: LugarAmado[] = [];
  for (const l of linhas) {
    const x = info.get(l.place_id);
    if (!x || vistos.has(x.id)) continue;
    vistos.add(x.id); lista.push({ ...x, nota: l.nota });
  }
  // Com foto primeiro: o perfil vende o lugar pela imagem.
  return lista.sort((a, b) => Number(Boolean(b.foto)) - Number(Boolean(a.foto)) || b.nota - a.nota).slice(0, limite);
}

export interface Conexoes { pessoas: { user_id: string; display_name: string; username: string | null }[]; total: number }
/** No meu perfil: meus amigos. No de outra pessoa: amigos em comum + total de amigos dela. */
export async function amigosDoPerfil(alvo: string): Promise<Conexoes> {
  const { data } = await supabase.rpc('amigos_do_perfil', { alvo });
  const linhas = (data ?? []) as { user_id: string | null; display_name: string | null; username: string | null; total: number }[];
  return {
    pessoas: linhas.filter((l) => l.user_id).map((l) => ({ user_id: l.user_id!, display_name: l.display_name || 'Viajante', username: l.username })),
    total: Number(linhas[0]?.total ?? 0),
  };
}
