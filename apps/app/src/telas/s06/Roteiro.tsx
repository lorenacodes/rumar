import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { enderecoCurto, horarioLegivel, LUGARES, OSM_ATUALIZADO_EM } from '../../lib/catalogo';
import { NOME_CATEGORIA, NOME_ESTILO, planejar, textoDistancia, type Parada, type Periodo } from '../../lib/planejador';
import { useViajante } from '../../state/viajante';
import { Abas } from '../../ui/abas';
import { FotoLugar } from '../../ui/foto';
import { Voltar } from '../../ui/pecas';

const RITMO = { calm: 'tranquilo', balanced: 'equilibrado', intense: 'intenso' } as const;
const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function periodoDaFaixa(p: Periodo): 'Manhã' | 'Tarde' | 'Noite' {
  return p === 'morning' ? 'Manhã' : p === 'afternoon' ? 'Tarde' : 'Noite';
}

/** Linha do tempo de uma parada. */
function ItemDoDia({ parada, ultimo, aoAbrir }: { parada: Parada; ultimo: boolean; aoAbrir: (id: string) => void }) {
  const l = parada.lugar;
  return (
    <li style={{ display: 'grid', gridTemplateColumns: '52px 1fr', columnGap: '10px' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ font: "600 14px 'Lexend Exa'", paddingTop: '2px' }}>{parada.horario}</div>
        {/* Trilho da linha do tempo */}
        <span aria-hidden style={{ position: 'absolute', right: '-6px', top: '6px', width: '10px', height: '10px', background: l ? 'var(--amarelo)' : 'var(--fundo)', border: '2px solid var(--texto)', boxSizing: 'border-box' }} />
        {!ultimo ? <span aria-hidden style={{ position: 'absolute', right: '-2px', top: '18px', bottom: '-6px', width: '2px', background: 'var(--linha)' }} /> : null}
      </div>
      <div style={{ paddingBottom: ultimo ? '4px' : '18px', minWidth: 0 }}>
        {l ? (
          <>
            <button type="button" className="r-btn" onClick={() => aoAbrir(l.id)} style={{ display: 'block', width: '100%', textAlign: 'left' }} aria-label={`${l.nome}: ver detalhes`}>
              <FotoLugar id={l.id} />
              <div style={{ font: "700 12px/16px 'Open Sans'", letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--azul)', marginTop: '8px' }}>{NOME_CATEGORIA[l.categoria]}</div>
              <div style={{ font: "600 18px/23px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '2px' }}>{l.nome}</div>
            </button>
            <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '2px' }}>
              {enderecoCurto(l.endereco) ?? l.area}
            </div>
            {l.horario ? (
              <div style={{ fontSize: '14px', lineHeight: '20px', marginTop: '2px' }}>
                <span style={{ fontWeight: 600 }}>Horário:</span> {horarioLegivel(l.horario)} <span style={{ color: 'var(--texto-sec)' }}>· OpenStreetMap</span>
              </div>
            ) : (
              <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '2px' }}>Horário não confirmado: confira antes de ir.</div>
            )}
            <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: '20px', color: 'var(--verde)', fontWeight: 600 }}>{parada.motivo}</p>
            {parada.proximo ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '8px', padding: '6px 0', borderTop: '1px dashed var(--linha)', fontSize: '14px', lineHeight: '19px', color: 'var(--texto-sec)' }}>
                <span>
                  <span aria-hidden>↓ </span>Próxima parada a {textoDistancia(parada.proximo.km)}
                </span>
                <a href={parada.proximo.rota} target="_blank" rel="noreferrer" style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '40px', color: 'var(--azul)', fontWeight: 600, textDecoration: 'none' }}>
                  Ver rota ↗
                </a>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div style={{ font: "600 16px 'Lexend Exa'" }}>Tempo livre</div>
            <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)' }}>{parada.motivo}</div>
          </>
        )}
      </div>
    </li>
  );
}

/** 6.3 Roteiro de verdade, montado pelo perfil de viajante e pela viagem. */
export function Roteiro() {
  const navegar = useNavigate();
  const { preferencias, viagem } = useViajante();
  const [dia, setDia] = useState(1);
  const dias = useMemo(() => (preferencias && viagem ? planejar(LUGARES, preferencias, viagem) : []), [preferencias, viagem]);
  if (!preferencias || !viagem) return <Navigate to="/montar" replace />;

  const atual = dias.find((d) => d.numero === dia) ?? dias[0]!;
  const [a, m, d0] = viagem.dataIda.split('-').map(Number);
  const fim = new Date(Date.UTC(a!, m! - 1, d0! + viagem.noites));
  const periodo = `${d0} ${MES[m! - 1]} a ${fim.getUTCDate()} ${MES[fim.getUTCMonth()]}`;
  const faixas = (['Manhã', 'Tarde', 'Noite'] as const).map((f) => ({ f, itens: atual.paradas.filter((p) => periodoDaFaixa(p.periodo) === f) })).filter((x) => x.itens.length);

  return (
    <main className="tela" data-tela="6.3" data-real="roteiro">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <Voltar para="/minha-viagem" />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>{viagem.destino} · {periodo}</div>
        <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Seu roteiro.</h1>
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '4px' }}>
          Feito para quem gosta de {NOME_ESTILO[preferencias.estilo]}, no ritmo {RITMO[preferencias.ritmo]}.{' '}
          <button type="button" className="r-btn alvo-toque" onClick={() => navegar('/perfil-viajante')} style={{ color: 'var(--azul)', fontWeight: 600, fontSize: '14px' }}>
            Ajustar
          </button>
        </div>

        <div role="tablist" aria-label="Dias da viagem" style={{ display: 'flex', gap: '6px', overflowX: 'auto', margin: '14px -20px 0', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
          {dias.map((x) => {
            const ativo = x.numero === atual.numero;
            return (
              <button key={x.numero} type="button" role="tab" aria-selected={ativo} className="r-btn" onClick={() => setDia(x.numero)}
                style={{ flex: 'none', minWidth: '64px', height: '52px', padding: '0 10px', boxSizing: 'border-box', textAlign: 'center', ...(ativo ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>
                <span style={{ display: 'block', font: "600 14px 'Lexend Exa'" }}>Dia {x.numero}</span>
                <span style={{ display: 'block', fontSize: '12px', opacity: 0.85 }}>{x.diaSemana.slice(0, 3)} {x.data.slice(0, 2)}</span>
              </button>
            );
          })}
        </div>

        <section aria-labelledby="titulo-dia" style={{ marginTop: '16px' }}>
          <h2 id="titulo-dia" style={{ margin: 0, font: "600 20px/26px 'Lexend Exa'", letterSpacing: '-0.02em' }}>
            Dia {atual.numero} — {atual.diaSemana[0]!.toUpperCase() + atual.diaSemana.slice(1)}, {atual.data}
          </h2>
          <div style={{ font: "600 15px/21px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>{atual.tema}</div>
          <p style={{ margin: '6px 0 0', fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)' }}>{atual.resumo}</p>
          {atual.mapa ? (
            <a href={atual.mapa} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', marginTop: '12px', border: '2px solid var(--texto)', font: "600 15px 'Open Sans'", color: 'var(--texto)', textDecoration: 'none' }}>
              Ver o dia no mapa ↗
            </a>
          ) : null}

          {faixas.map(({ f, itens }) => (
            <div key={f} style={{ marginTop: '18px' }}>
              <h3 style={{ margin: '0 0 10px', font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--texto-sec)', borderBottom: '1px solid var(--linha)', paddingBottom: '6px' }}>{f}</h3>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {itens.map((p, i) => <ItemDoDia key={`${p.periodo}-${i}`} parada={p} ultimo={i === itens.length - 1} aoAbrir={(id) => navegar(`/lugar/${id}`)} />)}
              </ol>
            </div>
          ))}
        </section>

        <p style={{ fontSize: '13px', lineHeight: '19px', color: 'var(--texto-sec)', margin: '20px 0 24px' }}>
          Lugares escolhidos pela curadoria do Bo Vair. Endereços e horários: OpenStreetMap{OSM_ATUALIZADO_EM ? `, ${OSM_ATUALIZADO_EM.split('-').reverse().join('/')}` : ''}. Distâncias em linha reta; o tempo de trajeto aparece em "Ver rota".
        </p>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}
