import { useEffect, useMemo, useRef, useState } from 'react';
import { Check } from '../../ui/check';
import { useNavigate } from 'react-router-dom';

import '../../styles/feed.css';
import { DESTINO_CURADORIA, horarioLegivel, LUGARES } from '../../lib/catalogo';
import { basePorId, capasPorCategoria, type CategoriaLugar, CATEGORIAS_LUGAR, type Destino, feedLugares, type LugarBase, lugaresCuriosos, muralGeral, nomeTipo, ORDEM_CATEGORIAS, paraLugar } from '../../lib/lugares';
import { afinidade, filtrar, NOME_CATEGORIA, type Lugar } from '../../lib/planejador';
import { listarViagens } from '../../lib/viagens';
import { curiosidades, type Curiosidade } from '../../lib/curiosidades';
import { fotosAprovadas } from '../../lib/fotosEnviadas';
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
  curioso?: string | null;
  /** Crédito de foto enviada por quem foi (@usuario), quando a foto não é do Commons. */
  creditoEnviada?: string | null;
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
  id: b.id, nome: b.nome, tipo: nomeTipo(b.tipo), bairro: b.bairro, foto: b.foto, fotoPagina: b.foto_pagina, curioso: b.curioso ?? null, curadoria: false, categoria: b.categoria,
  gratuito: b.gratuito === true, horario: b.horario, cozinha: b.cozinha, lat: b.lat, lon: b.lon, lugar: paraLugar(b),
});
const deCuradoria = (l: Lugar): Post => ({
  id: l.id, nome: l.nome, tipo: NOME_CATEGORIA[l.categoria], bairro: l.area || null, foto: null, fotoPagina: null, curadoria: true, categoria: null,
  gratuito: l.custo === 0, horario: l.horario ?? null, cozinha: null, lat: l.lat, lon: l.lon, lugar: l,
});

/** Rótulo curto da categoria, para o selo do postal. */
const SELO: Partial<Record<CategoriaLugar, string>> = {
  restaurantes: 'Comer', bares: 'Bar', cafes: 'Café', 'vida-noturna': 'Noite', parques: 'Verde', praias: 'Praia', museus: 'Museu', historico: 'História',
  cultura: 'Cultura', compras: 'Compras', mercados: 'Feira', lazer: 'Lazer', atracoes: 'Ponto', hospedagem: 'Pouso', trabalho: 'Rede',
};
const hojeCurto = () => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase();

function Postal({ p, cidade, aoAbrir, viagemDoDestino }: { p: Post; cidade: string; aoAbrir: () => void; viagemDoDestino: string | null }) {
  const { salvos, alternarSalvo, preferencias } = useViajante();
  const quero = salvos.includes(p.id);
  const [carimbou, setCarimbou] = useState(false);
  const ultimoToque = useRef(0);
  const navegar = useNavigate();
  const motivos = preferencias && p.lugar ? afinidade(p.lugar, preferencias).motivos.filter((m) => m !== 'nível da viagem') : [];
  const marcar = () => { if (!quero) setCarimbou(true); void alternarSalvo(p.id); };
  // Dois toques na frente carimbam "Quero ir"; um toque abre o lugar.
  const tocar = () => {
    const agora = Date.now();
    if (agora - ultimoToque.current < 320) {
      ultimoToque.current = 0;
      if (!quero) marcar();
      return;
    }
    ultimoToque.current = agora;
    setTimeout(() => { if (ultimoToque.current === agora) aoAbrir(); }, 330);
  };
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const temImagem = p.curadoria ? temFoto(p.id) : Boolean(p.foto) && !fotoFalhou;
  const selo = (p.categoria && SELO[p.categoria]) || 'Lugar';
  const fatos = [
    p.cozinha ? `Cozinha ${p.cozinha.replace(/_/g, ' ').replace(/;/g, ', ')}` : null,
    p.gratuito ? 'Grátis' : null,
    p.horario ? `Abre ${horarioLegivel(p.horario)}` : null,
  ].filter(Boolean) as string[];

  return (
    <article className="postal" aria-label={p.nome}>
      <div className="postal-frente" role="button" tabIndex={0} aria-label={`${p.nome}: toque para ver, dois toques para marcar Quero ir`} onClick={tocar} onKeyDown={(e) => e.key === 'Enter' && aoAbrir()}
        style={temImagem ? undefined : { aspectRatio: '16 / 9' }}>
        {temImagem ? (
          <>
            {p.curadoria ? <FotoLugar id={p.id} proporcao="4 / 3" credito={false} /> : <img src={p.foto!} alt={`Foto de ${p.nome}`} loading="lazy" draggable={false} onError={() => setFotoFalhou(true)} />}
            <div className="postal-legenda"><small>{cidade} · {p.curioso ? `Curioso · ${p.curioso}` : p.tipo}</small><b>{p.nome}</b></div>
            <span className="postal-selo" aria-hidden="true"><span><i>{selo[0]}</i>{selo}</span></span>
          </>
        ) : (
          <div className="postal-sem-foto" style={{ height: '100%' }}>
            <span className="vazio" aria-hidden="true">sem foto livre ainda</span>
            <small>{cidade} · {p.tipo}</small>
            <b>{p.nome}</b>
          </div>
        )}
        {quero ? <span className={`postal-carimbo${carimbou ? ' novo' : ''}`} aria-hidden="true"><small>{cidade.slice(0, 16)}</small>Quero ir<small>{hojeCurto()}</small></span> : null}
      </div>
      {temImagem && p.creditoEnviada ? <div style={{ textAlign: 'right', fontSize: '11px', lineHeight: '24px', color: 'var(--texto-sec)', padding: '0 4px' }}>Foto: {p.creditoEnviada}</div> : null}
      {temImagem && p.fotoPagina ? (
        <a href={p.fotoPagina} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'right', fontSize: '11px', lineHeight: '24px', color: 'var(--texto-sec)', padding: '0 4px' }}>Foto: Commons</a>
      ) : null}

      <div className="postal-verso">
        <div>
          {motivos.length ? <span style={{ fontWeight: 600, color: 'var(--verde)' }}>Combina: {motivos.join(' · ')}</span> : null}
          {fatos.length ? <div style={{ color: 'var(--texto-sec)', fontSize: '13px', lineHeight: '18px', marginTop: '4px' }}>{fatos.join(' · ')}</div> : null}
        </div>
        <i aria-hidden="true" />
        <div className="postal-endereco">
          <div>{p.nome}</div>
          {p.bairro ? <div>{p.bairro}</div> : null}
          <div>{cidade}</div>
        </div>
      </div>

      <div className="postal-acoes">
        <button type="button" className="r-btn postal-acao" aria-pressed={quero} onClick={marcar}>{quero ? <><Check />Quero ir</> : '+ Quero ir'}</button>
        {p.lugar ? (
          <button type="button" className="r-btn postal-acao" onClick={() => navegar(`/lugar/${p.id}${viagemDoDestino ? `?viagem=${viagemDoDestino}` : ''}`)}>{viagemDoDestino ? 'No roteiro' : 'Na viagem'}</button>
        ) : null}
        {typeof p.lat === 'number' && typeof p.lon === 'number' ? (
          <a className="postal-acao" href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`} target="_blank" rel="noreferrer">Mapa</a>
        ) : null}
        <span style={{ flex: 1 }} />
        <button type="button" className="r-btn postal-acao" onClick={aoAbrir} style={{ color: 'var(--azul)' }}>Ver ›</button>
      </div>
    </article>
  );
}

/**
 * Mural de cartões-postais (D-031/D-032): selos por categoria, cada lugar um postal (frente com foto
 * e selo, verso com o porquê e o endereço), "Quero ir" carimba o postal, rolagem sem fim.
 * Só fotos livres de verdade (Wikimedia Commons); lugar sem foto aparece como o verso do postal.
 */
export function FeedLugares({ destino, aoAbrir, viagem }: { destino: Destino; aoAbrir: (id: string) => void; viagem: string | null }) {
  const { preferencias } = useViajante();
  const [categoria, setCategoria] = useState<CategoriaLugar | 'curiosos' | null>(null);
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
    void (categoria === 'curiosos' ? lugaresCuriosos([destino.id], pagina) : feedLugares(destino.id, pagina, categoria)).then(async ({ itens, fim: acabou }) => {
      // Sem foto do Commons: usa a foto aprovada de quem foi (D-034).
      const semFoto = itens.filter((i) => !i.foto).map((i) => i.id);
      const enviadas = semFoto.length ? await fotosAprovadas(semFoto) : new Map();
      if (!vivo) return;
      let novos = itens.map((i) => {
        const p = deBase(i);
        const f = enviadas.get(i.id)?.find((x: { tipo: string }) => x.tipo !== 'video');
        return f ? { ...p, foto: f.url, fotoPagina: null, creditoEnviada: f.usuario ? `@${f.usuario}` : 'quem foi' } : p;
      });
      if (pagina === 0 && destino.id === DESTINO_CURADORIA && !categoria) novos = [...LUGARES.filter((l) => temFoto(l.id)).map(deCuradoria), ...novos];
      // Dentro de cada página, o que mais combina com o jeito de viajar vem antes (fotos primeiro).
      if (preferencias) {
        // "Para você": o que a pessoa não come ou não quer (D-041) não aparece.
        if (!categoria) novos = novos.filter((x) => !x.lugar || filtrar([x.lugar], preferencias).length > 0);
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
      <div className="mural-selos" role="group" aria-label="Selos por categoria">
        <button type="button" className="r-btn mural-selo" aria-pressed={!categoria} onClick={() => setCategoria(null)}>
          <span className="mural-selo-borda"><span style={{ fontSize: '16px' }}>Bo</span></span>Para você
        </button>
        <button type="button" className="r-btn mural-selo" aria-pressed={categoria === 'curiosos'} onClick={() => setCategoria(categoria === 'curiosos' ? null : 'curiosos')}>
          <span className="mural-selo-borda"><span style={{ fontSize: '15px' }}>?!</span></span>Curiosos
        </button>
        {cats.map((c) => {
          const capa = capas.get(c);
          return (
            <button key={c} type="button" className="r-btn mural-selo" aria-pressed={categoria === c} onClick={() => setCategoria(categoria === c ? null : c)}>
              <span className="mural-selo-borda"><span>{capa?.foto ? <img src={capa.foto} alt="" loading="lazy" /> : CATEGORIAS_LUGAR[c].nome[0]}</span></span>
              {CATEGORIAS_LUGAR[c].nome.split(' ')[0]}
            </button>
          );
        })}
      </div>
      {posts.map((p) => <Postal key={p.id} p={p} cidade={destino.nome} aoAbrir={() => aoAbrir(p.id)} viagemDoDestino={viagemDoDestino} />)}
      {carregando ? <div className="mural-esqueleto" aria-label="Carregando mais lugares" /> : null}
      <div ref={fundo} style={{ height: '1px' }} />
      {fim && !carregando ? (
        <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--texto-sec)', textAlign: 'center', margin: '16px 0 0' }}>
          {posts.length ? 'Você viu tudo por aqui.' : 'Nada nesta categoria ainda.'}
        </p>
      ) : null}
    </section>
  );
}

/**
 * Descobrir sem escolher cidade (D-036): postais de várias cidades — favoritas e das próximas
 * viagens primeiro, depois as que têm mais lugares fotografados — intercaladas, rolagem sem fim.
 */
export function FeedGeral({ cidades, aoAbrir }: { cidades: { destino_id: string; nome: string }[]; aoAbrir: (id: string) => void }) {
  const { preferencias } = useViajante();
  const navegar = useNavigate();
  const [categoria, setCategoria] = useState<CategoriaLugar | 'curiosos' | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagina, setPagina] = useState(0);
  const [fim, setFim] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const fundo = useRef<HTMLDivElement>(null);
  const ids = cidades.map((c) => c.destino_id);
  const nome = useMemo(() => new Map(cidades.map((c) => [c.destino_id, c.nome])), [cidades]);
  const chave = ids.join(',');

  useEffect(() => { setPosts([]); setPagina(0); setFim(false); }, [chave, categoria]);
  useEffect(() => {
    if (fim || !ids.length) return;
    let vivo = true;
    setCarregando(true);
    void (categoria === 'curiosos' ? lugaresCuriosos(ids, pagina) : muralGeral(ids, pagina, categoria)).then(({ itens, fim: acabou }) => {
      if (!vivo) return;
      let novos = itens.map(deBase);
      if (preferencias) {
        if (!categoria) novos = novos.filter((x) => !x.lugar || filtrar([x.lugar], preferencias).length > 0);
        // Dentro da página, o que combina com o jeito de viajar vem antes (sem juntar uma cidade só).
        const pontos = (x: Post) => (x.lugar ? afinidade(x.lugar, preferencias).pontos : 0);
        novos = [...novos].sort((a, b) => pontos(b) - pontos(a));
      }
      setPosts((atual) => [...atual, ...novos.filter((x) => !atual.some((y) => y.id === x.id))]);
      setFim(acabou);
      setCarregando(false);
    });
    return () => { vivo = false; };
  }, [chave, categoria, pagina, fim, preferencias]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const alvo = fundo.current;
    if (!alvo || fim) return;
    const obs = new IntersectionObserver((e) => { if (e[0]?.isIntersecting && !carregando) setPagina((n) => n + 1); }, { rootMargin: '600px' });
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [carregando, fim, posts.length]);

  const cats = ORDEM_CATEGORIAS.filter((c) => c !== 'transporte' && c !== 'hospedagem' && (c !== 'trabalho' || preferencias?.networking));
  return (
    <section aria-label="Lugares para conhecer">
      <div className="mural-selos" role="group" aria-label="Selos por categoria">
        <button type="button" className="r-btn mural-selo" aria-pressed={!categoria} onClick={() => setCategoria(null)}>
          <span className="mural-selo-borda"><span style={{ fontSize: '16px' }}>Bo</span></span>Para você
        </button>
        <button type="button" className="r-btn mural-selo" onClick={() => navegar('/curiosos')}>
          <span className="mural-selo-borda"><span style={{ fontSize: '15px' }}>?!</span></span>Curiosos
        </button>
        {cats.map((c) => (
          <button key={c} type="button" className="r-btn mural-selo" aria-pressed={categoria === c} onClick={() => setCategoria(categoria === c ? null : c)}>
            <span className="mural-selo-borda"><span>{CATEGORIAS_LUGAR[c].nome[0]}</span></span>
            {CATEGORIAS_LUGAR[c].nome.split(' ')[0]}
          </button>
        ))}
      </div>
      {posts.map((p) => {
        const destinoId = (basePorId(p.id)?.destino_id) ?? '';
        return <Postal key={p.id} p={p} cidade={nome.get(destinoId) ?? ''} aoAbrir={() => aoAbrir(p.id)} viagemDoDestino={null} />;
      })}
      {carregando ? <div className="mural-esqueleto" aria-label="Carregando mais lugares" /> : null}
      <div ref={fundo} style={{ height: '1px' }} />
      {fim && !carregando ? <p style={{ fontSize: '13px', color: 'var(--texto-sec)', textAlign: 'center', margin: '16px 0 0' }}>{posts.length ? 'Você viu tudo por aqui.' : 'Nada nesta categoria ainda.'}</p> : null}
    </section>
  );
}

/** Convite para as Curiosidades do mundo (D-039), no topo do Descobrir. */
export function ConviteCuriosidades() {
  const navegar = useNavigate();
  const [c, setC] = useState<Curiosidade | null>(null);
  useEffect(() => void curiosidades(0, 1).then((l) => setC(l[0] ?? null)), []);
  if (!c) return null;
  return (
    <button type="button" className="r-btn convite-curiosidades" onClick={() => navegar(`/curiosos?c=${c.id}`)} aria-label={`Curiosidades do mundo: ${c.nome}`}
      style={{ position: 'relative', display: 'block', width: '100%', height: '150px', marginTop: '12px', overflow: 'hidden', background: 'var(--fundo-escuro)', textAlign: 'left' }}>
      <img src={c.foto} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.1) contrast(1.05) brightness(0.8)' }} onError={() => setC(null)} />
      <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '30px 14px 12px', background: 'linear-gradient(transparent, rgba(6,14,36,.85))', color: '#fff' }}>
        <span style={{ display: 'block', font: "700 11px 'Open Sans'", letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--amarelo)' }}>Curiosidades do mundo</span>
        <span style={{ display: 'block', font: "600 19px/23px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{c.nome}</span>
        <span style={{ display: 'block', fontSize: '13px', opacity: 0.9 }}>Lugares estranhos e incríveis. Ver ›</span>
      </span>
    </button>
  );
}
