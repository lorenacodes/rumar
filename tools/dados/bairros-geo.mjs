/**
 * Ponto dentro de um contorno, pela regra par-ímpar sobre todos os segmentos.
 * `linhas`: as vias que formam os anéis (as do OSM já repetem o primeiro ponto no fim quando fecham);
 * por isso só se usam pontos consecutivos, sem "fechar" cada via sozinha. Anéis internos viram buracos.
 */
export function pontoNoContorno([x, y], linhas) {
  let dentro = false;
  for (const g of linhas) {
    for (let i = 1; i < g.length; i++) {
      const [xi, yi] = g[i]; const [xj, yj] = g[i - 1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
    }
  }
  return dentro;
}
