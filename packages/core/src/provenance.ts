/**
 * Procedência: de onde vem cada número exibido ao usuário.
 * Regra do produto: nenhum valor aparece sem procedência, fonte e data.
 *
 * - `quoted`: cotação consultada agora em um parceiro/API.
 * - `reference`: valor de referência coletado de uma fonte, com data de coleta.
 * - `estimate`: estimativa calculada (média, modelo, curadoria).
 * - `simulated`: dado fictício para desenvolvimento/testes. Nunca em produção.
 */
export type Provenance = "quoted" | "reference" | "estimate" | "simulated";

/** Da mais confiável para a menos confiável. */
export const PROVENANCE_RANK: Readonly<Record<Provenance, number>> = {
  quoted: 3,
  reference: 2,
  estimate: 1,
  simulated: 0,
};

export const PROVENANCE_LABEL_PT: Readonly<Record<Provenance, string>> = {
  quoted: "Cotado agora",
  reference: "Referência",
  estimate: "Estimativa",
  simulated: "Simulado",
};

export interface Sourced<T> {
  readonly value: T;
  readonly provenance: Provenance;
  /** Nome legível da fonte (ex.: "Banco Central — PTAX"). */
  readonly source: string;
  /** Data de coleta/consulta, ISO `YYYY-MM-DD`. */
  readonly asOf: string;
  readonly sourceUrl?: string;
}

export function sourced<T>(
  value: T,
  provenance: Provenance,
  source: string,
  asOf: string,
  sourceUrl?: string,
): Sourced<T> {
  return sourceUrl === undefined
    ? { value, provenance, source, asOf }
    : { value, provenance, source, asOf, sourceUrl };
}

/** A procedência de um valor composto é a do seu insumo menos confiável. */
export function weakestProvenance(items: readonly Provenance[]): Provenance {
  if (items.length === 0) return "estimate";
  return items.reduce((weakest, p) =>
    PROVENANCE_RANK[p] < PROVENANCE_RANK[weakest] ? p : weakest,
  );
}

/** Referência de fonte resumida, anexada a cada linha de custo. */
export interface SourceRef {
  readonly label: string;
  readonly provenance: Provenance;
  readonly source: string;
  readonly asOf: string;
  readonly sourceUrl?: string;
}

export function toSourceRef(label: string, s: Sourced<unknown>): SourceRef {
  const base = { label, provenance: s.provenance, source: s.source, asOf: s.asOf };
  return s.sourceUrl === undefined ? base : { ...base, sourceUrl: s.sourceUrl };
}
