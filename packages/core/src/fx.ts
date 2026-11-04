import { BRL, money, type Money } from "./money";
import type { MarketParameters } from "./types";
import type { Provenance, SourceRef } from "./provenance";
import { toSourceRef } from "./provenance";

export interface BrlConversion {
  /** Valor convertido pela taxa de referência, sem custos. */
  readonly atReferenceRate: Money;
  /** Custo do spread do meio de pagamento. */
  readonly spread: Money;
  /** IOF sobre o valor convertido com spread. */
  readonly iof: Money;
  readonly provenances: readonly Provenance[];
  readonly sources: readonly SourceRef[];
}

/**
 * Converte um gasto em moeda estrangeira para BRL, separando o custo de câmbio
 * (spread) e o IOF, para que apareçam explicitamente ao usuário.
 * Valores já em BRL passam sem custos.
 */
export function convertToBrl(value: Money, params: MarketParameters): BrlConversion {
  if (value.currency === BRL) {
    return { atReferenceRate: value, spread: money(0), iof: money(0), provenances: [], sources: [] };
  }
  const rate = params.fxRatesToBrl[value.currency];
  if (!rate) {
    throw new RangeError(`Sem taxa de câmbio para ${value.currency}`);
  }
  const atReference = value.minor * rate.value;
  const spread = atReference * params.cardSpreadRate.value;
  const iof = (atReference + spread) * params.iofRate.value;
  return {
    atReferenceRate: money(atReference),
    spread: money(spread),
    iof: money(iof),
    provenances: [rate.provenance, params.cardSpreadRate.provenance, params.iofRate.provenance],
    sources: [
      toSourceRef(`Câmbio ${value.currency}`, rate),
      toSourceRef("Spread do cartão", params.cardSpreadRate),
      toSourceRef("IOF", params.iofRate),
    ],
  };
}
