/**
 * Divisão dos gastos do grupo (D-065): quem pagou, entre quem dividir e quem deve a quem.
 * Tudo em centavos inteiros na moeda de referência da viagem; o resto da divisão (1 centavo) vai, em ordem
 * fixa, para os primeiros da lista, para a soma fechar exata. Transferências: o mínimo de pagamentos
 * (quem mais deve paga para quem mais tem a receber).
 */
export interface GastoDividido { valor: number; pagoPor: string; entre: string[] }
export interface Transferencia { de: string; para: string; valor: number }

export function saldos(gastos: GastoDividido[], pessoas: string[]): Map<string, number> {
  const s = new Map(pessoas.map((p) => [p, 0]));
  for (const g of gastos) {
    const entre = g.entre.filter((p) => s.has(p));
    if (!entre.length || !s.has(g.pagoPor) || g.valor <= 0) continue;
    const parte = Math.floor(g.valor / entre.length);
    let resto = g.valor - parte * entre.length;
    s.set(g.pagoPor, s.get(g.pagoPor)! + g.valor);
    for (const p of [...entre].sort()) {
      const extra = resto > 0 ? 1 : 0;
      resto -= extra;
      s.set(p, s.get(p)! - parte - extra);
    }
  }
  return s;
}

export function quemDeveAQuem(gastos: GastoDividido[], pessoas: string[]): Transferencia[] {
  const s = saldos(gastos, pessoas);
  const devedores = [...s].filter(([, v]) => v < 0).map(([p, v]) => ({ p, v: -v })).sort((a, b) => b.v - a.v || a.p.localeCompare(b.p));
  const credores = [...s].filter(([, v]) => v > 0).map(([p, v]) => ({ p, v })).sort((a, b) => b.v - a.v || a.p.localeCompare(b.p));
  const t: Transferencia[] = [];
  let i = 0;
  let j = 0;
  while (i < devedores.length && j < credores.length) {
    const v = Math.min(devedores[i]!.v, credores[j]!.v);
    if (v > 0) t.push({ de: devedores[i]!.p, para: credores[j]!.p, valor: v });
    devedores[i]!.v -= v;
    credores[j]!.v -= v;
    if (devedores[i]!.v === 0) i++;
    if (credores[j]!.v === 0) j++;
  }
  return t;
}
