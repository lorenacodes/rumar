/** Marca de "feito/escolhido" desenhada em CSS (D-037: nenhum emoji ou símbolo-emoji no app). */
export function Check({ cor = 'currentColor' }: { cor?: string }) {
  return (
    <span aria-hidden="true" style={{ display: 'inline-block', width: '0.32em', height: '0.62em', borderRight: `0.14em solid ${cor}`, borderBottom: `0.14em solid ${cor}`, transform: 'rotate(45deg)', margin: '0 0.35em 0.15em 0.1em', verticalAlign: 'middle' }} />
  );
}
