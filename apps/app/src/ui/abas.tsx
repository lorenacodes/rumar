import { useNavigate } from 'react-router-dom';

import { useDemo } from '../dev/demo';

export type Aba = 'inicio' | 'descobrir' | 'viagem' | 'social' | 'passaporte';

/** Desenho original (4 abas): usado só na comparação com o design (/dev/telas). */
const ABAS_DESIGN: { id: Aba; nome: string; rota: string }[] = [
  { id: 'inicio', nome: 'Início', rota: '/inicio' },
  { id: 'descobrir', nome: 'Descobrir', rota: '/descobrir' },
  { id: 'viagem', nome: 'Minha viagem', rota: '/viagens' },
  { id: 'passaporte', nome: 'Perfil', rota: '/perfil' },
];
/**
 * Navegação do app (D-022): a jornada de quem viaja em 5 lugares claros — começar (Início),
 * explorar (Descobrir), planejar e acompanhar (Viagens), viajar junto (Social) e eu (Perfil).
 */
const ABAS_APP: { id: Aba; nome: string; rota: string }[] = [
  { id: 'inicio', nome: 'Início', rota: '/inicio' },
  { id: 'descobrir', nome: 'Descobrir', rota: '/descobrir' },
  { id: 'viagem', nome: 'Viagens', rota: '/viagens' },
  { id: 'social', nome: 'Social', rota: '/social' },
  { id: 'passaporte', nome: 'Perfil', rota: '/perfil' },
];

/** Barra de abas fixa, 64 px, quatro abas (igual em todas as telas do design). */
export function Abas({ ativa, logoAbaixoDoRodape }: { ativa: Aba; logoAbaixoDoRodape?: boolean }) {
  const navegar = useNavigate();
  const ABAS = useDemo() ? ABAS_DESIGN : ABAS_APP;
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
                ? { display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--texto)', fontWeight: '600', boxShadow: 'inset 0 3px 0 var(--amarelo)', textAlign: 'center', whiteSpace: 'nowrap', minWidth: 0, padding: '0 2px' }
                : { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', whiteSpace: 'nowrap', minWidth: 0, padding: '0 2px' }
            }>
            {a.nome}
          </button>
        );
      })}
    </nav>
  );
}
