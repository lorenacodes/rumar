import { useNavigate } from 'react-router-dom';

export type Aba = 'inicio' | 'descobrir' | 'viagem' | 'passaporte';

const ABAS: { id: Aba; nome: string; rota: string }[] = [
  { id: 'inicio', nome: 'Início', rota: '/inicio' },
  { id: 'descobrir', nome: 'Descobrir', rota: '/em-breve/descobrir' },
  { id: 'viagem', nome: 'Minha viagem', rota: '/em-breve/minha-viagem' },
  { id: 'passaporte', nome: 'Passaporte', rota: '/perfil' },
];

/** Barra de abas fixa, 64 px, quatro abas (igual em todas as telas do design). */
export function Abas({ ativa }: { ativa: Aba }) {
  const navegar = useNavigate();
  return (
    <nav
      aria-label="Abas"
      style={{
        position: 'absolute',
        left: '0',
        right: '0',
        bottom: '0',
        height: 'calc(64px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'var(--fundo)',
        borderTop: '1px solid var(--linha)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        font: "500 14px 'Open Sans'",
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
            onClick={() => navegar(a.rota)}
            style={
              ativo
                ? { display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--texto)', fontWeight: '600', boxShadow: 'inset 0 3px 0 var(--amarelo)', textAlign: 'center' }
                : { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
            }>
            {a.nome}
          </button>
        );
      })}
    </nav>
  );
}
