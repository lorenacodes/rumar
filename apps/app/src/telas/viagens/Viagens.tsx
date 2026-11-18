import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSessao } from '../../conta/servico';
import { aceitarConvite, listarViagens, sairDaViagem, type Viagem } from '../../lib/viagens';
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
          <BotaoPrincipal onClick={() => navegar('/conta/criar')}>Criar conta ↗</BotaoPrincipal>
          <div style={{ marginTop: '8px' }}><BotaoContorno onClick={() => navegar('/entrar')}>Já tenho conta · Entrar</BotaoContorno></div>
        </div>
        <Abas ativa="viagem" logoAbaixoDoRodape />
      </main>
    );
  }

  const situacao = (v: Viagem): { texto: string; cor: string } => {
    const hoje = new Date().toISOString().slice(0, 10);
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
      <span style={{ width: '64px', flex: 'none' }}><FotoLugar id={v.destino} proporcao="1 / 1" credito={false} compacto /></span>
      <span>
        <span style={{ display: 'block', font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{v.destino}</span>
        <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>{periodo(v.data_ida, v.noites)} · {v.viajantes} {v.viajantes === 1 ? 'pessoa' : 'pessoas'}</span>
        <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: situacao(v).cor }}>{extra ?? situacao(v).texto}</span>
      </span>
    </button>
  );

  return (
    <main className="tela" data-tela="viagens" data-real="viagens">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Viagens</div>
        <h1 style={titulo}>Suas viagens.</h1>
        <div style={{ marginTop: '12px' }}><BotaoPrincipal onClick={() => navegar('/viagens/nova')}>Nova viagem ↗</BotaoPrincipal></div>
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

const titulo = { margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' } as const;
