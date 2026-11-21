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
  const [andamento, setAndamento] = useState<Map<string, { paradas: number; hosp: boolean; pct: number | null }>>(new Map());
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
  const convites = dados?.minhas.filter((v) => v.status === 'convidado') ?? [];
  const ativas = dados?.minhas.filter((v) => v.status === 'ativo') ?? [];
  const Cartao = ({ v, extra }: { v: Viagem; extra?: string }) => (
    <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}`)} style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', textAlign: 'left', padding: '10px 0', borderBottom: '1px solid var(--linha)' }}>
      <span style={{ width: '76px', flex: 'none', borderRadius: '14px', overflow: 'hidden' }}><FotoLugar id={v.destino} proporcao="1 / 1" credito={false} compacto /></span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{v.destino}</span>
        <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>{periodo(v.data_ida, v.noites)} · {v.viajantes} {v.viajantes === 1 ? 'pessoa' : 'pessoas'}</span>
        <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: situacao(v).cor }}>{extra ?? situacao(v).texto}</span>
        <Andamento a={andamento.get(v.id)} feita={situacao(v).texto === 'Viagem feita'} />
      </span>
    </button>
  );

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
        <Rotulo>Minhas viagens</Rotulo>
        {ativas.length ? ativas.map((v) => <Cartao key={v.id} v={v} extra={v.papel === 'dono' ? undefined : v.papel === 'editor' ? 'Você planeja junto' : 'Você acompanha'} />) : (
          <p style={{ fontSize: '15px', color: 'var(--texto-sec)', margin: 0 }}>{dados ? 'Nenhuma ainda. Toque em "Nova viagem".' : 'Carregando…'}</p>
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

/** Selos do andamento: o que já está pronto (verde) e o que falta (âmbar). */
function Andamento({ a, feita }: { a?: { paradas: number; hosp: boolean; pct: number | null }; feita: boolean }) {
  if (!a || feita) return null;
  const selo = (ok: boolean, texto: string) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: ok ? 'rgba(26,122,62,.12)' : 'rgba(138,90,0,.12)', color: ok ? 'var(--verde)' : 'var(--ambar)' }}>{texto}</span>
  );
  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
      {selo(a.paradas > 0, a.paradas ? `Roteiro: ${a.paradas} ${a.paradas === 1 ? 'parada' : 'paradas'}` : 'Falta roteiro')}
      {selo(a.hosp, a.hosp ? 'Hospedagem ok' : 'Falta hospedagem')}
      {a.pct !== null ? selo(a.pct >= 100, `${a.pct}% guardado`) : selo(false, 'Sem orçamento')}
    </span>
  );
}

const titulo = { margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' } as const;
