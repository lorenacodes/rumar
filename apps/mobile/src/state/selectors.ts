import {
  addDays,
  computeReadiness,
  computeViabilityCalendar,
  firstDayOf,
  minimumLeadDays,
  money,
  rankDestinations,
  type Destination,
  type DestinationViability,
  type Readiness,
  type YearMonth,
} from '@rumar/core';

import { catalog, findDestination, requirementsFor } from '@/data/catalog';
import type { AppState, PassportStatus, TravelerProfile } from '@/state/types';

/** "Não sei" é tratado como "não tenho": é o cenário mais seguro para os prazos. */
export function passportExpiryFor(status: PassportStatus): string | null {
  return status === 'valid' ? '2099-12-31' : null;
}

export function currentYearMonth(today = new Date()): YearMonth {
  return { year: today.getFullYear(), month: today.getMonth() + 1 };
}

export function todayIso(today = new Date()): string {
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function savedMinor(state: AppState): number {
  const initial = state.profile?.initialSavedMinor ?? 0;
  return initial + state.contributions.reduce((s, c) => s + c.amountMinor, 0);
}

/**
 * Datas aproximadas da viagem: embarque no 1º dia do mês escolhido (mais
 * conservador para os prazos) e volta após o número de noites.
 */
export function tripDates(departureMonth: YearMonth, nights: number): { departure: string; return: string } {
  const departure = firstDayOf(departureMonth);
  return { departure, return: addDays(departure, nights) };
}

export function computeDiscovery(profile: TravelerProfile, saved: number, asOf: YearMonth): DestinationViability[] {
  const passportExpiry = passportExpiryFor(profile.passport);
  const leadMonths: Record<string, number> = {};
  for (const d of catalog.destinations) {
    // Aproximação: avalia a validade do passaporte para uma volta daqui a 12 meses.
    const approxReturn = firstDayOf({ year: asOf.year + 1, month: asOf.month });
    const days = minimumLeadDays(requirementsFor(d), { passportExpiry }, approxReturn, catalog.passportLeadTimeDays);
    leadMonths[d.id] = Math.ceil(days / 30);
  }
  const travelersNeedingPassport = profile.passport === 'valid' ? 0 : profile.travelers;
  return rankDestinations(
    computeViabilityCalendar({
      destinations: catalog.destinations,
      flights: catalog.flights,
      params: catalog.params,
      originIata: profile.originIata,
      travelers: profile.travelers,
      nights: profile.nights,
      style: profile.style,
      savings: { saved: money(saved), monthly: money(profile.monthlyMinor), asOf },
      minLeadMonthsByDestination: leadMonths,
      travelersNeedingPassport,
    }),
  );
}

export interface TripView {
  readonly destination: Destination;
  readonly readiness: Readiness;
  readonly dates: { departure: string; return: string };
  readonly saved: number;
}

export function computeTripView(state: AppState, today = todayIso()): TripView | null {
  const { profile, goal } = state;
  if (!profile || !goal) return null;
  const destination = findDestination(goal.destinationId);
  if (!destination) return null;
  const dates = tripDates(goal.departureMonth, profile.nights);
  const saved = savedMinor(state);
  const readiness = computeReadiness({
    today,
    departureDate: dates.departure,
    returnDate: dates.return,
    requirements: requirementsFor(destination),
    traveler: { passportExpiry: passportExpiryFor(profile.passport) },
    passportLeadTimeDays: catalog.passportLeadTimeDays,
    completedTaskIds: new Set(state.completedTaskIds),
    goalSaved: money(saved),
    goalTarget: money(goal.targetMinor),
  });
  return { destination, readiness, dates, saved };
}
