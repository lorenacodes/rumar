/**
 * DADOS SIMULADOS — APENAS PARA DESENVOLVIMENTO E TESTES.
 *
 * Nenhum valor abaixo é uma cotação ou referência real. Todos estão marcados com
 * procedência `simulated` e aparecem com o selo "Simulado" no app. Os dados reais
 * virão da curadoria (tabelas do Supabase), com fonte e data.
 */
import { fromMajor } from "../money";
import { sourced } from "../provenance";
import type { Place } from "../itinerary";
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

// ---------------------------------------------------------------------------
// Lugares simulados (nomes fictícios) para testar o roteiro personalizado.
// ---------------------------------------------------------------------------

function place(p: Omit<Place, "provenance" | "sourceName" | "verifiedAt">): Place {
  return { ...p, provenance: "simulated", sourceName: SRC, verifiedAt: AS_OF };
}

export const SIM_PLACES: readonly Place[] = [
  place({ id: "a-centro-historico", destinationId: "sim-a", name: "Centro Histórico (simulado)", description: "Praças, igrejas e casarões para caminhar sem pressa.", area: "Centro", tags: ["history_culture", "photography"], slots: ["morning", "afternoon"], energy: 2, walking: "high", stepFree: false, costLevel: 0 }),
  place({ id: "a-museu", destinationId: "sim-a", name: "Museu da Cidade (simulado)", description: "Arte e história local em um prédio antigo.", area: "Centro", tags: ["museums_art", "history_culture"], slots: ["morning", "afternoon"], energy: 1, walking: "low", stepFree: true, costLevel: 1 }),
  place({ id: "a-mercado", destinationId: "sim-a", name: "Mercado Municipal (simulado)", description: "Barracas de comida, frutas e artesanato.", area: "Centro", tags: ["local_markets", "food_drink"], slots: ["morning", "afternoon"], energy: 2, walking: "medium", stepFree: true, costLevel: 1 }),
  place({ id: "a-parque", destinationId: "sim-a", name: "Parque à Beira do Rio (simulado)", description: "Gramado, bancos à sombra e pôr do sol.", area: "Orla", tags: ["nature_outdoors", "wellness", "photography"], slots: ["morning", "afternoon", "evening"], energy: 1, walking: "medium", stepFree: true, costLevel: 0 }),
  place({ id: "a-mirante", destinationId: "sim-a", name: "Mirante do Morro (simulado)", description: "Subida íngreme com vista da cidade inteira.", area: "Morro", tags: ["adventure", "photography", "nature_outdoors"], slots: ["morning", "evening"], energy: 3, walking: "high", stepFree: false, costLevel: 0 }),
  place({ id: "a-bairro-boemio", destinationId: "sim-a", name: "Bairro Boêmio (simulado)", description: "Bares, música ao vivo e ruas cheias à noite.", area: "Boêmio", tags: ["nightlife", "meet_people", "food_drink"], slots: ["evening", "night"], energy: 3, walking: "medium", stepFree: null, costLevel: 2 }),
  place({ id: "a-rua-diversa", destinationId: "sim-a", name: "Rua da Diversidade (simulado)", description: "Bares e cafés conhecidos por acolher a comunidade LGBTQIA+.", area: "Boêmio", tags: ["lgbtqia", "nightlife", "meet_people"], slots: ["evening", "night"], energy: 3, walking: "low", stepFree: true, costLevel: 2 }),
  place({ id: "a-hostel-bar", destinationId: "sim-a", name: "Encontro de Viajantes (simulado)", description: "Noite de jogos e conversa com gente do mundo todo.", area: "Boêmio", tags: ["meet_people"], slots: ["night"], energy: 2, walking: "low", stepFree: true, costLevel: 1 }),
  place({ id: "a-cafe-jardim", destinationId: "sim-a", name: "Café do Jardim (simulado)", description: "Café tranquilo com mesas ao ar livre.", area: "Orla", tags: ["food_drink", "wellness"], slots: ["morning", "afternoon"], energy: 1, walking: "low", stepFree: true, costLevel: 1 }),
  place({ id: "a-feira-design", destinationId: "sim-a", name: "Feira de Design (simulado)", description: "Peças de artistas locais aos fins de semana.", area: "Orla", tags: ["shopping", "local_markets"], slots: ["afternoon"], energy: 2, walking: "medium", stepFree: true, costLevel: 2 }),
  place({ id: "a-restaurante", destinationId: "sim-a", name: "Restaurante Típico (simulado)", description: "Pratos tradicionais em um salão antigo.", area: "Centro", tags: ["food_drink", "history_culture"], slots: ["evening"], energy: 1, walking: "low", stepFree: true, costLevel: 3 }),
  place({ id: "b-catedral", destinationId: "sim-b", name: "Catedral Antiga (simulado)", description: "Vitrais e uma torre com vista.", area: "Cidade Velha", tags: ["history_culture", "photography"], slots: ["morning", "afternoon"], energy: 1, walking: "medium", stepFree: false, costLevel: 1 }),
  place({ id: "b-galeria", destinationId: "sim-b", name: "Galeria Nacional (simulado)", description: "Grande acervo de pintura.", area: "Cidade Velha", tags: ["museums_art"], slots: ["morning", "afternoon"], energy: 1, walking: "low", stepFree: true, costLevel: 2 }),
  place({ id: "b-clube", destinationId: "sim-b", name: "Distrito da Música (simulado)", description: "Casas de show e festas até tarde.", area: "Porto", tags: ["nightlife", "meet_people", "lgbtqia"], slots: ["night"], energy: 3, walking: "medium", stepFree: null, costLevel: 2 }),
];
