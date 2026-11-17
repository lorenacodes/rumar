/**
 * Configuração pública do app.
 *
 * A chave abaixo é a chave **publishable** do Supabase: ela vai dentro do app
 * instalado de qualquer forma e só permite o que as regras de segurança por linha
 * (RLS) deixam. Chaves secretas (service_role, Resend, FCM) nunca ficam aqui: só nas
 * Edge Functions.
 */
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://iunrivtuhwaytmwclmui.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';

/** Versão dos textos legais aceitos (rascunho até revisão jurídica — seção 11). */
export const VERSAO_TEXTOS_LEGAIS = 'rascunho-2026-11-05';

/** Endereço que abre o app a partir dos links de e-mail (deep link). */
export const DEEP_LINK = 'com.bovair.app://auth';

/**
 * Quantos números tem o código que o Supabase manda por e-mail (cadastro e troca de
 * e-mail). TEM de ser igual a "Email OTP Length" no painel (Authentication → Sign In /
 * Providers → Email). Hoje o projeto gera 8 (conferido no banco em 17/11/2026).
 */
export const CODIGO_DIGITOS = Number(import.meta.env.VITE_CODIGO_DIGITOS ?? 8);

/** Validade do código, também configurada no painel ("Email OTP Expiration"). */
export const CODIGO_VALIDADE_MIN = 60;
