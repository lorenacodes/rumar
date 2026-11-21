import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import { DESTINOS_COM_FOTO, FotoDestino } from './foto';

/** Fotos de lugares do destino passando no cartão da próxima viagem (sem movimento se a pessoa pediu menos animação). */
export function FotosQuePassam({ destinoId, nome }: { destinoId: string | null; nome: string }) {
  const [fotos, setFotos] = useState<{ foto: string; nome: string }[]>([]);
  const [i, setI] = useState(0);
  // Foto que não abre sai da roda (nada de ícone de imagem quebrada).
  const tirar = (foto: string) => { setFotos((fs) => fs.filter((f) => f.foto !== foto)); setI(0); };
  useEffect(() => {
    if (!destinoId) return;
    void supabase.from('lugares').select('foto, nome').eq('destino_id', destinoId).eq('ativo', true).not('foto', 'is', null)
      .in('categoria', ['praias', 'atracoes', 'historico', 'museus', 'parques', 'cultura', 'mercados']).order('fama', { ascending: false, nullsFirst: false }).limit(6)
      .then(({ data }) => setFotos((data ?? []) as { foto: string; nome: string }[]));
  }, [destinoId]);
  useEffect(() => {
    if (fotos.length < 2 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % fotos.length), 4000);
    return () => clearInterval(t);
  }, [fotos.length]);
  if (!fotos.length) return DESTINOS_COM_FOTO.includes(nome) ? <FotoDestino nome={nome} credito={false} /> : null;
  return (
    <>
      {fotos.map((f, k) => (
        <img key={f.foto} src={f.foto} alt="" loading={k ? 'lazy' : 'eager'} onError={() => tirar(f.foto)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: k === i ? 1 : 0, transition: 'opacity 900ms ease' }} />
      ))}
      <span style={{ position: 'absolute', right: 12, bottom: 10, zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '12px' }}>
        <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fotos[i]?.nome}</span>
        {fotos.length > 1 ? <span aria-hidden="true" style={{ display: 'flex', gap: '4px' }}>{fotos.map((f, k) => <span key={f.foto} style={{ width: '6px', height: '6px', borderRadius: '50%', background: k === i ? '#fff' : 'rgba(255,255,255,.45)' }} />)}</span> : null}
      </span>
    </>
  );
}

