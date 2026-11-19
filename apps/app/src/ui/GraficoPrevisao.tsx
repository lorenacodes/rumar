import { useRef, useState } from 'react';

import { dinheiro } from '../lib/moedas';
import { mesAno, type Previsao } from '../lib/previsao';

/**
 * Gráfico "quando você junta o dinheiro" (D-077): uma linha (o que terá guardado, mês a mês), a meta
 * tracejada e a data da viagem. Toque/arraste mostra o valor de cada mês. Tabela escondida para leitor de tela.
 */
export function GraficoPrevisao({ p, meta, moeda, dataViagem }: { p: Previsao; meta: number; moeda: string; dataViagem: string }) {
  const L = 340; const A = 170; const esq = 8; const dir = 8; const topo = 26; const base = 30;
  const n = Math.max(1, p.pontos.length - 1);
  const x = (m: number) => esq + (m / n) * (L - esq - dir);
  const y = (v: number) => topo + (1 - v / Math.max(1, meta)) * (A - topo - base);
  const caminho = p.pontos.map((pt, i) => `${i ? 'L' : 'M'}${x(pt.mes).toFixed(1)},${y(pt.valor).toFixed(1)}`).join(' ');
  const area = `${caminho} L${x(n).toFixed(1)},${y(0)} L${x(0)},${y(0)} Z`;
  const svg = useRef<SVGSVGElement>(null);
  const [sel, setSel] = useState<number | null>(null);
  const mover = (e: React.PointerEvent) => {
    const r = svg.current?.getBoundingClientRect(); if (!r) return;
    const px = ((e.clientX - r.left) / r.width) * L;
    setSel(Math.max(0, Math.min(n, Math.round(((px - esq) / (L - esq - dir)) * n))));
  };
  // Posição exata da viagem (meses com fração), para não arredondar a data.
  const mesesFrac = (Date.parse(`${dataViagem}T12:00:00Z`) - Date.parse(`${p.pontos[0]!.data}T12:00:00Z`)) / (30.44 * 86_400_000);
  const viagemX = mesesFrac >= 0 && mesesFrac <= n ? x(mesesFrac) : null;
  const ponto = sel !== null ? p.pontos[sel] : null;
  const f = (v: number) => dinheiro(v, moeda, 0);
  const resumo = p.mesesAteMeta === 0 ? 'Você já tem o valor da viagem.'
    : p.dataMeta ? `Você junta ${f(meta)} em ${mesAno(p.dataMeta)}.` : 'Informe quanto guarda por mês para ver a previsão.';

  return (
    <figure style={{ margin: '10px 0 0' }}>
      <svg ref={svg} viewBox={`0 0 ${L} ${A}`} width="100%" role="img" aria-label={`${resumo} Viagem em ${mesAno(dataViagem)}.`}
        onPointerMove={mover} onPointerDown={mover} onPointerLeave={() => setSel(null)} style={{ display: 'block', touchAction: 'pan-y', overflow: 'visible' }}>
        {/* meta */}
        <line x1={esq} x2={L - dir} y1={y(meta)} y2={y(meta)} stroke="var(--texto-sec)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={esq} y={y(meta) - 7} fontSize="11" fill="var(--texto-sec)" fontFamily="Open Sans">Meta {f(meta)}</text>
        {/* base */}
        <line x1={esq} x2={L - dir} y1={y(0)} y2={y(0)} stroke="var(--linha)" strokeWidth="1" />
        {/* guardado */}
        <path d={area} fill="var(--azul)" opacity="0.12" />
        <path d={caminho} fill="none" stroke="var(--azul)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* viagem */}
        {viagemX !== null ? (
          <g>
            <line x1={viagemX} x2={viagemX} y1={topo - 4} y2={y(0)} stroke="var(--amarelo)" strokeWidth="2.5" />
            <text x={viagemX} y={A - 4} fontSize="11" fontWeight="600" fill="var(--texto)" fontFamily="Open Sans" textAnchor={viagemX > L * 0.75 ? 'end' : viagemX < L * 0.25 ? 'start' : 'middle'}>Viagem · {mesAno(dataViagem)}</text>
          </g>
        ) : null}
        {/* quando junta */}
        {p.mesesAteMeta !== null && p.mesesAteMeta > 0 && p.mesesAteMeta <= n ? (
          <circle cx={x(p.mesesAteMeta)} cy={y(meta)} r="5" fill="var(--azul)" stroke="var(--fundo)" strokeWidth="2" />
        ) : null}
        <text x={esq} y={A - 16} fontSize="10" fill="var(--texto-sec)" fontFamily="Open Sans">Hoje</text>
        {/* toque */}
        {ponto ? (
          <g>
            <line x1={x(ponto.mes)} x2={x(ponto.mes)} y1={topo - 4} y2={y(0)} stroke="var(--texto)" strokeWidth="1" opacity="0.4" />
            <circle cx={x(ponto.mes)} cy={y(ponto.valor)} r="5" fill="var(--azul)" stroke="var(--fundo)" strokeWidth="2" />
            <g transform={`translate(${Math.min(L - 120, Math.max(0, x(ponto.mes) - 60))}, 0)`}>
              <rect width="120" height="22" rx="11" fill="var(--fundo-escuro)" />
              <text x="60" y="15" fontSize="11" fontWeight="600" fill="#fff" fontFamily="Open Sans" textAnchor="middle">{mesAno(ponto.data)} · {f(ponto.valor)}</text>
            </g>
          </g>
        ) : null}
      </svg>
      <table className="visualmente-oculto">
        <caption>Quanto terá guardado por mês</caption>
        <tbody>{p.pontos.map((pt) => <tr key={pt.mes}><td>{mesAno(pt.data)}</td><td>{f(pt.valor)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
