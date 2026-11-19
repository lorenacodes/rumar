import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { cobertura, destinoPorId, pedirCidade, rotuloDestino, type Destino } from '../../lib/lugares';
import { paisPorCodigo } from '../../lib/moedas';
import { useDestinoAtual } from '../../state/destino';
import { EscolherDestino } from '../../ui/escolherDestino';
import { criarViagem } from '../../lib/viagens';
import { nivelDoOrcamento, NOME_NIVEL } from '../../lib/nivel';
import type { Diagnostico } from '../../lib/linhaDoTempo';
import { dinheiro, NOME_MOEDA } from '../../lib/moedas';
import { usePlano } from '../../state/plano';
import { useViajante } from '../../state/viajante';
import { Aviso, BotaoPrincipal, Rodape, Voltar } from '../../ui/pecas';
import { campo, Rotulo, Segmentos } from './comum';

const hoje = (dias = 0) => new Date(Date.now() + dias * 86_400_000).toISOString().slice(0, 10);

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
  const { moedaReferencia, paisResidencia } = usePlano();
  const [params] = useSearchParams();
  const ultimo = useDestinoAtual((x) => x.destino);
  const [destino, setDestino] = useState<Destino | null>(null);
  const [lugaresNaBase, setLugaresNaBase] = useState<number | null>(null);
  useEffect(() => {
    const d = params.get('d');
    if (d) void destinoPorId(d).then(setDestino);
    else if (ultimo) setDestino(ultimo);
  }, [params, ultimo]);
  useEffect(() => {
    setLugaresNaBase(null);
    if (destino) void cobertura(destino.id).then((c) => setLugaresNaBase(c.reduce((s, x) => s + x.quantidade, 0)));
  }, [destino]);
  const paisDestino = destino ? paisPorCodigo(destino.pais) : null;
  const intl = (paisDestino?.codigo ?? paisResidencia) !== paisResidencia;
  const nivelOrc = nivelDoOrcamento(orcamento ? Math.round(Number(orcamento.replace(/\./g, '').replace(',', '.')) * 100) : 0, viajantes, noites, moedaReferencia, intl);
  const num = (t: string) => (t ? Math.round(Number(t.replace(/\./g, '').replace(',', '.')) * 100) : 0);

  const criar = async () => {
    if (!destino) return setErro('Escolha o destino.');
    if (dataIda < hoje()) return setErro('Escolha uma data a partir de hoje.');
    if (!preferencias) return navegar('/perfil-viajante');
    setCriando(true);
    const valor = num(orcamento);
    const id = await criarViagem({
      destino: destino.nome, destinoId: destino.id, dataIda, noites, viajantes, orcamento: valor || null, dataDefinida: definida === 'sim', moedaDestino: paisDestino?.moeda ?? null,
      guardado: num(guardado), capacidadeMensal: mensal ? num(mensal) : null, diagnostico: diag, moedaPlanejamento: moedaReferencia,
    }, preferencias);
    setCriando(false);
    if (!id) return setErro('Não conseguimos criar a viagem. Confira a internet e tente de novo.');
    if (!lugaresNaBase) void pedirCidade(destino.id);
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
        <Rotulo>Destino</Rotulo>
        {destino ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ font: "600 22px 'Lexend Exa'" }}>{rotuloDestino(destino)}</div>
            <button type="button" className="r-btn" onClick={() => setDestino(null)} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Trocar</button>
          </div>
        ) : <EscolherDestino aoEscolher={setDestino} placeholder="Qualquer cidade: Aracaju, Gramado, Lisboa…" />}
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
        <Rotulo>Quantas pessoas viajam</Rotulo>
        <Passo valor={viajantes} menor={1} maior={10} aoMudar={setViajantes} rotulo="uma pessoa" />
        <Rotulo><label htmlFor="orc">Quanto quer gastar no total? (opcional, em {moedaReferencia})</label></Rotulo>
        <input id="orc" className="r-input" inputMode="decimal" placeholder={`Ex.: ${dinheiro(1_500_000, moedaReferencia)}`} value={orcamento} onChange={(e) => setOrcamento(e.target.value.replace(/[^\d.,]/g, ''))} style={campo} />
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '6px' }}>
          {nivelOrc
            ? <>≈ {dinheiro(nivelOrc.porPessoaDia, moedaReferencia, 0)} por pessoa por dia: o roteiro será de nível <b style={{ color: 'var(--texto)' }}>{NOME_NIVEL[nivelOrc.nivel]}</b>.</>
            : 'O roteiro se ajusta ao valor.'}
        </div>
        <details style={{ marginTop: '18px', borderTop: '1px solid var(--linha)', borderBottom: '1px solid var(--linha)' }}>
          <summary style={{ minHeight: '52px', display: 'flex', alignItems: 'center', cursor: 'pointer', font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Mais detalhes (opcional): economia e documentos</summary>
          <div style={{ paddingBottom: '12px' }}>
        <Rotulo><label htmlFor="guardado">Quanto já tem guardado para ela? (opcional)</label></Rotulo>
        <input id="guardado" className="r-input" inputMode="decimal" placeholder="0" value={guardado} onChange={(e) => setGuardado(e.target.value.replace(/[^\d.,]/g, ''))} style={campo} />
        <Rotulo><label htmlFor="mensal">Quanto consegue guardar por mês? (opcional)</label></Rotulo>
        <input id="mensal" className="r-input" inputMode="decimal" placeholder="0" value={mensal} onChange={(e) => setMensal(e.target.value.replace(/[^\d.,]/g, ''))} style={campo} />
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '6px' }}>Com isso, o app calcula a meta, quanto guardar por mês e avisa se não fechar até a data.</div>
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

const passo = { width: '48px', height: '48px', border: '2px solid var(--texto)', font: "600 22px 'Open Sans'", display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;
