/** Amigos e destinos favoritos (Supabase, com RLS). */
import { supabase } from './supabase';
import { eu } from './viagens';

export interface PessoaPublica { user_id: string; display_name: string; username: string | null; origin_city: string | null }
export interface Amizade { outro: PessoaPublica; status: 'pendente' | 'aceita' | 'recusada'; enviadaPorMim: boolean }

export async function buscarPessoas(termo: string): Promise<PessoaPublica[]> {
  if (termo.trim().length < 2) return [];
  const { data } = await supabase.rpc('buscar_pessoas', { termo });
  return (data ?? []) as PessoaPublica[];
}

export async function perfilPublico(id: string): Promise<(PessoaPublica & { amigos: boolean }) | null> {
  const { data } = await supabase.rpc('perfil_publico', { alvo: id });
  return ((data as (PessoaPublica & { amigos: boolean })[] | null)?.[0]) ?? null;
}

export async function minhasAmizades(): Promise<Amizade[]> {
  const uid = await eu();
  if (!uid) return [];
  const { data } = await supabase.from('friendships').select('requester, addressee, status');
  const linhas = (data ?? []) as { requester: string; addressee: string; status: Amizade['status'] }[];
  const lista = await Promise.all(
    linhas.map(async (l) => {
      const outroId = l.requester === uid ? l.addressee : l.requester;
      const p = await perfilPublico(outroId);
      return p ? { outro: p, status: l.status, enviadaPorMim: l.requester === uid } : null;
    }),
  );
  return lista.filter((x) => x !== null) as Amizade[];
}

export async function pedirAmizade(id: string) {
  const uid = await eu();
  // Se a outra pessoa já me pediu, aceito o pedido dela (D-085: um vínculo só por par).
  const { data: dela } = await supabase.from('friendships').select('status').eq('requester', id).eq('addressee', uid).maybeSingle();
  if (dela) {
    if (dela.status !== 'aceita') await responderAmizade(id, true);
    return true;
  }
  return !(await supabase.from('friendships').insert({ requester: uid, addressee: id })).error;
}
export async function responderAmizade(requester: string, aceitar: boolean) {
  const uid = await eu();
  await supabase.from('friendships').update({ status: aceitar ? 'aceita' : 'recusada', updated_at: new Date().toISOString() }).eq('requester', requester).eq('addressee', uid);
}
export async function desfazerAmizade(id: string) {
  const uid = await eu();
  await supabase.from('friendships').delete().or(`and(requester.eq.${uid},addressee.eq.${id}),and(requester.eq.${id},addressee.eq.${uid})`);
}

// ---------------------------------------------------------------- destinos favoritos
export interface Favorito { chave: string; nome: string; regiao: string | null; pais: string; destino_id?: string | null }

export async function meusFavoritos(): Promise<Favorito[]> {
  if (!(await supabase.auth.getSession()).data.session) return [];
  const { data } = await supabase.from('favorite_destinations').select('chave, nome, regiao, pais, destino_id').order('created_at');
  return (data ?? []) as Favorito[];
}
export async function favoritar(f: Favorito, sim: boolean) {
  const uid = await eu();
  if (!uid) return;
  if (sim) await supabase.from('favorite_destinations').upsert({ user_id: uid, ...f });
  else await supabase.from('favorite_destinations').delete().eq('user_id', uid).eq('chave', f.chave);
}
