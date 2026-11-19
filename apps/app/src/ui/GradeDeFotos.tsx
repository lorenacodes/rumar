import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apagarMinhaFotoQualquer, fotosDaPessoa, type FotoDaPessoa } from '../lib/fotosPessoa';

/** Grade de fotos de uma pessoa (D-082), 3 por linha; toque abre a foto com o atalho para a viagem ou o lugar. */
export function GradeDeFotos({ userId, vazio, max, minhas = false }: { userId: string; vazio?: string; max?: number; minhas?: boolean }) {
  const navegar = useNavigate();
  const [fotos, setFotos] = useState<FotoDaPessoa[] | null>(null);
  const [vendo, setVendo] = useState<FotoDaPessoa | null>(null);
  const [todas, setTodas] = useState(false);
  useEffect(() => { if (userId) void fotosDaPessoa(userId).then(setFotos); }, [userId]);
  if (fotos === null) return null;
  if (!fotos.length) return vazio ? <p style={{ fontSize: '15px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>{vazio}</p> : null;
  return (
    <>
      <div role="list" aria-label="Fotos" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', marginTop: '8px' }}>
        {(max && !todas ? fotos.slice(0, max) : fotos).map((f) => (
          <div role="listitem" key={f.id} style={{ display: 'contents' }}>
            <button type="button" className="r-btn" onClick={() => setVendo(f)} aria-label={f.titulo ? `Foto em ${f.titulo}` : 'Foto'} style={{ padding: 0, position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
              {f.tipo === 'video'
                ? <video src={f.url} muted playsInline preload="metadata" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block', background: '#000' }} />
                : <img src={f.url} alt="" loading="lazy" onError={() => setFotos((l) => l?.filter((x) => x !== f) ?? null)} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />}
            </button>
          </div>
        ))}
      </div>
      {max && fotos.length > max ? <button type="button" className="r-btn" onClick={() => setTodas(!todas)} style={{ minHeight: '44px', marginTop: '4px', color: 'var(--azul)', font: "600 15px 'Open Sans'" }}>{todas ? 'Ver menos' : `Ver todas (${fotos.length})`}</button> : null}
      {vendo ? (
        <div role="dialog" aria-label="Foto" onClick={() => setVendo(null)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,.92)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {vendo.tipo === 'video'
            ? <video src={vendo.url} controls autoPlay playsInline onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxHeight: '78vh' }} />
            : <img src={vendo.url} alt={vendo.titulo ?? ''} style={{ width: '100%', maxHeight: '78vh', objectFit: 'contain' }} />}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 16px', color: '#fff' }} onClick={(e) => e.stopPropagation()}>
            <b style={{ flex: 1, minWidth: 0 }}>{vendo.titulo ?? ''}</b>
            {vendo.trip_id ? <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${vendo.trip_id}?aba=roteiro`)} style={{ color: '#fff', fontWeight: 600, minHeight: '44px' }}>Ver a viagem</button>
              : vendo.place_id ? <button type="button" className="r-btn" onClick={() => navegar(`/lugar/${vendo.place_id}`)} style={{ color: '#fff', fontWeight: 600, minHeight: '44px' }}>Ver o lugar</button> : null}
            {minhas ? <button type="button" className="r-btn" onClick={() => { if (window.confirm('Apagar esta foto? Ela sai de todos os lugares do app.')) void apagarMinhaFotoQualquer(vendo).then((ok) => { if (ok) { setFotos((l) => l?.filter((x) => x.id !== vendo.id) ?? null); setVendo(null); } }); }} style={{ color: '#ff9b9b', fontWeight: 600, minHeight: '44px' }}>Apagar</button> : null}
            <button type="button" className="r-btn" onClick={() => setVendo(null)} style={{ color: '#fff', minHeight: '44px' }}>Fechar</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
