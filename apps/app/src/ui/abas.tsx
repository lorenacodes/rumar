import { useNavigate } from 'react-router-dom';

export type Aba = 'inicio' | 'descobrir' | 'viagem' | 'passaporte';

const ABAS: { id: Aba; nome: string; rota: string }[] = [
  { id: 'inicio', nome: 'Início', rota: '/inicio' },
  { id: 'descobrir', nome: 'Descobrir', rota: '/descobrir' },
  { id: 'viagem', nome: 'Minha viagem', rota: '/minha-viagem' },
  // Perfil de verdade (5.13, dados do banco). Sem conta, a 5.13 leva a Entrar/Criar conta.
  { id: 'passaporte', nome: 'Perfil', rota: '/perfil' },
];

/** Barra de abas fixa, 64 px, quatro abas (igual em todas as telas do design). */
export function Abas({ ativa, logoAbaixoDoRodape }: { ativa: Aba; logoAbaixoDoRodape?: boolean }) {
  const navegar = useNavigate();
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
        gridTemplateColumns: 'repeat(4,1fr)',
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
