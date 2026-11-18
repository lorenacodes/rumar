import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { desfazerAmizade, perfilPublico, type PessoaPublica } from '../../lib/social';
import { listarViagens, type Viagem } from '../../lib/viagens';
import { Voltar } from '../../ui/pecas';
import { periodo, Rotulo } from '../viagens/comum';

/** Perfil de um amigo: só dados públicos e as viagens que ele compartilhou com os amigos. */
export function Pessoa() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  const [p, setP] = useState<(PessoaPublica & { amigos: boolean }) | null | undefined>(undefined);
  const [viagens, setViagens] = useState<Viagem[]>([]);
  useEffect(() => {
    void perfilPublico(id).then(setP);
    void listarViagens().then((v) => setViagens(v.deAmigos.filter((x) => x.user_id === id)));
  }, [id]);
  if (p === undefined) return <main className="tela" aria-busy="true" />;
  return (
    <main className="tela" data-tela="pessoa" data-real="pessoa">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para="/social" />
        <h1 style={{ margin: '6px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{p?.display_name ?? 'Pessoa'}</h1>
        <div style={{ fontSize: '15px', color: 'var(--texto-sec)' }}>{[p?.username ? `@${p.username}` : null, p?.origin_city, p?.amigos ? 'vocês são amigos' : null].filter(Boolean).join(' · ')}</div>
        <Rotulo>Viagens compartilhadas</Rotulo>
        {viagens.map((v) => (
          <button key={v.id} type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}`)} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', minHeight: '56px', alignItems: 'center', borderBottom: '1px solid var(--linha)', textAlign: 'left' }}>
            <span><b>{v.destino}</b><span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{periodo(v.data_ida, v.noites)}</span></span>
            <span aria-hidden>›</span>
          </button>
        ))}
        {!viagens.length ? <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: 0 }}>{p?.amigos ? 'Nenhuma viagem compartilhada com os amigos ainda.' : 'Viagens aparecem aqui quando vocês forem amigos e ela compartilhar.'}</p> : null}
        {p?.amigos ? (
          <button type="button" className="r-btn" onClick={() => { if (window.confirm('Desfazer a amizade?')) void desfazerAmizade(id).then(() => navegar('/perfil/amigos')); }} style={{ marginTop: '20px', minHeight: '44px', color: 'var(--vermelho)', fontWeight: 600 }}>Desfazer amizade</button>
        ) : null}
      </div>
    </main>
  );
}
