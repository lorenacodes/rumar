/**
 * Catálogo de dados do app.
 *
 * ⚠️ HOJE TODOS OS DADOS SÃO SIMULADOS (procedência `simulated`).
 * O banco de dados ainda não existe (decisão: criar depois, em projeto próprio,
 * separado do da Buovai). Quando existir, esta interface passa a ler as tabelas
 * curadas, e as telas não precisam mudar.
 */
import {
  SIM_DESTINATIONS,
  SIM_FLIGHTS,
  SIM_PLACES,
  SIM_REQUIREMENTS,
  SIMULATED_PARAMS,
} from '@rumar/core/fixtures';
import type { Destination, EntryRequirement, FlightReference, MarketParameters, Place } from '@rumar/core';

export interface Origin {
  readonly iata: string;
  readonly label: string;
}

export interface Catalog {
  readonly isSimulated: boolean;
  readonly origins: readonly Origin[];
  readonly destinations: readonly Destination[];
  readonly flights: readonly FlightReference[];
  readonly params: MarketParameters;
  readonly requirementsByCountry: Readonly<Record<string, readonly EntryRequirement[]>>;
  /** Prazo médio para emitir passaporte, em dias (parâmetro a curar). */
  readonly passportLeadTimeDays: number;
  /** Lugares curados por destino, para o roteiro. */
  readonly places: readonly Place[];
}

const ORIGINS: readonly Origin[] = [
  { iata: 'GRU', label: 'São Paulo (Guarulhos)' },
  { iata: 'GIG', label: 'Rio de Janeiro (Galeão)' },
];

/** Para a demonstração, o Rio reaproveita as referências simuladas de São Paulo. */
const flights: FlightReference[] = [
  ...SIM_FLIGHTS,
  ...SIM_FLIGHTS.map((f) => ({ ...f, originIata: 'GIG' })),
];

const requirementsByCountry: Record<string, EntryRequirement[]> = {};
for (const req of SIM_REQUIREMENTS) {
  (requirementsByCountry[req.countryCode] ??= []).push(req);
}

export const catalog: Catalog = {
  isSimulated: true,
  origins: ORIGINS,
  destinations: SIM_DESTINATIONS,
  flights,
  params: SIMULATED_PARAMS,
  requirementsByCountry,
  passportLeadTimeDays: 45,
  places: SIM_PLACES,
};

export function findDestination(id: string): Destination | undefined {
  return catalog.destinations.find((d) => d.id === id);
}

export function requirementsFor(destination: Destination): readonly EntryRequirement[] {
  return catalog.requirementsByCountry[destination.countryCode] ?? [];
}

export function placesFor(destination: Destination): readonly Place[] {
  return catalog.places.filter((p) => p.destinationId === destination.id);
}
