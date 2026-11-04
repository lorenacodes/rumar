import type { TravelPersona, TravelStyle, YearMonth } from '@rumar/core';

export type PassportStatus = 'valid' | 'none' | 'unknown';

/** Respostas do onboarding + preferências. */
export interface TravelerProfile {
  readonly originIata: string;
  /** Centavos que consegue guardar por mês. */
  readonly monthlyMinor: number;
  /** Centavos já guardados quando começou. */
  readonly initialSavedMinor: number;
  readonly travelers: number;
  readonly nights: number;
  readonly style: TravelStyle;
  readonly passport: PassportStatus;
  /** Mês preferido ou `null` = flexível. */
  readonly preferredMonth: YearMonth | null;
}

export interface Goal {
  readonly destinationId: string;
  readonly departureMonth: YearMonth;
  /** Custo total no momento em que a meta foi criada (centavos). */
  readonly targetMinor: number;
  readonly createdAt: string;
}

export interface Contribution {
  readonly id: string;
  readonly amountMinor: number;
  readonly date: string;
}

export interface AppState {
  readonly version: 1;
  readonly profile: TravelerProfile | null;
  readonly goal: Goal | null;
  readonly contributions: readonly Contribution[];
  readonly completedTaskIds: readonly string[];
  /**
   * Jeito de viajar (interesses, ritmo, necessidades). Pode incluir interesses que
   * revelam dado sensível (ex.: cena LGBTQIA+): por isso fica só no aparelho e
   * nunca é enviado a servidores sem consentimento específico (LGPD, art. 11).
   */
  readonly persona: TravelPersona | null;
}

export const INITIAL_STATE: AppState = {
  version: 1,
  profile: null,
  goal: null,
  contributions: [],
  completedTaskIds: [],
  persona: null,
};
