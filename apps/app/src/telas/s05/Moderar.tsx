import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { avaliacoesDenunciadas, esconderAvaliacao, filaDeModeracao, moderar, souModerador, type Pendente } from '../../lib/fotosEnviadas';
import { basePorId, lugaresPorIds } from '../../lib/lugares';
import { Abas } from '../../ui/abas';
import { Voltar } from '../../ui/pecas';

/** Fila de aprovação de fotos enviadas (só moderadores, D-034). */
export function Moderar() {
  const navegar = useNavigate();
  const [pode, setPode] = useState<boolean | undefined>(undefined);
  const [fila, setFila] = useState<Pendente[] | null>(null);
  const [denunciadas, setDenunciadas] = useState<Awaited<ReturnType<typeof avaliacoesDenunciadas>>>([]);
  const carregar = () => void filaDeModeracao().then(async (f) => { await lugaresPorIds(f.map((x) => x.place_id)); setFila(f); });
  useEffect(() => void souModerador().then((s) => { setPode(s); if (s) { carregar(); void avaliacoesDenunciadas().then(setDenunciadas); } }), []);
  if (pode === false) return <Navigate to="/perfil" replace />;
  const decidir = (id: string, s: 'aprovada' | 'recusada') => void moderar(id, s).then(() => setFila((f) => (f ?? []).filter((x) => x.id !== id)));
  return (
    <main className="tela" data-tela="moderar" data-real="moderar">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para="/perfil" />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Perfil · Moderação</div>
        <h1 style={{ margin: '4px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Moderação</h1>
        <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)' }}>Aprove só se a foto é do lugar (ou de um prato de lá), sem pessoas que dê para reconhecer e sem nada impróprio. Na dúvida, recuse.</p>
        {denunciadas.length ? (
          <section aria-label="Avaliações denunciadas" style={{ marginTop: '12px' }}>
            <h2 style={{ font: "600 18px 'Lexend Exa'", margin: 0 }}>Avaliações denunciadas</h2>
            {denunciadas.map((a) => (
              <div key={a.id} style={{ borderTop: '1px solid var(--linha)', padding: '8px 0' }}>
                <div style={{ fontSize: '14px' }}><b>{a.nota} de 5</b> · {a.denuncias} {a.denuncias === 1 ? 'denúncia' : 'denúncias'}</div>
                {a.comentario ? <p style={{ margin: '4px 0', fontSize: '15px' }}>“{a.comentario}”</p> : null}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="r-btn" onClick={() => navegar(`/lugar/${a.place_id}`)} style={{ color: 'var(--azul)', fontWeight: 600, minHeight: '40px' }}>Ver o lugar ›</button>
                  <button type="button" className="r-btn" onClick={() => void esconderAvaliacao(a.id).then((ok) => ok && setDenunciadas((l) => l.filter((x) => x.id !== a.id)))} style={{ minHeight: '40px', padding: '0 12px', border: '2px solid var(--vermelho)', color: 'var(--vermelho)', fontWeight: 600 }}>Esconder</button>
                </div>
              </div>
            ))}
          </section>
        ) : null}
        <h2 style={{ font: "600 18px 'Lexend Exa'", margin: '16px 0 0' }}>Fotos e vídeos</h2>
        {fila === null ? <p>Carregando…</p> : !fila.length ? <p style={{ fontSize: '15px' }}>Nenhuma foto esperando.</p> : null}
        {(fila ?? []).map((f) => {
          const b = basePorId(f.place_id);
          return (
            <article key={f.id} style={{ marginTop: '16px', borderTop: '1px solid var(--linha)', paddingTop: '12px' }}>
              {f.url ? (f.tipo === 'video'
                ? <video src={f.url} controls playsInline style={{ width: '100%', maxHeight: '420px', background: '#000', display: 'block' }} />
                : <img src={f.url} alt="Foto enviada" style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', background: 'var(--cartao-2)', display: 'block' }} />) : null}
              <div style={{ fontSize: '14px', lineHeight: '20px', marginTop: '6px' }}>
                <b>{b?.nome ?? f.place_id}</b> · {f.tipo === 'prato' ? 'prato' : f.tipo === 'video' ? 'vídeo' : 'lugar'} · {new Date(f.created_at).toLocaleDateString('pt-BR')}
                {f.legenda ? <div>“{f.legenda}”</div> : null}
                <button type="button" className="r-btn" onClick={() => navegar(`/lugar/${f.place_id}`)} style={{ color: 'var(--azul)', fontWeight: 600, minHeight: '36px' }}>Ver o lugar ›</button>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button type="button" className="r-btn" onClick={() => decidir(f.id, 'recusada')} style={{ flex: 1, height: '48px', border: '2px solid var(--vermelho)', color: 'var(--vermelho)', font: "600 15px 'Open Sans'" }}>Recusar</button>
                <button type="button" className="r-btn" onClick={() => decidir(f.id, 'aprovada')} style={{ flex: 1, height: '48px', background: 'var(--verde)', color: '#fff', font: "600 15px 'Open Sans'" }}>Aprovar</button>
              </div>
            </article>
          );
        })}
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}
