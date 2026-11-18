import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/feed.css';
import { DESTINO_CURADORIA, horarioLegivel, LUGARES } from '../../lib/catalogo';
import { capasPorCategoria, CATEGORIAS_LUGAR, feedLugares, nomeTipo, ORDEM_CATEGORIAS, paraLugar, type CategoriaLugar, type Destino, type LugarBase } from '../../lib/lugares';
import { afinidade, NOME_CATEGORIA, type Lugar } from '../../lib/planejador';
import { listarViagens } from '../../lib/viagens';
import { useViajante } from '../../state/viajante';
import { FotoLugar, temFoto } from '../../ui/foto';

/** Um post do feed: lugar da base (com foto do Commons ou cartão de texto) ou da curadoria de Paris. */
interface Post {
  id: string;
  nome: string;
  tipo: string;
  bairro: string | null;
  foto: string | null;
  fotoPagina: string | null;
  curadoria: boolean;
  categoria: CategoriaLugar | null;
  gratuito: boolean;
  horario: string | null;
  cozinha: string | null;
  lat?: number;
  lon?: number;
  lugar: Lugar | null;
}

const deBase = (b: LugarBase): Post => ({
  id: b.id, nome: b.nome, tipo: nomeTipo(b.tipo), bairro: b.bairro, foto: b.foto, fotoPagina: b.foto_pagina, curadoria: false, categoria: b.categoria,
  gratuito: b.gratuito === true, horario: b.horario, cozinha: b.cozinha, lat: b.lat, lon: b.lon, lugar: paraLugar(b),
});
const deCuradoria = (l: Lugar): Post => ({
  id: l.id, nome: l.nome, tipo: NOME_CATEGORIA[l.categoria], bairro: l.area || null, foto: null, fotoPagina: null, curadoria: true, categoria: null,
  gratuito: l.custo === 0, horario: l.horario ?? null, cozinha: null, lat: l.lat, lon: l.lon, lugar: l,
});

/** Cores do cartão de texto (lugar sem foto livre), por categoria. */
const COR: Partial<Record<CategoriaLugar, string>> = {
  restaurantes: 'linear-gradient(150deg,#d9480f,#f59f00)', bares: 'linear-gradient(150deg,#5f3dc4,#d6336c)', cafes: 'linear-gradient(150deg,#8d5a3b,#e8a87c)',
  'vida-noturna': 'linear-gradient(150deg,#1b1f3b,#7048e8)', parques: 'linear-gradient(150deg,#2b8a3e,#94d82d)', praias: 'linear-gradient(150deg,#1971c2,#3bc9db)',
  museus: 'linear-gradient(150deg,#0b1f4b,#1f4fd8)', historico: 'linear-gradient(150deg,#5c3d2e,#c08552)', cultura: 'linear-gradient(150deg,#862e9c,#f06595)',
  compras: 'linear-gradient(150deg,#c2255c,#ff8787)', mercados: 'linear-gradient(150deg,#e67700,#ffd43b)', lazer: 'linear-gradient(150deg,#0c8599,#63e6be)',
  atracoes: 'linear-gradient(150deg,#1f4fd8,#ffc83d)', hospedagem: 'linear-gradient(150deg,#364fc7,#748ffc)',
};

function PostLugar({ p, aoAbrir, viagemDoDestino }: { p: Post; aoAbrir: () => void; viagemDoDestino: string | null }) {
  const { salvos, alternarSalvo, preferencias } = useViajante();
  const salvo = salvos.includes(p.id);
  const [pulo, setPulo] = useState(0);
  const ultimoToque = useRef(0);
  const navegar = useNavigate();
  const motivos = preferencias && p.lugar ? afinidade(p.lugar, preferencias).motivos.filter((m) => !m.startsWith('combina com o nível')) : [];
  // Dois toques na foto salvam (como curtir); um toque abre o lugar.
  const tocar = () => {
    const agora = Date.now();
    if (agora - ultimoToque.current < 320) {
      ultimoToque.current = 0;
      if (!salvo) void alternarSalvo(p.id);
      setPulo((n) => n + 1);
      return;
    }
    ultimoToque.current = agora;
    setTimeout(() => { if (ultimoToque.current === agora) aoAbrir(); }, 330);
  };
  const temImagem = p.curadoria ? temFoto(p.id) : Boolean(p.foto);
  const fatos = [
    p.cozinha ? `Cozinha: ${p.cozinha.replace(/_/g, ' ').replace(/;/g, ', ')}` : null,
    p.gratuito ? 'Entrada grátis (informado no mapa)' : null,
    p.horario ? `Horário no mapa: ${horarioLegivel(p.horario)}` : null,
  ].filter(Boolean) as string[];

  return (
    <article className="feed-post" aria-label={p.nome}>
      <div className="feed-cabeca">
        <span className="feed-avatar" aria-hidden="true">{p.foto ? <img src={p.foto} alt="" loading="lazy" /> : (p.nome.replace(/[^\p{L}]/gu, '')[0] ?? '·').toUpperCase()}</span>
        <button type="button" className="r-btn" onClick={aoAbrir} style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
          <span style={{ display: 'block', font: "600 15px/19px 'Lexend Exa'", letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome}</span>
          <span style={{ display: 'block', fontSize: '12px', lineHeight: '16px', color: 'var(--texto-sec)' }}>{[p.tipo, p.bairro].filter(Boolean).join(' · ')}</span>
        </button>
      </div>

      <div className="feed-midia" role="button" tabIndex={0} aria-label={`${p.nome}: toque para ver, dois toques para salvar`} onClick={tocar} onKeyDown={(e) => e.key === 'Enter' && aoAbrir()}
        style={temImagem ? undefined : { aspectRatio: '16 / 11', background: (p.categoria && COR[p.categoria]) || 'linear-gradient(150deg,#0b1f4b,#1f4fd8)' }}>
        {p.curadoria && temImagem ? <FotoLugar id={p.id} proporcao="4 / 5" credito={false} />
          : p.foto ? <img src={p.foto} alt={`Foto de ${p.nome}`} loading="lazy" draggable={false} />
            : (
              <div className="feed-texto">
                <span style={{ font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.9 }}>{p.tipo}</span>
                <b>{p.nome}</b>
                {p.bairro ? <span style={{ fontSize: '15px', marginTop: '6px', opacity: 0.95 }}>{p.bairro}</span> : null}
                <span style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>Ainda sem foto livre deste lugar</span>
              </div>
            )}
        {pulo ? <span key={pulo} className="feed-coracao" aria-hidden="true">♥</span> : null}
        {p.foto && p.fotoPagina ? (
          <a href={p.fotoPagina} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', right: 0, bottom: 0, padding: '2px 6px', background: 'rgba(0,0,0,.5)', color: '#fff', fontSize: '11px' }}>Foto: Wikimedia Commons</a>
        ) : null}
      </div>

      <div className="feed-acoes">
        <button type="button" className="r-btn feed-acao" aria-pressed={salvo} aria-label={salvo ? `Tirar ${p.nome} dos salvos` : `Salvar ${p.nome}`} onClick={() => { if (!salvo) setPulo((n) => n + 1); void alternarSalvo(p.id); }}>
          <span className="ico" aria-hidden="true">{salvo ? '♥' : '♡'}</span>
        </button>
        {p.lugar ? (
          <button type="button" className="r-btn feed-acao" onClick={() => navegar(`/lugar/${p.id}${viagemDoDestino ? `?viagem=${viagemDoDestino}` : ''}`)}>
            <span className="ico" aria-hidden="true">＋</span>{viagemDoDestino ? 'No roteiro' : 'Viagem'}
          </button>
        ) : null}
        {typeof p.lat === 'number' && typeof p.lon === 'number' ? (
          <a className="feed-acao" href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`} target="_blank" rel="noreferrer">
            <span className="ico" aria-hidden="true">➚</span>Mapa
          </a>
        ) : null}
        <span style={{ flex: 1 }} />
        <button type="button" className="r-btn feed-acao" onClick={aoAbrir} style={{ color: 'var(--azul)' }}>Ver mais ›</button>
      </div>

      <div className="feed-legenda">
        {salvo ? <div style={{ font: "600 13px 'Open Sans'", color: 'var(--vermelho)' }}>♥ Salvo nos seus lugares</div> : null}
        {motivos.length ? <div><b>Por que você vai gostar:</b> {motivos.join(', ')}.</div> : null}
        {fatos.length ? <div style={{ color: 'var(--texto-sec)', fontSize: '13px', lineHeight: '18px', marginTop: '2px' }}>{fatos.join(' · ')}</div> : null}
      </div>
    </article>
  );
}

/**
 * Feed de lugares no estilo de rede social (D-031): destaques redondos por categoria, fotos grandes,
 * dois toques para salvar e rolagem sem fim. Só fotos livres de verdade (Wikimedia Commons);
 * lugar sem foto vira cartão de texto colorido — nunca foto de outro lugar.
 */
export function FeedLugares({ destino, aoAbrir, viagem }: { destino: Destino; aoAbrir: (id: string) => void; viagem: string | null }) {
  const { preferencias } = useViajante();
  const [categoria, setCategoria] = useState<CategoriaLugar | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagina, setPagina] = useState(0);
  const [fim, setFim] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [capas, setCapas] = useState<Map<CategoriaLugar, LugarBase>>(new Map());
  const [viagemDoDestino, setViagemDoDestino] = useState<string | null>(viagem);
  const fundo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void capasPorCategoria(destino.id).then(setCapas);
    if (viagem) return;
    // Quem já tem viagem para esta cidade adiciona direto no roteiro dela.
    void listarViagens().then(({ minhas }) => {
      const hoje = new Date().toISOString().slice(0, 10);
      const v = minhas.find((x) => x.destino_id === destino.id && x.status === 'ativo' && x.papel !== 'leitor' && x.data_ida >= hoje);
      setViagemDoDestino(v?.id ?? null);
    });
  }, [destino.id, viagem]);

  useEffect(() => { setPosts([]); setPagina(0); setFim(false); }, [destino.id, categoria]);

  useEffect(() => {
    if (fim) return;
    let vivo = true;
    setCarregando(true);
    void feedLugares(destino.id, pagina, categoria).then(({ itens, fim: acabou }) => {
      if (!vivo) return;
      let novos = itens.map(deBase);
      if (pagina === 0 && destino.id === DESTINO_CURADORIA && !categoria) novos = [...LUGARES.filter((l) => temFoto(l.id)).map(deCuradoria), ...novos];
      // Dentro de cada página, o que mais combina com o jeito de viajar vem antes (fotos primeiro).
      if (preferencias) {
        const pontos = (x: Post) => (x.lugar ? afinidade(x.lugar, preferencias).pontos : 0) + (x.foto || x.curadoria ? 100 : 0);
        novos.sort((a, b) => pontos(b) - pontos(a));
      }
      setPosts((atual) => {
        const vistos = new Set(atual.map((x) => x.nome.toLowerCase()));
        return [...atual, ...novos.filter((x) => (vistos.has(x.nome.toLowerCase()) ? false : (vistos.add(x.nome.toLowerCase()), true)))];
      });
      setFim(acabou);
      setCarregando(false);
    });
    return () => { vivo = false; };
  }, [destino.id, categoria, pagina, fim, preferencias]);

  // Rolagem sem fim: perto do fim da lista, carrega a próxima página.
  useEffect(() => {
    const alvo = fundo.current;
    if (!alvo || fim) return;
    const obs = new IntersectionObserver((e) => { if (e[0]?.isIntersecting && !carregando) setPagina((n) => n + 1); }, { rootMargin: '600px' });
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [carregando, fim, posts.length]);

  const cats = useMemo(() => ORDEM_CATEGORIAS.filter((c) => c !== 'transporte' && (capas.has(c) || !capas.size)), [capas]);

  return (
    <section aria-label={`Feed de lugares em ${destino.nome}`}>
      <div className="feed-destaques" role="group" aria-label="Destaques por categoria">
        <button type="button" className="r-btn feed-destaque" aria-pressed={!categoria} onClick={() => setCategoria(null)}>
          <span className="feed-anel"><span><span className="feed-inicial">★</span></span></span>Para você
        </button>
        {cats.map((c) => {
          const capa = capas.get(c);
          return (
            <button key={c} type="button" className="r-btn feed-destaque" aria-pressed={categoria === c} onClick={() => setCategoria(categoria === c ? null : c)}>
              <span className="feed-anel"><span>{capa?.foto ? <img src={capa.foto} alt="" loading="lazy" /> : <span className="feed-inicial">{CATEGORIAS_LUGAR[c].nome[0]}</span>}</span></span>
              {CATEGORIAS_LUGAR[c].nome.split(' ')[0]}
            </button>
          );
        })}
      </div>
      {posts.map((p) => <PostLugar key={p.id} p={p} aoAbrir={() => aoAbrir(p.id)} viagemDoDestino={viagemDoDestino} />)}
      {carregando ? <div className="feed-esqueleto" aria-label="Carregando mais lugares" /> : null}
      <div ref={fundo} style={{ height: '1px' }} />
      {fim && !carregando ? (
        <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--texto-sec)', textAlign: 'center', margin: '16px 0 0' }}>
          {posts.length ? 'Você viu tudo o que já coletamos aqui.' : 'Nada nesta categoria nos lugares já coletados.'} Fotos: Wikimedia Commons, com crédito em cada uma. Lugares: OpenStreetMap (cobertura parcial; confira antes de ir).
        </p>
      ) : null}
    </section>
  );
}
