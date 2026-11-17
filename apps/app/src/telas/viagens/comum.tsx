import type { CSSProperties, ReactNode } from 'react';

export const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export function periodo(dataIda: string, noites: number): string {
  const [a, m, d] = dataIda.split('-').map(Number);
  const fim = new Date(Date.UTC(a!, m! - 1, d! + noites));
  return `${d} ${MES[m! - 1]} → ${fim.getUTCDate()} ${MES[fim.getUTCMonth()]}`;
}
export function dataMais(dataIda: string, dias: number): string {
  const [a, m, d] = dataIda.split('-').map(Number);
  return new Date(Date.UTC(a!, m! - 1, d! + dias)).toISOString().slice(0, 10);
}
export const reais = (centavos: number) => (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
export const euros = (centavos: number) => (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'EUR', maximumFractionDigits: centavos % 100 ? 2 : 0 });

export const SELO: Record<string, string> = { cotado: '◉ Cotado', referencia: '▤ Referência', estimativa: '≈ Estimativa', informado: '✎ Informado por você' };

export function Selo({ tipo }: { tipo: string }) {
  return <span style={{ font: "600 12px 'Open Sans'", border: '1px solid currentColor', padding: '0 5px', whiteSpace: 'nowrap', color: tipo === 'cotado' ? 'var(--verde)' : 'var(--texto-sec)' }}>{SELO[tipo] ?? tipo}</span>;
}

export const Rotulo = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--texto-sec)', margin: '18px 0 6px', ...style }}>{children}</div>
);

export function Segmentos<T extends string>({ opcoes, valor, aoMudar, rotulo }: { opcoes: { id: T; nome: string }[]; valor: T; aoMudar: (v: T) => void; rotulo: string }) {
  return (
    <div role="tablist" aria-label={rotulo} style={{ display: 'flex', gap: '6px', overflowX: 'auto', margin: '0 -20px', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
      {opcoes.map((o) => {
        const ativo = o.id === valor;
        return (
          <button key={o.id} type="button" role="tab" aria-selected={ativo} className="r-btn" onClick={() => aoMudar(o.id)}
            style={{ flex: 'none', height: '44px', padding: '0 14px', boxSizing: 'border-box', whiteSpace: 'nowrap', font: `${ativo ? 600 : 500} 14px 'Open Sans'`, ...(ativo ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>
            {o.nome}
          </button>
        );
      })}
    </div>
  );
}

export const botaoTexto: CSSProperties = { minHeight: '44px', color: 'var(--azul)', fontWeight: 600, fontSize: '15px' };
export const campo: CSSProperties = { display: 'block', width: '100%', boxSizing: 'border-box', borderBottom: '2px solid var(--texto)', padding: '8px 0', font: "500 18px 'Open Sans'", color: 'var(--texto)', background: 'transparent' };
