/**
 * DADOS SIMULADOS — APENAS PARA DESENVOLVIMENTO E TESTES.
 *
 * Nenhum valor abaixo é uma cotação ou referência real. Todos estão marcados com
 * procedência `simulated` e aparecem com o selo "Simulado" no app. Os dados reais
 * virão da curadoria (tabelas do Supabase), com fonte e data.
 */
import { fromMajor } from "../money";
import { sourced } from "../provenance";
import type { EntryRequirement } from "../readiness";
import type { Destination, FlightReference, MarketParameters, StyleCostProfile } from "../types";

const AS_OF = "2026-11-04";
const SRC = "Dados simulados (desenvolvimento)";
const sim = <T>(value: T) => sourced(value, "simulated", SRC, AS_OF);

function profile(
  currency: string,
  lodging: number,
  peoplePerRoom: number,
  food: number,
  transport: number,
  activities: number,
  transfer: number,
): StyleCostProfile {
  return {
    lodgingPerRoomNight: sim(fromMajor(lodging, currency)),
    peoplePerRoom,
    foodPerPersonDay: sim(fromMajor(food, currency)),
    localTransportPerPersonDay: sim(fromMajor(transport, currency)),
    activitiesPerPersonDay: sim(fromMajor(activities, currency)),
    airportTransferPerPersonWay: sim(fromMajor(transfer, currency)),
  };
}

export const SIMULATED_PARAMS: MarketParameters = {
  fxRatesToBrl: {
    USD: sim(5.5),
    EUR: sim(6),
  },
  iofRate: sim(0.035),
  cardSpreadRate: sim(0.04),
  insurancePerPersonDayByRegion: {
    south_america: sim(fromMajor(12)),
    europe: sim(fromMajor(18)),
  },
  passportFee: sim(fromMajor(260)),
  checkedBagRoundTripPerPerson: sim(fromMajor(400)),
};

/** Cidade fictícia em moeda USD, para os testes não dependerem de dados reais. */
export const SIM_CITY_A: Destination = {
  id: "sim-a",
  city: "Cidade Simulada A",
  country: "País Simulado",
  countryCode: "XA",
  mainAirportIata: "AAA",
  currency: "USD",
  insuranceRegion: "south_america",
  minNightsSuggested: 4,
  costs: {
    economic: profile("USD", 40, 2, 25, 5, 10, 15),
    intermediate: profile("USD", 90, 2, 45, 10, 25, 30),
    comfort: profile("USD", 180, 2, 80, 25, 50, 50),
  },
  lodgingSeasonality: { 7: 1.3 },
  entryFees: [],
};

export const SIM_CITY_B: Destination = {
  id: "sim-b",
  city: "Cidade Simulada B",
  country: "Outro País Simulado",
  countryCode: "XB",
  mainAirportIata: "BBB",
  currency: "EUR",
  insuranceRegion: "europe",
  minNightsSuggested: 6,
  costs: {
    economic: profile("EUR", 60, 2, 35, 8, 15, 20),
    intermediate: profile("EUR", 120, 2, 60, 12, 30, 40),
    comfort: profile("EUR", 220, 2, 100, 25, 60, 70),
  },
  entryFees: [{ label: "Taxa turística simulada", perPerson: sim(fromMajor(10, "EUR")) }],
};

export const SIM_DESTINATIONS: readonly Destination[] = [SIM_CITY_A, SIM_CITY_B];

export const SIM_FLIGHTS: readonly FlightReference[] = [
  ...Array.from({ length: 12 }, (_, i) => ({
    originIata: "GRU",
    destinationIata: "AAA",
    month: i + 1,
    roundTripPerPerson: sim(fromMajor(i + 1 === 7 ? 2600 : 1800)),
  })),
  // Cidade B sem referência em dezembro, para testar "sem dados".
  ...Array.from({ length: 11 }, (_, i) => ({
    originIata: "GRU",
    destinationIata: "BBB",
    month: i + 1,
    roundTripPerPerson: sim(fromMajor(4500)),
  })),
];

export const SIM_REQUIREMENTS: readonly EntryRequirement[] = [
  {
    id: "xa-passport",
    countryCode: "XA",
    kind: "passport",
    title: "Passaporte válido",
    description: "Passaporte válido durante toda a viagem (regra simulada).",
    mandatory: true,
    leadTimeDays: 30,
    passportMinValidityMonthsAfterReturn: 0,
    sourceName: SRC,
    sourceUrl: "https://example.org/simulado",
    verifiedAt: AS_OF,
  },
  {
    id: "xb-passport",
    countryCode: "XB",
    kind: "passport",
    title: "Passaporte válido",
    description: "Passaporte com validade mínima após a data de retorno (regra simulada).",
    mandatory: true,
    leadTimeDays: 30,
    passportMinValidityMonthsAfterReturn: 3,
    sourceName: SRC,
    sourceUrl: "https://example.org/simulado",
    verifiedAt: AS_OF,
  },
  {
    id: "xb-insurance",
    countryCode: "XB",
    kind: "insurance",
    title: "Seguro-viagem obrigatório",
    description: "Cobertura mínima exigida (regra simulada).",
    mandatory: true,
    leadTimeDays: 7,
    sourceName: SRC,
    sourceUrl: "https://example.org/simulado",
    verifiedAt: AS_OF,
  },
];
