/**
 * Conta (seção 5 do design) sobre o Supabase Auth.
 * Regras: docs/ESPECIFICACAO.md, seções 5 e 8. Nada de senha, código ou e-mail em log.
 */
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { CODIGO_DIGITOS, CODIGO_VALIDADE_MIN, DEEP_LINK, VERSAO_TEXTOS_LEGAIS } from '../config';
import { useFluxoConta } from './fluxo';
import { supabase } from '../lib/supabase';
import { rotuloCidade, type Cidade } from '../lib/cidades';
import { useEscolhas } from '../state/escolhas';
import { usePlano } from '../state/plano';
import { sincronizarViajante, useViajante } from '../state/viajante';

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

const DOMINIOS_COMUNS = ['gmail.com', 'hotmail.com', 'outlook.com', 'live.com', 'yahoo.com', 'yahoo.com.br', 'icloud.com', 'uol.com.br', 'bol.com.br', 'terra.com.br'];

function distancia(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length]![b.length]!;
}

/** Sugere a correção de domínios digitados errado (ex.: "gamil.com" → "gmail.com"). */
export function sugerirEmail(email: string): string | null {
  const [nome, dominio] = email.trim().toLowerCase().split('@');
  if (!nome || !dominio || DOMINIOS_COMUNS.includes(dominio)) return null;
  const perto = DOMINIOS_COMUNS.find((d) => distancia(dominio, d) <= 2);
  return perto ? `${nome}@${perto}` : null;
}

// ---------------------------------------------------------------------------
// Limite de tentativas no aparelho (5.2): 5 erros → 15 minutos de pausa.
// O Supabase também limita tentativas no servidor.
// ---------------------------------------------------------------------------
const CHAVE_TENTATIVAS = 'bovair.tentativas';
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
}): Promise<Resultado<'existe' | 'rede' | 'invalido' | 'email_invalido' | 'limite_email' | 'email_nao_autorizado'>> {
  const { data, error } = await supabase.auth.signUp({
    email: dados.email.trim(),
    password: dados.senha,
    options: {
      emailRedirectTo: DEEP_LINK,
      data: { display_name: dados.nome.trim(), novidades_email: dados.novidades },
    },
  });
  if (error) {
    // Códigos do Supabase Auth: https://supabase.com/docs/guides/auth/debugging/error-codes
    if (error.code === 'email_address_invalid') return { ok: false, motivo: 'email_invalido' };
    if (error.code === 'over_email_send_rate_limit' || error.status === 429) return { ok: false, motivo: 'limite_email' };
    if (error.code === 'email_address_not_authorized') return { ok: false, motivo: 'email_nao_autorizado' };
    if (error.code === 'user_already_exists' || /registered|exists/i.test(error.message)) return { ok: false, motivo: 'existe' };
    if (error.status === 400 || error.status === 422) return { ok: false, motivo: 'invalido' };
    return { ok: false, motivo: 'rede' };
  }
  // Com confirmação por e-mail ligada, um e-mail já cadastrado volta sem identidades.
  if (data.user && (data.user.identities?.length ?? 0) === 0) return { ok: false, motivo: 'existe' };
  return { ok: true };
}

/**
 * Pede um código novo. O Supabase só deixa pedir de novo depois de alguns segundos e
 * limita quantos e-mails saem por hora: as duas respostas viram mensagens claras.
 */
export async function reenviarCodigo(
  email: string,
  tipo: 'signup' | 'email_change',
): Promise<{ ok: true } | { ok: false; motivo: 'espera'; segundos: number } | { ok: false; motivo: 'limite' | 'rede' }> {
  const { error } = await supabase.auth.resend({ type: tipo, email: email.trim(), options: { emailRedirectTo: DEEP_LINK } });
  if (!error) {
    useFluxoConta.getState().set({ enviadoEm: Date.now(), erros: 0 });
    return { ok: true };
  }
  const segundos = /after (\d+) seconds?/i.exec(error.message)?.[1];
  if (segundos) return { ok: false, motivo: 'espera', segundos: Number(segundos) };
  if (error.status === 429 || error.code === 'over_email_send_rate_limit') return { ok: false, motivo: 'limite' };
  return { ok: false, motivo: 'rede' };
}

export type MotivoCodigo = 'formato' | 'invalido' | 'vencido' | 'muitas_tentativas' | 'menor' | 'rede';

/**
 * Confirma o código do e-mail (5.5). O Supabase gera o código, guarda só o resumo
 * criptográfico (e-mail + código) junto do usuário e confere aqui: o código precisa
 * ter exatamente CODIGO_DIGITOS números e valer para ESTE e-mail. No cadastro, em
 * seguida guarda perfil, consentimentos e plano.
 */
export async function confirmarCodigo(email: string, codigo: string, tipo: 'signup' | 'email_change'): Promise<Resultado<MotivoCodigo>> {
  if (!new RegExp(`^\\d{${CODIGO_DIGITOS}}$`).test(codigo)) return { ok: false, motivo: 'formato' };
  const fluxo = useFluxoConta.getState();
  const { data, error } = await supabase.auth.verifyOtp({ email: email.trim(), token: codigo, type: tipo });
  if (error || !data.session) {
    if (error?.status === 429 || error?.code === 'over_request_rate_limit') return { ok: false, motivo: 'muitas_tentativas' };
    if (error && !error.status) return { ok: false, motivo: 'rede' };
    fluxo.set({ erros: fluxo.erros + 1 });
    // O Supabase responde igual para código errado e vencido; pela hora do envio dá para saber qual.
    const vencido = fluxo.enviadoEm > 0 && Date.now() - fluxo.enviadoEm > CODIGO_VALIDADE_MIN * 60_000;
    return { ok: false, motivo: vencido ? 'vencido' : 'invalido' };
  }
  fluxo.set({ erros: 0 });
  if (tipo === 'signup') return finalizarCadastro(data.session);
  return { ok: true };
}

/**
 * Traz da conta para o aparelho o que está no banco (perfil e plano), para o app mostrar
 * os dados da pessoa em qualquer celular, depois de atualizar ou entrar de novo.
 */
export async function carregarDaConta(): Promise<void> {
  const { data: s } = await supabase.auth.getSession();
  const user = s.session?.user;
  if (!user) return;
  const [perfil, plano] = await Promise.all([
    supabase.from('profiles').select('display_name, origin_city, origin, language, spoken_languages, birth_ok').eq('user_id', user.id).maybeSingle(),
    supabase.from('savings_plan').select('monthly_cents, saved_cents').eq('user_id', user.id).maybeSingle(),
  ]);
  const atual = usePlano.getState();
  const parcial: Partial<typeof atual> = {};
  if (perfil.data) {
    if (perfil.data.birth_ok) parcial.maior18 = true;
    if (perfil.data.origin_city) parcial.cidade = perfil.data.origin_city as string;
    if (perfil.data.origin) parcial.origem = perfil.data.origin as Cidade;
  }
  if (plano.data) {
    parcial.mensal = plano.data.monthly_cents as number;
    parcial.guardado = plano.data.saved_cents as number;
  }
  if (Object.keys(parcial).length) atual.atualizar(parcial);
  await sincronizarViajante();
}

/** Cria o perfil e registra os consentimentos da tela 5.3. */
let finalizando: Promise<Resultado<'menor' | 'rede'>> | null = null;

/** Evita gravar duas vezes quando o código e o evento de entrada chegam juntos. */
export function finalizarCadastro(sessao: Session): Promise<Resultado<'menor' | 'rede'>> {
  finalizando ??= finalizarCadastroUmaVez(sessao).finally(() => {
    finalizando = null;
  });
  return finalizando;
}

async function finalizarCadastroUmaVez(sessao: Session): Promise<Resultado<'menor' | 'rede'>> {
  const plano = usePlano.getState();
  // A data de nascimento nunca saiu do aparelho: só o resultado da tela 1.1.
  if (!plano.maior18) return { ok: false, motivo: 'menor' };
  const user = sessao.user;
  const meta = user.user_metadata as { display_name?: string; novidades_email?: boolean };

  const perfil = await supabase.from('profiles').upsert({
    user_id: user.id,
    display_name: meta.display_name ?? 'Viajante',
    origin_city: plano.cidade || null,
    origin: plano.origem,
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
  await garantirPerfil();
  return { ok: true };
}

/**
 * Conta confirmada pelo link do e-mail (e não pelo código) ainda não tem perfil:
 * cria na primeira vez que a pessoa entra. Os termos e a privacidade foram aceitos na
 * tela 5.3 (o botão só funciona com as duas caixas marcadas).
 */
export async function garantirPerfil(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  const sessao = data.session;
  if (!sessao) return false;
  const existe = await supabase.from('profiles').select('user_id').eq('user_id', sessao.user.id).maybeSingle();
  if (existe.error) return false;
  if (existe.data) return true;
  if (finalizando) return (await finalizando).ok;
  const r = await finalizarCadastro(sessao);
  return r.ok;
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
  /** Cidade escolhida da lista (contas antigas podem ter só o texto). */
  origem?: Cidade | null;
  /** Endereço temporário (1 hora) da foto privada; nulo sem foto. */
  foto?: string | null;
}

const PASTA_FOTOS = 'fotos-perfil';
const caminhoFoto = (userId: string) => `${userId}/perfil.jpg`;

export async function carregarPerfil(): Promise<Perfil | null> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  let { data } = await supabase.from('profiles').select('display_name, origin_city, origin, photo_updated_at').eq('user_id', u.user.id).maybeSingle();
  // Sem perfil (conta criada antes da correção): cria agora e lê de novo.
  if (!data && (await garantirPerfil())) {
    ({ data } = await supabase.from('profiles').select('display_name, origin_city, origin, photo_updated_at').eq('user_id', u.user.id).maybeSingle());
  }
  if (!data) return null;
  let foto: string | null = null;
  if (data.photo_updated_at) {
    const assinada = await supabase.storage.from(PASTA_FOTOS).createSignedUrl(caminhoFoto(u.user.id), 3600);
    // O número da versão evita mostrar a foto antiga guardada no aparelho.
    if (assinada.data) foto = `${assinada.data.signedUrl}&v=${Date.parse(data.photo_updated_at as string)}`;
  }
  return { display_name: data.display_name, origin_city: data.origin_city, origem: (data.origin as Cidade | null) ?? null, email: u.user.email ?? '', foto };
}

export async function salvarPerfil(nome: string, origem: Cidade | null): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return false;
  const cidade = origem ? rotuloCidade(origem) : null;
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: nome.trim(), origin_city: cidade, origin: origem })
    .eq('user_id', u.user.id);
  // O plano do aparelho passa a sair da mesma cidade.
  if (!error && origem) usePlano.getState().atualizar({ cidade: cidade ?? '', origem });
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
  // O plano e as escolhas são da conta que saiu: não ficam à mostra para quem entrar
  // depois neste aparelho (eles continuam guardados no banco e voltam ao entrar).
  usePlano.getState().limpar();
  useEscolhas.setState({ valores: {}, consentimentoNecessidades: false });
  useViajante.getState().limpar();
  useFluxoConta.getState().set({ email: '', erros: 0, enviadoEm: 0 });
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

// ---------------------------------------------------------------------------
// Foto de perfil (5.14): reduzida no aparelho e guardada em pasta privada.
// ---------------------------------------------------------------------------
/** Recorta no centro em quadrado de 512 px e salva como JPEG (fica com ~50 a 150 KB). */
async function prepararFoto(arquivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo);
  const lado = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('sem canvas');
  ctx.drawImage(bitmap, (bitmap.width - lado) / 2, (bitmap.height - lado) / 2, lado, lado, 0, 0, 512, 512);
  bitmap.close();
  return new Promise((ok, erro) => canvas.toBlob((b) => (b ? ok(b) : erro(new Error('falhou'))), 'image/jpeg', 0.85));
}

export async function enviarFoto(arquivo: File): Promise<Resultado<'tipo' | 'rede'>> {
  if (!arquivo.type.startsWith('image/')) return { ok: false, motivo: 'tipo' };
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return { ok: false, motivo: 'rede' };
  let blob: Blob;
  try {
    blob = await prepararFoto(arquivo);
  } catch {
    return { ok: false, motivo: 'tipo' };
  }
  const envio = await supabase.storage.from(PASTA_FOTOS).upload(caminhoFoto(u.user.id), blob, { upsert: true, contentType: 'image/jpeg' });
  if (envio.error) return { ok: false, motivo: 'rede' };
  const { error } = await supabase.from('profiles').update({ photo_updated_at: new Date().toISOString() }).eq('user_id', u.user.id);
  return error ? { ok: false, motivo: 'rede' } : { ok: true };
}

export async function removerFoto(): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return false;
  const apagou = await supabase.storage.from(PASTA_FOTOS).remove([caminhoFoto(u.user.id)]);
  if (apagou.error) return false;
  const { error } = await supabase.from('profiles').update({ photo_updated_at: null }).eq('user_id', u.user.id);
  return !error;
}
