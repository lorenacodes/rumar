/** Textos recorrentes do design (marca, rótulo azul, título, parágrafo, nota). */
import type { CSSProperties, ReactNode } from 'react';

export function Marca({ marginTop = '2px' }: { marginTop?: string }) {
  return <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop }}>rumar</div>;
}

export function RotuloAzul({ children, marginTop = '2px' }: { children: ReactNode; marginTop?: string }) {
  return <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop }}>{children}</div>;
}

export function Titulo({ children, marginTop, style }: { children: ReactNode; marginTop: string; style?: CSSProperties }) {
  return <h1 style={{ margin: 0, font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop, ...style }}>{children}</h1>;
}

export function Paragrafo({ children, tamanho = 16, marginTop = '10px' }: { children: ReactNode; tamanho?: 15 | 16; marginTop?: string }) {
  return (
    <p style={{ margin: 0, fontSize: `${tamanho}px`, lineHeight: tamanho === 16 ? '24px' : '22px', color: 'var(--texto-sec)', marginTop }}>
      {children}
    </p>
  );
}

export function Nota({ children, marginTop = '16px', padding = '10px 14px' }: { children: ReactNode; marginTop?: string; padding?: string }) {
  return <div style={{ marginTop, background: 'var(--cartao-1)', padding, fontSize: '14px', lineHeight: '20px' }}>{children}</div>;
}

export function CartaoApoio({ titulo, children, marginTop = '16px' }: { titulo: string; children: ReactNode; marginTop?: string }) {
  return (
    <div style={{ marginTop, background: 'var(--cartao-2)', padding: '12px 14px' }}>
      <div style={{ font: "600 15px 'Open Sans'" }}>{titulo}</div>
      <div style={{ fontSize: '14px', lineHeight: '21px', color: 'var(--texto-sec)', marginTop: '4px' }}>{children}</div>
    </div>
  );
}

export function Conteudo({ children, padding = '22px 20px 0', style }: { children: ReactNode; padding?: string; style?: CSSProperties }) {
  return <div style={{ padding, ...style }}>{children}</div>;
}
