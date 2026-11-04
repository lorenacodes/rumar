import { ValidationError } from "./errors";
import { addMonths, diffMonths, type YearMonth } from "./dates";
import { BRL, money, type Money } from "./money";

export interface SavingsPlan {
  /** Quanto já foi guardado para a viagem. */
  readonly saved: Money;
  /** Quanto a pessoa consegue guardar por mês. */
  readonly monthly: Money;
  /** Mês de referência ("agora"). */
  readonly asOf: YearMonth;
}

function assertBrlNonNegative(field: string, value: Money, label: string): void {
  if (value.currency !== BRL) throw new ValidationError(field, `${label} deve estar em reais.`);
  if (value.minor < 0) throw new ValidationError(field, `${label} não pode ser negativo.`);
}

export function validateSavingsPlan(plan: SavingsPlan): void {
  assertBrlNonNegative("saved", plan.saved, "O valor guardado");
  assertBrlNonNegative("monthly", plan.monthly, "O valor mensal");
}

/**
 * Quanto estará disponível no início do mês `target`, guardando `monthly` todo mês
 * a partir do mês seguinte ao de referência.
 */
export function availableBy(plan: SavingsPlan, target: YearMonth): Money {
  const months = Math.max(0, diffMonths(plan.asOf, target));
  return money(plan.saved.minor + plan.monthly.minor * months);
}

/** Meses necessários para atingir a meta. `0` se já atingiu; `null` se nunca (mensal zero). */
export function monthsToReach(plan: SavingsPlan, target: Money): number | null {
  validateSavingsPlan(plan);
  const remaining = target.minor - plan.saved.minor;
  if (remaining <= 0) return 0;
  if (plan.monthly.minor <= 0) return null;
  return Math.ceil(remaining / plan.monthly.minor);
}

/** Primeiro mês em que a meta estará atingida, ou `null`. */
export function reachDate(plan: SavingsPlan, target: Money): YearMonth | null {
  const months = monthsToReach(plan, target);
  return months === null ? null : addMonths(plan.asOf, months);
}

/** Quanto é preciso guardar por mês para ter `target` até o mês `deadline`. */
export function requiredMonthly(saved: Money, target: Money, asOf: YearMonth, deadline: YearMonth): Money | null {
  const remaining = target.minor - saved.minor;
  if (remaining <= 0) return money(0);
  const months = diffMonths(asOf, deadline);
  if (months <= 0) return null;
  return money(Math.ceil(remaining / months));
}

export interface GoalProgress {
  readonly target: Money;
  readonly saved: Money;
  readonly remaining: Money;
  /** 0–1 */
  readonly ratio: number;
}

export function goalProgress(saved: Money, target: Money): GoalProgress {
  const remaining = Math.max(0, target.minor - saved.minor);
  const ratio = target.minor <= 0 ? 1 : Math.min(1, saved.minor / target.minor);
  return { target, saved, remaining: money(remaining), ratio };
}
