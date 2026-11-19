import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { minhasAvaliacoes } from '../../lib/avaliacoes';
import { CATEGORIAS_LUGAR, type CategoriaLugar } from '../../lib/lugares';
import { Estrelas } from '../../ui/estrelas';
import { Voltar } from '../../ui/pecas';

/** Minhas avaliações (D-061): os lugares que a pessoa avaliou, por cidade. */
export function MinhasAvaliacoes() {
  const navegar = useNavigate();
  const [lista, setLista] = useState<Awaited<ReturnType<typeof minhasAvaliacoes>> | null>(null);
  useEffect(() => void minhasAvaliacoes().then(setLista), []);
  const cidades = [...new Set((lista ?? []).map((a) => a.cidade ?? 'Outros lugares'))];
  return (
    <main className="tela" data-tela="minhas-avaliacoes" data-real="minhas-avaliacoes">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para="/perfil" />
        <h1 style={{ margin: '6px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Minhas avaliações</h1>
        {lista && !lista.length ? <p style={{ fontSize: '15px', color: 'var(--texto-sec)' }}>Nenhuma ainda. Em uma viagem, use "Onde você foi?".</p> : null}
        {cidades.map((c) => (
          <section key={c} aria-label={c}>
            <h2 style={{ font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--texto-sec)', margin: '18px 0 4px' }}>{c}</h2>
            {(lista ?? []).filter((a) => (a.cidade ?? 'Outros lugares') === c).map((a) => (
              <button key={a.id} type="button" className="r-btn" onClick={() => navegar(`/lugar/${a.place_id}`)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 0', borderBottom: '1px solid var(--linha)' }}>
                <b style={{ fontSize: '16px' }}>{a.nome}</b>
                <span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{a.categoria ? CATEGORIAS_LUGAR[a.categoria as CategoriaLugar]?.nome ?? '' : ''}</span>
                <Estrelas nota={a.nota} tamanho={14} />
                {a.comentario ? <span style={{ display: 'block', fontSize: '14px', lineHeight: '20px', marginTop: '2px' }}>{a.comentario}</span> : null}
              </button>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
