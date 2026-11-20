/**
 * Links dos e-mails (senha nova, confirmação, troca de e-mail) abrem o app pelo
 * endereço com.bovair.app://auth (configurado no AndroidManifest e no Supabase).
 */
import { App as CapApp } from '@capacitor/app';

import { supabase } from '../lib/supabase';
import { carregarDaConta, concluirRetornoWeb, garantirPerfil } from './servico';

export function ouvirLinks(navegar: (rota: string) => void): () => void {
  const tratar = async (url: string) => {
    if (!url.startsWith('com.bovair.app://auth')) return;
    const u = new URL(url.replace('com.bovair.app://', 'https://app.bovair/'));
    const params = new URLSearchParams(u.search + '&' + u.hash.replace(/^#/, ''));
    if (params.get('error_code') === 'otp_expired' || params.get('error')) return navegar('/conta/link-vencido');
    const code = params.get('code');
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return navegar('/conta/link-vencido');
    }
    // Confirmação de cadastro pelo link: cria o perfil e segue como se fosse o código (5.5).
    const tipo = params.get('type');
    if (tipo === 'signup' || tipo === 'email') {
      if (await garantirPerfil()) navegar('/inicio');
    }
  };
  const ouvinte = CapApp.addListener('appUrlOpen', (e) => void tratar(e.url));
  // Na web, a volta do Google chega como ?code= nesta mesma página.
  void concluirRetornoWeb().then((ok) => { if (ok) navegar('/inicio'); });
  // Link de senha: o Supabase avisa com o evento PASSWORD_RECOVERY.
  const { data } = supabase.auth.onAuthStateChange((evento, sessao) => {
    if (evento === 'PASSWORD_RECOVERY') navegar('/conta/senha-nova');
    // Qualquer entrada (código, link ou senha) garante o perfil, fora do callback do Supabase.
    // Também ao abrir o app já logado (INITIAL_SESSION): contas antigas ganham o perfil.
    if ((evento === 'SIGNED_IN' || evento === 'INITIAL_SESSION') && sessao) {
      // Cria o perfil se faltar e traz perfil e plano do banco para este aparelho.
      setTimeout(() => void garantirPerfil().then(() => carregarDaConta()), 0);
    }
  });
  return () => {
    void ouvinte.then((o) => o.remove());
    data.subscription.unsubscribe();
  };
}
