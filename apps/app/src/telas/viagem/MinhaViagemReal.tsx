import { useNavigate } from 'react-router-dom';

import { lugarPorId } from '../../lib/catalogo';
import { NOME_ESTILO } from '../../lib/planejador';
import { useViajante } from '../../state/viajante';
import { Abas } from '../../ui/abas';
import { BotaoContorno, BotaoPrincipal } from '../../ui/pecas';
import { LinhaLugar } from '../descobrir/Descobrir';

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** Minha viagem: a viagem criada pela pessoa (do banco ou do aparelho), sem dados de exemplo. */
export function MinhaViagemReal() {
  const navegar = useNavigate();
  const { viagem, preferencias, salvos } = useViajante();

  if (!viagem) {
    return (
      <main className="tela" data-tela="minha-viagem" data-real="minha-viagem">
        <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Minha viagem</div>
          <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Ainda sem viagem.</h1>
          <p style={{ fontSize: '16px', lineHeight: '24px', margin: '10px 0 0' }}>Diga para onde e quando, conte seu jeito de viajar e o roteiro se monta dia a dia.</p>
        </div>
        <div className="rodape" style={{ padding: '10px 20px', borderTop: '1px solid var(--linha)', background: 'var(--fundo)', bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <BotaoPrincipal onClick={() => navegar('/montar')}>Montar minha viagem ↗</BotaoPrincipal>
        </div>
        <Abas ativa="viagem" logoAbaixoDoRodape />
      </main>
    );
  }

  const [a, m, d] = viagem.dataIda.split('-').map(Number);
  const ida = new Date(Date.UTC(a!, m! - 1, d!));
  const volta = new Date(Date.UTC(a!, m! - 1, d! + viagem.noites));
  const faltam = Math.ceil((ida.getTime() - Date.now()) / 86_400_000);
  const salvosLugares = salvos.map(lugarPorId).filter((x) => x !== undefined);

  return (
    <main className="tela" data-tela="minha-viagem" data-real="minha-viagem">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Minha viagem</div>
        <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Rumo a {viagem.destino}.</h1>
        <div style={{ background: 'var(--fundo-escuro)', borderTop: '8px solid var(--amarelo)', color: '#fff', marginTop: '12px', padding: '14px 18px' }}>
          <div style={{ font: "600 22px 'Lexend Exa'" }}>{d} {MES[m! - 1]} → {volta.getUTCDate()} {MES[volta.getUTCMonth()]}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '14px', color: '#AEBBE0' }}>
            <span>{viagem.noites} noites · {viagem.noites + 1} dias</span>
            <b style={{ color: 'var(--amarelo)' }}>{faltam > 0 ? `faltam ${faltam} dias` : faltam === 0 ? 'é hoje' : 'em andamento'}</b>
          </div>
        </div>
        <div style={{ marginTop: '12px', display: 'grid', gap: '8px' }}>
          <BotaoPrincipal onClick={() => navegar('/roteiro')}>Ver meu roteiro dia a dia ↗</BotaoPrincipal>
          <BotaoContorno onClick={() => navegar('/montar')}>Mudar datas ou refazer</BotaoContorno>
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: '-0.02em', margin: '20px 0 2px' }}>Seu jeito de viajar</div>
        <div style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)' }}>
          {preferencias ? `Estilo ${NOME_ESTILO[preferencias.estilo]} · ritmo ${{ calm: 'tranquilo', balanced: 'equilibrado', intense: 'intenso' }[preferencias.ritmo]}` : 'Ainda não respondido.'}{' '}
          <button type="button" className="r-btn alvo-toque" onClick={() => navegar('/perfil-viajante')} style={{ color: 'var(--azul)', fontWeight: 600 }}>{preferencias ? 'Alterar' : 'Responder'}</button>
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: '-0.02em', margin: '20px 0 2px' }}>Lugares salvos</div>
        {salvosLugares.length ? (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>{salvosLugares.map((l) => <LinhaLugar key={l.id} l={l} aoAbrir={() => navegar(`/lugar/${l.id}`)} />)}</ul>
        ) : (
          <p style={{ fontSize: '15px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>Toque no ♡ dos lugares em Descobrir para guardar aqui.</p>
        )}
        <div style={{ height: '24px' }} />
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}
