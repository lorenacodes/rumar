import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/feed.css';
import { DESTINO_CURADORIA, horarioLegivel, LUGARES } from '../../lib/catalogo';
import { capasPorCategoria, CATEGORIAS_LUGAR, feedLugares, nomeTipo, ORDEM_CATEGORIAS, paraLugar, type CategoriaLugar, type Destino, type LugarBase } from '../../lib/lugares';
import { afinidade, NOME_CATEGORIA, type Lugar } from '../../lib/planejador';
import { listarViagens } from '../../lib/viagens';
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
  id: b.id, nome: b.nome, tipo: nomeTipo(b.tipo), bairro: b.bairro, foto: b.foto, fotoPagina: b.foto_pagina, curadoria: false, categoria: b.categoria,
  gratuito: b.gratuito === true, horario: b.horario, cozinha: b.cozinha, lat: b.lat, lon: b.lon, lugar: paraLugar(b),
});
const deCuradoria = (l: Lugar): Post => ({
  id: l.id, nome: l.nome, tipo: NOME_CATEGORIA[l.categoria], bairro: l.area || null, foto: null, fotoPagina: null, curadoria: true, categoria: null,
  gratuito: l.custo === 0, horario: l.horario ?? null, cozinha: null, lat: l.lat, lon: l.lon, lugar: l,
});

/** Rótulo curto da categoria, para o selo do postal. */
const SELO: Partial<Record<CategoriaLugar, string>> = {
  restaurantes: 'Comer', bares: 'Bar', cafes: 'Café', 'vida-noturna': 'Noite', parques: 'Verde', praias: 'Praia', museus: 'Museu', historico: 'História',
  cultura: 'Cultura', compras: 'Compras', mercados: 'Feira', lazer: 'Lazer', atracoes: 'Ponto', hospedagem: 'Pouso',
};
const hojeCurto = () => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase();

function Postal({ p, cidade, aoAbrir, viagemDoDestino }: { p: Post; cidade: string; aoAbrir: () => void; viagemDoDestino: string | null }) {
  const { salvos, alternarSalvo, preferencias } = useViajante();
  const quero = salvos.includes(p.id);
  const [carimbou, setCarimbou] = useState(false);
  const ultimoToque = useRef(0);
  const navegar = useNavigate();
  const motivos = preferencias && p.lugar ? afinidade(p.lugar, preferencias).motivos.filter((m) => !m.startsWith('combina com o nível')) : [];
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
  const temImagem = p.curadoria ? temFoto(p.id) : Boolean(p.foto);
  const selo = (p.categoria && SELO[p.categoria]) || 'Lugar';
  const fatos = [
    p.cozinha ? `Cozinha: ${p.cozinha.replace(/_/g, ' ').replace(/;/g, ', ')}` : null,
    p.gratuito ? 'Entrada grátis (informado no mapa)' : null,
    p.horario ? `Horário no mapa: ${horarioLegivel(p.horario)}` : null,
  ].filter(Boolean) as string[];

  return (
    <article className="postal" aria-label={p.nome}>
      <div className="postal-frente" role="button" tabIndex={0} aria-label={`${p.nome}: toque para ver, dois toques para marcar Quero ir`} onClick={tocar} onKeyDown={(e) => e.key === 'Enter' && aoAbrir()}
        style={temImagem ? undefined : { aspectRatio: '16 / 9' }}>
        {temImagem ? (
          <>
            {p.curadoria ? <FotoLugar id={p.id} proporcao="4 / 3" credito={false} /> : <img src={p.foto!} alt={`Foto de ${p.nome}`} loading="lazy" draggable={false} />}
            <div className="postal-legenda"><small>{cidade} · {p.tipo}</small><b>{p.nome}</b></div>
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
      {p.foto && p.creditoEnviada ? <div style={{ textAlign: 'right', fontSize: '11px', lineHeight: '24px', color: 'var(--texto-sec)', padding: '0 4px' }}>Foto: {p.creditoEnviada}</div> : null}
      {p.foto && p.fotoPagina ? (
        <a href={p.fotoPagina} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'right', fontSize: '11px', lineHeight: '24px', color: 'var(--texto-sec)', padding: '0 4px' }}>Foto: Wikimedia Commons (autor e licença)</a>
      ) : null}

      <div className="postal-verso">
        <div>
          {motivos.length ? <><b>Por que você vai gostar:</b> {motivos.join(', ')}.</> : <span style={{ color: 'var(--texto-sec)' }}>{p.tipo}{p.bairro ? ` no bairro ${p.bairro}` : ''}.</span>}
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
        <button type="button" className="r-btn postal-acao" aria-pressed={quero} onClick={marcar}>{quero ? '✓ Quero ir' : '+ Quero ir'}</button>
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
    void feedLugares(destino.id, pagina, categoria).then(async ({ itens, fim: acabou }) => {
      // Sem foto do Commons: usa a foto aprovada de quem foi (D-034).
      const semFoto = itens.filter((i) => !i.foto).map((i) => i.id);
      const enviadas = semFoto.length ? await fotosAprovadas(semFoto) : new Map();
      if (!vivo) return;
      let novos = itens.map((i) => {
        const p = deBase(i);
        const f = enviadas.get(i.id)?.[0];
        return f ? { ...p, foto: f.url, fotoPagina: null, creditoEnviada: f.usuario ? `@${f.usuario}` : 'quem foi' } : p;
      });
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
      <div className="mural-selos" role="group" aria-label="Selos por categoria">
        <button type="button" className="r-btn mural-selo" aria-pressed={!categoria} onClick={() => setCategoria(null)}>
          <span className="mural-selo-borda"><span>★</span></span>Para você
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
          {posts.length ? 'Você viu tudo o que já coletamos aqui.' : 'Nada nesta categoria nos lugares já coletados.'} Fotos: Wikimedia Commons, com crédito em cada uma. Lugares: OpenStreetMap (cobertura parcial; confira antes de ir).
        </p>
      ) : null}
    </section>
  );
}
