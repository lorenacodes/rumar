import type { CurrencyCode, Money } from "./money";
import type { Sourced } from "./provenance";

export type TravelStyle = "economic" | "intermediate" | "comfort";

export const TRAVEL_STYLE_LABEL_PT: Readonly<Record<TravelStyle, string>> = {
  economic: "Econômica",
  intermediate: "Intermediária",
  comfort: "Confortável",
};

/** Custos diários de um destino para um estilo de viagem, na moeda local ou em BRL. */
export interface StyleCostProfile {
  /** Por quarto, por noite. */
  readonly lodgingPerRoomNight: Sourced<Money>;
  /** Pessoas por quarto assumidas neste estilo. */
  readonly peoplePerRoom: number;
  /** Por pessoa, por dia. */
  readonly foodPerPersonDay: Sourced<Money>;
  /** Por pessoa, por dia. */
  readonly localTransportPerPersonDay: Sourced<Money>;
  /** Por pessoa, por dia. */
  readonly activitiesPerPersonDay: Sourced<Money>;
  /** Por pessoa, por trecho (aeroporto ↔ hospedagem). */
  readonly airportTransferPerPersonWay: Sourced<Money>;
}

/** Referência de passagem ida e volta, por pessoa, em BRL, para um mês do ano. */
export interface FlightReference {
  readonly originIata: string;
  readonly destinationIata: string;
  /** 1–12 */
  readonly month: number;
  readonly roundTripPerPerson: Sourced<Money>;
}

export interface EntryFee {
  readonly label: string;
  readonly perPerson: Sourced<Money>;
}

export interface Destination {
  readonly id: string;
  readonly city: string;
  readonly country: string;
  /** ISO 3166-1 alfa-2 */
  readonly countryCode: string;
  readonly mainAirportIata: string;
  readonly currency: CurrencyCode;
  /** Região para seguro-viagem (ex.: "south_america", "europe"). */
  readonly insuranceRegion: string;
  readonly minNightsSuggested: number;
  readonly costs: Readonly<Record<TravelStyle, StyleCostProfile>>;
  /** Multiplicador sazonal de hospedagem por mês (1–12). Ausente = 1. */
  readonly lodgingSeasonality?: Readonly<Partial<Record<number, number>>>;
  readonly entryFees: readonly EntryFee[];
}

/** Parâmetros globais com fonte: câmbio, IOF, spread, seguro, passaporte. */
export interface MarketParameters {
  /** Quantos BRL vale 1 unidade de cada moeda. */
  readonly fxRatesToBrl: Readonly<Record<CurrencyCode, Sourced<number>>>;
  /** Fração, ex.: 0.035 para 3,5%. */
  readonly iofRate: Sourced<number>;
  /** Spread médio do meio de pagamento sobre a taxa de referência. Fração. */
  readonly cardSpreadRate: Sourced<number>;
  /** Seguro-viagem por pessoa por dia, em BRL, por região. */
  readonly insurancePerPersonDayByRegion: Readonly<Record<string, Sourced<Money>>>;
  /** Taxa de emissão do passaporte, em BRL. */
  readonly passportFee: Sourced<Money>;
  /** Bagagem despachada ida e volta, por pessoa, em BRL (estilos que a incluem). */
  readonly checkedBagRoundTripPerPerson: Sourced<Money>;
}
