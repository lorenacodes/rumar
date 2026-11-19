import { useEffect, useState } from 'react';

import { fotosDePerfil } from '../lib/amigos';

/** Foto de perfil de alguém (D-063); sem foto, a inicial do nome. */
export function Avatar({ userId, nome, tamanho = 40 }: { userId: string; nome: string; tamanho?: number }) {
  const [url, setUrl] = useState<string | null>(null);
  const [falhou, setFalhou] = useState(false);
  useEffect(() => { void fotosDePerfil([userId]).then((m) => setUrl(m.get(userId) ?? null)); }, [userId]);
  const caixa = { width: `${tamanho}px`, height: `${tamanho}px`, flex: 'none', borderRadius: '50%', overflow: 'hidden' } as const;
  if (url && !falhou) return <img src={url} alt="" onError={() => setFalhou(true)} style={{ ...caixa, objectFit: 'cover', display: 'block' }} />;
  return (
    <span aria-hidden="true" style={{ ...caixa, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--fundo-escuro)', color: '#fff', font: `600 ${Math.round(tamanho * 0.42)}px 'Lexend Exa'` }}>
      {(nome.trim()[0] ?? '?').toUpperCase()}
    </span>
  );
}
