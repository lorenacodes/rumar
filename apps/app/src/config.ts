/**
 * Configuração pública do app.
 *
 * A chave abaixo é a chave **publishable** do Supabase: ela vai dentro do app
 * instalado de qualquer forma e só permite o que as regras de segurança por linha
 * (RLS) deixam. Chaves secretas (service_role, Resend, FCM) nunca ficam aqui: só nas
 * Edge Functions.
 */
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://ofobfqzomviglkqjowkj.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_bd6m0CasUk3lUBfH__AEUg_vo7ZPVCY';

/** Versão dos textos legais aceitos (rascunho até revisão jurídica — seção 11). */
export const VERSAO_TEXTOS_LEGAIS = 'rascunho-2026-11-05';

/** Endereço que abre o app a partir dos links de e-mail (deep link). */
export const DEEP_LINK = 'com.rumar.app://auth';
