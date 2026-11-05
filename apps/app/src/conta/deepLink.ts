/**
 * Links dos e-mails (senha nova, confirmação, troca de e-mail) abrem o app pelo
 * endereço com.rumar.app://auth (configurado no AndroidManifest e no Supabase).
 */
import { App as CapApp } from '@capacitor/app';

import { supabase } from '../lib/supabase';

export function ouvirLinks(navegar: (rota: string) => void): () => void {
  const tratar = async (url: string) => {
    if (!url.startsWith('com.rumar.app://auth')) return;
    const u = new URL(url.replace('com.rumar.app://', 'https://app.rumar/'));
    const params = new URLSearchParams(u.search + '&' + u.hash.replace(/^#/, ''));
    if (params.get('error_code') === 'otp_expired' || params.get('error')) return navegar('/conta/link-vencido');
    const code = params.get('code');
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return navegar('/conta/link-vencido');
    }
  };
  const ouvinte = CapApp.addListener('appUrlOpen', (e) => void tratar(e.url));
  // Link de senha: o Supabase avisa com o evento PASSWORD_RECOVERY.
  const { data } = supabase.auth.onAuthStateChange((evento) => {
    if (evento === 'PASSWORD_RECOVERY') navegar('/conta/senha-nova');
  });
  return () => {
    void ouvinte.then((o) => o.remove());
    data.subscription.unsubscribe();
  };
}
