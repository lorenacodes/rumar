import { useState } from 'react';

/** "Quero ir" como coração: vazio, ou amarelo com um pulo quando a pessoa marca. */
export function CoracaoQueroIr({ marcado, aoTocar, nome, tamanho = 44, sobreFoto = false }: { marcado: boolean; aoTocar: () => void; nome: string; tamanho?: number; sobreFoto?: boolean }) {
  const [pulo, setPulo] = useState(0);
  return (
    <button type="button" className="r-btn coracao-quero" aria-pressed={marcado} aria-label={marcado ? `Tirar ${nome} do Quero ir` : `Quero ir: ${nome}`}
      onClick={(e) => { e.stopPropagation(); if (!marcado) setPulo((n) => n + 1); aoTocar(); }}
      style={{ width: `${tamanho}px`, height: `${tamanho}px`, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: sobreFoto ? 'rgba(11,31,75,.45)' : 'transparent' }}>
      <svg key={pulo} className={pulo ? 'coracao-pulo' : undefined} width={Math.round(tamanho * 0.55)} height={Math.round(tamanho * 0.55)} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
          fill={marcado ? 'var(--amarelo)' : 'none'} stroke={marcado ? 'var(--amarelo)' : sobreFoto ? '#fff' : 'var(--texto-sec)'} strokeWidth="1.9" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
