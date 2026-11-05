/**
 * Conta (seção 5 do design) sobre o Supabase Auth.
 * Regras: docs/ESPECIFICACAO.md, seções 5 e 8. Nada de senha, código ou e-mail em log.
 */
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { DEEP_LINK, VERSAO_TEXTOS_LEGAIS } from '../config';
import { supabase } from '../lib/supabase';
import { usePlano } from '../state/plano';

export type Resultado<T extends string> = { ok: true } | { ok: false; motivo: T };

/** Regras de senha mostradas nas telas 5.10 e 5.16. */
export function regrasSenha(senha: string) {
  return {
    tamanho: senha.length >= 8,
    letraENumero: /[A-Za-zÀ-ÿ]/.test(senha) && /\d/.test(senha),
  };
}

export function senhaValida(senha: string): boolean {
  const r = regrasSenha(senha);
  return r.tamanho && r.letraENumero;
}

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

// ---------------------------------------------------------------------------
// Limite de tentativas no aparelho (5.2): 5 erros → 15 minutos de pausa.
// O Supabase também limita tentativas no servidor.
// ---------------------------------------------------------------------------
const CHAVE_TENTATIVAS = 'rumar.tentativas';
const MAX_TENTATIVAS = 5;
const PAUSA_MS = 15 * 60 * 1000;

function lerTentativas(): { n: number; ate: number } {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_TENTATIVAS) ?? '') as { n: number; ate: number };
  } catch {
    return { n: 0, ate: 0 };
  }
}

export function pausaRestanteMs(): number {
  return Math.max(0, lerTentativas().ate - Date.now());
}

function registrarErro(): void {
  const t = lerTentativas();
  const n = t.n + 1;
  localStorage.setItem(CHAVE_TENTATIVAS, JSON.stringify(n >= MAX_TENTATIVAS ? { n: 0, ate: Date.now() + PAUSA_MS } : { n, ate: t.ate }));
}

function zerarTentativas(): void {
  localStorage.removeItem(CHAVE_TENTATIVAS);
}

// ---------------------------------------------------------------------------
// Criar conta e guardar o plano (5.3 → 5.5)
// ---------------------------------------------------------------------------
export async function criarConta(dados: {
  nome: string;
  email: string;
  senha: string;
  novidades: boolean;
}): Promise<Resultado<'existe' | 'rede' | 'invalido'>> {
  const { data, error } = await supabase.auth.signUp({
    email: dados.email.trim(),
    password: dados.senha,
    options: {
      emailRedirectTo: DEEP_LINK,
      data: { display_name: dados.nome.trim(), novidades_email: dados.novidades },
    },
  });
  if (error) {
    if (/registered|exists/i.test(error.message)) return { ok: false, motivo: 'existe' };
    if (error.status === 400 || error.status === 422) return { ok: false, motivo: 'invalido' };
    return { ok: false, motivo: 'rede' };
  }
  // Com confirmação por e-mail ligada, um e-mail já cadastrado volta sem identidades.
  if (data.user && (data.user.identities?.length ?? 0) === 0) return { ok: false, motivo: 'existe' };
  return { ok: true };
}

export async function reenviarCodigo(email: string, tipo: 'signup' | 'email_change'): Promise<boolean> {
  const { error } = await supabase.auth.resend({ type: tipo, email: email.trim() });
  return !error;
}

/** Confirma o código de 6 números (5.5) e, no cadastro, guarda perfil, consentimentos e plano. */
export async function confirmarCodigo(
  email: string,
  codigo: string,
  tipo: 'signup' | 'email_change',
): Promise<Resultado<'codigo' | 'menor' | 'rede'>> {
  const { data, error } = await supabase.auth.verifyOtp({ email: email.trim(), token: codigo, type: tipo });
  if (error || !data.session) return { ok: false, motivo: 'codigo' };
  if (tipo === 'signup') return finalizarCadastro(data.session);
  return { ok: true };
}

/** Cria o perfil e registra os consentimentos da tela 5.3. */
export async function finalizarCadastro(sessao: Session): Promise<Resultado<'menor' | 'rede'>> {
  const plano = usePlano.getState();
  // A data de nascimento nunca saiu do aparelho: só o resultado da tela 1.1.
  if (!plano.maior18) return { ok: false, motivo: 'menor' };
  const user = sessao.user;
  const meta = user.user_metadata as { display_name?: string; novidades_email?: boolean };

  const perfil = await supabase.from('profiles').upsert({
    user_id: user.id,
    display_name: meta.display_name ?? 'Viajante',
    origin_city: plano.cidade || null,
    language: plano.idiomaApp,
    spoken_languages: plano.idiomasFalados,
    birth_ok: true,
  });
  if (perfil.error) return { ok: false, motivo: 'rede' };

  const consentimentos = [
    { purpose: 'termos', granted: true },
    { purpose: 'privacidade', granted: true },
    { purpose: 'novidades_email', granted: !!meta.novidades_email },
  ];
  if (plano.avisos) {
    consentimentos.push(
      { purpose: 'avisos_preco', granted: plano.avisos.preco },
      { purpose: 'avisos_prazos', granted: plano.avisos.prazos },
      { purpose: 'avisos_resumo', granted: plano.avisos.resumo },
    );
  }
  const consent = await supabase
    .from('consents')
    .insert(consentimentos.map((c) => ({ ...c, user_id: user.id, text_version: VERSAO_TEXTOS_LEGAIS })));
  if (consent.error) return { ok: false, motivo: 'rede' };

  return guardarPlanoNaConta(user.id);
}

/** Guarda o plano deste aparelho na conta (5.3 e 5.7). */
export async function guardarPlanoNaConta(userId: string): Promise<Resultado<'rede'>> {
  const plano = usePlano.getState();
  const { error } = await supabase
    .from('savings_plan')
    .upsert({ user_id: userId, monthly_cents: plano.mensal, saved_cents: plano.guardado });
  return error ? { ok: false, motivo: 'rede' } : { ok: true };
}

export async function contaTemPlano(userId: string): Promise<boolean> {
  const { data } = await supabase.from('savings_plan').select('user_id').eq('user_id', userId).maybeSingle();
  return !!data;
}

// ---------------------------------------------------------------------------
// Entrar (5.1, 5.2, 28.7)
// ---------------------------------------------------------------------------
export async function entrar(email: string, senha: string): Promise<Resultado<'senha' | 'pausa' | 'nao_confirmado' | 'rede'>> {
  if (pausaRestanteMs() > 0) return { ok: false, motivo: 'pausa' };
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
  if (error) {
    if (/not confirmed/i.test(error.message)) return { ok: false, motivo: 'nao_confirmado' };
    if (error.status === 400) {
      registrarErro();
      return { ok: false, motivo: pausaRestanteMs() > 0 ? 'pausa' : 'senha' };
    }
    return { ok: false, motivo: 'rede' };
  }
  zerarTentativas();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Senha (5.8 a 5.12, 5.16)
// ---------------------------------------------------------------------------
export async function pedirLinkDeSenha(email: string): Promise<void> {
  // A mensagem seguinte (5.9) é a mesma exista ou não uma conta.
  await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: DEEP_LINK });
}

/** Salva a senha nova e sai da conta nos outros aparelhos (5.10, 5.16). */
export async function salvarSenhaNova(senha: string): Promise<Resultado<'igual' | 'fraca' | 'rede'>> {
  if (!senhaValida(senha)) return { ok: false, motivo: 'fraca' };
  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) return { ok: false, motivo: /different|same/i.test(error.message) ? 'igual' : 'rede' };
  await supabase.auth.signOut({ scope: 'others' });
  return { ok: true };
}

/** Confere a senha atual antes de mudanças sensíveis (5.15, 5.16). */
export async function conferirSenhaAtual(senha: string): Promise<boolean> {
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
  if (!email) return false;
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  return !error;
}

// ---------------------------------------------------------------------------
// Perfil (5.13 a 5.15) e sair (5.17, 5.18)
// ---------------------------------------------------------------------------
export interface Perfil {
  display_name: string;
  origin_city: string | null;
  email: string;
}

export async function carregarPerfil(): Promise<Perfil | null> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data } = await supabase.from('profiles').select('display_name, origin_city').eq('user_id', u.user.id).maybeSingle();
  if (!data) return null;
  return { ...data, email: u.user.email ?? '' };
}

export async function salvarPerfil(nome: string, cidade: string): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return false;
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: nome.trim(), origin_city: cidade.trim() || null })
    .eq('user_id', u.user.id);
  return !error;
}

export async function pedirTrocaDeEmail(novo: string): Promise<boolean> {
  const { error } = await supabase.auth.updateUser({ email: novo.trim() }, { emailRedirectTo: DEEP_LINK });
  return !error;
}

let saidaVoluntaria = false;

export async function sair(): Promise<void> {
  saidaVoluntaria = true;
  await supabase.auth.signOut();
}

/** Sessão atual, atualizada em tempo real. `undefined` enquanto carrega. */
export function useSessao(): Session | null | undefined {
  const [sessao, setSessao] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSessao(data.session));
    const { data } = supabase.auth.onAuthStateChange((_evento, s) => setSessao(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return sessao;
}

/** A sessão terminou sem a pessoa pedir (28.7)? */
export function sessaoTerminouSozinha(): boolean {
  const r = !saidaVoluntaria;
  saidaVoluntaria = false;
  return r;
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase() || 'R';
}
