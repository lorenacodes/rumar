import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import CAMBIO from '../../dados/cambio.json';
import PRECOS from '../../dados/precos-paris.json';
import { DESTINO_CURADORIA, enderecoCurto, lugarPorId, lugaresDoDestino } from '../../lib/catalogo';
import { candidatosRoteiro, destinoPorId, type Destino } from '../../lib/lugares';
import { mesclar, paraQuem } from '../../lib/grupo';
import { calcular, sugerirAjustes, type Precos } from '../../lib/orcamento';
import { afinidade, distanciaKm, NOME_CATEGORIA, rotaMapa, textoDistancia, type Gosto, type Lugar, type Periodo } from '../../lib/planejador';
import { minhasAmizades, type Amizade } from '../../lib/social';
import {
  acompanhar, adicionarGasto, atualizarViagem, buscarHoteis, carregarViagem, confirmarSugestao, convidar, escolherHotel,
  marcarFeito, montarRoteiro, moverItem, mudarHora, removerGasto, removerItem, trocarItem, type Busca, type Item, type ViagemCompleta,
} from '../../lib/viagens';
import { converter, taxa } from '../../lib/moedas';
import { usePlano } from '../../state/plano';
import { useViajante } from '../../state/viajante';
import { AbaDinheiro, PlanejadoReal } from './Dinheiro';
import { AbaEtapas } from './Etapas';
import { montarJornada } from './jornada';
import { Abas } from '../../ui/abas';
import { FotoLugar } from '../../ui/foto';
import { Mapa, type Ponto } from '../../ui/Mapa';
import { Aviso, BotaoContorno, BotaoPrincipal, Voltar } from '../../ui/pecas';
import { botaoTexto, campo, dataMais, euros, periodo as textoPeriodo, reais, Rotulo, Segmentos, Selo } from './comum';

type Aba = 'etapas' | 'roteiro' | 'mapa' | 'hospedagem' | 'dinheiro' | 'grupo';
const HORA: Record<string, string> = { morning: '9h30', afternoon: '14h', evening: '18h30', night: '21h30' };
const FAIXA: Record<string, string> = { morning: 'Manhã', afternoon: 'Tarde', evening: 'Noite', night: 'Noite' };
const P_PARIS = PRECOS as unknown as Precos;
const SEM_PRECOS: Precos = { lugares: {}, transporte: {} };
// Preços conferidos existem só para a curadoria de Paris; nas outras cidades, nada é estimado sem fonte.
let P: Precos = P_PARIS;
const destinoDe = (v: ViagemCompleta) => v.viagem.destino_id ?? (v.viagem.destino === 'Paris' ? DESTINO_CURADORIA : null);
const EURO = (CAMBIO as { moedas: Record<string, { venda: number; data: string }> }).moedas.EUR ?? null;
const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const GOSTO_TAG: Record<Gosto, string[]> = { museus: ['museums_art', 'history_culture'], comer: ['food_drink'], cafes: ['food_drink'], noite: ['nightlife'], parques: ['nature_outdoors'], compras: ['shopping'], fotos: ['photography'], feiras: ['local_markets'], gente: ['meet_people'], lgbt: ['lgbtqia'] };
const temCoord = (l?: Lugar | null): l is Lugar & { lat: number; lon: number } => typeof l?.lat === 'number';

function precoTexto(l: Lugar): { texto: string; reserva: boolean } {
  const p = P.lugares[l.id];
  if (p) return { texto: p.min === 0 ? 'Grátis' : p.min === p.max ? `${euros(p.min)} por pessoa` : `${euros(p.min)} a ${euros(p.max)} por pessoa`, reserva: Boolean(p.reserva) };
  if ((l as Lugar & { ingresso?: boolean }).ingresso === false) return { texto: 'Sem ingresso (gastos à parte)', reserva: false };
  if (l.custo === 0) return { texto: 'Grátis', reserva: false };
  return { texto: 'Preço não confirmado', reserva: false };
}

export function Viagem() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  const [params, setParams] = useSearchParams();
  const pedida = params.get('aba') ?? 'etapas';
  const aba = (pedida === 'orcamento' ? 'dinheiro' : pedida) as Aba;
  const [v, setV] = useState<ViagemCompleta | null | undefined>(undefined);
  const [dia, setDia] = useState(1);
  const local = useLocation();
  const recarregar = useCallback(() => void carregarViagem(id).then(setV), [id]);
  // Sempre fresco: ao abrir/navegar, ao vivo (Realtime), ao voltar para o app e, por
  // garantia, a cada 15 s enquanto a tela está visível (se o ao vivo cair, ninguém fica
  // olhando uma versão velha da viagem).
  useEffect(() => {
    recarregar();
  }, [recarregar, local.key]);
  useEffect(() => {
    const parar = acompanhar(id, recarregar);
    const aoVoltar = () => document.visibilityState === 'visible' && recarregar();
    document.addEventListener('visibilitychange', aoVoltar);
    const relogio = setInterval(() => document.visibilityState === 'visible' && recarregar(), 15_000);
    return () => (parar(), document.removeEventListener('visibilitychange', aoVoltar), clearInterval(relogio));
  }, [id, recarregar]);

  const { preferencias } = useViajante();
  const { paisResidencia, paisPassaporte, moedaReferencia } = usePlano();
  const grupo = useMemo(() => (v ? mesclar(v.pessoas) ?? preferencias : null), [v, preferencias]);
  const itens = useMemo(() => (v?.itens ?? []).map((it) => ({ it, l: lugarPorId(it.place_id) })).filter((x): x is { it: Item; l: Lugar } => Boolean(x.l)), [v]);
  const [destino, setDestino] = useState<Destino | null>(null);
  const [, setPool] = useState(0);
  const destinoId = v ? destinoDe(v) : null;
  useEffect(() => {
    if (!destinoId) return;
    void destinoPorId(destinoId).then(setDestino);
    // Lugares da cidade para trocar paradas e ver no mapa.
    if (destinoId !== DESTINO_CURADORIA) void candidatosRoteiro(destinoId).then(() => setPool((n) => n + 1));
  }, [destinoId]);
  P = destinoId === DESTINO_CURADORIA ? P_PARIS : SEM_PRECOS;
  const orc = useMemo(() => {
    if (!v) return null;
    const entrada = {
      itens: itens.filter((x) => x.it.situacao === 'confirmado').map((x) => ({ dia: x.it.dia, periodo: x.it.periodo, ordem: x.it.ordem, lugar: x.l })),
      precos: P, catalogo: lugaresDoDestino(destinoId),
      hospedagem: v.hospedagem ? { nome: v.hospedagem.nome, total: v.hospedagem.total_centavos, moeda: v.hospedagem.moeda, fonte: v.hospedagem.fonte, cotadoEm: v.hospedagem.cotado_em, lat: v.hospedagem.lat, lon: v.hospedagem.lon } : null,
      gastos: v.gastos.map((g) => ({ categoria: g.categoria, descricao: g.descricao, valor: g.valor_centavos, moeda: g.moeda })),
      viajantes: v.viagem.viajantes, noites: v.viagem.noites, euroEmReais: EURO?.venda ?? null, prefereTransporte: grupo?.deslocamento === 'transporte',
    };
    const o = calcular(entrada);
    // O orçamento é guardado na moeda de planejamento da viagem; a comparação é feita em reais.
    const limiteBRL = v.viagem.orcamento_centavos ? converter(v.viagem.orcamento_centavos, taxa(v.viagem.moeda_planejamento ?? 'BRL', 'BRL')) : null;
    return { o, limiteBRL, sugestoes: limiteBRL ? sugerirAjustes(entrada, o, limiteBRL) : [] };
  }, [v, itens, grupo]);
  const j = useMemo(() => (v && orc ? montarJornada(v, orc.o.semCambio ? null : orc.o.provavelBRL, { paisResidencia, paisPassaporte, moedaReferencia }, undefined, destino?.pais) : null), [v, orc, paisResidencia, paisPassaporte, moedaReferencia, destino]);

  if (v === null) return <Navigate to="/viagens" replace />;
  if (!v) return <main className="tela" aria-busy="true" style={{ padding: '40px 20px' }}>Carregando a viagem…</main>;
  const pode = v.papel === 'dono' || v.papel === 'editor';
  const total = v.viagem.noites + 1;
  const acima = orc?.limiteBRL ? orc.o.provavelBRL - orc.limiteBRL : 0;
  const irPara = (a: string) => setParams({ aba: a }, { replace: true });

  return (
    <main className="tela" data-tela="viagem" data-real="viagem">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <Voltar para="/viagens" />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>{textoPeriodo(v.viagem.data_ida, v.viagem.noites)} · {v.viagem.viajantes} {v.viagem.viajantes === 1 ? 'pessoa' : 'pessoas'}</div>
        <h1 style={{ margin: '4px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{v.viagem.destino}</h1>
        {orc ? (
          <button type="button" className="r-btn" onClick={() => irPara('dinheiro')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px', padding: '10px 14px', boxSizing: 'border-box', background: 'var(--fundo-escuro)', color: '#fff', textAlign: 'left' }}>
            <span>
              <span style={{ display: 'block', fontSize: '13px', color: '#AEBBE0' }}>Custo estimado {orc.o.semCambio ? '(falta o câmbio)' : ''}</span>
              {orc.o.provavelBRL > 0
                ? <b style={{ font: "600 22px 'Lexend Exa'" }}>{reais(orc.o.provavelBRL)}</b>
                : <b style={{ font: "600 16px/21px 'Lexend Exa'" }}>Ainda sem preços com fonte</b>}
            </span>
            <span style={{ textAlign: 'right', fontSize: '13px', color: '#AEBBE0', alignSelf: 'center' }}>
              {orc.o.provavelBRL > 0 ? `${reais(orc.o.porPessoaBRL)} por pessoa` : 'Escolha a hospedagem ou informe gastos'}
              {v.viagem.orcamento_centavos ? <span style={{ display: 'block', color: acima > 0 ? 'var(--amarelo)' : '#9fe0b4', fontWeight: 600 }}>{acima > 0 ? `${reais(acima)} acima do orçamento` : 'Dentro do orçamento'}</span> : null}
            </span>
          </button>
        ) : null}
        <div style={{ marginTop: '12px' }}>
          <Segmentos rotulo="Partes da viagem" valor={aba} aoMudar={(a) => setParams({ aba: a }, { replace: true })}
            opcoes={[{ id: 'etapas', nome: 'Etapas' }, { id: 'roteiro', nome: 'Roteiro' }, { id: 'mapa', nome: 'Mapa' }, { id: 'hospedagem', nome: v.hospedagem ? 'Hospedagem ✓' : 'Hospedagem' }, { id: 'dinheiro', nome: 'Dinheiro' }, { id: 'grupo', nome: `Grupo (${v.membros.filter((m) => m.status === 'ativo').length})` }]} />
        </div>
        {aba === 'roteiro' || aba === 'mapa' ? (
          <div role="tablist" aria-label="Dias" style={{ display: 'flex', gap: '6px', overflowX: 'auto', margin: '10px -20px 0', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
              const d = new Date(`${dataMais(v.viagem.data_ida, n - 1)}T12:00:00Z`);
              const ativo = n === dia;
              return (
                <button key={n} type="button" role="tab" aria-selected={ativo} className="r-btn" onClick={() => setDia(n)}
                  style={{ flex: 'none', minWidth: '60px', height: '50px', textAlign: 'center', ...(ativo ? { background: 'var(--amarelo)', color: 'var(--botao-principal-texto)' } : { border: '1px solid var(--linha)' }) }}>
                  <span style={{ display: 'block', font: "600 14px 'Lexend Exa'" }}>Dia {n}</span>
                  <span style={{ display: 'block', fontSize: '12px' }}>{SEMANA[d.getUTCDay()]} {d.getUTCDate()}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {aba === 'etapas' && j && orc ? <AbaEtapas v={v} j={j} pode={pode} recarregar={recarregar} irPara={irPara} resumoFinal={<PlanejadoReal v={v} j={j} orc={orc.o} comCompartilhar />} /> : null}
        {aba === 'roteiro' ? <AbaRoteiro v={v} dia={dia} itens={itens} pode={pode} grupo={grupo} recarregar={recarregar} /> : null}
        {aba === 'mapa' ? <AbaMapa v={v} dia={dia} itens={itens} /> : null}
        {aba === 'hospedagem' ? <AbaHospedagem v={v} itens={itens} pode={pode} recarregar={recarregar} destino={destino} /> : null}
        {aba === 'dinheiro' && orc && j ? <AbaDinheiro v={v} j={j} orc={orc.o} pode={pode} recarregar={recarregar} resumo={<AbaOrcamento v={v} orc={orc} itens={itens} pode={pode} recarregar={recarregar} moeda={j.moedaPlano} />} /> : null}
        {aba === 'grupo' ? <AbaGrupo v={v} pode={pode} recarregar={recarregar} /> : null}
        <div style={{ height: '24px' }} />
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

// ---------------------------------------------------------------- Roteiro (lista editável)
function AbaRoteiro({ v, dia, itens, pode, grupo, recarregar }: { v: ViagemCompleta; dia: number; itens: { it: Item; l: Lugar }[]; pode: boolean; grupo: ReturnType<typeof mesclar>; recarregar: () => void }) {
  const navegar = useNavigate();
  const { alternarSalvo, salvos } = useViajante();
  const [trocando, setTrocando] = useState<string | null>(null);
  const doDia = itens.filter((x) => x.it.dia === dia).sort((a, b) => a.it.ordem - b.it.ordem);
  const usados = new Set(itens.map((x) => x.l.id));
  const faixas = ['Manhã', 'Tarde', 'Noite'].map((f) => ({ f, lista: doDia.filter((x) => FAIXA[x.it.periodo] === f) })).filter((x) => x.lista.length);
  const temas = [...new Set(doDia.map((x) => NOME_CATEGORIA[x.l.categoria]))].slice(0, 3).join(' · ');
  const executar = async (p: Promise<unknown>) => (await p, recarregar());

  return (
    <section style={{ marginTop: '14px' }}>
      <h2 style={{ margin: 0, font: "600 20px/26px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Dia {dia}</h2>
      <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>{temas || 'Dia livre'}</div>
      {!doDia.length ? <p style={{ fontSize: '15px', color: 'var(--texto-sec)' }}>Nada planejado para este dia.</p> : null}
      {faixas.map(({ f, lista }) => (
        <div key={f}>
          <Rotulo style={{ borderBottom: '1px solid var(--linha)', paddingBottom: '6px' }}>{f}</Rotulo>
          {lista.map(({ it, l }) => {
            const i = doDia.findIndex((x) => x.it.id === it.id);
            const prox = doDia[i + 1]?.l;
            const km = temCoord(l) && temCoord(prox) ? distanciaKm(l, prox) : null;
            const preco = precoTexto(l);
            const motivos = grupo ? afinidade(l, grupo).motivos : [];
            const quem = paraQuem(v.pessoas, (Object.keys(GOSTO_TAG) as Gosto[]).filter((g) => GOSTO_TAG[g].some((t) => l.tags.includes(t))));
            const alternativas = lugaresDoDestino(destinoDe(v)).filter((o) => !usados.has(o.id) && o.categoria === l.categoria && o.slots.includes(it.periodo as Periodo))
              .map((o) => ({ o, km: temCoord(o) && temCoord(l) ? distanciaKm(o, l) : 9 })).sort((a, b) => a.km - b.km).slice(0, 4);
            return (
              <article key={it.id} style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: '10px', padding: '10px 0', borderBottom: '1px dashed var(--linha)' }}>
                <div>
                  <div style={{ font: "600 14px 'Lexend Exa'", marginBottom: '4px' }}>{it.hora ? it.hora.slice(0, 5).replace(':', 'h') : HORA[it.periodo]}</div>
                  <button type="button" className="r-btn" onClick={() => navegar(`/lugar/${l.id}?viagem=${v.viagem.id}`)} aria-label={`${l.nome}: detalhes`} style={{ display: 'block', width: '84px' }}>
                    <FotoLugar id={l.id} proporcao="1 / 1" credito={false} compacto />
                  </button>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: "700 11px/15px 'Open Sans'", letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--azul)' }}>{NOME_CATEGORIA[l.categoria]}</div>
                  <div style={{ font: "600 17px/22px 'Lexend Exa'", letterSpacing: '-0.02em', textDecoration: it.feito ? 'line-through' : 'none' }}>{l.nome}</div>
                  {it.feito ? <div style={{ font: "600 13px 'Open Sans'", color: 'var(--verde)' }}>✓ Feito</div> : null}
                  {it.situacao === 'sugerido' ? <div style={{ font: "600 13px 'Open Sans'", color: 'var(--ambar)' }}>Sugestão de um participante</div> : null}
                  <div style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--texto-sec)' }}>{enderecoCurto(l.endereco) ?? l.area}</div>
                  <div style={{ fontSize: '14px', lineHeight: '20px', marginTop: '2px' }}>
                    <b>{preco.texto}</b>{preco.reserva ? <span style={{ color: 'var(--ambar)', fontWeight: 600 }}> · compre o ingresso antes</span> : null}
                  </div>
                  {motivos.length ? <div style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--verde)', fontWeight: 600, marginTop: '2px' }}>Por que aqui: {motivos.join(', ')}.</div> : null}
                  {quem ? <div style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--verde)' }}>{quem}</div> : null}
                  {km !== null && prox ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px' }}>
                      <span>↓ {textoDistancia(km)} · {km <= 1.5 ? 'dá para ir a pé' : (P.transporte.metro ? `metrô: 1 bilhete (${euros(P.transporte.metro.valor)})` : 'transporte (veja a rota)')}</span>
                      <a href={rotaMapa(l as { lat: number; lon: number }, prox as { lat: number; lon: number }, km <= 1.5 ? 'walking' : 'transit')} target="_blank" rel="noreferrer" style={{ color: 'var(--azul)', fontWeight: 600, minHeight: '40px', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>Rota ↗</a>
                    </div>
                  ) : null}
                  {pode ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {it.situacao === 'sugerido' ? <button type="button" className="r-btn" onClick={() => void executar(confirmarSugestao(it))} style={acao}>Confirmar</button> : null}
                      <button type="button" className="r-btn" disabled={i === 0} aria-label="Subir" onClick={() => void executar(Promise.all([moverItem(it, dia, doDia[i - 1]!.it.ordem), moverItem(doDia[i - 1]!.it, dia, it.ordem)]))} style={acao}>↑</button>
                      <button type="button" className="r-btn" disabled={i === doDia.length - 1} aria-label="Descer" onClick={() => void executar(Promise.all([moverItem(it, dia, doDia[i + 1]!.it.ordem), moverItem(doDia[i + 1]!.it, dia, it.ordem)]))} style={acao}>↓</button>
                      <label style={{ ...acao, display: 'inline-flex', alignItems: 'center' }}>
                        <span className="visualmente-oculto">Mudar de dia</span>
                        <select value={dia} onChange={(e) => void executar(moverItem(it, Number(e.target.value), 99))} style={{ border: 0, background: 'transparent', font: "600 13px 'Open Sans'", color: 'var(--texto)' }}>
                          {Array.from({ length: v.viagem.noites + 1 }, (_, n) => <option key={n} value={n + 1}>Dia {n + 1}</option>)}
                        </select>
                      </label>
                      <button type="button" className="r-btn" onClick={() => setTrocando(trocando === it.id ? null : it.id)} style={acao}>Trocar</button>
                      <button type="button" className="r-btn" aria-pressed={Boolean(it.feito)} onClick={() => void executar(marcarFeito(it, !it.feito))} style={{ ...acao, color: it.feito ? 'var(--verde)' : 'var(--texto)' }}>{it.feito ? '✓ Feito' : 'Marcar feito'}</button>
                      <label style={{ ...acao, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span className="visualmente-oculto">Horário de {l.nome}</span>
                        <input type="time" defaultValue={it.hora?.slice(0, 5) ?? ''} onBlur={(e) => { const h = e.target.value; if (h !== (it.hora?.slice(0, 5) ?? '')) void executar(mudarHora(it, h || null)); }} style={{ border: 0, background: 'transparent', font: "600 13px 'Open Sans'", color: 'var(--texto)', width: '88px' }} />
                      </label>
                      <button type="button" className="r-btn" aria-label={`Tirar ${l.nome}`} onClick={() => void executar(removerItem(it))} style={{ ...acao, color: 'var(--vermelho)' }}>Tirar</button>
                    </div>
                  ) : (
                    <button type="button" className="r-btn" onClick={() => void alternarSalvo(l.id)} style={{ ...acao, marginTop: '4px' }}>{salvos.includes(l.id) ? '♥ Salvo nos meus lugares' : '♡ Salvar como inspiração'}</button>
                  )}
                  {trocando === it.id ? (
                    <div style={{ marginTop: '6px', borderLeft: '3px solid var(--amarelo)', paddingLeft: '8px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Mesma categoria, mais perto primeiro:</div>
                      {alternativas.length ? alternativas.map(({ o, km: d }) => (
                        <button key={o.id} type="button" className="r-btn" onClick={() => (setTrocando(null), void executar(trocarItem(it, o.id)))} style={{ display: 'block', minHeight: '40px', textAlign: 'left', fontSize: '14px' }}>
                          <b>{o.nome}</b> · {d < 9 ? textoDistancia(d) : o.area} · {precoTexto(o).texto}
                        </button>
                      )) : <div style={{ fontSize: '14px' }}>Nenhuma alternativa no catálogo.</div>}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ))}
      {pode ? (
        <div style={{ marginTop: '12px' }}>
          <BotaoContorno onClick={() => navegar(`/descobrir?d=${destinoDe(v) ?? ""}&viagem=${v.viagem.id}&dia=${dia}`)}>+ Adicionar lugar no dia {dia}</BotaoContorno>
        </div>
      ) : null}
    </section>
  );
}
const acao = { minHeight: '36px', padding: '0 10px', border: '1px solid var(--linha)', font: "600 13px 'Open Sans'" } as const;

// ---------------------------------------------------------------- Mapa
function AbaMapa({ v, dia, itens }: { v: ViagemCompleta; dia: number; itens: { it: Item; l: Lugar }[] }) {
  const navegar = useNavigate();
  const [sel, setSel] = useState<string | null>(null);
  const [todos, setTodos] = useState(false);
  const doDia = itens.filter((x) => x.it.dia === dia).sort((a, b) => a.it.ordem - b.it.ordem);
  const pontos: Ponto[] = [
    ...(todos
      ? lugaresDoDestino(destinoDe(v)).filter(temCoord).map((l) => ({ id: l.id, lat: l.lat!, lon: l.lon!, rotulo: itens.some((x) => x.l.id === l.id) ? '★' : '·', titulo: l.nome, tipo: 'lugar' as const }))
      : doDia.filter((x) => temCoord(x.l)).map((x, i) => ({ id: x.l.id, lat: x.l.lat!, lon: x.l.lon!, rotulo: String(i + 1), titulo: x.l.nome, tipo: x.it.situacao === 'sugerido' ? ('sugerido' as const) : ('parada' as const) }))),
    ...(v.hospedagem?.lat && v.hospedagem.lon ? [{ id: 'hotel', lat: v.hospedagem.lat, lon: v.hospedagem.lon, rotulo: 'H', titulo: v.hospedagem.nome, tipo: 'hotel' as const }] : []),
  ];
  const escolhido = sel && sel !== 'hotel' ? lugarPorId(sel) : null;
  const naViagem = escolhido ? itens.some((x) => x.l.id === escolhido.id) : false;
  let somaKm = 0;
  for (let i = 0; i < doDia.length - 1; i++) if (temCoord(doDia[i]!.l) && temCoord(doDia[i + 1]!.l)) somaKm += distanciaKm(doDia[i]!.l as never, doDia[i + 1]!.l as never);
  return (
    <section style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>{todos ? 'Todos os lugares conferidos da cidade' : `Dia ${dia}: ${doDia.length} paradas · ${textoDistancia(somaKm)} no total`}</span>
        <button type="button" className="r-btn" onClick={() => (setTodos(!todos), setSel(null))} style={botaoTexto}>{todos ? 'Só o dia' : 'Explorar a cidade'}</button>
      </div>
      <Mapa pontos={pontos} linha={!todos} altura="min(56vh, 420px)" aoEscolher={setSel} selecionado={sel} />
      <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '4px' }}>Mapa © OpenStreetMap · OpenFreeMap. Números = ordem da visita; H = hospedagem.</div>
      {escolhido ? (
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', padding: '10px', border: '1px solid var(--linha)' }}>
          <span style={{ width: '64px', flex: 'none' }}><FotoLugar id={escolhido.id} proporcao="1 / 1" credito={false} /></span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', font: "700 11px 'Open Sans'", textTransform: 'uppercase', color: 'var(--azul)' }}>{NOME_CATEGORIA[escolhido.categoria]}</span>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>{escolhido.nome}</b>
            <span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{precoTexto(escolhido).texto}{naViagem ? ' · já está na viagem' : ''}</span>
            <button type="button" className="r-btn" onClick={() => navegar(`/lugar/${escolhido.id}?viagem=${v.viagem.id}&dia=${dia}`)} style={botaoTexto}>{naViagem ? 'Ver detalhes' : 'Ver e adicionar à viagem'}</button>
          </span>
        </div>
      ) : sel === 'hotel' && v.hospedagem ? <p style={{ fontSize: '14px' }}><b>{v.hospedagem.nome}</b> · sua hospedagem</p> : null}
    </section>
  );
}

// ---------------------------------------------------------------- Hospedagem
function AbaHospedagem({ v, itens, pode, recarregar, destino }: { v: ViagemCompleta; itens: { it: Item; l: Lugar }[]; pode: boolean; recarregar: () => void; destino: Destino | null }) {
  const [checkin, setCheckin] = useState(v.viagem.data_ida);
  const [checkout, setCheckout] = useState(dataMais(v.viagem.data_ida, v.viagem.noites));
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [ordem, setOrdem] = useState<'preco' | 'nota' | 'distancia'>('preco');
  const [busca, setBusca] = useState<Busca | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [comparar, setComparar] = useState<string[]>([]);
  const comCoord = itens.map((x) => x.l).filter(temCoord);
  const centro = comCoord.length ? { lat: comCoord.reduce((s, l) => s + l.lat, 0) / comCoord.length, lon: comCoord.reduce((s, l) => s + l.lon, 0) / comCoord.length } : destino ? { lat: destino.lat, lon: destino.lon } : { lat: 48.8566, lon: 2.3522 };
  const euro = EURO?.venda ?? null;

  const procurar = async () => {
    setErro(null);
    setCarregando(true);
    const r = await buscarHoteis({ ...centro, checkin, checkout, adultos: v.viagem.viajantes });
    setCarregando(false);
    if (r.ok) setBusca(r.dados);
    else setErro(r.mensagem);
  };
  const lista = (busca?.hoteis ?? [])
    .map((h) => ({ h, km: distanciaKm(centro, h) }))
    .filter(({ h }) => (!min || h.porNoite >= Number(min) * 100) && (!max || h.porNoite <= Number(max) * 100))
    .sort((a, b) => (ordem === 'preco' ? a.h.porNoite - b.h.porNoite : ordem === 'nota' ? (b.h.nota ?? 0) - (a.h.nota ?? 0) : a.km - b.km));
  const emReais = (c: number) => (euro ? ` (≈ ${reais(Math.round(c * euro))})` : '');
  const sel = lista.filter((x) => comparar.includes(x.h.id));

  return (
    <section style={{ marginTop: '14px' }}>
      {v.hospedagem ? (
        <div style={{ border: '2px solid var(--texto)', padding: '10px 12px' }}>
          <div style={{ font: "700 11px 'Open Sans'", textTransform: 'uppercase', color: 'var(--verde)' }}>Hospedagem escolhida</div>
          <b style={{ font: "600 17px 'Lexend Exa'" }}>{v.hospedagem.nome}</b>
          <div style={{ fontSize: '14px' }}>{euros(v.hospedagem.total_centavos)} no total{emReais(v.hospedagem.total_centavos)} · {v.hospedagem.checkin.split('-').reverse().join('/')} a {v.hospedagem.checkout.split('-').reverse().join('/')}</div>
          <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{v.hospedagem.fonte}, cotado em {new Date(v.hospedagem.cotado_em).toLocaleDateString('pt-BR')}. Preços mudam até a reserva.</div>
        </div>
      ) : <p style={{ fontSize: '15px', lineHeight: '22px', margin: 0 }}>Sem hospedagem a viagem não está planejada no bolso. Busque perto do seu roteiro:</p>}
      {pode ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Entrada<input type="date" className="r-input" value={checkin} onChange={(e) => setCheckin(e.target.value)} style={campo} /></label>
            <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Saída<input type="date" className="r-input" value={checkout} onChange={(e) => setCheckout(e.target.value)} style={campo} /></label>
          </div>
          <div style={{ marginTop: '10px' }}><BotaoPrincipal onClick={() => void procurar()} disabled={carregando}>{carregando ? 'Buscando preços…' : `Buscar para ${v.viagem.viajantes} ${v.viagem.viajantes === 1 ? 'pessoa' : 'pessoas'}`}</BotaoPrincipal></div>
        </>
      ) : null}
      {erro ? <Aviso>{erro}</Aviso> : null}
      {busca ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
            <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Diária mínima (€)<input inputMode="numeric" className="r-input" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))} style={campo} /></label>
            <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Diária máxima (€)<input inputMode="numeric" className="r-input" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))} style={campo} /></label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Segmentos rotulo="Ordenar" valor={ordem} aoMudar={setOrdem} opcoes={[{ id: 'preco', nome: 'Menor preço' }, { id: 'nota', nome: 'Melhor nota' }, { id: 'distancia', nome: 'Perto do roteiro' }]} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '6px' }}>{lista.length} opções com preço para as datas · {busca.fonte}, {new Date(busca.cotadoEm).toLocaleString('pt-BR')}{busca.fonte.includes('teste') ? ' · ambiente de teste: confira o preço final antes de reservar' : ''}</div>
          {sel.length >= 2 ? (
            <div style={{ overflowX: 'auto', marginTop: '10px' }}>
              <table style={{ borderCollapse: 'collapse', fontSize: '13px', minWidth: '100%' }}>
                <thead><tr><th style={th}>Comparar</th>{sel.map(({ h }) => <th key={h.id} style={th}>{h.nome}</th>)}</tr></thead>
                <tbody>
                  <tr><td style={td}>Diária</td>{sel.map(({ h }) => <td key={h.id} style={td}>{euros(h.porNoite)}</td>)}</tr>
                  <tr><td style={td}>Total</td>{sel.map(({ h }) => <td key={h.id} style={td}>{euros(h.total)}{emReais(h.total)}</td>)}</tr>
                  <tr><td style={td}>Nota</td>{sel.map(({ h }) => <td key={h.id} style={td}>{h.nota ?? '—'} ({h.avaliacoes ?? 0})</td>)}</tr>
                  <tr><td style={td}>Estrelas</td>{sel.map(({ h }) => <td key={h.id} style={td}>{h.estrelas ?? '—'}</td>)}</tr>
                  <tr><td style={td}>Até o roteiro</td>{sel.map(({ h, km }) => <td key={h.id} style={td}>{textoDistancia(km)}</td>)}</tr>
                </tbody>
              </table>
            </div>
          ) : null}
          <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
            {lista.map(({ h, km }) => (
              <li key={h.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--linha)' }}>
                {h.foto ? <img src={h.foto} alt={`Foto do ${h.nome}`} loading="lazy" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }} /> : null}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '6px' }}>
                  <div style={{ minWidth: 0 }}>
                    <b style={{ font: "600 16px/21px 'Lexend Exa'" }}>{h.nome}</b>
                    <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{h.estrelas ? `${'★'.repeat(Math.round(h.estrelas))} · ` : ''}{h.nota ? `nota ${h.nota} (${h.avaliacoes} avaliações)` : 'sem nota'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{textoDistancia(km)} do centro do roteiro</div>
                  </div>
                  <div style={{ textAlign: 'right', flex: 'none' }}>
                    <b style={{ font: "600 17px 'Lexend Exa'" }}>{euros(h.porNoite)}</b>
                    <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>por noite</div>
                    <div style={{ fontSize: '13px' }}>{euros(h.total)} total</div>
                  </div>
                </div>
                {h.comodidades.length ? <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '4px' }}>{h.comodidades.slice(0, 5).join(' · ')}</div> : null}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <label style={{ ...acao, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <input type="checkbox" checked={comparar.includes(h.id)} onChange={() => setComparar((c) => (c.includes(h.id) ? c.filter((x) => x !== h.id) : [...c, h.id].slice(-3)))} /> Comparar
                  </label>
                  {pode ? <button type="button" className="r-btn" onClick={() => void escolherHotel(v.viagem.id, h, busca, checkin, checkout).then(recarregar)} style={{ ...acao, background: 'var(--amarelo)', border: 0 }}>Escolher esta</button> : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
const th = { textAlign: 'left' as const, padding: '6px', borderBottom: '2px solid var(--texto)', font: "600 13px 'Open Sans'", minWidth: '110px' };
const td = { padding: '6px', borderBottom: '1px solid var(--linha)', verticalAlign: 'top' as const };

// ---------------------------------------------------------------- Orçamento
function AbaOrcamento({ v, orc, itens, pode, recarregar, moeda }: { v: ViagemCompleta; orc: { o: ReturnType<typeof calcular>; limiteBRL: number | null; sugestoes: ReturnType<typeof sugerirAjustes> }; itens: { it: Item; l: Lugar }[]; pode: boolean; recarregar: () => void; moeda: string }) {
  const [limite, setLimite] = useState(v.viagem.orcamento_centavos ? String(v.viagem.orcamento_centavos / 100) : '');
  const [aberta, setAberta] = useState<string | null>(null);
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [cat, setCat] = useState('passagem');
  const { o, sugestoes } = orc;
  const ativos = v.membros.filter((m) => m.status === 'ativo');
  const limiteC = orc.limiteBRL;
  const aplicar = async (de: string, para: string, dia: number) => {
    const it = itens.find((x) => x.l.id === de && x.it.dia === dia)?.it;
    if (it) await trocarItem(it, para);
    recarregar();
  };
  return (
    <section style={{ marginTop: '14px' }}>
      <div style={{ font: "600 26px 'Lexend Exa'" }}>{reais(o.provavelBRL)}</div>
      <div style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Faixa: {reais(o.minBRL)} a {reais(o.maxBRL)} · {reais(o.porPessoaBRL)} por pessoa ({v.viagem.viajantes})</div>
      {EURO ? <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>Euro a R$ {EURO.venda.toFixed(4).replace('.', ',')} (Banco Central, PTAX de {EURO.data.split('-').reverse().join('/')})</div> : <Aviso cor="var(--ambar)">Câmbio do Banco Central ainda não carregado: os valores em euro não entram no total em reais.</Aviso>}
      {limiteC ? (
        <div style={{ marginTop: '10px', padding: '10px 12px', background: o.provavelBRL > limiteC ? 'var(--cartao-1)' : 'var(--cartao-2)' }}>
          <b>{o.provavelBRL > limiteC ? `Passa ${reais(o.provavelBRL - limiteC)} do orçamento de ${reais(limiteC)}.` : `Dentro do orçamento de ${reais(limiteC)} (sobram ${reais(limiteC - o.provavelBRL)}).`}</b>
          {sugestoes.length ? (
            <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '14px', lineHeight: '20px' }}>
              {sugestoes.map((s) => (
                <li key={s.texto}>{s.texto}: economiza ≈ {reais(s.economiaBRL)}.{pode && s.troca ? <> <button type="button" className="r-btn" onClick={() => void aplicar(s.troca!.de, s.troca!.para, s.troca!.dia)} style={{ color: 'var(--azul)', fontWeight: 600 }}>Aplicar</button></> : null}</li>
              ))}
            </ul>
          ) : o.provavelBRL > limiteC ? <div style={{ fontSize: '14px', marginTop: '4px' }}>Dá para reduzir noites, trocar a hospedagem ou tirar atrações pagas.</div> : null}
        </div>
      ) : null}
      {pode ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginTop: '10px' }}>
          <label style={{ flex: 1, fontSize: '13px', color: 'var(--texto-sec)' }}>Orçamento total ({moeda})<input inputMode="numeric" className="r-input" value={limite} onChange={(e) => setLimite(e.target.value.replace(/\D/g, ''))} style={campo} /></label>
          <button type="button" className="r-btn" onClick={() => void atualizarViagem(v.viagem.id, { orcamento_centavos: limite ? Number(limite) * 100 : null }).then(recarregar)} style={{ ...acao, height: '44px' }}>Salvar</button>
        </div>
      ) : null}
      <Rotulo>Por categoria</Rotulo>
      {o.categorias.map((c) => (
        <div key={c.id} style={{ borderBottom: '1px solid var(--linha)' }}>
          <button type="button" className="r-btn" aria-expanded={aberta === c.id} onClick={() => setAberta(aberta === c.id ? null : c.id)} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', minHeight: '52px', alignItems: 'center', textAlign: 'left' }}>
            <span><b>{c.nome}</b>{c.linhas.some((l) => l.semPreco) ? <span style={{ fontSize: '12px', color: 'var(--ambar)' }}> · itens sem preço</span> : null}</span>
            <span style={{ font: "600 15px 'Lexend Exa'" }}>{c.maxBRL ? (c.minBRL === c.maxBRL ? reais(c.minBRL) : `${reais(c.minBRL)}–${reais(c.maxBRL)}`) : '—'} {aberta === c.id ? '▴' : '▾'}</span>
          </button>
          {aberta === c.id ? (
            <div style={{ paddingBottom: '10px' }}>
              {c.aviso ? <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginBottom: '6px' }}>{c.aviso}</div> : null}
              {c.linhas.map((l, i) => (
                <div key={i} style={{ padding: '6px 0', borderTop: i ? '1px dashed var(--linha)' : 0, fontSize: '14px', lineHeight: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <span>{l.texto}</span>
                    <b style={{ whiteSpace: 'nowrap' }}>{l.semPreco ? 'sem preço' : l.moeda === 'EUR' ? (l.min === l.max ? euros(l.min) : `${euros(l.min)}–${euros(l.max)}`) : reais(l.min)}</b>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: 'var(--texto-sec)' }}>
                    <Selo tipo={l.selo} /> {l.url ? <a href={l.url} target="_blank" rel="noreferrer" style={{ color: 'var(--texto-sec)' }}>{l.fonte}</a> : l.fonte}
                  </div>
                  {c.id === 'outros' && pode ? <button type="button" className="r-btn" onClick={() => void removerGasto(v.viagem.id, v.gastos[i]!.id).then(recarregar)} style={{ color: 'var(--vermelho)', fontSize: '13px', minHeight: '36px' }}>Remover</button> : null}
                </div>
              ))}
              {!c.linhas.length ? <div style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Nada ainda.</div> : null}
            </div>
          ) : null}
        </div>
      ))}
      {pode ? (
        <>
          <Rotulo>Informar um gasto (passagem, seguro, compras…)</Rotulo>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categoria do gasto" style={{ ...campo, font: "500 16px 'Open Sans'" }}>
              <option value="passagem">Passagem</option><option value="hospedagem">Hospedagem</option><option value="alimentacao">Alimentação</option><option value="lazer">Lazer</option><option value="transporte">Transporte</option><option value="outros">Outros</option>
            </select>
            <input className="r-input" placeholder="Descrição (ex.: passagem ida e volta)" value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 80))} style={campo} aria-label="Descrição" />
            <input className="r-input" inputMode="numeric" placeholder="Valor em R$" value={valor} onChange={(e) => setValor(e.target.value.replace(/\D/g, ''))} style={campo} aria-label="Valor em reais" />
            <BotaoContorno onClick={() => { if (desc && valor) void adicionarGasto(v.viagem.id, { categoria: cat, descricao: desc, valor: Number(valor) * 100 }).then(() => (setDesc(''), setValor(''), recarregar())); }}>Adicionar gasto</BotaoContorno>
          </div>
        </>
      ) : null}
      {ativos.length > 1 ? (
        <>
          <Rotulo>Divisão entre participantes</Rotulo>
          {ativos.map((m) => <div key={m.user_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', padding: '4px 0' }}><span>{m.nome}</span><b>{reais(Math.round(o.provavelBRL / v.viagem.viajantes))}</b></div>)}
          <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>Divisão igual pelo número de viajantes da viagem ({v.viagem.viajantes}).</div>
        </>
      ) : null}
    </section>
  );
}

// ---------------------------------------------------------------- Grupo
function AbaGrupo({ v, pode, recarregar }: { v: ViagemCompleta; pode: boolean; recarregar: () => void }) {
  const navegar = useNavigate();
  const [amigos, setAmigos] = useState<Amizade[]>([]);
  const [refazendo, setRefazendo] = useState(false);
  const { preferencias } = useViajante();
  const dono = v.papel === 'dono';
  useEffect(() => {
    if (dono) void minhasAmizades().then((a) => setAmigos(a.filter((x) => x.status === 'aceita')));
  }, [dono]);
  const naViagem = new Set(v.membros.map((m) => m.user_id));
  const PAPEL = { dono: 'Organiza', editor: 'Planeja junto', leitor: 'Só acompanha' } as const;
  return (
    <section style={{ marginTop: '14px' }}>
      <Rotulo style={{ marginTop: 0 }}>Quem participa</Rotulo>
      {v.membros.map((m) => {
        const respondeu = v.pessoas.find((p) => p.nome === m.nome)?.preferencias;
        return (
          <div key={m.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '52px', borderBottom: '1px solid var(--linha)' }}>
            <span>
              <b>{m.nome}</b>
              <span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{m.status === 'convidado' ? 'Convite enviado' : PAPEL[m.papel]}{m.status === 'ativo' ? (respondeu ? ' · jeito de viajar respondido' : ' · ainda sem jeito de viajar') : ''}</span>
            </span>
          </div>
        );
      })}
      {dono ? (
        <>
          <Rotulo>Convidar amigos</Rotulo>
          {amigos.filter((a) => !naViagem.has(a.outro.user_id)).map((a) => (
            <div key={a.outro.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '52px', borderBottom: '1px solid var(--linha)', gap: '6px' }}>
              <b style={{ flex: 1 }}>{a.outro.display_name}</b>
              <button type="button" className="r-btn" onClick={() => void convidar(v.viagem.id, a.outro.user_id, 'editor').then(recarregar)} style={acao}>Planejar junto</button>
              <button type="button" className="r-btn" onClick={() => void convidar(v.viagem.id, a.outro.user_id, 'leitor').then(recarregar)} style={acao}>Só ver</button>
            </div>
          ))}
          {!amigos.length ? <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: 0 }}>Adicione amigos na aba Social para convidar. <button type="button" className="r-btn" onClick={() => navegar('/social')} style={botaoTexto}>Ir para Social</button></p> : null}
          <Rotulo>Quem pode ver</Rotulo>
          <Segmentos rotulo="Visibilidade" valor={v.viagem.visibilidade} aoMudar={(vis) => void atualizarViagem(v.viagem.id, { visibilidade: vis }).then(recarregar)}
            opcoes={[{ id: 'privada', nome: 'Só participantes' }, { id: 'amigos', nome: 'Meus amigos também' }]} />
        </>
      ) : null}
      {pode ? (
        <>
          <Rotulo>Roteiro do grupo</Rotulo>
          <p style={{ fontSize: '14px', lineHeight: '20px', margin: 0 }}>Junta o jeito de viajar de todos: gostos somam, o que alguém quer evitar fica de fora e o orçamento segue o mais apertado. Cada parada diz para quem do grupo ela foi pensada.</p>
          <div style={{ marginTop: '8px' }}>
            <BotaoContorno onClick={() => { if (window.confirm('Refazer o roteiro com as preferências de todos? As mudanças manuais serão substituídas.')) { setRefazendo(true); void montarRoteiro(v.viagem, v.pessoas, preferencias).then(() => (setRefazendo(false), recarregar())); } }}>{refazendo ? 'Refazendo…' : 'Refazer roteiro para o grupo'}</BotaoContorno>
          </div>
        </>
      ) : null}
      <Rotulo>Últimas alterações</Rotulo>
      {v.eventos.map((e) => (
        <div key={e.id} style={{ fontSize: '14px', lineHeight: '20px', padding: '4px 0', borderBottom: '1px dashed var(--linha)' }}>
          <b>{v.membros.find((m) => m.user_id === e.autor)?.nome ?? 'Alguém'}</b>: {e.texto} <span style={{ color: 'var(--texto-sec)', fontSize: '12px' }}>{new Date(e.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ))}
    </section>
  );
}
