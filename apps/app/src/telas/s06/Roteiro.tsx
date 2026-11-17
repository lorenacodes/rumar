import { buildItinerary, INTEREST_LABEL_PT, PACE_LABEL_PT, SLOT_LABEL_PT, type InterestTag, type Pace, type TravelNeed } from '@rumar/core';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { LUGARES_PARIS } from '../../dados/lugares';
import { useEscolhas } from '../../state/escolhas';
import { Abas } from '../../ui/abas';
import { FotoDestino } from '../../ui/foto';
import { BotaoPrincipal, Rodape, Voltar } from '../../ui/pecas';

/** Opções da 6.1 → jeito de viajar usado pelo motor de roteiro (packages/core). */
const MOTIVO: Record<string, InterestTag[]> = {
  Lazer: ['photography', 'wellness'],
  'Networking e trabalho': ['meet_people'],
  Estudo: ['history_culture', 'museums_art'],
  Evento: ['meet_people'],
  Família: ['family_kids'],
  Celebrar: ['food_drink', 'nightlife'],
};
const VIVER: Record<string, InterestTag[]> = {
  Comida: ['food_drink', 'local_markets'],
  Museus: ['museums_art', 'history_culture'],
  'Vida noturna': ['nightlife'],
  'Conhecer gente': ['meet_people'],
  Natureza: ['nature_outdoors'],
  Compras: ['shopping'],
};
const RITMO: Record<string, Pace> = { Tranquilo: 'calm', Equilibrado: 'balanced', Intenso: 'intense' };
const NECESSIDADE: Record<string, TravelNeed> = {
  'Acesso sem degraus': 'step_free',
  'Pouca caminhada': 'low_walking',
  'Lugares calmos': 'quiet',
};

const NOITES = 6;

/** 6.3 Roteiro de verdade: montado pelas escolhas da 6.1, com lugares reais curados. */
export function Roteiro() {
  const navegar = useNavigate();
  const valores = useEscolhas((s) => s.valores);
  const consentiu = useEscolhas((s) => s.consentimentoNecessidades);
  const [dia, setDia] = useState(1);

  const motivos = valores['6.1:motivo'] ?? [];
  const viver = valores['6.1:viver'] ?? [];
  const ritmo = RITMO[(valores['6.1:ritmo'] ?? [])[0] ?? 'Equilibrado'] ?? 'balanced';
  const necessidades = (valores['6.1:necessidades'] ?? []).map((n) => NECESSIDADE[n]).filter((n): n is TravelNeed => Boolean(n));
  const interesses = [...new Set([...motivos.flatMap((m) => MOTIVO[m] ?? []), ...viver.flatMap((v) => VIVER[v] ?? [])])];

  const { roteiro, semVerificacao } = useMemo(() => {
    if (interesses.length === 0) return { roteiro: null, semVerificacao: false };
    const montar = (needs: TravelNeed[]) =>
      buildItinerary({ places: LUGARES_PARIS, persona: { interests: interesses, pace: ritmo, needs }, nights: NOITES, style: 'intermediate' });
    const usadas = consentiu ? necessidades : [];
    const comFiltro = montar(usadas);
    const vazio = comFiltro.days.every((d) => d.items.every((i) => !i.place));
    // Nenhum lugar com a necessidade CONFERIDA: em vez de um roteiro vazio, mostra o
    // roteiro sem o filtro, avisando item a item que a acessibilidade não foi verificada.
    if (vazio && usadas.length) return { roteiro: montar(usadas.filter((n) => n !== 'step_free')), semVerificacao: usadas.includes('step_free') };
    return { roteiro: comFiltro, semVerificacao: false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([interesses, ritmo, necessidades, consentiu])]);

  // Necessidade é dado sensível: só usa depois do aceite específico (6.2).
  if (necessidades.length > 0 && !consentiu) return <Navigate to="/tela/6.2" replace />;

  const resumo = [...motivos, ...viver].map((t, i) => (i === 0 ? t : t.toLowerCase())).join(', ');
  const diaAtual = roteiro?.days.find((d) => d.day === dia);

  return (
    <main className="tela" data-tela="6.3" data-real="roteiro">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <Voltar />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Roteiro · Paris · {NOITES} noites</div>
        <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Feito do seu jeito.</h1>

        {!roteiro ? (
          <>
            <p style={{ fontSize: '16px', lineHeight: '24px', margin: '12px 0 0' }}>
              Conte o que te leva até lá e o que você quer viver. O roteiro se monta na hora.
            </p>
            <div style={{ marginTop: '16px' }}>
              <BotaoPrincipal onClick={() => navegar('/tela/6.1')}>Escolher meu jeito de viajar ↗</BotaoPrincipal>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: '6px 0 10px' }}>
              {resumo} · ritmo {PACE_LABEL_PT[ritmo].toLowerCase()}
              {consentiu && necessidades.length ? (semVerificacao ? ' · necessidades consideradas, acessibilidade a conferir' : ' · necessidades respeitadas') : ''}
            </div>
            {semVerificacao ? (
              <div role="note" style={{ background: 'var(--cartao-1)', padding: '10px 12px', fontSize: '14px', lineHeight: '20px', marginBottom: '10px' }}>
                <b>Acesso sem degraus ainda não conferido.</b> Ainda não verificamos a acessibilidade destes lugares nas fontes oficiais. Confira antes de ir.
              </div>
            ) : null}
            <div role="tablist" aria-label="Dias" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {roteiro.days.map((d) => {
                const ativo = d.day === dia;
                return (
                  <button
                    key={d.day}
                    type="button"
                    role="tab"
                    aria-selected={ativo}
                    className="r-btn"
                    onClick={() => setDia(d.day)}
                    style={{ flex: 'none', height: '48px', padding: '0 14px', boxSizing: 'border-box', font: `${ativo ? 600 : 500} 15px 'Open Sans'`, ...(ativo ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>
                    Dia {d.day}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '8px' }}>
              {diaAtual?.kind === 'arrival' ? 'Chegada: só a segunda metade do dia.' : diaAtual?.kind === 'departure' ? 'Partida: só a manhã.' : diaAtual?.area ? `Dia pelo ${diaAtual.area}, para andar menos.` : ''}
            </div>
            {diaAtual?.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: '1px dashed var(--linha)' }}>
                <div style={{ width: '56px', flex: 'none', font: "500 13px 'Lexend Exa'", color: 'var(--texto-sec)', paddingTop: '2px' }}>{SLOT_LABEL_PT[item.slot]}</div>
                {item.place ? (
                  <div style={{ width: '60px', height: '60px', flex: 'none', position: 'relative', overflow: 'hidden', background: 'linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))' }}>
                    <FotoDestino nome={item.place.name} />
                  </div>
                ) : null}
                <div style={{ flex: 1 }}>
                  <div style={{ font: "600 15px/20px 'Open Sans'" }}>{item.place?.name ?? 'Tempo livre'}</div>
                  {item.place ? <div style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--texto-sec)' }}>{item.place.description}</div> : null}
                  <div style={{ font: "600 14px/19px 'Open Sans'", color: 'var(--verde)', marginTop: '2px' }}>{item.reasons.join(' · ')}</div>
                  {semVerificacao && item.place && item.place.stepFree !== true ? (
                    <div style={{ font: "600 14px/19px 'Open Sans'", color: 'var(--ambar)' }}>{item.place.stepFree === false ? 'Tem degraus' : 'Sem degraus: não verificado'}</div>
                  ) : null}
                </div>
              </div>
            ))}
            {roteiro.uncoveredInterests.length ? (
              <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '10px' }}>
                Ainda não temos lugares de {roteiro.uncoveredInterests.map((t) => INTEREST_LABEL_PT[t].toLowerCase()).join(', ')} em Paris.
              </div>
            ) : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', margin: '10px 0 16px' }}>
              <span style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Lugares de curadoria. Confira horários antes de ir.</span>
              <span style={{ font: "600 14px 'Open Sans'", border: '1px solid var(--texto)', padding: '1px 6px', whiteSpace: 'nowrap' }}>≈ Estimativa</span>
            </div>
          </>
        )}
      </div>
      {roteiro ? (
        <Rodape padding="10px 20px 10px" style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <BotaoPrincipal onClick={() => navegar('/tela/11.1')}>Reservar a viagem ↗</BotaoPrincipal>
        </Rodape>
      ) : null}
      <Abas ativa="viagem" logoAbaixoDoRodape={Boolean(roteiro)} />
    </main>
  );
}
