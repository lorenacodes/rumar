import { Info } from '../../ui/info';
import { Check } from '../../ui/check';
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { ETAPAS, dataBR, internacional, type Diagnostico, type Etapa, type TipoPrazo } from '../../lib/linhaDoTempo';
import { dinheiro } from '../../lib/moedas';
import { atualizarViagem, criarTarefa, marcarTarefaPessoal, marcarTarefaSistema, ordenarTarefas, removerTarefa, type ViagemCompleta } from '../../lib/viagens';
import { Aviso, BotaoContorno, BotaoPrincipal } from '../../ui/pecas';
import { botaoTexto, campo, Rotulo, Segmentos } from './comum';
import type { Jornada, TarefaVista } from './jornada';

const TIPO: Record<TipoPrazo, string> = { oficial: 'Regra oficial', viagem: 'Pela data da viagem', sugestao: 'Sugestão', a_confirmar: 'A confirmar' };
const PRIOR: Record<string, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
const botao = { minHeight: '40px', padding: '0 12px', border: '1px solid var(--linha)', font: "600 14px 'Open Sans'" } as const;

type Painel = null | 'diagnostico' | 'editar' | 'encerrar';

export function AbaEtapas({ v, j, pode, recarregar, irPara, resumoFinal }: { v: ViagemCompleta; j: Jornada; pode: boolean; recarregar: () => void; irPara: (aba: string) => void; resumoFinal: ReactNode }) {
  const [vista, setVista] = useState<Etapa>(j.etapa);
  const [painel, setPainel] = useState<Painel>(null);
  const navegar = useNavigate();
  const tarefas = j.tarefas;
  const acionaveis = tarefas.filter((t) => !t.informativa);
  const feitas = acionaveis.filter((t) => t.feita).length;
  const proximas = acionaveis.filter((t) => !t.feita && t.etapa !== 'durante' && t.etapa !== 'volta').sort((a, b) => (a.prazo ?? '9999').localeCompare(b.prazo ?? '9999') || ordemPrior(a) - ordemPrior(b)).slice(0, 3);
  const alertasDoc = tarefas.filter((t) => t.etapa === 'documentos' && !t.feita && !t.informativa && t.prioridade === 'alta');
  const vencidas = acionaveis.filter((t) => !t.feita && t.prazo && t.prazo < j.ctx.hoje);
  const idxAtual = ETAPAS.findIndex((e) => e.id === j.etapa);

  const abrir = (t: TarefaVista) => {
    if (t.ir === 'idioma') navegar(`/viagem/${v.viagem.id}/idioma`);
    else if (t.ir === 'diagnostico' || t.ir === 'editar' || t.ir === 'encerrar') setPainel(t.ir);
    else if (t.ir) irPara(t.ir);
  };
  const marcar = async (t: TarefaVista, feita: boolean) => {
    if (t.pessoal) await marcarTarefaPessoal(t.pessoal, v.viagem.id, feita);
    else await marcarTarefaSistema(v.viagem.id, t.chave, t.etapa, feita, t.titulo);
    recarregar();
  };

  const situacao = j.ctx.encerrada ? 'Viagem encerrada' : j.etapa === 'volta' ? 'A viagem terminou' : j.etapa === 'durante' ? `Você está viajando: dia ${Math.min(v.viagem.noites + 1, 1 - j.diasParaIda)} de ${v.viagem.noites + 1}` : j.diasParaIda === 1 ? 'Falta 1 dia' : `Faltam ${j.diasParaIda} dias`;

  return (
    <section style={{ marginTop: '14px' }}>
      <div style={{ padding: '14px', background: 'var(--fundo-escuro)', color: '#fff' }}>
        <div style={{ font: "600 24px 'Lexend Exa'" }}>{situacao}</div>
        <div style={{ fontSize: '14px', color: 'var(--sobre-escuro-sec)', marginTop: '2px' }}>
          Etapa atual: <b style={{ color: '#fff' }}>{ETAPAS[idxAtual]?.nome}</b> · {feitas} de {acionaveis.length} tarefas feitas
          {!j.ctx.dataDefinida ? ' · data prevista' : ''}
        </div>
        <div aria-hidden="true" style={{ height: '6px', background: 'rgba(255,255,255,.2)', marginTop: '10px' }}>
          <div style={{ height: '6px', width: `${Math.round((feitas / Math.max(1, acionaveis.length)) * 100)}%`, background: 'var(--amarelo)' }} />
        </div>
        {j.plano ? (
          <div style={{ fontSize: '14px', marginTop: '10px', color: 'var(--sobre-escuro-sec)' }}>
            Guardado: <b style={{ color: '#fff' }}>{dinheiro(j.guardado, j.moedaPlano)}</b> de {dinheiro(j.plano.meta, j.moedaPlano)}
            {j.plano.falta ? <> · guardar <b style={{ color: '#fff' }}>{dinheiro(j.plano.mensal, j.moedaPlano)}/mês</b></> : ' · meta atingida'}
          </div>
        ) : null}
      </div>

      {alertasDoc.length ? <Aviso>Documentos pendentes: {alertasDoc.map((t) => t.titulo).join('; ')}.</Aviso> : null}
      {vencidas.length ? <Aviso cor="var(--ambar)">Passou do prazo: {vencidas.map((t) => t.titulo).join('; ')}.</Aviso> : null}
      {j.plano?.compativel === false ? <Aviso cor="var(--ambar)">O que você consegue guardar por mês não cobre a meta até a data. Veja as alternativas em Dinheiro → Economia.</Aviso> : null}

      {proximas.length && !j.ctx.encerrada ? (
        <>
          <Rotulo>Próximas tarefas</Rotulo>
          {proximas.map((t) => <LinhaTarefa key={t.chave} t={t} pode={pode} hoje={j.ctx.hoje} aoMarcar={marcar} aoAbrir={abrir} compacta />)}
        </>
      ) : null}

      <Rotulo>Linha do tempo</Rotulo>
      <ol aria-label="Etapas da viagem" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {ETAPAS.map((e, i) => {
          const daEtapa = tarefas.filter((t) => t.etapa === e.id);
          if (!daEtapa.length && e.id !== vista) return null;
          const pend = daEtapa.filter((t) => !t.feita && !t.informativa).length;
          const estado = i < idxAtual && !pend ? 'feita' : e.id === j.etapa ? 'atual' : pend === 0 && daEtapa.length ? 'feita' : 'futura';
          const aberta = vista === e.id;
          return (
            <li key={e.id} style={{ borderLeft: `3px solid ${estado === 'feita' ? 'var(--verde)' : estado === 'atual' ? 'var(--amarelo)' : 'var(--linha)'}`, paddingLeft: '12px', marginLeft: '6px' }}>
              <button type="button" className="r-btn" aria-expanded={aberta} onClick={() => setVista(e.id)} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', minHeight: '48px', alignItems: 'center', textAlign: 'left' }}>
                <span>
                  <b style={{ font: "600 16px 'Lexend Exa'" }}>{estado === 'feita' ? <Check cor="var(--verde)" /> : estado === 'atual' ? '● ' : '○ '}{e.nome}</b>
                  <span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{pend ? `${pend} ${pend === 1 ? 'pendente' : 'pendentes'}` : daEtapa.length ? 'Tudo feito' : 'Sem tarefas'}{e.id === j.etapa ? ' · você está aqui' : ''}</span>
                </span>
                <span aria-hidden="true">{aberta ? '▴' : '▾'}</span>
              </button>
              {aberta ? (
                <div style={{ paddingBottom: '12px' }}>
                  {daEtapa.map((t) => <LinhaTarefa key={t.chave} t={t} pode={pode} hoje={j.ctx.hoje} aoMarcar={marcar} aoAbrir={abrir} />)}
                  {pode ? <TarefasPessoais v={v} etapa={e.id} tarefas={daEtapa.filter((t) => t.pessoal)} recarregar={recarregar} /> : null}
                  {e.id === 'volta' ? resumoFinal : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {pode ? (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
          <button type="button" className="r-btn" style={botao} onClick={() => setPainel('editar')}>Mudar datas e valores</button>
          {internacional(j.ctx) ? <button type="button" className="r-btn" style={botao} onClick={() => setPainel('diagnostico')}>Documentos que já tenho</button> : <button type="button" className="r-btn" style={botao} onClick={() => setPainel('diagnostico')}>O que já tenho</button>}
          {!j.ctx.encerrada ? <button type="button" className="r-btn" style={botao} onClick={() => setPainel('encerrar')}>Encerrar a viagem</button> : null}
        </div>
      ) : null}
      {painel === 'diagnostico' ? <PainelDiagnostico v={v} j={j} fechar={() => setPainel(null)} recarregar={recarregar} /> : null}
      {painel === 'editar' ? <PainelEditar v={v} j={j} fechar={() => setPainel(null)} recarregar={recarregar} /> : null}
      {painel === 'encerrar' ? <PainelEncerrar v={v} fechar={() => setPainel(null)} recarregar={recarregar} resumo={resumoFinal} /> : null}
      <Info rotulo="Sobre prazos e regras" style={{ marginTop: '16px' }}>Regras oficiais mudam: cada tarefa mostra a fonte e a data em que conferimos. "A confirmar" = o prazo depende de quem presta o serviço.</Info>
    </section>
  );
}

const ordemPrior = (t: TarefaVista) => (t.prioridade === 'alta' ? 0 : t.prioridade === 'media' ? 1 : 2);

function LinhaTarefa({ t, pode, hoje, aoMarcar, aoAbrir, compacta }: { t: TarefaVista; pode: boolean; hoje: string; aoMarcar: (t: TarefaVista, f: boolean) => void; aoAbrir: (t: TarefaVista) => void; compacta?: boolean }) {
  const [aberta, setAberta] = useState(false);
  const marcavel = pode && !t.informativa && !t.automatica;
  const atrasada = !t.feita && t.prazo && t.prazo < hoje;
  return (
    <div style={{ display: 'flex', gap: '10px', padding: '8px 0', borderTop: '1px dashed var(--linha)' }}>
      {t.informativa ? (
        <span aria-hidden="true" style={{ width: '28px', flex: 'none', textAlign: 'center', fontSize: '18px', color: 'var(--azul)' }}>ℹ</span>
      ) : (
        <input type="checkbox" checked={t.feita} disabled={!marcavel} onChange={(e) => aoMarcar(t, e.target.checked)} aria-label={`${t.feita ? 'Desmarcar' : 'Marcar como feita'}: ${t.titulo}`} style={{ width: '24px', height: '24px', margin: '2px', flex: 'none', accentColor: 'var(--verde)' }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <button type="button" className="r-btn" aria-expanded={aberta} onClick={() => setAberta(!aberta)} style={{ textAlign: 'left', width: '100%', minHeight: '32px' }}>
          <b style={{ fontSize: '15px', textDecoration: t.feita && !t.informativa ? 'line-through' : 'none', color: t.feita && !t.informativa ? 'var(--texto-sec)' : 'var(--texto)' }}>{t.titulo}</b>
          {!t.informativa && !t.feita ? <span style={{ fontSize: '12px', marginLeft: '6px', color: t.prioridade === 'alta' ? 'var(--vermelho)' : 'var(--texto-sec)' }}>· prioridade {PRIOR[t.prioridade]?.toLowerCase()}</span> : null}
          {t.prazo || t.prazoTexto ? (
            <span style={{ display: 'block', fontSize: '13px', color: atrasada ? 'var(--vermelho)' : 'var(--texto-sec)' }}>
              {t.prazo ? `Até ${dataBR(t.prazo)}` : ''}{t.prazo && t.tipoPrazo ? ' · ' : ''}{t.tipoPrazo ? TIPO[t.tipoPrazo] : ''}
            </span>
          ) : null}
        </button>
        {aberta || (!compacta && !t.feita) ? (
          <div style={{ fontSize: '14px', lineHeight: '20px', marginTop: '2px' }}>
            {t.descricao ? <div>{t.descricao}</div> : null}
            {t.orientacao ? <div style={{ color: 'var(--texto-sec)', marginTop: '4px' }}>{t.orientacao}</div> : null}
            {t.prazoTexto ? <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px' }}>Prazo: {t.prazoTexto}.</div> : null}
            {t.fonte ? <div style={{ fontSize: '13px', marginTop: '4px' }}>Fonte: <a href={t.fonte.url} target="_blank" rel="noreferrer" style={{ color: 'var(--azul)' }}>{t.fonte.nome}</a> <span style={{ color: 'var(--texto-sec)' }}>(conferido em {dataBR(t.fonte.consultadoEm)})</span></div> : null}
            {t.ir && !t.feita ? <button type="button" className="r-btn" onClick={() => aoAbrir(t)} style={botaoTexto}>{t.ir === 'diagnostico' ? 'Responder ↗' : t.ir === 'editar' ? 'Mudar a data ↗' : t.ir === 'encerrar' ? 'Encerrar ↗' : t.ir === 'idioma' ? 'Ver as aulas ↗' : 'Abrir ↗'}</button> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TarefasPessoais({ v, etapa, tarefas, recarregar }: { v: ViagemCompleta; etapa: Etapa; tarefas: TarefaVista[]; recarregar: () => void }) {
  const [titulo, setTitulo] = useState('');
  const [prazo, setPrazo] = useState('');
  const lista = tarefas.map((t) => t.pessoal!).sort((a, b) => a.ordem - b.ordem);
  const mover = async (i: number, d: -1 | 1) => {
    const outra = lista[i + d];
    const esta = lista[i];
    if (!outra || !esta) return;
    await ordenarTarefas([{ id: esta.id, ordem: outra.ordem === esta.ordem ? esta.ordem + d : outra.ordem }, { id: outra.id, ordem: esta.ordem }]);
    recarregar();
  };
  return (
    <div style={{ marginTop: '6px' }}>
      {lista.length ? (
        <div style={{ fontSize: '13px', color: 'var(--texto-sec)', margin: '4px 0' }}>
          Suas tarefas:
          {lista.map((t, i) => (
            <span key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--texto)' }}>
              <span style={{ flex: 1 }}>{t.titulo}</span>
              <button type="button" className="r-btn" aria-label={`Subir ${t.titulo}`} disabled={i === 0} onClick={() => void mover(i, -1)} style={{ width: '40px', height: '40px' }}>↑</button>
              <button type="button" className="r-btn" aria-label={`Descer ${t.titulo}`} disabled={i === lista.length - 1} onClick={() => void mover(i, 1)} style={{ width: '40px', height: '40px' }}>↓</button>
              <button type="button" className="r-btn" aria-label={`Apagar ${t.titulo}`} onClick={() => void removerTarefa(v.viagem.id, t.id).then(recarregar)} style={{ width: '40px', height: '40px', color: 'var(--vermelho)' }}>×</button>
            </span>
          ))}
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
        <input className="r-input" placeholder="Nova tarefa sua" value={titulo} onChange={(e) => setTitulo(e.target.value.slice(0, 120))} aria-label="Nova tarefa pessoal" style={{ ...campo, flex: 1, fontSize: '15px' }} />
        <input type="date" className="r-input" value={prazo} onChange={(e) => setPrazo(e.target.value)} aria-label="Prazo da tarefa (opcional)" style={{ ...campo, width: '140px', fontSize: '14px' }} />
        <button type="button" className="r-btn" style={botao} onClick={() => { if (titulo.trim()) void criarTarefa(v.viagem.id, { etapa, titulo: titulo.trim(), prazo: prazo || null, ordem: (lista.at(-1)?.ordem ?? -1) + 1 }).then(() => (setTitulo(''), setPrazo(''), recarregar())); }}>Criar</button>
      </div>
    </div>
  );
}

function Moldura({ titulo, fechar, children }: { titulo: string; fechar: () => void; children: ReactNode }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={titulo} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'flex-end' }} onClick={fechar}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--fundo)', color: 'var(--texto)', width: '100%', maxHeight: '88vh', overflowY: 'auto', padding: '18px 20px calc(18px + env(safe-area-inset-bottom))', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, font: "600 20px 'Lexend Exa'" }}>{titulo}</h2>
          <button type="button" className="r-btn" aria-label="Fechar" onClick={fechar} style={{ width: '44px', height: '44px', fontSize: '22px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Opcoes<T extends string>({ rotulo, valor, opcoes, aoMudar }: { rotulo: string; valor: T | undefined; opcoes: { id: T; nome: string }[]; aoMudar: (v: T) => void }) {
  return (
    <>
      <Rotulo>{rotulo}</Rotulo>
      <Segmentos rotulo={rotulo} valor={(valor ?? '') as T} opcoes={opcoes} aoMudar={aoMudar} />
    </>
  );
}

function PainelDiagnostico({ v, j, fechar, recarregar }: { v: ViagemCompleta; j: Jornada; fechar: () => void; recarregar: () => void }) {
  const [d, setD] = useState<Diagnostico>(v.viagem.diagnostico ?? {});
  const intl = internacional(j.ctx);
  const salvar = async () => {
    const limpo: Diagnostico = { ...d };
    if (limpo.passaporte !== 'sim') delete limpo.validadePassaporte;
    await atualizarViagem(v.viagem.id, { diagnostico: limpo }, 'Atualizou o diagnóstico da viagem.');
    recarregar();
    fechar();
  };
  return (
    <Moldura titulo={intl ? 'Documentos que já tenho' : 'O que já tenho'} fechar={fechar}>
      <p style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Só perguntamos o que vale para {v.viagem.destino}. As tarefas mudam com as respostas.</p>
      {intl ? (
        <>
          <Opcoes rotulo="Tem passaporte?" valor={d.passaporte} aoMudar={(x) => setD({ ...d, passaporte: x })} opcoes={[{ id: 'sim', nome: 'Tenho' }, { id: 'vencido', nome: 'Está vencido' }, { id: 'nao', nome: 'Não tenho' }]} />
          {d.passaporte === 'sim' ? (
            <>
              <Rotulo><label htmlFor="validade">Válido até</label></Rotulo>
              <input id="validade" type="date" className="r-input" value={d.validadePassaporte ?? ''} onChange={(e) => setD({ ...d, validadePassaporte: e.target.value || undefined })} style={campo} />
            </>
          ) : null}
          <Opcoes rotulo="Já tem seguro-viagem?" valor={d.seguro} aoMudar={(x) => setD({ ...d, seguro: x })} opcoes={[{ id: 'sim', nome: 'Já tenho' }, { id: 'nao', nome: 'Ainda não' }]} />
          <Opcoes rotulo="O voo tem conexão em outro país?" valor={d.conexao} aoMudar={(x) => setD({ ...d, conexao: x })} opcoes={[{ id: 'nao', nome: 'Não' }, { id: 'sim', nome: 'Sim' }, { id: 'nao_sei', nome: 'Ainda não sei' }]} />
        </>
      ) : null}
      <Opcoes rotulo="Já comprou a passagem?" valor={d.passagem} aoMudar={(x) => setD({ ...d, passagem: x })} opcoes={[{ id: 'sim', nome: 'Já comprei' }, { id: 'nao', nome: 'Ainda não' }]} />
      <div style={{ height: '16px' }} />
      <BotaoPrincipal onClick={() => void salvar()}>Salvar respostas</BotaoPrincipal>
    </Moldura>
  );
}

function PainelEditar({ v, j, fechar, recarregar }: { v: ViagemCompleta; j: Jornada; fechar: () => void; recarregar: () => void }) {
  const vg = v.viagem;
  const [data, setData] = useState(vg.data_ida);
  const [definida, setDefinida] = useState<'sim' | 'nao'>(vg.data_definida === false ? 'nao' : 'sim');
  const [noites, setNoites] = useState(String(vg.noites));
  const [orc, setOrc] = useState(vg.orcamento_centavos ? String(vg.orcamento_centavos / 100) : '');
  const [inicial, setInicial] = useState(vg.guardado_centavos ? String(vg.guardado_centavos / 100) : '');
  const [mensal, setMensal] = useState(vg.capacidade_mensal_centavos ? String(vg.capacidade_mensal_centavos / 100) : '');
  const [reserva, setReserva] = useState(String(vg.reserva_pct ?? 10));
  const [erro, setErro] = useState<string | null>(null);
  const num = (s: string) => (s ? Math.round(Number(s.replace(',', '.')) * 100) : null);
  const salvar = async () => {
    const n = Number(noites);
    if (!data || !(n >= 1 && n <= 60)) return setErro('Confira a data e o número de noites (1 a 60).');
    const mudouData = data !== vg.data_ida || n !== vg.noites;
    await atualizarViagem(vg.id, {
      data_ida: data, data_definida: definida === 'sim', noites: n, orcamento_centavos: num(orc), guardado_centavos: num(inicial) ?? 0,
      capacidade_mensal_centavos: num(mensal), reserva_pct: Math.min(50, Math.max(0, Number(reserva) || 0)),
    }, mudouData ? `Mudou a data da viagem para ${dataBR(data)} (${n} noites).` : 'Atualizou valores da viagem.');
    recarregar();
    fechar();
  };
  const m = j.moedaPlano;
  return (
    <Moldura titulo="Mudar datas e valores" fechar={fechar}>
      <p style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Ao salvar, prazos, meta de economia e o valor por mês são recalculados.</p>
      <Rotulo><label htmlFor="e-data">Data de ida</label></Rotulo>
      <input id="e-data" type="date" className="r-input" value={data} onChange={(e) => setData(e.target.value)} style={campo} />
      <Opcoes rotulo="Essa data é" valor={definida} aoMudar={setDefinida} opcoes={[{ id: 'sim', nome: 'Fechada' }, { id: 'nao', nome: 'Uma previsão' }]} />
      <Rotulo><label htmlFor="e-noites">Noites</label></Rotulo>
      <input id="e-noites" inputMode="numeric" className="r-input" value={noites} onChange={(e) => setNoites(e.target.value.replace(/\D/g, ''))} style={campo} />
      <p style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Mudar as noites não refaz o roteiro sozinho: os dias novos ficam vazios para você preencher.</p>
      <Rotulo><label htmlFor="e-orc">Orçamento total ({m})</label></Rotulo>
      <input id="e-orc" inputMode="decimal" className="r-input" value={orc} onChange={(e) => setOrc(e.target.value.replace(/[^\d,]/g, ''))} style={campo} />
      <Rotulo><label htmlFor="e-ini">Já tinha guardado ({m})</label></Rotulo>
      <input id="e-ini" inputMode="decimal" className="r-input" value={inicial} onChange={(e) => setInicial(e.target.value.replace(/[^\d,]/g, ''))} style={campo} />
      <Rotulo><label htmlFor="e-mes">Consigo guardar por mês ({m})</label></Rotulo>
      <input id="e-mes" inputMode="decimal" className="r-input" value={mensal} onChange={(e) => setMensal(e.target.value.replace(/[^\d,]/g, ''))} style={campo} />
      <Rotulo><label htmlFor="e-res">Reserva de emergência (% sobre o total)</label></Rotulo>
      <input id="e-res" inputMode="numeric" className="r-input" value={reserva} onChange={(e) => setReserva(e.target.value.replace(/\D/g, '').slice(0, 2))} style={campo} />
      <p style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Uma folga para imprevistos. Você escolhe o tamanho; o app não define um valor "certo".</p>
      {erro ? <Aviso>{erro}</Aviso> : null}
      <div style={{ height: '12px' }} />
      <BotaoPrincipal onClick={() => void salvar()}>Salvar e recalcular</BotaoPrincipal>
    </Moldura>
  );
}

function PainelEncerrar({ v, fechar, recarregar, resumo }: { v: ViagemCompleta; fechar: () => void; recarregar: () => void; resumo: ReactNode }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const encerrar = async () => {
    await atualizarViagem(v.viagem.id, { encerrada_em: new Date().toISOString(), avaliacao: nota || null, comentario: comentario.trim() || null }, 'Encerrou a viagem.');
    recarregar();
    fechar();
  };
  return (
    <Moldura titulo="Encerrar a viagem" fechar={fechar}>
      <p style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Antes, lance os últimos gastos em Dinheiro → Na viagem. Depois de encerrar, a viagem continua guardada para consulta.</p>
      {resumo}
      <Rotulo>Como foi o planejamento?</Rotulo>
      <div role="radiogroup" aria-label="Nota do planejamento" style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={nota === n} aria-label={`${n} de 5`} className="r-btn" onClick={() => setNota(n)} style={{ width: '48px', height: '48px', font: "600 18px 'Lexend Exa'", border: '1px solid var(--linha)', background: n <= nota ? 'var(--amarelo)' : 'transparent', color: 'var(--texto)' }}>{n}</button>
        ))}
      </div>
      <Rotulo><label htmlFor="coment">O que faria diferente? (opcional)</label></Rotulo>
      <textarea id="coment" className="r-input" value={comentario} onChange={(e) => setComentario(e.target.value.slice(0, 500))} rows={3} style={{ ...campo, resize: 'vertical' }} />
      <div style={{ height: '12px' }} />
      <BotaoPrincipal onClick={() => void encerrar()}>Encerrar a viagem</BotaoPrincipal>
      <BotaoContorno onClick={fechar} style={{ marginTop: '8px' }}>Ainda não</BotaoContorno>
    </Moldura>
  );
}

/** Texto para compartilhar a viagem encerrada. */
export function compartilhar(texto: string) {
  const nav = navigator as Navigator & { share?: (d: { title: string; text: string }) => Promise<void> };
  if (nav.share) return void nav.share({ title: 'Minha viagem no Bo Vair', text: texto }).catch(() => undefined);
  void navigator.clipboard?.writeText(texto);
  alert('Resumo copiado. Cole onde quiser compartilhar.');
}
