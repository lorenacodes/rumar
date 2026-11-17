import { useEffect, useState } from 'react';

import { useDemo } from '../dev/demo';

/**
 * Aviso quando o celular perde a internet (seção 9 da especificação): diz o que continua e o
 * que não funciona, em vez de telas que falham sem explicação. Some sozinho quando volta.
 */
export function SemInternet() {
  const demo = useDemo();
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [voltou, setVoltou] = useState(false);
  useEffect(() => {
    const ligar = () => { setOnline(true); setVoltou(true); setTimeout(() => setVoltou(false), 3000); };
    const desligar = () => { setOnline(false); setVoltou(false); };
    window.addEventListener('online', ligar);
    window.addEventListener('offline', desligar);
    return () => { window.removeEventListener('online', ligar); window.removeEventListener('offline', desligar); };
  }, []);
  if (demo || (online && !voltou)) return null;
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: 'calc(8px + env(safe-area-inset-top)) 16px 8px', background: online ? 'var(--verde)' : 'var(--fundo-escuro)', color: '#fff', font: "600 14px/19px 'Open Sans'", textAlign: 'center' }}>
      {online ? 'Internet de volta.' : 'Sem internet. O que já abriu continua na tela; para salvar mudanças ou ver lugares novos, conecte-se.'}
    </div>
  );
}
