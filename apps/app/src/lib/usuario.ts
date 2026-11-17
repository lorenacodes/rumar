/**
 * Nome de usuário (@), no estilo Instagram: único (sem diferenciar maiúsculas), usado para
 * encontrar amigos. As regras valem no banco (índice único, formato, reservados, troca a cada
 * 14 dias); aqui o app só ajuda a escrever certo e avisa antes de salvar.
 */
import { supabase } from './supabase';

export type Situacao = 'livre' | 'em_uso' | 'invalido' | 'reservado' | 'seu';

/** Converte o que a pessoa digita no formato aceito: "Ana Silva" → "ana.silva". */
export function normalizarUsuario(s: string): string {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9_.]/g, '')
    .replace(/\.{2,}/g, '.')
    .slice(0, 24);
}

/** Regra de formato (a mesma do banco). Devolve o problema em português, ou null. */
export function problemaNoFormato(u: string): string | null {
  if (u.length < 3) return 'Use pelo menos 3 caracteres.';
  if (u.length > 24) return 'Use no máximo 24 caracteres.';
  if (!/^[a-z0-9_.]+$/.test(u)) return 'Só letras minúsculas sem acento, números, ponto e sublinhado.';
  if (!/[a-z]/.test(u)) return 'Precisa ter pelo menos uma letra.';
  if (u.startsWith('.') || u.endsWith('.')) return 'Não pode começar nem terminar com ponto.';
  if (u.includes('..')) return 'Não pode ter dois pontos seguidos.';
  return null;
}

export async function situacao(u: string): Promise<Situacao> {
  const { data, error } = await supabase.rpc('usuario_disponivel', { nome: u });
  if (error) throw error;
  return data as Situacao;
}

/** Sugestões livres a partir do nome da pessoa (e do que ela tentou). */
export async function sugerir(nome: string, tentativa: string): Promise<string[]> {
  const partes = normalizarUsuario(nome).split('.').filter(Boolean);
  const base = partes.length ? partes : [normalizarUsuario(tentativa) || 'viajante'];
  const primeiro = base[0]!;
  const ultimo = base.length > 1 ? base[base.length - 1]! : '';
  const t = normalizarUsuario(tentativa).replace(/^\.+|\.+$/g, '');
  const ano = new Date().getFullYear();
  const candidatos = [
    ultimo ? `${primeiro}.${ultimo}` : '', ultimo ? `${primeiro}${ultimo}` : '', ultimo ? `${primeiro}_${ultimo}` : '',
    t ? `${t}.viaja` : '', t ? `${t}_${ano}` : '', `${primeiro}.viaja`, `${primeiro}.bovair`, `${primeiro}${String(ano).slice(2)}`,
    `${primeiro}.${Math.floor(100 + Math.random() * 900)}`,
  ].filter((c, i, a) => c && !problemaNoFormato(c) && a.indexOf(c) === i);
  const livres: string[] = [];
  for (const c of candidatos) {
    if (livres.length >= 3) break;
    try {
      if ((await situacao(c)) === 'livre') livres.push(c);
    } catch {
      break;
    }
  }
  return livres;
}

export async function meuUsuario(): Promise<{ username: string | null; alteradoEm: string | null; nome: string } | null> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  // select('*'): funciona antes e depois da migração do @ (coluna username_alterado_em).
  const { data } = await supabase.from('profiles').select('*').eq('user_id', u.user.id).maybeSingle();
  return data ? { username: (data.username as string | null) ?? null, alteradoEm: ((data as { username_alterado_em?: string | null }).username_alterado_em ?? null), nome: data.display_name as string } : null;
}

export type ErroUsuario = 'em_uso' | 'reservado' | 'troca_recente' | 'invalido' | 'rede';
export async function salvarUsuario(u: string): Promise<{ ok: true } | { ok: false; motivo: ErroUsuario }> {
  if (problemaNoFormato(u)) return { ok: false, motivo: 'invalido' };
  const { data: s } = await supabase.auth.getUser();
  if (!s.user) return { ok: false, motivo: 'rede' };
  const { error } = await supabase.from('profiles').update({ username: u }).eq('user_id', s.user.id);
  if (!error) return { ok: true };
  if (error.code === '23505') return { ok: false, motivo: 'em_uso' };
  if (/username_reservado/.test(error.message)) return { ok: false, motivo: 'reservado' };
  if (/username_troca_recente/.test(error.message)) return { ok: false, motivo: 'troca_recente' };
  if (error.code === '23514') return { ok: false, motivo: 'invalido' };
  return { ok: false, motivo: 'rede' };
}

/** Quando a pessoa pode trocar de novo (1 vez a cada 14 dias). */
export function podeTrocarEm(alteradoEm: string | null): Date | null {
  if (!alteradoEm) return null;
  const d = new Date(new Date(alteradoEm).getTime() + 14 * 86_400_000);
  return d > new Date() ? d : null;
}
