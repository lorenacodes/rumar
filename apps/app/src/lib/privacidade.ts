/**
 * Direitos do titular (LGPD, art. 18): baixar os dados e excluir a conta.
 * Exclusão: confere a senha, marca o pedido e dá 14 dias para desistir; depois a função
 * remover-contas (agendada) apaga a conta e tudo o que depende dela.
 */
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { hojeLocal } from './datas';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

import { supabase } from './supabase';

export const PRAZO_EXCLUSAO_DIAS = 14;
/** Contato de privacidade (encarregado). Vem da configuração do app, nunca fixo no código. */
export const CONTATO_PRIVACIDADE: string | null = (import.meta.env.VITE_CONTATO_PRIVACIDADE as string | undefined) || null;

export async function estadoExclusao(): Promise<{ pedidaEm: string; apagaEm: Date } | null> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data } = await supabase.from('profiles').select('deletion_requested_at').eq('user_id', u.user.id).maybeSingle();
  const em = data?.deletion_requested_at as string | null | undefined;
  return em ? { pedidaEm: em, apagaEm: new Date(new Date(em).getTime() + PRAZO_EXCLUSAO_DIAS * 86_400_000) } : null;
}

export async function pedirExclusao(senha: string): Promise<{ ok: true } | { ok: false; motivo: 'senha' | 'rede' }> {
  const { data: u } = await supabase.auth.getUser();
  const email = u.user?.email;
  if (!u.user || !email) return { ok: false, motivo: 'rede' };
  // Conferir a senha é a confirmação de que é a própria pessoa pedindo.
  const { error: e1 } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (e1) return { ok: false, motivo: 'senha' };
  const { error } = await supabase.from('profiles').update({ deletion_requested_at: new Date().toISOString() }).eq('user_id', u.user.id);
  return error ? { ok: false, motivo: 'rede' } : { ok: true };
}

export async function cancelarExclusao(): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return false;
  const { error } = await supabase.from('profiles').update({ deletion_requested_at: null }).eq('user_id', u.user.id);
  return !error;
}

/** Junta tudo o que o app guarda sobre a pessoa num arquivo JSON legível. */
export async function meusDados(): Promise<Record<string, unknown>> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error('sem sessão');
  const uid = u.user.id;
  const [perfil, consentimentos, plano, preferencias, favoritos, salvos, amizades, membros, fotos] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', uid).maybeSingle(),
    supabase.from('consents').select('*').eq('user_id', uid),
    supabase.from('savings_plan').select('*').eq('user_id', uid).maybeSingle(),
    supabase.from('travel_preferences').select('*').eq('user_id', uid).maybeSingle(),
    supabase.from('favorite_destinations').select('*').eq('user_id', uid),
    supabase.from('saved_places').select('*').eq('user_id', uid),
    supabase.from('friendships').select('*'),
    supabase.from('trip_members').select('trip_id, papel, status').eq('user_id', uid),
    supabase.from('fotos_enviadas').select('id, place_id, tipo, legenda, status, created_at, caminho').eq('user_id', uid),
  ]);
  const ids = (membros.data ?? []).map((m) => m.trip_id as string);
  const tabelas = ['trips', 'trip_items', 'trip_lodging', 'trip_expenses', 'trip_tasks', 'trip_savings', 'trip_spend', 'viagem_fotos'] as const;
  const viagens: Record<string, unknown> = {};
  if (ids.length) {
    const r = await Promise.all(tabelas.map((t) => (t === 'trips' ? supabase.from(t).select('*').in('id', ids) : supabase.from(t).select('*').in('trip_id', ids))));
    tabelas.forEach((t, i) => (viagens[t] = r[i]!.data ?? []));
  }
  return {
    gerado_em: new Date().toISOString(),
    aviso: 'Dados da sua conta no Bo Vair (LGPD, art. 18). A data de nascimento nunca foi guardada: só "maior de 18".',
    conta: { id: uid, email: u.user.email, criada_em: u.user.created_at },
    perfil: perfil.data, consentimentos: consentimentos.data, plano: plano.data, jeito_de_viajar: preferencias.data,
    destinos_favoritos: favoritos.data, lugares_salvos: salvos.data, amizades: amizades.data, participacao_em_viagens: membros.data, viagens, fotos_enviadas: fotos.data,
  };
}

/** Entrega o arquivo: no celular, pela folha de compartilhar do Android; no navegador, download. */
export async function baixarMeusDados(): Promise<'ok' | 'erro'> {
  try {
    const dados = JSON.stringify(await meusDados(), null, 2);
    const nome = `bovair-meus-dados-${hojeLocal()}.json`;
    if (Capacitor.isNativePlatform()) {
      const r = await Filesystem.writeFile({ path: nome, data: dados, directory: Directory.Cache, encoding: Encoding.UTF8 });
      await Share.share({ title: 'Meus dados no Bo Vair', url: r.uri, dialogTitle: 'Salvar ou enviar seus dados' });
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([dados], { type: 'application/json' }));
      a.download = nome;
      a.click();
      URL.revokeObjectURL(a.href);
    }
    return 'ok';
  } catch {
    return 'erro';
  }
}
