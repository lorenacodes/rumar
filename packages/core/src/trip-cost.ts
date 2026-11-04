import { assertInteger, MissingDataError, ValidationError } from "./errors";
import { convertToBrl } from "./fx";
import { add, BRL, money, multiply, sum, type Money } from "./money";
import {
  toSourceRef,
  weakestProvenance,
  type Provenance,
  type SourceRef,
  type Sourced,
} from "./provenance";
import type { Destination, FlightReference, MarketParameters, TravelStyle } from "./types";

export type CostCategory =
  | "flight"
  | "checked_bag"
  | "lodging"
  | "food"
  | "local_transport"
  | "airport_transfer"
  | "activities"
  | "insurance"
  | "entry_fees"
  | "passport"
  | "fx_costs"
  | "contingency";

export const COST_CATEGORY_LABEL_PT: Readonly<Record<CostCategory, string>> = {
  flight: "Passagem aérea",
  checked_bag: "Bagagem despachada",
  lodging: "Hospedagem",
  food: "Alimentação",
  local_transport: "Transporte local",
  airport_transfer: "Aeroporto ↔ hospedagem",
  activities: "Passeios e atrações",
  insurance: "Seguro-viagem",
  entry_fees: "Taxas de entrada",
  passport: "Passaporte",
  fx_costs: "IOF e câmbio",
  contingency: "Reserva para imprevistos",
};

export interface CostLine {
  readonly category: CostCategory;
  readonly amount: Money; // sempre BRL
  readonly provenance: Provenance;
  /** Explicação curta do cálculo, para o usuário. */
  readonly detail: string;
  readonly sources: readonly SourceRef[];
}

export interface TripCostInput {
  readonly destination: Destination;
  readonly flight: FlightReference | undefined;
  readonly params: MarketParameters;
  readonly travelers: number;
  readonly nights: number;
  readonly style: TravelStyle;
  /** Mês de embarque (1–12), para sazonalidade. */
  readonly departureMonth: number;
  /** Padrão: incluída nos estilos intermediário e confortável. */
  readonly includeCheckedBag?: boolean;
  /** Quantos viajantes ainda precisam emitir passaporte. Padrão: 0. */
  readonly travelersNeedingPassport?: number;
  /** Fração da reserva para imprevistos. Padrão: 0,10. */
  readonly contingencyRate?: number;
}

export interface TripCostBreakdown {
  readonly lines: readonly CostLine[];
  readonly subtotal: Money;
  readonly total: Money;
  /** Procedência do insumo menos confiável. */
  readonly provenance: Provenance;
  readonly perPerson: Money;
}

export const DEFAULT_CONTINGENCY_RATE = 0.1;

function validate(input: TripCostInput): void {
  assertInteger("travelers", input.travelers, 1, 9, "Número de viajantes");
  assertInteger("nights", input.nights, 1, 90, "Número de noites");
  assertInteger("departureMonth", input.departureMonth, 1, 12, "Mês de embarque");
  const needing = input.travelersNeedingPassport ?? 0;
  assertInteger("travelersNeedingPassport", needing, 0, input.travelers, "Viajantes sem passaporte");
  const rate = input.contingencyRate ?? DEFAULT_CONTINGENCY_RATE;
  if (!Number.isFinite(rate) || rate < 0 || rate > 0.5) {
    throw new ValidationError("contingencyRate", "A reserva para imprevistos deve ficar entre 0% e 50%.");
  }
}

/**
 * Custo porta a porta de uma viagem: tudo o que a pessoa vai gastar, em BRL,
 * com procedência e fonte de cada linha. Gastos em moeda estrangeira geram uma
 * linha separada de IOF + spread, para que o custo do câmbio fique visível.
 */
export function computeTripCost(input: TripCostInput): TripCostBreakdown {
  validate(input);
  const { destination, params, travelers, nights, style } = input;
  if (!input.flight) {
    throw new MissingDataError(
      "flight",
      `Ainda não temos referência de passagem para ${destination.city} nesse mês.`,
    );
  }
  const profile = destination.costs[style];
  const days = nights + 1;
  const rooms = Math.ceil(travelers / profile.peoplePerRoom);
  const seasonality = destination.lodgingSeasonality?.[input.departureMonth] ?? 1;

  const lines: CostLine[] = [];
  let fxSpread = money(0);
  let fxIof = money(0);
  const fxProvenances: Provenance[] = [];
  let fxSources: readonly SourceRef[] = [];

  /** Adiciona uma linha, convertendo para BRL quando necessário. */
  const addLine = (
    category: CostCategory,
    unit: Sourced<Money>,
    quantity: number,
    detail: string,
    sourceLabel: string,
  ): void => {
    const total = multiply(unit.value, quantity);
    const conversion = convertToBrl(total, params);
    if (conversion.provenances.length > 0) {
      fxSpread = add(fxSpread, conversion.spread);
      fxIof = add(fxIof, conversion.iof);
      fxProvenances.push(...conversion.provenances);
      fxSources = conversion.sources;
    }
    const provenances = [unit.provenance, ...conversion.provenances.slice(0, 1)];
    lines.push({
      category,
      amount: conversion.atReferenceRate,
      provenance: weakestProvenance(provenances),
      detail,
      sources: [toSourceRef(sourceLabel, unit), ...conversion.sources.slice(0, 1)],
    });
  };

  addLine(
    "flight",
    input.flight.roundTripPerPerson,
    travelers,
    `Ida e volta ${input.flight.originIata}–${input.flight.destinationIata} × ${travelers} viajante(s)`,
    "Passagem",
  );

  const includeBag = input.includeCheckedBag ?? style !== "economic";
  if (includeBag) {
    addLine(
      "checked_bag",
      params.checkedBagRoundTripPerPerson,
      travelers,
      `1 mala despachada ida e volta × ${travelers}`,
      "Bagagem",
    );
  }

  const lodgingUnit: Sourced<Money> = {
    ...profile.lodgingPerRoomNight,
    value: multiply(profile.lodgingPerRoomNight.value, seasonality),
  };
  addLine(
    "lodging",
    lodgingUnit,
    rooms * nights,
    `${nights} noite(s) × ${rooms} quarto(s)` +
      (seasonality !== 1 ? ` · ajuste de temporada ×${seasonality}` : ""),
    "Hospedagem",
  );
  addLine("food", profile.foodPerPersonDay, travelers * days, `${days} dia(s) × ${travelers} pessoa(s)`, "Alimentação");
  addLine(
    "local_transport",
    profile.localTransportPerPersonDay,
    travelers * days,
    `${days} dia(s) × ${travelers} pessoa(s)`,
    "Transporte local",
  );
  addLine(
    "airport_transfer",
    profile.airportTransferPerPersonWay,
    travelers * 2,
    `Chegada e partida × ${travelers} pessoa(s)`,
    "Transfer",
  );
  addLine(
    "activities",
    profile.activitiesPerPersonDay,
    travelers * days,
    `${days} dia(s) × ${travelers} pessoa(s)`,
    "Passeios",
  );

  const insurance = params.insurancePerPersonDayByRegion[destination.insuranceRegion];
  if (!insurance) {
    throw new MissingDataError("insurance", `Sem referência de seguro para a região ${destination.insuranceRegion}.`);
  }
  addLine("insurance", insurance, travelers * days, `${days} dia(s) × ${travelers} pessoa(s)`, "Seguro-viagem");

  for (const fee of destination.entryFees) {
    addLine("entry_fees", fee.perPerson, travelers, `${fee.label} × ${travelers}`, fee.label);
  }

  const needingPassport = input.travelersNeedingPassport ?? 0;
  if (needingPassport > 0) {
    addLine("passport", params.passportFee, needingPassport, `Emissão × ${needingPassport} pessoa(s)`, "Taxa do passaporte");
  }

  if (fxProvenances.length > 0) {
    lines.push({
      category: "fx_costs",
      amount: add(fxSpread, fxIof),
      provenance: weakestProvenance(fxProvenances),
      detail: `IOF ${(params.iofRate.value * 100).toLocaleString("pt-BR")}% + spread ${(
        params.cardSpreadRate.value * 100
      ).toLocaleString("pt-BR")}% sobre gastos em moeda estrangeira`,
      sources: fxSources,
    });
  }

  const subtotal = sum(lines.map((l) => l.amount), BRL);
  const contingencyRate = input.contingencyRate ?? DEFAULT_CONTINGENCY_RATE;
  if (contingencyRate > 0) {
    lines.push({
      category: "contingency",
      amount: multiply(subtotal, contingencyRate),
      provenance: "estimate",
      detail: `${Math.round(contingencyRate * 100)}% do subtotal, para imprevistos`,
      sources: [],
    });
  }

  const total = sum(lines.map((l) => l.amount), BRL);
  return {
    lines,
    subtotal,
    total,
    provenance: weakestProvenance(lines.filter((l) => l.category !== "contingency").map((l) => l.provenance)),
    perPerson: money(total.minor / travelers),
  };
}
