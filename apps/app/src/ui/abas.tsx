import { useNavigate } from 'react-router-dom';

import { useDemo } from '../dev/demo';

export type Aba = 'inicio' | 'descobrir' | 'viagem' | 'social' | 'passaporte';

/** Ícones de traço (D-076), desenhados aqui: casa, bússola, mala e pessoa. */
function Icone({ id, ativo }: { id: Aba; ativo: boolean }) {
  const p = { fill: ativo ? 'currentColor' : 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      {id === 'inicio' ? <path {...p} d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" /> : null}
      {id === 'descobrir' ? <><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path {...p} d="m15.5 8.5-2 5-5 2 2-5z" /></> : null}
      {id === 'viagem' ? <><rect {...p} x="4" y="8" width="16" height="11.5" rx="2.5" /><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M9 8V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2" />{ativo ? <path stroke="var(--fundo)" strokeWidth="1.8" d="M4 13h16" /> : <path stroke="currentColor" strokeWidth="1.8" d="M4 13h16" />}</> : null}
      {id === 'passaporte' || id === 'social' ? <><circle {...p} cx="12" cy="8.5" r="3.8" /><path {...p} d="M4.5 20c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6z" /></> : null}
    </svg>
  );
}

/** Desenho original (4 abas): usado só na comparação com o design (/dev/telas). */
const ABAS_DESIGN: { id: Aba; nome: string; rota: string }[] = [
  { id: 'inicio', nome: 'Início', rota: '/inicio' },
  { id: 'descobrir', nome: 'Descobrir', rota: '/descobrir' },
  { id: 'viagem', nome: 'Minha viagem', rota: '/viagens' },
  { id: 'passaporte', nome: 'Perfil', rota: '/perfil' },
];
/**
 * Navegação do app (D-022, revista na D-032): começar (Início), explorar (Descobrir), planejar e
 * acompanhar (Viagens) e eu (Perfil). Amigos ficam dentro do Perfil (Perfil → Amigos).
 */
const ABAS_APP: { id: Aba; nome: string; rota: string }[] = [
  { id: 'inicio', nome: 'Início', rota: '/inicio' },
  { id: 'descobrir', nome: 'Descobrir', rota: '/descobrir' },
  { id: 'viagem', nome: 'Viagens', rota: '/viagens' },
  { id: 'passaporte', nome: 'Perfil', rota: '/pessoa/eu' },
];

/** Barra de abas fixa, 64 px, quatro abas (igual em todas as telas do design). */
export function Abas({ ativa, logoAbaixoDoRodape }: { ativa: Aba; logoAbaixoDoRodape?: boolean }) {
  const navegar = useNavigate();
  const demo = useDemo();
  const ABAS = demo ? ABAS_DESIGN : ABAS_APP;
  return (
    <nav
      aria-label="Abas"
      style={{
        position: 'sticky',
        bottom: '0',
        marginTop: logoAbaixoDoRodape ? '0' : 'auto',
        zIndex: 1,
        height: 'calc(64px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'var(--fundo)',
        borderTop: '1px solid var(--linha)',
        display: 'grid',
        gridTemplateColumns: `repeat(${ABAS.length},1fr)`,
        // 14 px no tamanho do design (390 px); diminui um pouco em telas estreitas para
        // "Minha viagem" caber numa linha só.
        font: "500 clamp(12px, 3.6vw, 14px) 'Open Sans'",
        color: 'var(--texto-sec)',
      }}>
      {ABAS.map((a) => {
        const ativo = a.id === ativa;
        return (
          <button
            key={a.id}
            type="button"
            className="r-btn"
            aria-current={ativo ? 'page' : undefined}
            // Regra 16.6: tocar na aba ativa leva ao topo da tela.
            onClick={(e) => (ativo ? (e.currentTarget.closest('.tela') as HTMLElement | null)?.scrollTo({ top: 0, behavior: 'smooth' }) : navegar(a.rota))}
            style={
              ativo
                ? { display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--texto)', fontWeight: '600', boxShadow: demo ? 'inset 0 3px 0 var(--amarelo)' : 'none', textAlign: 'center', whiteSpace: 'nowrap', minWidth: 0, padding: '0 2px' }
                : { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', whiteSpace: 'nowrap', minWidth: 0, padding: '0 2px' }
            }>
            {demo ? a.nome : (
              // App (D-076): ícone sobre o nome, com a pílula de destaque na aba ativa (padrão Material).
              <span className="aba-conteudo">
                <span className={ativo ? 'aba-indicador ativo' : 'aba-indicador'}><Icone id={a.id} ativo={ativo} /></span>
                <span>{a.nome}</span>
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
