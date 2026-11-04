import { addMonths, diffMonths, type YearMonth } from "./dates";
import { MissingDataError } from "./errors";
import { availableBy, validateSavingsPlan, type SavingsPlan } from "./goal";
import { money, type Money } from "./money";
import type { Provenance } from "./provenance";
import { computeTripCost, type TripCostBreakdown } from "./trip-cost";
import type { Destination, FlightReference, MarketParameters, TravelStyle } from "./types";

export type ViabilityStatus =
  /** O dinheiro guardado até o mês cobre o custo total. */
  | "viable"
  /** Falta pouco (até `TIGHT_MARGIN` do custo). */
  | "tight"
  /** Ainda não dá com o ritmo de poupança atual. */
  | "not_yet"
  /** Não há tempo para os documentos obrigatórios (ex.: emitir passaporte). */
  | "too_soon"
  /** Falta dado para calcular (ex.: sem referência de passagem nesse mês). */
  | "no_data";

/** Considera "apertado" quando falta até 10% do custo total. */
export const TIGHT_MARGIN = 0.1;

export interface ViabilityCell {
  readonly destinationId: string;
  readonly month: YearMonth;
  readonly status: ViabilityStatus;
  readonly cost: TripCostBreakdown | null;
  readonly available: Money;
  /** available − total (negativo = falta). `null` sem dados. */
  readonly slack: Money | null;
  readonly provenance: Provenance | null;
}

export interface ViabilityInput {
  readonly destinations: readonly Destination[];
  readonly flights: readonly FlightReference[];
  readonly params: MarketParameters;
  readonly originIata: string;
  readonly travelers: number;
  readonly nights: number;
  readonly style: TravelStyle;
  readonly savings: SavingsPlan;
  /** Quantos meses à frente avaliar (inclui o mês seguinte ao atual). Padrão: 18. */
  readonly horizonMonths?: number;
  readonly travelersNeedingPassport?: number;
  /**
   * Antecedência mínima (em meses) exigida pela preparação documental, por destino.
   * Ex.: emitir passaporte. Meses antes disso ficam como "too_soon".
   */
  readonly minLeadMonthsByDestination?: Readonly<Record<string, number>>;
}

export interface DestinationViability {
  readonly destination: Destination;
  readonly cells: readonly ViabilityCell[];
  /** Primeiro mês viável no horizonte, se houver. */
  readonly firstViable: ViabilityCell | null;
  /** Mês com maior folga entre os viáveis, se houver. */
  readonly bestViable: ViabilityCell | null;
  /** Mês com menor custo total no horizonte (viável ou não). */
  readonly cheapest: ViabilityCell | null;
}

export const DEFAULT_HORIZON_MONTHS = 18;

function findFlight(
  flights: readonly FlightReference[],
  origin: string,
  destination: string,
  month: number,
): FlightReference | undefined {
  return flights.find(
    (f) => f.originIata === origin && f.destinationIata === destination && f.month === month,
  );
}

/**
 * Calendário de viabilidade: para cada destino e mês, compara o custo porta a porta
 * com o que a pessoa terá guardado até lá. Responde "para onde" e "quando".
 */
export function computeViabilityCalendar(input: ViabilityInput): DestinationViability[] {
  validateSavingsPlan(input.savings);
  const horizon = input.horizonMonths ?? DEFAULT_HORIZON_MONTHS;

  return input.destinations.map((destination) => {
    const minLead = input.minLeadMonthsByDestination?.[destination.id] ?? 0;
    const cells: ViabilityCell[] = [];

    for (let offset = 1; offset <= horizon; offset++) {
      const month = addMonths(input.savings.asOf, offset);
      const available = availableBy(input.savings, month);
      const flight = findFlight(input.flights, input.originIata, destination.mainAirportIata, month.month);

      let cost: TripCostBreakdown | null = null;
      try {
        cost = computeTripCost({
          destination,
          flight,
          params: input.params,
          travelers: input.travelers,
          nights: input.nights,
          style: input.style,
          departureMonth: month.month,
          ...(input.travelersNeedingPassport === undefined
            ? {}
            : { travelersNeedingPassport: input.travelersNeedingPassport }),
        });
      } catch (error) {
        if (!(error instanceof MissingDataError)) throw error;
      }

      if (!cost) {
        cells.push({ destinationId: destination.id, month, status: "no_data", cost: null, available, slack: null, provenance: null });
        continue;
      }

      const slack = money(available.minor - cost.total.minor);
      let status: ViabilityStatus;
      if (diffMonths(input.savings.asOf, month) < minLead) status = "too_soon";
      else if (slack.minor >= 0) status = "viable";
      else if (-slack.minor <= cost.total.minor * TIGHT_MARGIN) status = "tight";
      else status = "not_yet";

      cells.push({ destinationId: destination.id, month, status, cost, available, slack, provenance: cost.provenance });
    }

    const viable = cells.filter((c) => c.status === "viable");
    const withCost = cells.filter((c) => c.cost !== null);
    return {
      destination,
      cells,
      firstViable: viable[0] ?? null,
      bestViable: viable.reduce<ViabilityCell | null>(
        (best, c) => (best === null || (c.slack?.minor ?? 0) > (best.slack?.minor ?? 0) ? c : best),
        null,
      ),
      cheapest: withCost.reduce<ViabilityCell | null>(
        (best, c) => (best === null || c.cost!.total.minor < best.cost!.total.minor ? c : best),
        null,
      ),
    };
  });
}

/**
 * Ordena destinos para exibição: primeiro os que ficam viáveis mais cedo; depois os
 * mais baratos. Destinos sem nenhum mês calculável vão para o fim.
 */
export function rankDestinations(results: readonly DestinationViability[]): DestinationViability[] {
  const key = (r: DestinationViability): [number, number] => {
    const first = r.firstViable;
    const firstIndex = first ? r.cells.indexOf(first) : Number.POSITIVE_INFINITY;
    const cheapest = r.cheapest?.cost?.total.minor ?? Number.POSITIVE_INFINITY;
    return [firstIndex, cheapest];
  };
  return [...results].sort((a, b) => {
    const [fa, ca] = key(a);
    const [fb, cb] = key(b);
    return fa !== fb ? fa - fb : ca - cb;
  });
}
