/**
 * Registro de erros do app (D-085): grava na tabela erros_app, sem dados pessoais. Até 5 por sessão e sem
 * repetir a mesma mensagem. Tira e-mails, números longos e endereços de internet da mensagem.
 */
import { supabase } from './supabase';

const vistos = new Set<string>();
let enviados = 0;
const limpar = (t: string) => t.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]').replace(/https?:\/\/\S+/g, '[url]').replace(/\d{6,}/g, '[n]');

export function registrarErro(erro: unknown, onde?: string) {
  try {
    const e = erro instanceof Error ? erro : new Error(String(erro));
    const mensagem = limpar(`${onde ? `${onde}: ` : ''}${e.message || 'erro sem mensagem'}`).slice(0, 300);
    if (vistos.has(mensagem) || enviados >= 5) return;
    vistos.add(mensagem); enviados++;
    const rota = (typeof location !== 'undefined' ? location.hash.split('?')[0] ?? '' : '').replace(/[0-9a-f-]{36}/g, ':id').slice(0, 120);
    void supabase.from('erros_app').insert({
      mensagem, pilha: e.stack ? limpar(e.stack).slice(0, 2000) : null, rota,
      versao: import.meta.env.VITE_VERSAO ?? 'dev', plataforma: /Android/i.test(navigator.userAgent) ? 'android' : /iPhone|iPad/i.test(navigator.userAgent) ? 'ios' : 'web',
    }).then(() => undefined, () => undefined);
  } catch { /* registrar erro nunca pode quebrar o app */ }
}

/** Liga a captura de erros não tratados (uma vez, no início do app). */
export function capturarErros() {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (ev) => registrarErro(ev.error ?? ev.message, 'janela'));
  window.addEventListener('unhandledrejection', (ev) => registrarErro(ev.reason, 'promessa'));
}
