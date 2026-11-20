import { NOME_COZINHA, ORDEM_COZINHAS, type Cozinha } from '../../lib/comida';
import { NOME_FAIXA, type Faixa } from '../../lib/nivel';

export type Dieta = 'vegetariano' | 'vegano' | 'sem_gluten';
export interface EstadoFiltros { faixa: Faixa | null; gratis: boolean; cozinhas: Cozinha[]; dieta: Dieta[]; bemAvaliados: boolean; min: string; max: string }
export const FILTROS_VAZIOS: EstadoFiltros = { faixa: null, gratis: false, cozinhas: [], dieta: [], bemAvaliados: false, min: '', max: '' };
export const contarFiltros = (f: EstadoFiltros) => (f.faixa ? 1 : 0) + (f.gratis ? 1 : 0) + f.cozinhas.length + f.dieta.length + (f.bemAvaliados ? 1 : 0) + (f.min || f.max ? 1 : 0);
const NOME_DIETA: Record<Dieta, string> = { vegetariano: 'Vegetariano', vegano: 'Vegano', sem_gluten: 'Sem glúten' };

function Chip({ ativo, aoTocar, children }: { ativo: boolean; aoTocar: () => void; children: string }) {
  return (
    <button type="button" className="r-btn" aria-pressed={ativo} onClick={aoTocar}
      style={{ minHeight: '40px', padding: '0 14px', borderRadius: '20px', font: "600 14px 'Open Sans'", ...(ativo ? { background: 'var(--fundo-escuro)', color: '#fff' } : { background: 'var(--fundo)' }) }}>{children}</button>
  );
}
const Titulo = ({ t }: { t: string }) => <div style={{ font: "600 14px 'Open Sans'", marginTop: '14px' }}>{t}</div>;
const linha = { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' } as const;

/** Painel de filtros do Descobrir (D-084): faixa, cozinha, dieta, nota e preço. */
export function PainelFiltros({ f, mudar, comida, moeda, aoFechar, total }: { f: EstadoFiltros; mudar: (f: EstadoFiltros) => void; comida: boolean; moeda: string; aoFechar: () => void; total: number | null }) {
  const alterna = <T,>(lista: T[], x: T) => (lista.includes(x) ? lista.filter((y) => y !== x) : [...lista, x]);
  const campo = { display: 'block', width: '100%', boxSizing: 'border-box' as const, marginTop: '4px', font: "500 16px 'Open Sans'" };
  return (
    // Folha que sobe de baixo (não empurra as recomendações); toque fora ou Esc fecha.
    <div onClick={aoFechar} onKeyDown={(e) => { if (e.key === 'Escape') aoFechar(); }} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
    <section role="dialog" aria-modal="true" aria-label="Filtros" onClick={(e) => e.stopPropagation()}
      style={{ width: '100%', maxWidth: '520px', maxHeight: '78vh', overflowY: 'auto', boxSizing: 'border-box', padding: '8px 20px calc(16px + env(safe-area-inset-bottom))', borderRadius: '20px 20px 0 0', background: 'var(--cartao-2)', boxShadow: '0 -8px 30px rgba(0,0,0,.18)' }}>
      <div aria-hidden="true" style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--linha)', margin: '4px auto 6px' }} />
      <Titulo t="Faixa" />
      <div style={linha}>
        {(['especial', 'em-conta'] as Faixa[]).map((x) => <Chip key={x} ativo={f.faixa === x} aoTocar={() => mudar({ ...f, faixa: f.faixa === x ? null : x })}>{NOME_FAIXA[x]}</Chip>)}
        <Chip ativo={f.gratis} aoTocar={() => mudar({ ...f, gratis: !f.gratis })}>Grátis</Chip>
        <Chip ativo={f.bemAvaliados} aoTocar={() => mudar({ ...f, bemAvaliados: !f.bemAvaliados })}>Nota 4 ou mais</Chip>
      </div>
      {comida ? (
        <>
          <Titulo t="Cozinha" />
          <div style={linha}>{ORDEM_COZINHAS.map((c) => <Chip key={c} ativo={f.cozinhas.includes(c)} aoTocar={() => mudar({ ...f, cozinhas: alterna(f.cozinhas, c) })}>{NOME_COZINHA[c]}</Chip>)}</div>
          <Titulo t="Dieta" />
          <div style={linha}>{(Object.keys(NOME_DIETA) as Dieta[]).map((d) => <Chip key={d} ativo={f.dieta.includes(d)} aoTocar={() => mudar({ ...f, dieta: alterna(f.dieta, d) })}>{NOME_DIETA[d]}</Chip>)}</div>
        </>
      ) : null}
      <Titulo t={`Preço por pessoa (${moeda})`} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <label style={{ flex: 1, fontSize: '12px', color: 'var(--texto-sec)' }}>Mínimo<input inputMode="decimal" className="r-input" value={f.min} onChange={(e) => mudar({ ...f, min: e.target.value.replace(/[^\d,]/g, '') })} style={campo} /></label>
        <label style={{ flex: 1, fontSize: '12px', color: 'var(--texto-sec)' }}>Máximo<input inputMode="decimal" className="r-input" value={f.max} onChange={(e) => mudar({ ...f, max: e.target.value.replace(/[^\d,]/g, '') })} style={campo} /></label>
      </div>
      <p style={{ fontSize: '12px', lineHeight: '17px', color: 'var(--texto-sec)', margin: '8px 0 0' }}>Especial: reconhecido ou com nota alta. Em conta: simples e barato.</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', position: 'sticky', bottom: '-16px', paddingBottom: '4px', background: 'var(--cartao-2)' }}>
        <button type="button" className="r-btn" onClick={() => mudar(FILTROS_VAZIOS)} style={{ flex: 1, minHeight: '48px', borderRadius: '24px', background: 'var(--fundo)', font: "600 15px 'Open Sans'" }}>Limpar</button>
        <button type="button" className="r-btn" onClick={aoFechar} style={{ flex: 2, minHeight: '48px', borderRadius: '24px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>{total === null ? 'Ver resultados' : `Ver ${total} ${total === 1 ? 'resultado' : 'resultados'}`}</button>
      </div>
    </section>
    </div>
  );
}
