/** Estrelas desenhadas em SVG (D-047; nada de emoji, D-037). Exibição e escolha de 1 a 5. */
const CAMINHO = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z';

function Estrela({ cheia, tamanho }: { cheia: number; tamanho: number }) {
  const id = `e${Math.round(cheia * 100)}`;
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
      <defs><linearGradient id={id}><stop offset={`${cheia * 100}%`} stopColor="var(--amarelo)" /><stop offset={`${cheia * 100}%`} stopColor="var(--linha)" /></linearGradient></defs>
      <path d={CAMINHO} fill={`url(#${id})`} />
    </svg>
  );
}

export function Estrelas({ nota, tamanho = 16 }: { nota: number; tamanho?: number }) {
  return (
    <span role="img" aria-label={`${String(nota).replace('.', ',')} de 5`} style={{ display: 'inline-flex', gap: '1px', verticalAlign: 'middle' }}>
      {[1, 2, 3, 4, 5].map((i) => <Estrela key={i} tamanho={tamanho} cheia={Math.max(0, Math.min(1, nota - (i - 1)))} />)}
    </span>
  );
}

export function EscolherEstrelas({ valor, aoMudar }: { valor: number; aoMudar: (n: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Nota" style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={valor === n} aria-label={`${n} de 5`} className="r-btn" onClick={() => aoMudar(n)} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Estrela cheia={n <= valor ? 1 : 0} tamanho={32} />
        </button>
      ))}
    </div>
  );
}
