import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import PRECOS from '../../dados/precos-paris.json';
import type { Precos } from '../../lib/orcamento';
import { adicionarItem, listarViagens, type Viagem } from '../../lib/viagens';

import { CATEGORIAS, enderecoCurto, horarioLegivel, lugarPorId, OSM_ATUALIZADO_EM } from '../../lib/catalogo';
import { basePorId, CATEGORIAS_LUGAR, lugaresPorIds, nomeTipo } from '../../lib/lugares';
import { dinheiro } from '../../lib/moedas';
import { afinidade } from '../../lib/planejador';
import { useViajante } from '../../state/viajante';
import { FotoLugar } from '../../ui/foto';
import { Voltar } from '../../ui/pecas';

/** Detalhe do lugar: foto, categoria, endereço, horário com fonte, mapa e salvar. */
function AdicionarAViagem({ placeId, slots }: { placeId: string; slots: string[] }) {
  const navegar = useNavigate();
  const [params] = useSearchParams();
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [viagem, setViagem] = useState(params.get('viagem') ?? '');
  const [dia, setDia] = useState(Number(params.get('dia') ?? 1));
  const [periodo, setPeriodo] = useState(slots[0] ?? 'afternoon');
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    void listarViagens().then((v) => {
      const editaveis = v.minhas.filter((x) => x.status === 'ativo' && x.papel !== 'leitor');
      setViagens(editaveis);
      if (!params.get('viagem') && editaveis[0]) setViagem(editaveis[0].id);
    });
  }, [params]);
  if (!viagens.length) return null;
  const v = viagens.find((x) => x.id === viagem);
  const NOMES: Record<string, string> = { morning: 'Manhã', afternoon: 'Tarde', evening: 'Fim de tarde', night: 'Noite' };
  const sel = { ...{ display: 'block', width: '100%', boxSizing: 'border-box' as const, borderBottom: '2px solid var(--texto)', padding: '8px 0', font: "500 16px 'Open Sans'", background: 'transparent', color: 'var(--texto)' } };
  return (
    <div style={{ marginTop: '16px', padding: '12px', border: '2px solid var(--texto)' }}>
      <b style={{ font: "600 16px 'Lexend Exa'" }}>Adicionar à viagem</b>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
        <label style={{ gridColumn: '1 / -1', fontSize: '13px', color: 'var(--texto-sec)' }}>Viagem
          <select value={viagem} onChange={(e) => setViagem(e.target.value)} style={sel}>{viagens.map((x) => <option key={x.id} value={x.id}>{x.destino} · {x.data_ida.split('-').reverse().join('/')}</option>)}</select>
        </label>
        <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Dia
          <select value={dia} onChange={(e) => setDia(Number(e.target.value))} style={sel}>{Array.from({ length: (v?.noites ?? 0) + 1 }, (_, i) => <option key={i} value={i + 1}>Dia {i + 1}</option>)}</select>
        </label>
        <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Quando
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} style={sel}>{slots.map((s) => <option key={s} value={s}>{NOMES[s]}</option>)}</select>
        </label>
      </div>
      <button type="button" className="r-btn" onClick={() => void adicionarItem(viagem, placeId, dia, periodo).then((ok) => setMsg(ok ? 'Adicionado. O orçamento e o mapa já consideram este lugar.' : 'Não deu para adicionar. Confira se você pode editar esta viagem.'))}
        style={{ width: '100%', height: '48px', marginTop: '10px', background: 'var(--amarelo)', font: "600 15px 'Open Sans'" }}>Adicionar no dia {dia}</button>
      {msg ? <div role="status" style={{ fontSize: '14px', marginTop: '6px', color: msg.startsWith('Adicionado') ? 'var(--verde)' : 'var(--vermelho)' }}>{msg} {msg.startsWith('Adicionado') ? <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${viagem}`)} style={{ color: 'var(--azul)', fontWeight: 600 }}>Ver a viagem</button> : null}</div> : null}
    </div>
  );
}

export function Lugar() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  const [carregado, setCarregado] = useState(!id.startsWith('osm-') || Boolean(basePorId(id)));
  useEffect(() => {
    if (!carregado) void lugaresPorIds([id]).then(() => setCarregado(true));
  }, [id, carregado]);
  const l = lugarPorId(id);
  const base = basePorId(id);
  const { salvos, alternarSalvo, preferencias } = useViajante();
  if (!carregado) return <main className="tela" aria-busy="true" style={{ padding: '40px 20px' }}>Carregando o lugar…</main>;
  if (!l) return <Navigate to="/descobrir" replace />;
  if (base) return <LugarDaBase />;
  const salvo = salvos.includes(l.id);
  const preco = (PRECOS as unknown as Precos).lugares[l.id];
  const motivos = preferencias ? afinidade(l, preferencias).motivos : [];
  const mapa = typeof l.lat === 'number' ? `https://www.google.com/maps/search/?api=1&query=${l.lat},${l.lon}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.nome}, Paris`)}`;
  return (
    <main className="tela" data-tela="lugar" data-real="lugar">
      <div style={{ position: 'relative', maxHeight: '320px', overflow: 'hidden' }}>
        <FotoLugar id={l.id} proporcao="4 / 3" />
        <div style={{ position: 'absolute', top: 'calc(8px + env(safe-area-inset-top))', left: '12px', background: 'var(--fundo)', zIndex: 2 }}>
          <Voltar />
        </div>
      </div>
      <div style={{ padding: '14px 20px 24px' }}>
        <div style={{ font: "700 12px 'Open Sans'", letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--azul)' }}>{CATEGORIAS[l.categoria]}</div>
        <h1 style={{ margin: '4px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{l.nome}</h1>
        <p style={{ margin: '8px 0 0', fontSize: '16px', lineHeight: '24px' }}>{l.descricao}</p>
        {motivos.length ? <p style={{ margin: '8px 0 0', fontSize: '14px', lineHeight: '20px', color: 'var(--verde)', fontWeight: 600 }}>Combina com você: {motivos.join(', ')}.</p> : null}
        <dl style={{ margin: '14px 0 0', display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '12px', rowGap: '8px', fontSize: '15px', lineHeight: '21px' }}>
          <dt style={{ fontWeight: 600 }}>Onde</dt>
          <dd style={{ margin: 0 }}>{enderecoCurto(l.endereco) ?? l.area}</dd>
          <dt style={{ fontWeight: 600 }}>Horário</dt>
          <dd style={{ margin: 0 }}>{l.horario ? horarioLegivel(l.horario) : 'Não confirmado. Confira no site oficial antes de ir.'}</dd>
          <dt style={{ fontWeight: 600 }}>Preço</dt>
          <dd style={{ margin: 0 }}>{preco ? (preco.min === 0 ? 'Grátis' : `${(preco.min / 100).toLocaleString('pt-BR')}${preco.max !== preco.min ? ` a ${(preco.max / 100).toLocaleString('pt-BR')}` : ''} € por pessoa`) : l.custo === 0 ? 'Grátis' : 'Não confirmado'}{preco ? <span style={{ display: 'block', fontSize: '12px', color: 'var(--texto-sec)' }}>{preco.selo === 'referencia' ? '▤ Referência' : '≈ Estimativa'} · <a href={preco.url} target="_blank" rel="noreferrer" style={{ color: 'var(--texto-sec)' }}>{preco.fonte}</a>{preco.reserva ? ' · compre o ingresso antes' : ''}</span> : null}</dd>
        </dl>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <a href={mapa} target="_blank" rel="noreferrer" style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--texto)', font: "600 15px 'Open Sans'", color: 'var(--texto)', textDecoration: 'none' }}>Ver no mapa ↗</a>
          <button type="button" className="r-btn" aria-pressed={salvo} onClick={() => void alternarSalvo(l.id)} style={{ flex: 1, height: '48px', background: salvo ? 'var(--fundo-escuro)' : 'var(--amarelo)', color: salvo ? '#fff' : 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>
            {salvo ? '✓ Quero ir' : '+ Quero ir'}
          </button>
        </div>
        <AdicionarAViagem placeId={l.id} slots={l.slots} />
        {l.site ? <a href={l.site} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '12px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Site oficial ↗</a> : null}
        <p style={{ fontSize: '13px', lineHeight: '19px', color: 'var(--texto-sec)', marginTop: '16px' }}>
          {l.osm ? <>Endereço e horário: <a href={l.osm} target="_blank" rel="noreferrer" style={{ color: 'var(--texto-sec)' }}>OpenStreetMap</a>{OSM_ATUALIZADO_EM ? `, ${OSM_ATUALIZADO_EM.split('-').reverse().join('/')}` : ''}. </> : null}
          Lugar escolhido pela curadoria do Bo Vair.
        </p>
        <button type="button" className="r-btn" onClick={() => navegar('/descobrir')} style={{ marginTop: '4px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Ver mais lugares</button>
      </div>
    </main>
  );
}

/** Lugar da base (OpenStreetMap): o que a fonte tem, com a fonte e a data, e o que falta dito. */
function LugarDaBase() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  const b = basePorId(id)!;
  const l = lugarPorId(id)!;
  const { salvos, alternarSalvo } = useViajante();
  const salvo = salvos.includes(id);
  const linha = (rotulo: string, valor: React.ReactNode) => (<><dt style={{ fontWeight: 600 }}>{rotulo}</dt><dd style={{ margin: 0 }}>{valor}</dd></>);
  const preco = b.preco_min_centavos != null && b.preco_moeda
    ? `${dinheiro(b.preco_min_centavos, b.preco_moeda)}${b.preco_max_centavos && b.preco_max_centavos !== b.preco_min_centavos ? ` a ${dinheiro(b.preco_max_centavos, b.preco_moeda)}` : ''}${b.preco_fonte ? ` (${b.preco_fonte})` : ''}`
    : b.gratuito ? 'Grátis (segundo o OpenStreetMap)' : 'Não informado pela fonte. Confira no local ou no site.';
  return (
    <main className="tela" data-tela="lugar" data-real="lugar">
      {b.foto ? (
        <div style={{ position: 'relative', maxHeight: '320px', overflow: 'hidden' }}>
          <FotoLugar id={id} proporcao="4 / 3" />
          <div style={{ position: 'absolute', top: 'calc(8px + env(safe-area-inset-top))', left: '12px', background: 'var(--fundo)', zIndex: 2 }}><Voltar /></div>
        </div>
      ) : <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}><Voltar /></div>}
      <div style={{ padding: '14px 20px 24px' }}>
        <div style={{ font: "700 12px 'Open Sans'", letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--azul)' }}>{CATEGORIAS_LUGAR[b.categoria].nome} · {nomeTipo(b.tipo)}</div>
        {!b.foto ? <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>Ainda sem foto com licença livre deste lugar.</div> : null}
        <h1 style={{ margin: '4px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{b.nome}</h1>
        <dl style={{ margin: '14px 0 0', display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '12px', rowGap: '8px', fontSize: '15px', lineHeight: '21px' }}>
          {linha('Onde', b.endereco ?? b.bairro ?? 'Endereço não informado (veja no mapa).')}
          {b.cozinha ? linha('Cozinha', b.cozinha) : null}
          {b.estrelas ? linha('Categoria', `${b.estrelas} estrelas (classificação do hotel, não é avaliação de clientes)`) : null}
          {linha('Horário', b.horario ? horarioLegivel(b.horario) : 'Não informado. Confira antes de ir.')}
          {linha('Preço', preco)}
          {b.telefone ? linha('Telefone', <a href={`tel:${b.telefone.replace(/[^\d+]/g, '')}`} style={{ color: 'var(--azul)' }}>{b.telefone}</a>) : null}
          {linha('Avaliações', 'Ainda não temos uma fonte de avaliações para mostrar.')}
        </dl>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <a href={`https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lon}`} target="_blank" rel="noreferrer" style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--texto)', font: "600 15px 'Open Sans'", color: 'var(--texto)', textDecoration: 'none' }}>Ver no mapa ↗</a>
          <button type="button" className="r-btn" aria-pressed={salvo} onClick={() => void alternarSalvo(id)} style={{ flex: 1, height: '48px', background: salvo ? 'var(--fundo-escuro)' : 'var(--amarelo)', color: salvo ? '#fff' : 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>{salvo ? '✓ Quero ir' : '+ Quero ir'}</button>
        </div>
        {CATEGORIAS_LUGAR[b.categoria].roteiro ? <AdicionarAViagem placeId={id} slots={l.slots} /> : <p style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '12px' }}>{b.categoria === 'hospedagem' ? 'Para preço e reserva de hospedagem, use a aba Hospedagem da sua viagem.' : 'Lugar de apoio (não entra no roteiro).'}</p>}
        {b.site ? <a href={b.site} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '12px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Site ↗</a> : null}
        <p style={{ fontSize: '13px', lineHeight: '19px', color: 'var(--texto-sec)', marginTop: '16px' }}>
          Dados: <a href={`https://www.openstreetmap.org/${b.fonte_id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--texto-sec)' }}>OpenStreetMap</a> (© colaboradores, ODbL){b.dados_de ? `, base de ${b.dados_de.split('-').reverse().join('/')}` : ''}. Mapa colaborativo: {b.verificado ? 'conferido pela curadoria do Bo Vair.' : 'não conferido pela curadoria do Bo Vair.'}
        </p>
        <button type="button" className="r-btn" onClick={() => navegar(`/descobrir?d=${b.destino_id}`)} style={{ marginTop: '4px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Ver mais lugares desta cidade</button>
      </div>
    </main>
  );
}
