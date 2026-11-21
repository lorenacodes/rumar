import { useEffect, useState } from 'react';
import { hojeLocal } from '../../lib/datas';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { cobertura, destinoPorId, pedirCidade, rotuloDestino, type Destino } from '../../lib/lugares';
import { paisPorCodigo } from '../../lib/moedas';
import { useDestinoAtual } from '../../state/destino';
import { EscolherDestino } from '../../ui/escolherDestino';
import { adicionarGasto, criarViagem, listarViagens } from '../../lib/viagens';
import { seguirRoteiro } from '../../lib/seguirRoteiro';
import { textoConflito, viagensNoMesmoPeriodo, type Periodo } from '../../lib/conflitoDatas';
import { nivelDoOrcamento, NOME_NIVEL } from '../../lib/nivel';
import { mesAno, preverPoupanca } from '../../lib/previsao';
import { GraficoPrevisao } from '../../ui/GraficoPrevisao';
import type { Diagnostico } from '../../lib/linhaDoTempo';
import { dinheiro, NOME_MOEDA } from '../../lib/moedas';
import { usePlano } from '../../state/plano';
import { useViajante } from '../../state/viajante';
import { Aviso, BotaoPrincipal, Rodape, Voltar } from '../../ui/pecas';
import { campo, Rotulo, Segmentos } from './comum';

const hoje = (dias = 0) => hojeLocal(dias);

/** Nova viagem: destino, datas, viajantes e orçamento. O roteiro nasce do perfil de viajante. */
export function NovaViagem() {
  const navegar = useNavigate();
  const { preferencias } = useViajante();
  const [dataIda, setDataIda] = useState(hoje(60));
  const [noites, setNoites] = useState(5);
  const [viajantes, setViajantes] = useState(1);
  const [orcamento, setOrcamento] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);
  const [definida, setDefinida] = useState<'sim' | 'nao'>('sim');
  const [guardado, setGuardado] = useState('');
  const [mensal, setMensal] = useState('');
  const [diag, setDiag] = useState<Diagnostico>({});
  // Quanto custa (D-077): a pessoa pesquisa e anota as 3 partes; o app soma, põe a reserva e prevê.
  const [passagem, setPassagem] = useState('');
  const [diaria, setDiaria] = useState('');
  const [diaADia, setDiaADia] = useState('');
  const [sabeTotal, setSabeTotal] = useState(false);
  const { moedaReferencia, paisResidencia } = usePlano();
  const [params] = useSearchParams();
  const ultimo = useDestinoAtual((x) => x.destino);
  const [destino, setDestino] = useState<Destino | null>(null);
  const [lugaresNaBase, setLugaresNaBase] = useState<number | null>(null);
  // Datas que se cruzam com outra viagem minha: avisa (pode ser comparação de destinos), não bloqueia.
  const [minhas, setMinhas] = useState<Periodo[]>([]);
  useEffect(() => { void listarViagens().then((l) => setMinhas(l.minhas as unknown as Periodo[])); }, []);
  const conflitos = viagensNoMesmoPeriodo({ data_ida: dataIda, noites }, minhas.filter((v) => !v.registrada));
  useEffect(() => {
    const d = params.get('d');
    const n = Number(params.get('noites'));
    if (params.get('roteiro') && n >= 1 && n <= 60) setNoites(n);
    if (d) void destinoPorId(d).then(setDestino);
    else if (ultimo) setDestino(ultimo);
  }, [params, ultimo]);
  useEffect(() => {
    setLugaresNaBase(null);
    if (destino) void cobertura(destino.id).then((c) => setLugaresNaBase(c.reduce((s, x) => s + x.quantidade, 0)));
  }, [destino]);
  const paisDestino = destino ? paisPorCodigo(destino.pais) : null;
  const intl = (paisDestino?.codigo ?? paisResidencia) !== paisResidencia;
  
  const num = (t: string) => (t ? Math.round(Number(t.replace(/\./g, '').replace(',', '.')) * 100) : 0);
  const custoPassagem = num(passagem) * viajantes;
  const custoHosp = num(diaria) * noites;
  const custoDia = num(diaADia) * viajantes * (noites + 1);
  const custo = sabeTotal ? num(orcamento) : custoPassagem + custoHosp + custoDia;
  const nivelOrc = nivelDoOrcamento(custo, viajantes, noites, moedaReferencia, intl);
  const metaPrev = Math.round(custo * 1.1); // + 10% de reserva para imprevistos (igual à meta da viagem)
  const prev = custo ? preverPoupanca({ hoje: hoje(), dataIda, meta: metaPrev, guardado: num(guardado), mensal: num(mensal) }) : null;
  const f0 = (c: number) => dinheiro(c, moedaReferencia, 0);
  const buscaVoo = destino ? `https://www.google.com/travel/flights?q=${encodeURIComponent(`voos para ${destino.nome} em ${dataIda}`)}` : '';
  const buscaHotel = destino ? `https://www.google.com/travel/hotels/${encodeURIComponent(destino.nome)}` : '';

  const criar = async () => {
    if (!destino) return setErro('Escolha o destino.');
    if (dataIda < hoje()) return setErro('Escolha uma data a partir de hoje.');
    const fechada = conflitos.find((c) => c.data_definida !== false);
    if (definida === 'sim' && fechada && !window.confirm(`Você já tem ${textoConflito(fechada)} com data fechada nesses dias. Criar mesmo assim?`)) return;
    if (!preferencias) return navegar('/perfil-viajante');
    setCriando(true);
    const valor = custo || num(orcamento);
    const id = await criarViagem({
      destino: destino.nome, destinoId: destino.id, dataIda, noites, viajantes, orcamento: valor || null, dataDefinida: definida === 'sim', moedaDestino: paisDestino?.moeda ?? null,
      guardado: num(guardado), capacidadeMensal: mensal ? num(mensal) : null, diagnostico: diag, moedaPlanejamento: moedaReferencia,
    }, preferencias);
    setCriando(false);
    if (!id) return setErro('Não conseguimos criar a viagem. Confira a internet e tente de novo.');
    // As partes informadas entram no custo da viagem (selo "informado por você").
    if (!sabeTotal) {
      if (custoPassagem) await adicionarGasto(id, { categoria: 'passagem', descricao: `Passagem ida e volta (${viajantes} ${viajantes === 1 ? 'pessoa' : 'pessoas'})`, valor: custoPassagem });
      if (custoHosp) await adicionarGasto(id, { categoria: 'hospedagem', descricao: `Hospedagem (${noites} ${noites === 1 ? 'noite' : 'noites'})`, valor: custoHosp });
      if (custoDia) await adicionarGasto(id, { categoria: 'alimentacao', descricao: `Comida, passeios e transporte (${noites + 1} dias)`, valor: custoDia });
    }
    if (!lugaresNaBase) void pedirCidade(destino.id);
    // "Seguir este roteiro": troca o roteiro automático pelos lugares do roteiro que a pessoa viu.
    const origem = params.get('roteiro');
    if (origem && await seguirRoteiro(origem, id)) return navegar(`/viagem/${id}?aba=roteiro`, { replace: true });
    navegar(`/viagem/${id}`, { replace: true });
  };

  const Passo = ({ valor, menor, maior, aoMudar, rotulo }: { valor: number; menor: number; maior: number; aoMudar: (n: number) => void; rotulo: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
      <button type="button" className="r-btn" aria-label={`Menos ${rotulo}`} onClick={() => aoMudar(Math.max(menor, valor - 1))} style={passo}>−</button>
      <output aria-live="polite" style={{ font: "600 24px 'Lexend Exa'", minWidth: '36px', textAlign: 'center' }}>{valor}</output>
      <button type="button" className="r-btn" aria-label={`Mais ${rotulo}`} onClick={() => aoMudar(Math.min(maior, valor + 1))} style={passo}>+</button>
    </div>
  );

  return (
    <main className="tela" data-tela="nova-viagem" data-real="nova-viagem">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <Voltar para="/viagens" />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Nova viagem</div>
        <h1 style={{ margin: '6px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Para onde e quando?</h1>
        {params.get('roteiro') ? <p style={{ margin: '6px 0 0', fontSize: '15px', lineHeight: '21px' }}>Sua viagem já nasce com os mesmos lugares, dia a dia.</p> : null}
        <Rotulo>Destino</Rotulo>
        {destino ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ font: "600 22px 'Lexend Exa'" }}>{rotuloDestino(destino)}</div>
            <button type="button" className="r-btn" onClick={() => setDestino(null)} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Trocar</button>
          </div>
        ) : <EscolherDestino aoEscolher={setDestino} placeholder="Busque uma cidade" />}
        {destino && lugaresNaBase !== null ? (
          <div style={{ fontSize: '14px', lineHeight: '20px', color: lugaresNaBase ? 'var(--texto-sec)' : 'var(--ambar)' }}>
            {lugaresNaBase ? `${lugaresNaBase} lugares para o seu roteiro.` : 'Ainda sem lugares aqui: o roteiro começa vazio e pedimos a coleta.'}
          </div>
        ) : null}
        {paisDestino ? <div style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>{paisDestino.nome} · moeda: {NOME_MOEDA[paisDestino.moeda] ?? paisDestino.moeda} · viagem {intl ? 'internacional' : 'nacional'}</div> : null}
        <Rotulo>A data já está fechada?</Rotulo>
        <Segmentos rotulo="A data já está fechada?" valor={definida} aoMudar={setDefinida} opcoes={[{ id: 'sim', nome: 'Sim, data fechada' }, { id: 'nao', nome: 'Ainda é uma previsão' }]} />
        <Rotulo><label htmlFor="ida">{definida === 'sim' ? 'Data de ida' : 'Data prevista de ida'}</label></Rotulo>
        <input id="ida" type="date" className="r-input" value={dataIda} min={hoje()} onChange={(e) => setDataIda(e.target.value)} style={campo} />
        <Rotulo>Noites</Rotulo>
        <Passo valor={noites} menor={1} maior={14} aoMudar={setNoites} rotulo="uma noite" />
        {conflitos.length ? (
          <div role="status" style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '12px', background: 'var(--cartao-2)' }}>
            <b style={{ display: 'block', fontSize: '14px' }}>Você já tem {conflitos.map(textoConflito).join(' e ')} nesses dias.</b>
            <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Se estiver comparando, pode criar.</span>
          </div>
        ) : null}
        <Rotulo>Quantas pessoas viajam</Rotulo>
        <Passo valor={viajantes} menor={1} maior={10} aoMudar={setViajantes} rotulo="uma pessoa" />

        {/* ---------------- Quanto custa (D-077) */}
        <h2 style={secao}>Quanto custa?</h2>
        <p style={ajuda}>Anote o que já pesquisou. A gente soma.</p>
        {!sabeTotal ? (
          <>
            <Parte id="passagem" rotulo="Passagem ida e volta, por pessoa" valor={passagem} aoMudar={setPassagem} link={buscaVoo} textoLink="Pesquisar voos" moeda={moedaReferencia} />
            <Parte id="diaria" rotulo="Hospedagem por noite (o quarto todo)" valor={diaria} aoMudar={setDiaria} link={buscaHotel} textoLink="Pesquisar hotéis" moeda={moedaReferencia} />
            <Parte id="diaadia" rotulo="Comida, passeios e transporte por dia, por pessoa" valor={diaADia} aoMudar={setDiaADia} moeda={moedaReferencia} />
            <button type="button" className="r-btn" onClick={() => setSabeTotal(true)} style={linkBtn}>Já sei o valor total</button>
          </>
        ) : (
          <>
            <Rotulo><label htmlFor="orc">Valor total da viagem ({moedaReferencia})</label></Rotulo>
            <input id="orc" className="r-input" inputMode="decimal" placeholder="0" value={orcamento} onChange={(e) => setOrcamento(e.target.value.replace(/[^\d.,]/g, ''))} style={campo} />
            <button type="button" className="r-btn" onClick={() => setSabeTotal(false)} style={linkBtn}>Calcular por partes</button>
          </>
        )}
        {custo ? (
          <div role="status" style={{ marginTop: '12px', padding: '14px 16px', background: 'var(--fundo-escuro)', color: '#fff' }}>
            <div style={{ fontSize: '13px', color: 'var(--sobre-escuro-sec)' }}>Para viajar com tranquilidade</div>
            <div style={{ font: "600 28px 'Lexend Exa'", marginTop: '2px' }}>{f0(metaPrev)}</div>
            <div style={{ fontSize: '13px', color: 'var(--sobre-escuro-sec)', marginTop: '4px' }}>
              {sabeTotal ? `${f0(custo)}` : [custoPassagem ? `passagem ${f0(custoPassagem)}` : null, custoHosp ? `hospedagem ${f0(custoHosp)}` : null, custoDia ? `dia a dia ${f0(custoDia)}` : null].filter(Boolean).join(' + ')} + 10% para imprevistos
            </div>
            {nivelOrc ? <div style={{ fontSize: '13px', color: 'var(--sobre-escuro-sec)', marginTop: '6px' }}>≈ {dinheiro(nivelOrc.porPessoaDia, moedaReferencia, 0)} por pessoa por dia: o roteiro será de nível <b style={{ color: '#fff' }}>{NOME_NIVEL[nivelOrc.nivel]}</b>.</div> : null}
            {!sabeTotal && (!custoPassagem || !custoHosp || !custoDia) ? <div style={{ fontSize: '13px', color: 'var(--amarelo)', marginTop: '6px' }}>Falta {[!custoPassagem ? 'passagem' : null, !custoHosp ? 'hospedagem' : null, !custoDia ? 'dia a dia' : null].filter(Boolean).join(', ')}. O valor ainda vai subir.</div> : null}
          </div>
        ) : null}

        {/* ---------------- Seu bolso */}
        <h2 style={secao}>Quando você consegue ir?</h2>
        <p style={ajuda}>Conte quanto já tem e quanto guarda por mês.</p>
        <Rotulo><label htmlFor="guardado">Já guardei ({moedaReferencia})</label></Rotulo>
        <input id="guardado" className="r-input" inputMode="decimal" placeholder="0" value={guardado} onChange={(e) => setGuardado(e.target.value.replace(/[^\d.,]/g, ''))} style={campo} />
        <Rotulo><label htmlFor="mensal">Consigo guardar por mês ({moedaReferencia})</label></Rotulo>
        <input id="mensal" className="r-input" inputMode="decimal" placeholder="0" value={mensal} onChange={(e) => setMensal(e.target.value.replace(/[^\d.,]/g, ''))} style={campo} />
        {prev ? (
          <div style={{ marginTop: '12px', padding: '14px 16px 10px', background: 'var(--cartao-2)' }}>
            <b style={{ display: 'block', font: "600 17px/23px 'Lexend Exa'" }}>
              {prev.mesesAteMeta === 0 ? 'Você já tem o dinheiro da viagem.'
                : !num(mensal) ? 'Quanto você guarda por mês?'
                : prev.cabe ? `Você junta tudo em ${mesAno(prev.dataMeta!)}.`
                : prev.dataMeta ? `Na data, faltariam ${f0(metaPrev - prev.naViagem)}.` : 'Nesse ritmo, passa de 5 anos.'}
            </b>
            <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '2px' }}>
              {prev.mesesAteMeta === 0 ? 'Pode viajar quando quiser.'
                : !num(mensal) ? `Para ir na data, guarde ${f0(prev.mensalNecessario)} por mês.`
                : prev.cabe ? (prev.mesesAteViagem - (prev.mesesAteMeta ?? 0) > 0 ? `${prev.mesesAteViagem - prev.mesesAteMeta!} ${prev.mesesAteViagem - prev.mesesAteMeta! === 1 ? 'mês' : 'meses'} antes da viagem.` : 'Bem na data da viagem.')
                : `Guarde ${f0(prev.mensalNecessario)} por mês${prev.dataMeta ? ` ou viaje em ${mesAno(prev.dataMeta)}` : ''}.`}
            </div>
            {num(mensal) || num(guardado) ? <GraficoPrevisao p={prev} meta={metaPrev} moeda={moedaReferencia} dataViagem={dataIda} /> : null}
            {!prev.cabe && prev.dataMeta && num(mensal) ? (
              <button type="button" className="r-btn" onClick={() => { setDataIda(prev.dataMeta!); setDefinida('nao'); }} style={{ ...linkBtn, marginTop: '4px' }}>Viajar em {mesAno(prev.dataMeta)}</button>
            ) : null}
            <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '4px' }}>Sem juros e sem inflação. Preços mudam.</div>
          </div>
        ) : !custo ? <p style={{ ...ajuda, color: 'var(--azul)' }}>Anote o custo acima para ver quando você consegue ir.</p> : null}
        <details style={{ marginTop: '18px', borderTop: '1px solid var(--linha)', borderBottom: '1px solid var(--linha)' }}>
          <summary style={{ minHeight: '52px', display: 'flex', alignItems: 'center', cursor: 'pointer', font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Mais detalhes (opcional): documentos e passagem</summary>
          <div style={{ paddingBottom: '12px' }}>
        {intl ? (
          <>
            <Rotulo>Você tem passaporte?</Rotulo>
            <Segmentos rotulo="Você tem passaporte?" valor={(diag.passaporte ?? '') as 'sim'} aoMudar={(x) => setDiag({ ...diag, passaporte: x as Diagnostico['passaporte'] })} opcoes={[{ id: 'sim', nome: 'Tenho' }, { id: 'vencido', nome: 'Vencido' }, { id: 'nao', nome: 'Não tenho' }]} />
            {diag.passaporte === 'sim' ? (
              <>
                <Rotulo><label htmlFor="validade">Válido até (se não souber agora, responda depois em Etapas)</label></Rotulo>
                <input id="validade" type="date" className="r-input" value={diag.validadePassaporte ?? ''} onChange={(e) => setDiag({ ...diag, validadePassaporte: e.target.value || undefined })} style={campo} />
              </>
            ) : null}
            <Rotulo>Já tem seguro-viagem?</Rotulo>
            <Segmentos rotulo="Já tem seguro-viagem?" valor={(diag.seguro ?? '') as 'sim'} aoMudar={(x) => setDiag({ ...diag, seguro: x as 'sim' | 'nao' })} opcoes={[{ id: 'sim', nome: 'Já tenho' }, { id: 'nao', nome: 'Ainda não' }]} />
          </>
        ) : null}
        <Rotulo>Já comprou a passagem?</Rotulo>
        <Segmentos rotulo="Já comprou a passagem?" valor={(diag.passagem ?? '') as 'sim'} aoMudar={(x) => setDiag({ ...diag, passagem: x as 'sim' | 'nao' })} opcoes={[{ id: 'sim', nome: 'Já comprei' }, { id: 'nao', nome: 'Ainda não' }]} />
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '6px' }}>Tudo aqui pode ficar para depois: as mesmas perguntas estão em Etapas, e as tarefas mostram só o que vale para o seu caso.</div>
          </div>
        </details>
        {!preferencias ? <p style={{ fontSize: '14px', color: 'var(--azul)', fontWeight: 600 }}>Antes, conte seu jeito de viajar (1 minuto).</p> : null}
        {erro ? <Aviso>{erro}</Aviso> : null}
        <div style={{ height: '16px' }} />
      </div>
      <Rodape>
        <BotaoPrincipal onClick={() => void criar()} disabled={criando}>{criando ? 'Montando o roteiro…' : preferencias ? 'Criar viagem' : 'Responder meu jeito de viajar'}</BotaoPrincipal>
      </Rodape>
    </main>
  );
}

const secao = { margin: '28px 0 0', font: "600 20px 'Lexend Exa'", letterSpacing: '-0.02em' } as const;
const ajuda = { fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', margin: '2px 0 0' } as const;
const linkBtn = { minHeight: '44px', marginTop: '6px', color: 'var(--azul)', font: "600 15px 'Open Sans'" } as const;

/** Uma parte do custo: campo + atalho para pesquisar o preço. */
function Parte({ id, rotulo, valor, aoMudar, link, textoLink, moeda }: { id: string; rotulo: string; valor: string; aoMudar: (v: string) => void; link?: string; textoLink?: string; moeda: string }) {
  return (
    <div>
      <Rotulo><label htmlFor={id}>{rotulo} ({moeda})</label></Rotulo>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input id={id} className="r-input" inputMode="decimal" placeholder="0" value={valor} onChange={(e) => aoMudar(e.target.value.replace(/[^\d.,]/g, ''))} style={{ ...campo, flex: 1 }} />
        {link ? <a href={link} target="_blank" rel="noopener noreferrer" style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 14px', borderRadius: '22px', background: 'var(--cartao-1)', color: 'var(--texto)', font: "600 14px 'Open Sans'", textDecoration: 'none' }}>{textoLink}</a> : null}
      </div>
    </div>
  );
}

const passo = { width: '48px', height: '48px', border: '2px solid var(--texto)', font: "600 22px 'Open Sans'", display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;
