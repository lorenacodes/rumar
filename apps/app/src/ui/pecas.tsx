/**
 * Peças repetidas nas telas, com as medidas exatas do design.
 * Visual copiado do Fluxo Unificado; aqui só entra semântica e comportamento.
 */
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export function Voltar({ para, rotulo = 'Voltar' }: { para?: string; rotulo?: string }) {
  const navegar = useNavigate();
  return (
    <button
      type="button"
      className="r-btn"
      aria-label={rotulo}
      onClick={() => (para ? navegar(para) : navegar(-1))}
      style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', fontSize: '24px', marginLeft: '-4px' }}>
      ←
    </button>
  );
}

/** Voltar com texto ao lado ("← Guardar o plano", "← Meu perfil"). */
export function VoltarComTexto({ texto, para }: { texto: string; para?: string }) {
  const navegar = useNavigate();
  return (
    <button
      type="button"
      className="r-btn"
      onClick={() => (para ? navegar(para) : navegar(-1))}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '48px', font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>
      <span style={{ fontSize: '22px' }}>←</span>
      {texto}
    </button>
  );
}

export function Rodape({ children, padding = '10px 20px 22px', style }: { children: ReactNode; padding?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '0',
        right: '0',
        bottom: '0px',
        padding,
        borderTop: '1px solid var(--linha)',
        background: 'var(--fundo)',
        ...style,
      }}>
      {children}
    </div>
  );
}

export function BotaoPrincipal({
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      className="r-btn"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: '100%',
        height: '56px',
        background: 'var(--amarelo)',
        color: 'var(--botao-principal-texto)',
        font: "600 17px 'Open Sans'",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}>
      {children}
    </button>
  );
}

/** Botão de texto cinza abaixo do principal ("Agora não", "Corrigir a data"). */
export function BotaoTexto({ children, onClick, marginTop }: { children: ReactNode; onClick?: () => void; marginTop?: string }) {
  return (
    <button
      type="button"
      className="r-btn"
      onClick={onClick}
      style={{
        width: '100%',
        height: '40px',
        marginTop,
        font: "600 15px 'Open Sans'",
        color: 'var(--texto-sec)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </button>
  );
}

/** Botão secundário de contorno, 52 px. */
export function BotaoContorno({ children, onClick, style }: { children: ReactNode; onClick?: () => void; style?: CSSProperties }) {
  return (
    <button
      type="button"
      className="r-btn"
      onClick={onClick}
      style={{
        width: '100%',
        height: '52px',
        border: '2px solid var(--texto)',
        font: "600 16px 'Open Sans'",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}>
      {children}
    </button>
  );
}

/** Link azul em linha ("Esqueci a senha"). */
export function LinkAzul({ children, onClick, style }: { children: ReactNode; onClick?: () => void; style?: CSSProperties }) {
  return (
    <button type="button" className="r-btn" onClick={onClick} style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', ...style }}>
      {children}
    </button>
  );
}

const rotuloStyle: CSSProperties = { display: 'block', font: "600 15px 'Open Sans'", color: 'var(--texto-sec)', marginTop: '14px' };

/**
 * Campo do design: rótulo + linha de 2 px embaixo. A linha fica marinho quando o
 * campo tem valor ou foco, e cinza quando está vazio (como no design).
 */
export function Campo({
  id,
  rotulo,
  valor,
  aoMudar,
  erro,
  rotuloStyle: rotuloExtra,
  ...input
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  erro?: boolean;
  rotuloStyle?: CSSProperties;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange'>) {
  const vazio = valor.length === 0;
  return (
    <>
      <label htmlFor={id} style={{ ...rotuloStyle, ...rotuloExtra }}>
        {rotulo}
      </label>
      <input
        id={id}
        className="r-input campo-design"
        value={valor}
        aria-invalid={erro || undefined}
        onChange={(e) => aoMudar(e.target.value)}
        style={{
          display: 'block',
          borderBottom: `2px solid ${erro ? 'var(--vermelho)' : vazio ? 'var(--linha)' : 'var(--texto)'}`,
          padding: '8px 0',
          font: `${vazio ? 400 : 500} 19px 'Open Sans'`,
          color: 'var(--texto)',
        }}
        {...input}
      />
    </>
  );
}

/** Caixa de seleção quadrada de 24 px com texto (termos, privacidade). */
export function Caixa({ marcada, aoMudar, children }: { marcada: boolean; aoMudar: (v: boolean) => void; children: ReactNode }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '44px', cursor: 'pointer' }}>
      <input type="checkbox" checked={marcada} onChange={(e) => aoMudar(e.target.checked)} className="visualmente-oculto" />
      <span
        aria-hidden
        style={{
          width: '24px',
          height: '24px',
          border: '2px solid var(--texto)',
          boxSizing: 'border-box',
          flex: 'none',
          background: marcada ? 'var(--fundo-escuro)' : undefined,
          color: 'var(--sobre-escuro)',
          font: "600 14px/20px 'Open Sans'",
          textAlign: 'center',
        }}>
        {marcada ? '✓' : ''}
      </span>
      <span style={{ fontSize: '15px', lineHeight: '20px' }}>{children}</span>
    </label>
  );
}

/** Mensagem de erro ou aviso logo abaixo de um campo. */
export function Aviso({ children, cor = 'var(--vermelho)' }: { children: ReactNode; cor?: string }) {
  return (
    <div role="alert" style={{ fontSize: '14px', lineHeight: '20px', color: cor, marginTop: '8px' }}>
      {children}
    </div>
  );
}
