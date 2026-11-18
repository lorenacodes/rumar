import { useId, useState, type ReactNode } from 'react';

/**
 * Detalhe que só aparece se a pessoa quiser (D-035): fonte, licença, como foi calculado.
 * Mantém a honestidade sem encher a tela de texto.
 */
export function Info({ rotulo = 'Fonte', children, style }: { rotulo?: string; children: ReactNode; style?: React.CSSProperties }) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  return (
    <span style={{ display: 'block', ...style }}>
      <button type="button" className="r-btn" aria-expanded={aberto} aria-controls={id} onClick={() => setAberto(!aberto)}
        style={{ minHeight: '32px', padding: '0', fontSize: '12px', fontWeight: 600, color: 'var(--texto-sec)', textDecoration: 'underline dotted' }}>
        ⓘ {rotulo}
      </button>
      {aberto ? <span id={id} style={{ display: 'block', fontSize: '12px', lineHeight: '17px', color: 'var(--texto-sec)', marginTop: '2px' }}>{children}</span> : null}
    </span>
  );
}
