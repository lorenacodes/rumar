import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import '../../styles/curiosos.css';
import { compartilharCuriosidade, curiosidade, curiosidades, gravarSemSombrios, lerSemSombrios, type Curiosidade } from '../../lib/curiosidades';
import { useViajante } from '../../state/viajante';
import { Abas } from '../../ui/abas';
import { Check } from '../../ui/check';

function Ficha({ c, n, primeira }: { c: Curiosidade; n: number; primeira: boolean }) {
  const { salvos, alternarSalvo } = useViajante();
  const quero = salvos.includes(c.id);
  const [aviso, setAviso] = useState<string | null>(null);
  const [falhou, setFalhou] = useState(false);
  if (falhou) return null;
  return (
    <article className="ficha" aria-label={c.nome}>
      <div className="ficha-foto">
        <img src={c.foto} alt={`Foto de ${c.nome}`} loading={primeira ? 'eager' : 'lazy'} onError={() => setFalhou(true)} />
        {c.foto_pagina ? <a href={c.foto_pagina} target="_blank" rel="noreferrer">Foto: Wikimedia Commons</a> : null}
      </div>
      <div className="ficha-etiqueta">
        <div className="ficha-numero"><span>Nº {String(n).padStart(4, '0')}</span><span>{c.pais ?? ''}</span></div>
        <h2 className="ficha-nome">{c.nome}</h2>
        {c.descricao ? <div className="ficha-desc">{c.descricao}</div> : null}
        {c.porque ? <p className="ficha-porque"><span>Por que visitam</span>{c.porque}</p> : null}
        {c.resumo ? (
          <p className="ficha-sabia"><b>Você sabia?</b> {c.resumo}{' '}
            {c.resumo_url ? <a href={c.resumo_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--texto-sec)' }}>Wikipédia</a> : null}
          </p>
        ) : null}
        <div className="ficha-acoes">
          <button type="button" className="r-btn ficha-acao" aria-pressed={quero} onClick={() => void alternarSalvo(c.id)}>{quero ? <><Check />Quero ir</> : '+ Quero ir'}</button>
          <button type="button" className="r-btn ficha-acao" onClick={() => void compartilharCuriosidade(c).then((r) => { if (r === 'copiado') { setAviso('Texto copiado'); setTimeout(() => setAviso(null), 2000); } })}>Compartilhar</button>
          <a className="ficha-acao" href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lon}`} target="_blank" rel="noreferrer">Onde fica</a>
        </div>
        {aviso ? <div role="status" style={{ fontSize: '12px', color: 'var(--verde)', paddingBottom: '4px' }}>{aviso}</div> : null}
      </div>
    </article>
  );
}

/** Curiosidades do mundo (D-039): uma ficha por tela, deslizando para cima. Ordem muda todo dia. */
export function Curiosos() {
  const navegar = useNavigate();
  const [params] = useSearchParams();
  const [itens, setItens] = useState<Curiosidade[]>([]);
  const [pagina, setPagina] = useState(0);
  const [fim, setFim] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const fundo = useRef<HTMLDivElement>(null);
  const rolagem = useRef<HTMLDivElement>(null);
  const inicial = params.get('c');
  const [semSombrios, setSemSombrios] = useState(lerSemSombrios);
  useEffect(() => { setItens([]); setPagina(0); setFim(false); }, [semSombrios]);

  useEffect(() => {
    if (fim) return;
    let vivo = true;
    setCarregando(true);
    void (async () => {
      const lote = await curiosidades(pagina, 10, semSombrios);
      const primeira = pagina === 0 && inicial ? await curiosidade(inicial) : null;
      if (!vivo) return;
      setItens((atual) => {
        const juntos = [...(primeira ? [primeira] : []), ...atual, ...lote];
        return juntos.filter((c, i) => juntos.findIndex((x) => x.id === c.id) === i);
      });
      setFim(lote.length < 10);
      setCarregando(false);
    })();
    return () => { vivo = false; };
  }, [pagina, fim, inicial, semSombrios]);

  useEffect(() => {
    const alvo = fundo.current;
    if (!alvo || fim) return;
    const obs = new IntersectionObserver((e) => { if (e[0]?.isIntersecting && !carregando) setPagina((n) => n + 1); }, { root: rolagem.current, rootMargin: '0px 0px 200% 0px' });
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [carregando, fim, itens.length]);

  return (
    <main className="tela" data-tela="curiosos" data-real="curiosos" style={{ background: 'var(--fundo-escuro)' }}>
      <div className="gabinete-topo">
        <button type="button" className="r-btn" aria-label="Voltar" onClick={() => (window.history.length > 1 ? navegar(-1) : navegar('/inicio'))} style={{ minWidth: '44px', minHeight: '44px', color: '#fff', fontSize: '22px' }}>←</button>
        <b style={{ font: "600 16px 'Lexend Exa'", letterSpacing: '-0.02em', flex: 1 }}>Curiosidades do mundo</b>
        <button type="button" className="r-btn" aria-pressed={semSombrios} onClick={() => { gravarSemSombrios(!semSombrios); setSemSombrios(!semSombrios); }}
          style={{ minHeight: '36px', padding: '0 10px', borderRadius: '999px', font: "600 12px 'Open Sans'", color: semSombrios ? 'var(--fundo-escuro)' : '#fff', background: semSombrios ? 'var(--amarelo)' : 'rgba(255,255,255,.18)' }}>
          Sem lugares sombrios
        </button>
      </div>
      <div className="gabinete" ref={rolagem} aria-busy={carregando}>
        {itens.map((c, i) => <Ficha key={c.id} c={c} n={i + 1} primeira={i === 0} />)}
        {!itens.length && !carregando ? <p style={{ color: '#fff', padding: '80px 20px' }}>As curiosidades estão chegando. Volte daqui a pouco.</p> : null}
        <div ref={fundo} style={{ height: '1px' }} />
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}
