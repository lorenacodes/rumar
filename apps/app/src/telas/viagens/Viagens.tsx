import { useEffect, useState } from 'react';
import { hojeLocal } from '../../lib/datas';
import { useNavigate } from 'react-router-dom';

import { useSessao } from '../../conta/servico';
import { aceitarConvite, listarViagens, sairDaViagem, type Viagem } from '../../lib/viagens';
import { supabase } from '../../lib/supabase';
import { Abas } from '../../ui/abas';
import { FotoLugar } from '../../ui/foto';
import { BotaoContorno, BotaoPrincipal } from '../../ui/pecas';
import { periodo, Rotulo } from './comum';

/** Viagens: as minhas (e convites), as que os amigos compartilharam, e criar uma nova. */
export function Viagens() {
  const navegar = useNavigate();
  const sessao = useSessao();
  const [dados, setDados] = useState<Awaited<ReturnType<typeof listarViagens>> | null>(null);
  const carregar = () => void listarViagens().then(setDados);
  // Andamento de cada viagem: paradas no roteiro, hospedagem escolhida e quanto do orçamento já foi guardado.
  const [verFeitas, setVerFeitas] = useState(false);
  const [andamento, setAndamento] = useState<Map<string, { paradas: number; hosp: boolean; pct: number | null }>>(new Map());
  // O que dá vontade: os lugares mais conhecidos do roteiro e quantas experiências únicas a cidade tem.
  const [desejo, setDesejo] = useState<Map<string, { lugares: string[]; total: number; experiencias: number }>>(new Map());
  useEffect(() => {
    const ids = (dados?.minhas ?? []).filter((v) => v.status === 'ativo').map((v) => v.id);
    if (!ids.length) return;
    void Promise.all([
      supabase.from('trip_items').select('trip_id').in('trip_id', ids),
      supabase.from('trip_lodging').select('trip_id').in('trip_id', ids),
      supabase.from('trips').select('id, orcamento_centavos, guardado_centavos').in('id', ids),
    ]).then(([itens, hosp, trips]) => {
      const m = new Map<string, { paradas: number; hosp: boolean; pct: number | null }>();
      for (const t of (trips.data ?? []) as { id: string; orcamento_centavos: number | null; guardado_centavos: number | null }[]) {
        m.set(t.id, { paradas: 0, hosp: false, pct: t.orcamento_centavos ? Math.min(100, Math.round(((t.guardado_centavos ?? 0) / t.orcamento_centavos) * 100)) : null });
      }
      for (const r of (itens.data ?? []) as { trip_id: string }[]) { const x = m.get(r.trip_id); if (x) x.paradas++; }
      for (const r of (hosp.data ?? []) as { trip_id: string }[]) { const x = m.get(r.trip_id); if (x) x.hosp = true; }
      setAndamento(m);
    });
    void (async () => {
      const ativas = (dados?.minhas ?? []).filter((v) => v.status === 'ativo');
      const destinos = [...new Set(ativas.map((v) => v.destino_id).filter((d): d is string => Boolean(d)))];
      const [itens, exps] = await Promise.all([
        supabase.from('trip_items').select('trip_id, place_id').in('trip_id', ids).not('place_id', 'like', 'livre-%').limit(2000),
        destinos.length ? supabase.from('experiencias').select('destino_id').eq('ativo', true).in('destino_id', destinos) : Promise.resolve({ data: [] }),
      ]);
      const linhas = (itens.data ?? []) as { trip_id: string; place_id: string }[];
      const lugIds = [...new Set(linhas.map((l) => l.place_id))].slice(0, 400);
      const { data: lug } = lugIds.length ? await supabase.from('lugares').select('id, nome, fama').in('id', lugIds) : { data: [] };
      const info = new Map(((lug ?? []) as { id: string; nome: string; fama: number | null }[]).map((l) => [l.id, l]));
      const porDestino = new Map<string, number>();
      for (const e of (exps.data ?? []) as { destino_id: string }[]) porDestino.set(e.destino_id, (porDestino.get(e.destino_id) ?? 0) + 1);
      const d = new Map<string, { lugares: string[]; total: number; experiencias: number }>();
      for (const v of ativas) {
        const doRoteiro = linhas.filter((l) => l.trip_id === v.id).map((l) => info.get(l.place_id)).filter((x): x is { id: string; nome: string; fama: number | null } => Boolean(x));
        const top = [...new Map(doRoteiro.map((x) => [x.nome, x])).values()].sort((a, b) => (b.fama ?? 0) - (a.fama ?? 0)).slice(0, 2).map((x) => x.nome);
        d.set(v.id, { lugares: top, total: doRoteiro.length, experiencias: v.destino_id ? porDestino.get(v.destino_id) ?? 0 : 0 });
      }
      setDesejo(d);
    })();
  }, [dados]);
  useEffect(() => {
    if (sessao) carregar();
  }, [sessao]);

  if (sessao === null) {
    return (
      <main className="tela" data-tela="viagens" data-real="viagens">
        <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Viagens</div>
          <h1 style={titulo}>Planeje com a sua conta.</h1>
          <p style={{ fontSize: '16px', lineHeight: '24px' }}>Roteiro, orçamento e amigos num lugar só.</p>
        </div>
        <div className="rodape" style={{ padding: '10px 20px', borderTop: '1px solid var(--linha)', background: 'var(--fundo)', bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <BotaoPrincipal onClick={() => navegar('/conta/criar')}>Criar conta</BotaoPrincipal>
          <div style={{ marginTop: '8px' }}><BotaoContorno onClick={() => navegar('/entrar')}>Já tenho conta · Entrar</BotaoContorno></div>
        </div>
        <Abas ativa="viagem" logoAbaixoDoRodape />
      </main>
    );
  }

  const situacao = (v: Viagem): { texto: string; cor: string } => {
    const hoje = hojeLocal();
    const fim = new Date(Date.parse(`${v.data_ida}T12:00:00Z`) + v.noites * 86_400_000).toISOString().slice(0, 10);
    if (hoje > fim) return { texto: 'Viagem feita', cor: 'var(--texto-sec)' };
    if (hoje >= v.data_ida) return { texto: 'Acontecendo agora', cor: 'var(--verde)' };
    const d = Math.round((Date.parse(`${v.data_ida}T12:00:00Z`) - Date.parse(`${hoje}T12:00:00Z`)) / 86_400_000);
    return { texto: d === 1 ? 'Falta 1 dia' : `Faltam ${d} dias`, cor: 'var(--azul)' };
  };
  const grupo = (v: Viagem): 'agora' | 'proximas' | 'feitas' => {
    const t = situacao(v).texto;
    return t === 'Viagem feita' ? 'feitas' : t === 'Acontecendo agora' ? 'agora' : 'proximas';
  };
  const convites = dados?.minhas.filter((v) => v.status === 'convidado') ?? [];
  const ativas = dados?.minhas.filter((v) => v.status === 'ativo') ?? [];
  const Cartao = ({ v, extra }: { v: Viagem; extra?: string }) => (
    <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}`)} style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', textAlign: 'left', padding: '10px 0', borderBottom: '1px solid var(--linha)' }}>
      <span style={{ width: '76px', flex: 'none', borderRadius: '14px', overflow: 'hidden' }}><FotoLugar id={v.destino} proporcao="1 / 1" credito={false} compacto /></span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{v.destino}</span>
        <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>{periodo(v.data_ida, v.noites)} · {v.viajantes} {v.viajantes === 1 ? 'pessoa' : 'pessoas'}</span>
        <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: situacao(v).cor }}>{extra ?? situacao(v).texto}</span>
        <Desejo d={desejo.get(v.id)} />
        <Andamento a={andamento.get(v.id)} feita={situacao(v).texto === 'Viagem feita'} />
      </span>
    </button>
  );

  /** Na foto: "Dia 3 de 6" durante a viagem; antes, a contagem regressiva. */
  const rotuloFoto = (v: Viagem) => {
    if (situacao(v).texto !== 'Acontecendo agora') return situacao(v).texto;
    const dia = Math.round((Date.parse(`${hojeLocal()}T12:00:00Z`) - Date.parse(`${v.data_ida}T12:00:00Z`)) / 86_400_000) + 1;
    return `Dia ${dia} de ${v.noites + 1}`;
  };
  /** A viagem mais próxima em destaque: foto grande, contagem e o que tem no roteiro. */
  const CartaoDestaque = ({ v }: { v: Viagem }) => {
    const d = desejo.get(v.id);
    return (
      <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}`)} aria-label={`${v.destino}: ${situacao(v).texto}`}
        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '4px 0 14px', borderBottom: '1px solid var(--linha)' }}>
        <span style={{ position: 'relative', display: 'block', borderRadius: '18px', overflow: 'hidden' }}>
          <FotoLugar id={v.destino} proporcao="16 / 9" credito={false} compacto />
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '28px 14px 12px', background: 'linear-gradient(0deg, rgba(11,31,75,.94) 0%, rgba(11,31,75,.7) 55%, rgba(11,31,75,0) 100%)', color: '#fff' }}>
            <span style={{ display: 'block', font: "600 13px/17px 'Open Sans'", color: 'var(--amarelo)' }}>{rotuloFoto(v)}</span>
            <span style={{ display: 'block', font: "600 24px/28px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{v.destino}</span>
            <span style={{ display: 'block', fontSize: '13px', opacity: 0.9 }}>{periodo(v.data_ida, v.noites)} · {v.viajantes} {v.viajantes === 1 ? 'pessoa' : 'pessoas'}</span>
          </span>
        </span>
        <Desejo d={d} grande />
        <Andamento a={andamento.get(v.id)} feita={false} />
      </button>
    );
  };

  return (
    <main className="tela" data-tela="viagens" data-real="viagens">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Viagens</div>
        <h1 style={titulo}>Suas viagens.</h1>
        <div style={{ marginTop: '12px' }}><BotaoPrincipal onClick={() => navegar('/viagens/nova')}>Nova viagem</BotaoPrincipal></div>
        {/* Segunda ação à vista (D-077): botão tonal do mesmo tamanho, não um link perdido. */}
        <button type="button" className="r-btn" onClick={() => navegar('/viagens/ja-fiz')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', height: '52px', marginTop: '10px', background: 'var(--cartao-1)', color: 'var(--texto)', font: "600 16px 'Open Sans'" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 6l1.5-2h5L16 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          Registrar viagem que já fiz
        </button>
        {convites.length ? (
          <>
            <Rotulo>Convites</Rotulo>
            {convites.map((v) => (
              <div key={v.id} style={{ borderBottom: '1px solid var(--linha)', paddingBottom: '8px' }}>
                <Cartao v={v} extra={`Convite para ${v.papel === 'editor' ? 'planejar junto' : 'acompanhar'}`} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="r-btn" onClick={() => void aceitarConvite(v.id).then(carregar)} style={{ flex: 1, height: '44px', background: 'var(--amarelo)', font: "600 15px 'Open Sans'" }}>Entrar na viagem</button>
                  <button type="button" className="r-btn" onClick={() => void sairDaViagem(v.id).then(carregar)} style={{ flex: 1, height: '44px', border: '1px solid var(--linha)', font: "600 15px 'Open Sans'" }}>Recusar</button>
                </div>
              </div>
            ))}
          </>
        ) : null}
        {/* Organizadas por momento: agora, próximas (da mais perto) e já feitas (recolhidas). */}
        {ativas.length ? (['agora', 'proximas', 'feitas'] as const).map((g) => {
          const lista = ativas.filter((v) => grupo(v) === g).sort((x, y) => (g === 'feitas' ? y.data_ida.localeCompare(x.data_ida) : x.data_ida.localeCompare(y.data_ida)));
          if (!lista.length) return null;
          const papel = (v: (typeof lista)[number]) => (v.papel === 'dono' ? undefined : v.papel === 'editor' ? 'Você planeja junto' : 'Você acompanha');
          if (g === 'feitas') return (
            <div key={g}>
              <button type="button" className="r-btn" aria-expanded={verFeitas} onClick={() => setVerFeitas(!verFeitas)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', minHeight: '48px', marginTop: '14px', fontWeight: 600, fontSize: '15px' }}>
                <span>Já feitas ({lista.length})</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" style={{ transform: verFeitas ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', color: 'var(--texto-sec)' }}><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {verFeitas ? lista.map((v) => <Cartao key={v.id} v={v} extra={papel(v)} />) : null}
            </div>
          );
          const [primeira, ...resto] = lista;
          return (
            <div key={g}>
              <Rotulo>{g === 'agora' ? 'Acontecendo agora' : 'Próximas'}</Rotulo>
              <CartaoDestaque v={primeira!} />
              {resto.map((v) => <Cartao key={v.id} v={v} extra={papel(v)} />)}
            </div>
          );
        }) : (
          <>
            <Rotulo>Minhas viagens</Rotulo>
            <p style={{ fontSize: '15px', color: 'var(--texto-sec)', margin: 0 }}>{dados ? 'Nenhuma ainda. Toque em "Nova viagem".' : 'Carregando…'}</p>
          </>
        )}
        {dados?.deAmigos.length ? (
          <>
            <Rotulo>Compartilhadas por amigos</Rotulo>
            {dados.deAmigos.map((v) => <Cartao key={v.id} v={v} extra="Só para ver e se inspirar" />)}
          </>
        ) : null}
        <div style={{ height: '24px' }} />
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** O que dá vontade: lugares conhecidos do roteiro e experiências únicas da cidade. */
function Desejo({ d, grande = false }: { d?: { lugares: string[]; total: number; experiencias: number }; grande?: boolean }) {
  if (!d || (!d.lugares.length && !d.experiencias)) return null;
  const mais = d.total - d.lugares.length;
  return (
    <span style={{ display: 'block', marginTop: grande ? '10px' : '4px', fontSize: grande ? '15px' : '13px', lineHeight: grande ? '21px' : '18px' }}>
      {d.lugares.length ? <span style={{ display: 'block' }}>Inclui <b>{d.lugares.join(', ')}</b>{mais > 0 ? ` e mais ${mais}` : ''}</span> : null}
      {d.experiencias ? <span style={{ display: 'block', color: 'var(--azul)', fontWeight: 600 }}>{d.experiencias} {d.experiencias === 1 ? 'experiência que só existe lá' : 'experiências que só existem lá'}</span> : null}
    </span>
  );
}

/** Andamento em uma linha: o próximo passo (ou "Tudo pronto") e uma barra fina com o quanto já está preparado. */
function Andamento({ a, feita }: { a?: { paradas: number; hosp: boolean; pct: number | null }; feita: boolean }) {
  if (!a || feita) return null;
  const passos = [a.paradas > 0, a.hosp, a.pct !== null && a.pct >= 100];
  const feitos = passos.filter(Boolean).length;
  const proximo = !passos[0] ? 'Próximo: montar o roteiro' : !passos[1] ? 'Próximo: escolher hospedagem' : a.pct === null ? 'Próximo: definir o orçamento' : !passos[2] ? `Próximo: guardar (${a.pct}% até agora)` : null;
  return (
    <span style={{ display: 'block', marginTop: '6px' }}>
      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: proximo ? 'rgba(138,90,0,.12)' : 'rgba(26,122,62,.12)', color: proximo ? 'var(--ambar)' : 'var(--verde)' }}>{proximo ?? 'Tudo pronto'}</span>
      <span aria-hidden="true" style={{ display: 'block', height: '4px', marginTop: '6px', borderRadius: '2px', background: 'var(--linha)', overflow: 'hidden' }}>
        <span style={{ display: 'block', width: `${(feitos / 3) * 100}%`, height: '100%', background: feitos === 3 ? 'var(--verde)' : 'var(--azul)' }} />
      </span>
    </span>
  );
}

const titulo = { margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' } as const;
