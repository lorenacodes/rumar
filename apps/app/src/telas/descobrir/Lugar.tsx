import React, { useEffect, useState } from 'react';
import { hojeLocal } from '../../lib/datas';
import { Check } from '../../ui/check';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import PRECOS from '../../dados/precos-paris.json';
import type { Precos } from '../../lib/orcamento';
import { adicionarItem, listarViagens, type Viagem } from '../../lib/viagens';

import { CATEGORIAS, DESTINO_CURADORIA, enderecoCurto, horarioLegivel, lugarPorId, OSM_ATUALIZADO_EM } from '../../lib/catalogo';
import { basePorId, CATEGORIAS_LUGAR, destinoPorId, fontesDoLugar, lugaresPorIds, nomeTipo, SELO_POPULARIDADE } from '../../lib/lugares';
import { dinheiro, paisPorCodigo } from '../../lib/moedas';
import { linkSeguro } from '../../lib/seguro';
import { linkWhatsApp } from '../../lib/whatsapp';
import { BotaoWhatsApp } from '../../ui/whatsapp';
import { afinidade } from '../../lib/planejador';
import { useViajante } from '../../state/viajante';
import { FotoLugar } from '../../ui/foto';
import { Voltar } from '../../ui/pecas';
import { Info } from '../../ui/info';
import { gastosDosLugares, type GastoLugar } from '../../lib/avaliacoes';
import { Avaliacoes } from './Avaliacoes';
import { CapaAlternativa, FotosDeQuemFoi } from './FotosDoLugar';
import { useSessao } from '../../conta/servico';

/** Detalhe do lugar: foto, categoria, endereço, horário com fonte, mapa e salvar. */
function AdicionarAViagem({ placeId, slots, destinoId, cidade: cidadeDada }: { placeId: string; slots: string[]; destinoId: string | null; cidade: string | null }) {
  const navegar = useNavigate();
  const [cidade, setCidade] = useState(cidadeDada);
  useEffect(() => { if (!cidadeDada && destinoId) void destinoPorId(destinoId).then((d) => d && setCidade(d.nome)); }, [cidadeDada, destinoId]);
  const sessao = useSessao();
  const [carregou, setCarregou] = useState(false);
  const [params] = useSearchParams();
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [viagem, setViagem] = useState(params.get('viagem') ?? '');
  const [dia, setDia] = useState(Number(params.get('dia') ?? 1));
  const [periodo, setPeriodo] = useState(slots[0] ?? 'afternoon');
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!sessao) return;
    void listarViagens().then((v) => {
      const hoje = hojeLocal();
      // Só viagens para a cidade deste lugar (e que ainda não acabaram).
      const editaveis = v.minhas.filter((x) => x.status === 'ativo' && x.papel !== 'leitor' && (!destinoId || x.destino_id === destinoId) && x.data_ida >= new Date(Date.parse(hoje) - x.noites * 864e5).toISOString().slice(0, 10));
      setViagens(editaveis);
      if (!params.get('viagem') || !editaveis.some((x) => x.id === params.get('viagem'))) setViagem(editaveis[0]?.id ?? '');
      setCarregou(true);
    });
  }, [params, sessao, destinoId]);
  const caixa = { marginTop: '16px', padding: '12px', border: '2px solid var(--texto)' } as const;
  const botao = { width: '100%', height: '48px', marginTop: '10px', background: 'var(--amarelo)', font: "600 15px 'Open Sans'" } as const;
  if (sessao === undefined) return null;
  if (!sessao) {
    return (
      <div style={caixa}>
        <b style={{ font: "600 16px 'Lexend Exa'" }}>Montar uma viagem com este lugar</b>
        <p style={{ fontSize: '14px', lineHeight: '20px', margin: '6px 0 0' }}>Crie sua conta grátis para montar o roteiro.</p>
        <button type="button" className="r-btn" onClick={() => navegar('/conta/criar')} style={botao}>Criar conta</button>
        <button type="button" className="r-btn alvo-toque" onClick={() => navegar('/entrar')} style={{ display: 'block', margin: '6px auto 0', color: 'var(--azul)', fontWeight: 600 }}>Já tenho conta · Entrar</button>
      </div>
    );
  }
  if (!carregou) return null;
  // Veio de uma viagem que já passou (registrar onde foi, D-061): não oferece planejar de novo.
  if (params.get('viagem') && !viagens.some((x) => x.id === params.get('viagem'))) {
    return <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--verde)', margin: '14px 0 0' }}>Salvo na sua viagem. Conte como foi abaixo.</p>;
  }
  if (!viagens.length) {
    return (
      <div style={caixa}>
        <b style={{ font: "600 16px 'Lexend Exa'" }}>{cidade ? `Que tal conhecer ${cidade}?` : 'Que tal conhecer esta cidade?'}</b>
                {destinoId ? <button type="button" className="r-btn" onClick={() => navegar(`/viagens/nova?d=${destinoId}`)} style={botao}>Planejar viagem{cidade ? ` para ${cidade}` : ''}</button> : null}
      </div>
    );
  }
  const v = viagens.find((x) => x.id === viagem);
  const NOMES: Record<string, string> = { morning: 'Manhã', afternoon: 'Tarde', evening: 'Fim de tarde', night: 'Noite' };
  const sel = { ...{ display: 'block', width: '100%', boxSizing: 'border-box' as const, borderBottom: '2px solid var(--texto)', padding: '8px 0', font: "500 16px 'Open Sans'", background: 'transparent', color: 'var(--texto)' } };
  return (
    <div style={caixa}>
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

const COMIDA = ['restaurantes', 'cafes', 'bares', 'vida-noturna'];

/** Gasto por pessoa informado por quem foi (dado nosso, de avaliações reais). Sem dado, convida a informar. */
function GastoDeQuemFoi({ placeId, comida }: { placeId: string; comida: boolean }) {
  const [g, setG] = useState<GastoLugar | null | undefined>(undefined);
  useEffect(() => {
    let vivo = true;
    setG(undefined);
    void gastosDosLugares([placeId]).then((m) => { if (vivo) setG(m.get(placeId) ?? null); }, () => { if (vivo) setG(null); });
    return () => { vivo = false; };
  }, [placeId]);
  if (g === undefined || (!g && !comida)) return null;
  if (!g) {
    return (
      <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)' }}>
        Ninguém informou o gasto ainda.{' '}
        <a href={`#/lugar/${placeId}#avaliar=1`} onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('bovair:abrir-avaliacao')); }} style={{ color: 'var(--azul)', fontWeight: 600 }}>Já foi? Conte quanto gastou</a>
      </p>
    );
  }
  return (
    <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '14px', background: 'var(--cartao-2)' }}>
      <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Gasto de quem foi</div>
      <div style={{ font: "600 20px/26px 'Lexend Exa'", letterSpacing: '-0.01em' }}>cerca de {dinheiro(g.mediana_centavos, g.moeda)} <span style={{ font: "400 14px 'Open Sans'", color: 'var(--texto-sec)' }}>por pessoa</span></div>
      <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '2px' }}>
        {g.quantidade} {g.quantidade === 1 ? 'pessoa informou' : 'pessoas informaram'}{' '}
        <Info rotulo="Como calculamos">É o valor do meio entre os gastos por pessoa que quem foi informou ao avaliar (mediana). Uma conta muito alta ou muito baixa não distorce. Não vem de cardápio nem de outro site.</Info>
      </div>
    </div>
  );
}

export function Lugar() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  // Guarda QUAL lugar já foi buscado: ao ir de um lugar para outro sem recarregar, busca o novo (antes ia para o Descobrir).
  const [buscado, setBuscado] = useState<string | null>(null);
  const carregado = !/^(osm|pesq|cnpj)-/.test(id) || Boolean(basePorId(id)) || buscado === id;
  useEffect(() => {
    if (carregado) return;
    let vivo = true;
    const fim = () => { if (vivo) setBuscado(id); };
    void lugaresPorIds([id]).then(fim, fim);
    return () => { vivo = false; };
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
  const mapa = typeof l.lat === 'number' ? `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lon}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.nome}, Paris`)}`;
  return (
    <main className="tela" data-tela="lugar" data-real="lugar">
      <div style={{ position: 'relative', maxHeight: '320px', overflow: 'hidden' }}>
        <FotoLugar id={l.id} proporcao="4 / 3" />
        <div style={{ position: 'absolute', top: 'calc(10px + env(safe-area-inset-top))', left: '14px', zIndex: 2 }}>
          <Voltar sobreFoto />
        </div>
      </div>
      <div style={{ padding: '14px 20px 24px' }}>
        <div style={{ font: "600 13px/17px 'Open Sans'", color: 'var(--azul)' }}>{CATEGORIAS[l.categoria]}</div>
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
          <a href={mapa} target="_blank" rel="noreferrer" style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--texto)', font: "600 15px 'Open Sans'", color: 'var(--texto)', textDecoration: 'none' }}>Como chegar ↗</a>
          <button type="button" className="r-btn" aria-pressed={salvo} onClick={() => void alternarSalvo(l.id)} style={{ flex: 1, height: '48px', background: salvo ? 'var(--fundo-escuro)' : 'var(--amarelo)', color: salvo ? '#fff' : 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>
            {salvo ? <><Check />Salvo</> : '+ Salvar'}
          </button>
        </div>
        <AdicionarAViagem placeId={l.id} slots={l.slots} destinoId={DESTINO_CURADORIA} cidade="Paris" />
        {linkSeguro(l.site) ? <a href={linkSeguro(l.site)!} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '12px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Site oficial ↗</a> : null}
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
  const [fontes, setFontes] = React.useState<{ url: string; titulo: string | null; tipo: string }[]>([]);
  React.useEffect(() => { if (b.popularidade || b.destaque || b.fonte === 'pesquisa') void fontesDoLugar(id).then(setFontes); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const linha = (rotulo: string, valor: React.ReactNode) => (<><dt style={{ fontWeight: 600 }}>{rotulo}</dt><dd style={{ margin: 0 }}>{valor}</dd></>);
  const preco = b.preco_min_centavos != null && b.preco_moeda
    ? `${dinheiro(b.preco_min_centavos, b.preco_moeda)}${b.preco_max_centavos && b.preco_max_centavos !== b.preco_min_centavos ? ` a ${dinheiro(b.preco_max_centavos, b.preco_moeda)}` : ''}${b.preco_fonte ? ` (${b.preco_fonte})` : ''}`
    : b.gratuito ? 'Grátis' : null;
  return (
    <main className="tela" data-tela="lugar" data-real="lugar">
      {b.foto ? (
        <div style={{ position: 'relative', maxHeight: '320px', overflow: 'hidden' }}>
          <FotoLugar id={id} proporcao="4 / 3" />
          <div style={{ position: 'absolute', top: 'calc(10px + env(safe-area-inset-top))', left: '14px', zIndex: 2 }}><Voltar sobreFoto /></div>
        </div>
      ) : <><div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}><Voltar /></div><CapaAlternativa placeId={id} nome={b.nome} /></>}
      <div style={{ padding: '14px 20px 24px' }}>
        <div style={{ font: "600 13px/17px 'Open Sans'", color: 'var(--azul)' }}>{CATEGORIAS_LUGAR[b.categoria].nome} · {nomeTipo(b.tipo)}</div>
        <h1 style={{ margin: '4px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{b.nome}</h1>
        {b.popularidade && SELO_POPULARIDADE[b.popularidade] ? (
          <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 10px', borderRadius: '999px', background: 'var(--fundo-escuro)', color: '#fff', font: "700 12px 'Open Sans'", letterSpacing: '0.02em' }}>{SELO_POPULARIDADE[b.popularidade]}</span>
        ) : null}
        {b.destaque ? <p style={{ margin: '8px 0 0', fontSize: '16px', lineHeight: '23px' }}>{b.destaque}</p> : null}
        {b.historia ? <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)' }}>{b.historia}</p> : null}
        <GastoDeQuemFoi placeId={id} comida={COMIDA.includes(b.categoria)} />
        <dl style={{ margin: '14px 0 0', display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '12px', rowGap: '8px', fontSize: '15px', lineHeight: '21px' }}>
          {b.endereco ?? b.bairro ? linha('Onde', [b.endereco, b.endereco && b.bairro && !b.endereco.includes(b.bairro) ? b.bairro : null].filter(Boolean).join(' · ') || b.bairro) : null}
          {b.melhor_horario ? linha('Melhor hora', b.melhor_horario) : null}
          {b.cozinha ? linha('Cozinha', b.cozinha) : null}
          {b.dieta_opcoes?.length ? linha('Opções', b.dieta_opcoes.map((o) => ({ vegetariano: 'vegetariana', vegano: 'vegana', so_vegetariano: 'só vegetariano', so_vegano: 'só vegano', sem_gluten: 'sem glúten' } as Record<string, string>)[o] ?? o).join(' · ')) : null}
          {b.estrelas ? linha('Categoria', `${b.estrelas} estrelas`) : null}
          {b.horario ? linha('Horário', horarioLegivel(b.horario)) : null}
          {preco ? linha('Preço', preco) : null}
          {b.telefone ? linha('Telefone', <>{b.telefone.split(/[;,]/).map((t) => t.trim()).filter(Boolean).slice(0, 2).map((t, i) => <React.Fragment key={t}>{i ? ' · ' : ''}<a href={`tel:${t.replace(/[^\d+]/g, '')}`} style={{ color: 'var(--azul)' }}>{t}</a>{linkWhatsApp(t, b.destino_id.startsWith('br')) ? <BotaoWhatsApp href={linkWhatsApp(t, b.destino_id.startsWith('br'))!} nome={b.nome} /> : null}</React.Fragment>)}</>) : null}
        </dl>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${b.local_preciso === false && b.endereco ? encodeURIComponent([b.endereco, b.bairro].filter(Boolean).join(', ')) : `${b.lat},${b.lon}`}`} target="_blank" rel="noreferrer" aria-label={`Como chegar a ${b.nome} (abre o Google Maps)`} style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--texto)', font: "600 15px 'Open Sans'", color: 'var(--texto)', textDecoration: 'none' }}>Como chegar ↗</a>
          <button type="button" className="r-btn" aria-pressed={salvo} onClick={() => void alternarSalvo(id)} style={{ flex: 1, height: '48px', background: salvo ? 'var(--fundo-escuro)' : 'var(--amarelo)', color: salvo ? '#fff' : 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>{salvo ? <><Check />Salvo</> : '+ Salvar'}</button>
        </div>
        {CATEGORIAS_LUGAR[b.categoria].roteiro ? <AdicionarAViagem placeId={id} slots={l.slots} destinoId={b.destino_id} cidade={null} /> : <p style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '12px' }}>{b.categoria === 'hospedagem' ? 'Reserve pela aba Hospedagem da sua viagem.' : 'Não entra no roteiro.'}</p>}
        <Avaliacoes placeId={id} nome={b.nome} comida={COMIDA.includes(b.categoria)} moeda={paisPorCodigo(b.destino_id.slice(0, 2).toUpperCase())?.moeda ?? 'BRL'} />
        <FotosDeQuemFoi placeId={id} nome={b.nome} comida={['restaurantes', 'bares', 'cafes', 'mercados', 'vida-noturna'].includes(b.categoria)} />
        {linkSeguro(b.site) ? <a href={linkSeguro(b.site)!} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '12px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Site ↗</a> : null}
        <Info style={{ marginTop: '14px' }}>
          {fontes.length ? <>Pesquisa: {fontes.map((f, i) => <React.Fragment key={f.url}>{i ? ' · ' : ''}<a href={f.url} target="_blank" rel="noreferrer" style={{ color: 'var(--texto-sec)' }}>{f.titulo ?? new URL(f.url).hostname.replace(/^www\./, '')}</a></React.Fragment>)}. </> : null}
          {b.fonte === 'cnpj' ? `Cadastro de empresas da Receita Federal (CNPJ ativo${b.dados_de ? `, ${b.dados_de.slice(5, 7)}/${b.dados_de.slice(0, 4)}` : ''}). ${b.local_preciso ? 'Local pelo endereço.' : 'Local aproximado, pela rua.'} Pode ter fechado: confira antes de ir.`
            : b.fonte === 'pesquisa' ? 'Lugar achado pela pesquisa do Bo Vair; localização pelo endereço no OpenStreetMap. Confira antes de ir.' : <>Dados: <a href={`https://www.openstreetmap.org/${b.fonte_id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--texto-sec)' }}>OpenStreetMap</a> (© colaboradores, ODbL){b.dados_de ? `, ${b.dados_de.split('-').reverse().join('/')}` : ''}. Mapa colaborativo{b.verificado ? ', conferido pela curadoria do Bo Vair' : ''}: confira horário e preço antes de ir. Estrelas de hotel são a classificação oficial, não nota de clientes.</>}
        </Info>
        <button type="button" className="r-btn" onClick={() => navegar(`/descobrir?d=${b.destino_id}`)} style={{ marginTop: '4px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Ver mais lugares desta cidade</button>
      </div>
    </main>
  );
}
