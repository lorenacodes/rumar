import { useEffect, useMemo, useState } from 'react';
import { Check } from '../../ui/check';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PRECOS from '../../dados/precos-paris.json';
import { DESTINO_CURADORIA, LUGARES, OSM_DA_CURADORIA } from '../../lib/catalogo';
import {
  basePorId, buscarLugares, cidadesEmDestaque, candidatosRoteiro, CATEGORIAS_LUGAR, cobertura, destinoPorId, lugaresPorIds, nomeTipo, ORDEM_CATEGORIAS, pedirCidade, rotuloDestino,
  type CategoriaLugar, type Cobertura, type Destino, type LugarBase,
} from '../../lib/lugares';
import { dinheiro, paisPorCodigo } from '../../lib/moedas';
import type { Precos } from '../../lib/orcamento';
import { afinidade, NOME_CATEGORIA, type Lugar } from '../../lib/planejador';
import { meusFavoritos } from '../../lib/social';
import { listarViagens } from '../../lib/viagens';
import { useDestinoAtual } from '../../state/destino';
import { useViajante } from '../../state/viajante';
import { Abas } from '../../ui/abas';
import { EscolherDestino } from '../../ui/escolherDestino';
import { Voltar } from '../../ui/pecas';
import { FotoLugar } from '../../ui/foto';
import { Mapa } from '../../ui/Mapa';
import { ConviteCuriosidades, FeedGeral, FeedLugares } from './Feed';
import { BlocoNetworking } from './Networking';

const P = PRECOS as unknown as Precos;
const dataBR = (iso?: string | null) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '');

/** Um item da lista: curadoria (Lugar) ou base (LugarBase), no mesmo formato de tela. */
interface Item { id: string; nome: string; rotulo: string; detalhe: string; lat?: number; lon?: number; verificado: boolean }
const deCuradoria = (l: Lugar): Item => ({ id: l.id, nome: l.nome, rotulo: NOME_CATEGORIA[l.categoria], detalhe: [l.area, l.custo === 0 ? 'grátis' : null, 'curadoria Bo Vair'].filter(Boolean).join(' · '), lat: l.lat, lon: l.lon, verificado: true });
const deBase = (b: LugarBase): Item => ({
  id: b.id, nome: b.nome, rotulo: nomeTipo(b.tipo),
  detalhe: [b.cozinha, b.bairro, b.estrelas ? `${b.estrelas} estrelas` : null, b.gratuito ? 'grátis' : null, b.preco_min_centavos != null && b.preco_moeda ? dinheiro(b.preco_min_centavos, b.preco_moeda) : null].filter(Boolean).join(' · '),
  lat: b.lat, lon: b.lon, verificado: b.verificado,
});

function LinhaItem({ it, aoAbrir }: { it: Item; aoAbrir: () => void }) {
  const { salvos, alternarSalvo } = useViajante();
  const salvo = salvos.includes(it.id);
  return (
    <li style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--linha)' }}>
      <button type="button" className="r-btn" onClick={aoAbrir} style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0, textAlign: 'left' }}>
        <span style={{ width: '72px', flex: 'none' }}><FotoLugar id={it.id} proporcao="1 / 1" credito={false} compacto /></span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', font: "700 11px/15px 'Open Sans'", letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--azul)' }}>{it.rotulo}</span>
          <span style={{ display: 'block', font: "600 16px/21px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{it.nome}</span>
          {it.detalhe ? <span style={{ display: 'block', fontSize: '13px', lineHeight: '18px', color: 'var(--texto-sec)' }}>{it.detalhe}</span> : null}
        </span>
      </button>
      <button type="button" className="r-btn" aria-pressed={salvo} aria-label={salvo ? `Tirar ${it.nome} do Quero ir` : `Quero ir: ${it.nome}`} onClick={() => void alternarSalvo(it.id)}
        style={{ minWidth: '44px', height: '44px', flex: 'none', color: salvo ? 'var(--carimbo)' : 'var(--texto-sec)', font: "700 13px 'Open Sans'", padding: '0 6px', whiteSpace: 'nowrap' }}>{salvo ? <><Check />Quero ir</> : '+ Quero ir'}</button>
    </li>
  );
}

type Filtro = 'para-voce' | 'todos' | 'salvos' | CategoriaLugar;

/** Descobrir: qualquer cidade da base, por categoria, nome, preço e mapa, com a cobertura à vista. */
export function Descobrir() {
  const navegar = useNavigate();
  const [params, setParams] = useSearchParams();
  const viagem = params.get('viagem');
  const { destino: guardado, escolher } = useDestinoAtual();
  const { preferencias, salvos } = useViajante();
  // Sem cidade na URL, o Descobrir abre no mural de várias cidades (D-036); escolher cidade é opcional.
  const [destino, setDestino] = useState<Destino | null>(params.get('d') && guardado?.id === params.get('d') ? guardado : null);
  const [cidades, setCidades] = useState<{ destino_id: string; nome: string }[]>([]);
  const [trocando, setTrocando] = useState(false);
  const filtro = (params.get('ver') ?? 'para-voce') as Filtro;
  const lista = params.get('modo') === 'lista';
  const [termo, setTermo] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [gratis, setGratis] = useState(false);
  const [mapa, setMapa] = useState(false);
  const [verPreco, setVerPreco] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [itens, setItens] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [cob, setCob] = useState<Cobertura[] | null>(null);
  const [verCobertura, setVerCobertura] = useState(false);
  const [pedido, setPedido] = useState(false);

  // Cidade: só a da URL (?d=). Sem ela, mural geral.
  useEffect(() => {
    const d = params.get('d');
    if (d && d !== destino?.id) void destinoPorId(d).then((x) => x && setDestino(x));
    else if (!d && destino) setDestino(null);
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps
  // Cidades do mural geral: favoritas e das próximas viagens primeiro, depois as mais fotografadas.
  useEffect(() => {
    if (destino) return;
    void (async () => {
      const [favs, viagens, destaque] = await Promise.all([meusFavoritos().catch(() => []), listarViagens().catch(() => ({ minhas: [] })), cidadesEmDestaque(16)]);
      const hoje = new Date().toISOString().slice(0, 10);
      const minhas = [
        ...viagens.minhas.filter((v) => v.destino_id && v.data_ida >= hoje).map((v) => ({ destino_id: v.destino_id!, nome: v.destino })),
        ...favs.filter((f) => f.destino_id).map((f) => ({ destino_id: f.destino_id!, nome: f.nome })),
      ];
      const lista = [...minhas, ...destaque];
      setCidades(lista.filter((c, i) => lista.findIndex((x) => x.destino_id === c.destino_id) === i).slice(0, 24));
    })();
  }, [destino]);
  const irParaCidade = (d: Destino) => (setDestino(d), setTrocando(false), setTermo(''), setParams((p) => { const n = new URLSearchParams(p); n.set('d', d.id); return n; }, { replace: false }));
  const todasAsCidades = () => setParams((p) => { const n = new URLSearchParams(p); n.delete('d'); n.delete('ver'); n.delete('modo'); return n; }, { replace: false });
  useEffect(() => {
    if (!destino) return;
    escolher(destino);
    setCob(null);
    setPedido(false);
    void cobertura(destino.id).then(setCob);
  }, [destino, escolher]);

  const moeda = destino ? paisPorCodigo(destino.pais)?.moeda ?? 'BRL' : 'BRL';
  const centavos = (s: string) => (s ? Math.round(Number(s.replace(',', '.')) * 100) : null);
  const comPreco = Boolean(min || max);
  // Feed (D-031): o jeito padrão de explorar; lista e mapa continuam a um toque.
  const feed = filtro === 'para-voce' && !lista && !mapa && !termo.trim() && !comPreco && !gratis;

  useEffect(() => {
    if (!destino) return;
    let vivo = true;
    setCarregando(true);
    const curadoria = destino.id === DESTINO_CURADORIA;
    (async () => {
      let novos: Item[] = [];
      let tot = 0;
      if (filtro === 'salvos') {
        const bases = await lugaresPorIds(salvos);
        novos = [...(curadoria ? LUGARES.filter((l) => salvos.includes(l.id)) : []).map(deCuradoria), ...bases.filter((b) => b.destino_id === destino.id).map(deBase)];
        tot = novos.length;
      } else if (filtro === 'para-voce' && !termo.trim() && !comPreco && !gratis) {
        const cands = [...(curadoria ? LUGARES : []), ...(await candidatosRoteiro(destino.id)).filter((l) => !OSM_DA_CURADORIA.has(l.osm ?? ''))];
        const ordem = preferencias ? [...cands].sort((a, b) => afinidade(b, preferencias).pontos - afinidade(a, preferencias).pontos) : cands;
        novos = ordem.slice(0, 24).map((l) => (basePorId(l.id) ? deBase(basePorId(l.id)!) : deCuradoria(l)));
        tot = novos.length;
      } else {
        const cat = filtro === 'todos' || filtro === 'para-voce' ? null : filtro;
        const r = await buscarLugares({ destino: destino.id, categoria: cat, termo, precoMin: centavos(min), precoMax: centavos(max), soGratis: gratis, pagina });
        const daBase = r.lugares.filter((b) => !OSM_DA_CURADORIA.has(`https://www.openstreetmap.org/${b.fonte_id}`)).map(deBase);
        // Paris: os lugares da curadoria (com preço conferido) entram junto, filtrados igual.
        const cur = curadoria && pagina === 0 ? LUGARES.filter((l) => {
          const p = P.lugares[l.id];
          const nomeOk = !termo.trim() || l.nome.toLowerCase().includes(termo.toLowerCase());
          const precoOk = !comPreco || (p && (centavos(min) == null || p.max >= centavos(min)!) && (centavos(max) == null || p.min <= centavos(max)!));
          const gratisOk = !gratis || l.custo === 0;
          return nomeOk && precoOk && gratisOk && (!cat || CATEGORIAS_LUGAR[cat].roteiro?.categoria === l.categoria);
        }).map(deCuradoria) : [];
        novos = [...cur, ...daBase];
        tot = r.total + cur.length;
      }
      if (!vivo) return;
      setItens((atual) => (pagina > 0 && filtro !== 'salvos' && filtro !== 'para-voce' ? [...atual, ...novos] : novos));
      setTotal(tot);
      setCarregando(false);
    })();
    return () => { vivo = false; };
  }, [destino, filtro, termo, min, max, gratis, pagina, preferencias, salvos]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setPagina(0), [destino, filtro, termo, min, max, gratis]);
  const porCat = useMemo(() => new Map((cob ?? []).map((c) => [c.categoria, c])), [cob]);
  const semColeta = cob !== null && cob.length === 0;
  const abrir = (id: string) => navegar(`/lugar/${id}${viagem ? `?viagem=${viagem}&dia=${params.get('dia') ?? 1}` : ''}`);
  const mudarFiltro = (f: Filtro) => setParams((p) => { const n = new URLSearchParams(p); n.set('ver', f); return n; }, { replace: true });
  const dadosDe = (cob ?? []).map((c) => c.dados_de).filter(Boolean).sort()[0];

  const chips: { id: Filtro; nome: string }[] = [
    { id: 'para-voce', nome: 'Para você' },
    { id: 'todos', nome: 'Tudo' },
    { id: 'salvos', nome: `Quero ir${salvos.length ? ` (${salvos.length})` : ''}` },
    ...ORDEM_CATEGORIAS.map((c) => ({ id: c, nome: `${CATEGORIAS_LUGAR[c].nome}${porCat.get(c) ? ` (${porCat.get(c)!.quantidade}${porCat.get(c)!.limite_atingido ? '+' : ''})` : ''}` })),
  ];

  return (
    <main className="tela" data-tela="descobrir" data-real="descobrir">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        {destino && !trocando ? <Voltar rotulo="Todas as cidades" aoTocar={todasAsCidades} /> : null}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Descobrir{destino ? ` · ${rotuloDestino(destino)}` : ''}</div>
          {trocando ? <button type="button" className="r-btn" onClick={() => setTrocando(false)} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600, fontSize: '14px' }}>Cancelar</button> : null}
        </div>
        <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{destino ? `O que viver em ${destino.nome}.` : 'Lugares para conhecer.'}</h1>
        {destino && !trocando && !viagem ? (
          <button type="button" className="r-btn" onClick={() => navegar(`/viagens/nova?d=${destino.id}`)} style={{ marginTop: '10px', height: '44px', padding: '0 14px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 14px 'Open Sans'" }}>Planejar viagem para {destino.nome}</button>
        ) : null}
        {trocando ? (
          <div style={{ marginTop: '10px' }}>
            <EscolherDestino autoFoco aoEscolher={irParaCidade} />
            <p style={{ fontSize: '13px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>Qualquer cidade do Brasil e destinos lá fora.</p>
          </div>
        ) : null}
        {!destino && !trocando ? (
          <>
            <div role="group" aria-label="Cidades" style={{ display: 'flex', gap: '6px', overflowX: 'auto', margin: '12px -20px 0', padding: '0 20px 2px', scrollbarWidth: 'none' }}>
              <button type="button" className="r-btn" onClick={() => setTrocando(true)} style={{ flex: 'none', height: '42px', padding: '0 14px', background: 'var(--fundo-escuro)', color: '#fff', font: "600 14px 'Open Sans'", whiteSpace: 'nowrap' }}>Escolher cidade</button>
              {[...(guardado ? [{ destino_id: guardado.id, nome: guardado.nome }] : []), ...cidades].filter((c, i, a) => a.findIndex((x) => x.destino_id === c.destino_id) === i).slice(0, 16).map((c) => (
                <button key={c.destino_id} type="button" className="r-btn" onClick={() => void destinoPorId(c.destino_id).then((d) => d && irParaCidade(d))}
                  style={{ flex: 'none', height: '42px', padding: '0 14px', border: '1px solid var(--linha)', font: "500 14px 'Open Sans'", whiteSpace: 'nowrap' }}>{c.nome}</button>
              ))}
            </div>
            <ConviteCuriosidades />
            {cidades.length ? <FeedGeral cidades={cidades} aoAbrir={(id) => navegar(`/lugar/${id}`)} /> : <div className="mural-esqueleto" aria-label="Carregando lugares" />}
          </>
        ) : null}

        {destino && !trocando ? (
          <>
            <label htmlFor="busca-lugar" className="visualmente-oculto">Buscar lugar pelo nome</label>
            <input id="busca-lugar" className="r-input" type="search" value={termo} placeholder={`Buscar lugar em ${destino.nome}`} onChange={(e) => setTermo(e.target.value)}
              style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: '12px', borderBottom: '2px solid var(--texto)', padding: '10px 0', font: "500 17px 'Open Sans'", color: 'var(--texto)', background: 'transparent' }} />
            {feed ? (
              <div role="group" aria-label="Outras formas de ver" style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px', fontWeight: 600 }}>
                <button type="button" className="r-btn alvo-toque" onClick={() => setParams((p) => { const n = new URLSearchParams(p); n.set('modo', 'lista'); return n; }, { replace: true })} style={{ color: 'var(--azul)' }}>Lista e filtros</button>
                <button type="button" className="r-btn alvo-toque" onClick={() => setMapa(true)} style={{ color: 'var(--azul)' }}>Mapa</button>
                <button type="button" className="r-btn alvo-toque" onClick={() => mudarFiltro('salvos')} style={{ color: 'var(--azul)' }}>Quero ir{salvos.length ? ` (${salvos.length})` : ''}</button>
              </div>
            ) : (
              <>
            <div role="tablist" aria-label="Categorias" style={{ display: 'flex', gap: '6px', overflowX: 'auto', margin: '12px -20px 0', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
              {chips.map((c) => {
                const ativo = filtro === c.id;
                return (
                  <button key={c.id} type="button" role="tab" aria-selected={ativo} className="r-btn" onClick={() => mudarFiltro(c.id)}
                    style={{ flex: 'none', height: '44px', padding: '0 14px', boxSizing: 'border-box', whiteSpace: 'nowrap', font: `${ativo ? 600 : 500} 14px 'Open Sans'`, ...(ativo ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>{c.nome}</button>
                );
              })}
            </div>
            <div role="group" aria-label="Mapa e filtros" style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
              {filtro === 'para-voce' ? (
                <button type="button" className="r-btn" aria-pressed={!lista && !mapa} onClick={() => (setMapa(false), setParams((p) => { const n = new URLSearchParams(p); if (lista || mapa) n.delete('modo'); else n.set('modo', 'lista'); return n; }, { replace: true }))}
                  style={{ height: '40px', padding: '0 12px', font: "600 13px 'Open Sans'", border: '2px solid var(--texto)' }}>{lista || mapa ? 'Ver feed' : 'Ver em lista'}</button>
              ) : null}
              <button type="button" className="r-btn" aria-pressed={mapa} onClick={() => setMapa(!mapa)} style={{ height: '40px', padding: '0 12px', font: "600 13px 'Open Sans'", border: '2px solid var(--texto)' }}>{mapa ? 'Fechar mapa' : 'Ver no mapa'}</button>
              <button type="button" className="r-btn" aria-pressed={gratis} onClick={() => setGratis(!gratis)} style={{ height: '40px', padding: '0 12px', font: "600 13px 'Open Sans'", ...(gratis ? { background: 'var(--azul)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>Grátis</button>
              <button type="button" className="r-btn" aria-expanded={verPreco || comPreco} onClick={() => setVerPreco(!verPreco)} style={{ height: '40px', padding: '0 12px', font: "600 13px 'Open Sans'", ...(comPreco ? { background: 'var(--azul)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>Preço {verPreco || comPreco ? '▴' : '▾'}</button>
            </div>
              </>
            )}
            {verPreco || comPreco ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--texto-sec)', width: '110px' }}>Mínimo ({moeda})<input inputMode="decimal" className="r-input" value={min} onChange={(e) => setMin(e.target.value.replace(/[^\d,]/g, ''))} style={campoPeq} /></label>
                <label style={{ fontSize: '12px', color: 'var(--texto-sec)', width: '110px' }}>Máximo ({moeda})<input inputMode="decimal" className="r-input" value={max} onChange={(e) => setMax(e.target.value.replace(/[^\d,]/g, ''))} style={campoPeq} /></label>
              </div>
            ) : null}
            {comPreco || gratis ? <p style={{ fontSize: '12px', lineHeight: '17px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>Só aparecem lugares com preço informado; os outros continuam no app.</p> : null}
            {viagem ? <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--azul)', margin: '8px 0 0' }}>Escolha um lugar para adicionar à sua viagem.</p> : null}

            {semColeta ? (
              <div style={{ marginTop: '14px', padding: '14px', background: 'var(--cartao-2)' }}>
                <b>Ainda não coletamos os lugares de {destino.nome}.</b>
                <p style={{ fontSize: '14px', lineHeight: '20px', margin: '6px 0 0' }}>A coleta é feita aos poucos, cidade por cidade, para não sobrecarregar as fontes. Peça esta cidade: ela entra na fila, e a coleta roda a cada 3 horas.</p>
                <button type="button" className="r-btn" disabled={pedido} onClick={() => void pedirCidade(destino.id).then((ok) => setPedido(ok))} style={{ marginTop: '8px', height: '48px', padding: '0 16px', background: 'var(--amarelo)', font: "600 15px 'Open Sans'" }}>{pedido ? 'Pedido registrado' : `Pedir ${destino.nome}`}</button>
              </div>
            ) : null}

            {cob && cob.length && !feed ? (
              <div style={{ marginTop: '10px', borderTop: '1px solid var(--linha)', borderBottom: '1px solid var(--linha)' }}>
                <button type="button" className="r-btn" aria-expanded={verCobertura} onClick={() => setVerCobertura(!verCobertura)} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', minHeight: '44px', alignItems: 'center', fontSize: '14px', textAlign: 'left' }}>
                  <span>O que já temos em {destino.nome}: <b>{cob.reduce((s, c) => s + c.quantidade, 0)} lugares</b> · cobertura parcial</span><span aria-hidden="true">{verCobertura ? '▴' : '▾'}</span>
                </button>
                {verCobertura ? (
                  <div style={{ fontSize: '13px', lineHeight: '19px', paddingBottom: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {ORDEM_CATEGORIAS.map((c) => {
                          const x = porCat.get(c);
                          return (
                            <tr key={c} style={{ borderTop: '1px dashed var(--linha)' }}>
                              <td style={{ padding: '3px 0' }}>{CATEGORIAS_LUGAR[c].nome}</td>
                              <td style={{ textAlign: 'right', color: x ? 'var(--texto)' : 'var(--texto-sec)' }}>{!x ? 'não buscado' : x.quantidade === 0 ? 'nenhum encontrado' : `${x.quantidade}${x.limite_atingido ? ' (parcial: limite da coleta)' : ''}`}</td>
                            </tr>
                          );
                        })}
                        <tr style={{ borderTop: '1px dashed var(--linha)' }}><td style={{ padding: '3px 0' }}>Experiências locais e passeios guiados</td><td style={{ textAlign: 'right', color: 'var(--texto-sec)' }}>sem fonte ainda</td></tr>
                        <tr style={{ borderTop: '1px dashed var(--linha)' }}><td style={{ padding: '3px 0' }}>Avaliações de clientes</td><td style={{ textAlign: 'right', color: 'var(--texto-sec)' }}>sem fonte ainda</td></tr>
                      </tbody>
                    </table>
                    <p style={{ margin: '6px 0 0', color: 'var(--texto-sec)' }}>
                      Área: até {cob[0]?.raio_km ?? destino.raio_km} km do centro. Fonte: OpenStreetMap (mapa colaborativo; © colaboradores do OpenStreetMap, licença ODbL){dadosDe ? `, dados de ${dataBR(dadosDe)}` : ''}. Nem todo estabelecimento está no mapa e os dados podem estar desatualizados: confira antes de ir. Preços quase nunca constam nessa fonte.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {feed && preferencias?.networking ? <BlocoNetworking destinoId={destino.id} cidade={destino.nome} area={preferencias.area} /> : null}
            {feed ? <FeedLugares destino={destino} aoAbrir={abrir} viagem={viagem} /> : null}
            {!feed && filtro === 'para-voce' && !termo && !comPreco && !gratis && itens.length ? (
              <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', margin: '12px 0 0' }}>
                {preferencias ? 'Em ordem do que mais combina com o seu jeito de viajar.' : 'Conte seu jeito de viajar para ver primeiro o que combina com você.'}
                {!preferencias ? <button type="button" className="r-btn alvo-toque" onClick={() => navegar('/perfil-viajante')} style={{ color: 'var(--azul)', fontWeight: 600, marginLeft: '4px' }}>Responder</button> : null}
              </p>
            ) : null}
            {mapa ? (
              <div style={{ marginTop: '10px' }}>
                <Mapa pontos={itens.filter((i) => typeof i.lat === 'number').map((i) => ({ id: i.id, lat: i.lat!, lon: i.lon!, rotulo: i.rotulo[0] ?? '·', titulo: i.nome, tipo: 'lugar' as const }))} altura="min(55vh, 420px)" aoEscolher={abrir} />
                <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '4px' }}>Mapa © OpenStreetMap · OpenFreeMap. Mostra os {itens.length} lugares desta lista.</div>
              </div>
            ) : null}
            <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0 }} aria-busy={carregando}>
              {!mapa && !feed ? itens.filter((i, n, todos) => todos.findIndex((x) => x.nome.toLowerCase() === i.nome.toLowerCase()) === n).map((i) => <LinhaItem key={i.id} it={i} aoAbrir={() => abrir(i.id)} />) : null}
            </ul>
            {carregando && !feed ? <p style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Carregando…</p> : null}
            {!carregando && !mapa && itens.length < total && filtro !== 'para-voce' && filtro !== 'salvos' ? (
              <button type="button" className="r-btn" onClick={() => setPagina(pagina + 1)} style={{ width: '100%', height: '48px', marginTop: '8px', border: '2px solid var(--texto)', font: "600 15px 'Open Sans'" }}>Ver mais ({total - itens.length} restantes)</button>
            ) : null}
            {!feed && !carregando && !itens.length && !semColeta ? (
              <p style={{ fontSize: '15px', color: 'var(--texto-sec)' }}>{filtro === 'salvos' ? 'Toque em "+ Quero ir" num lugar para guardar aqui.' : termo ? 'Nada com esse nome nos lugares já coletados.' : 'Nada nesta categoria nos lugares já coletados.'}</p>
            ) : null}
            <div style={{ height: '24px' }} />
          </>
        ) : null}
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

const campoPeq = { display: 'block', width: '100%', boxSizing: 'border-box', borderBottom: '2px solid var(--texto)', padding: '6px 0', font: "500 16px 'Open Sans'", color: 'var(--texto)', background: 'transparent' } as const;
