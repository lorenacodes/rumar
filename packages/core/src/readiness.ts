import { addDays, addMonthsToDate, diffDays, parseIsoDate } from "./dates";
import { ValidationError } from "./errors";
import { goalProgress } from "./goal";
import type { Money } from "./money";

/**
 * Prontidão da viagem: o que falta, até quando, e qual é a próxima ação.
 * Tudo aqui é determinístico e auditável: regras + dados curados, sem IA.
 */

export type RequirementKind =
  | "passport"
  | "visa"
  | "electronic_authorization"
  | "insurance"
  | "vaccine"
  | "financial_proof"
  | "return_ticket"
  | "accommodation_proof"
  | "other";

/** Exigência de entrada curada a partir de fonte oficial. */
export interface EntryRequirement {
  readonly id: string;
  readonly countryCode: string;
  readonly kind: RequirementKind;
  readonly title: string;
  readonly description: string;
  readonly mandatory: boolean;
  /** Concluir até N dias antes do embarque. */
  readonly leadTimeDays: number;
  /** Só para `passport`: validade mínima após a data de retorno. */
  readonly passportMinValidityMonthsAfterReturn?: number;
  readonly sourceName: string;
  readonly sourceUrl: string;
  /** Data da última verificação na fonte, ISO. */
  readonly verifiedAt: string;
}

export type TaskCategory = "document" | "booking" | "preparation";
export type TaskStatus = "done" | "overdue" | "due_soon" | "upcoming";

export interface ReadinessTask {
  readonly id: string;
  readonly category: TaskCategory;
  readonly title: string;
  readonly description: string;
  readonly mandatory: boolean;
  readonly dueDate: string;
  readonly status: TaskStatus;
  /** Exigência que originou a tarefa, quando houver (para mostrar fonte e data). */
  readonly requirement?: EntryRequirement;
  /** `true` quando o prazo é uma recomendação do produto, não uma regra oficial. */
  readonly isRecommendation: boolean;
}

interface StandardTask {
  readonly id: string;
  readonly category: TaskCategory;
  readonly title: string;
  readonly description: string;
  readonly leadTimeDays: number;
}

/**
 * Tarefas padrão de toda viagem. Os prazos são **recomendações do produto**
 * (não regras oficiais) e aparecem marcados como sugestão.
 */
export const STANDARD_TASKS: readonly StandardTask[] = [
  { id: "buy_flight", category: "booking", title: "Comprar a passagem", description: "Compre pelo melhor preço que caiba no seu plano.", leadTimeDays: 60 },
  { id: "book_lodging", category: "booking", title: "Reservar a hospedagem", description: "Prefira reservas com cancelamento grátis.", leadTimeDays: 45 },
  { id: "buy_insurance", category: "booking", title: "Contratar o seguro-viagem", description: "Confira a cobertura mínima exigida pelo destino.", leadTimeDays: 14 },
  { id: "plan_money", category: "preparation", title: "Organizar como vai pagar lá fora", description: "Cartão, conta global ou dinheiro em espécie: compare IOF e câmbio.", leadTimeDays: 10 },
  { id: "plan_internet", category: "preparation", title: "Garantir internet no destino", description: "Chip local, eSIM ou roaming.", leadTimeDays: 7 },
  { id: "check_in", category: "preparation", title: "Fazer o check-in do voo", description: "Normalmente abre 24 a 48 horas antes; confira com a companhia.", leadTimeDays: 1 },
];

export interface TravelerDocuments {
  /** Validade do passaporte (ISO) ou `null` se não tem passaporte. */
  readonly passportExpiry: string | null;
}

export interface ReadinessInput {
  readonly today: string;
  readonly departureDate: string;
  readonly returnDate: string;
  readonly requirements: readonly EntryRequirement[];
  readonly traveler: TravelerDocuments;
  /** Prazo médio para emitir passaporte, em dias (parâmetro curado). */
  readonly passportLeadTimeDays: number;
  /** IDs de tarefas marcadas como concluídas pelo usuário. */
  readonly completedTaskIds: ReadonlySet<string>;
  readonly goalSaved: Money;
  readonly goalTarget: Money;
}

export interface ReadinessScores {
  /** 0–1 */
  readonly money: number;
  readonly documents: number;
  readonly plan: number;
  readonly overall: number;
}

export interface Readiness {
  readonly tasks: readonly ReadinessTask[];
  readonly scores: ReadinessScores;
  readonly nextAction: ReadinessTask | null;
  readonly daysToDeparture: number;
}

/** Pesos do índice geral. Dinheiro pesa mais porque é a maior barreira. */
export const READINESS_WEIGHTS = { money: 0.4, documents: 0.35, plan: 0.25 } as const;

/** Tarefas com prazo em até N dias são "due_soon". */
export const DUE_SOON_DAYS = 14;

/** Passaporte é válido para a viagem? */
export function isPassportValidForTrip(
  passportExpiry: string | null,
  returnDate: string,
  minValidityMonthsAfterReturn: number,
): boolean {
  if (!passportExpiry) return false;
  const requiredUntil = addMonthsToDate(returnDate, minValidityMonthsAfterReturn);
  return diffDays(requiredUntil, passportExpiry) >= 0;
}

function statusFor(done: boolean, today: string, dueDate: string): TaskStatus {
  if (done) return "done";
  const days = diffDays(today, dueDate);
  if (days < 0) return "overdue";
  if (days <= DUE_SOON_DAYS) return "due_soon";
  return "upcoming";
}

const PASSPORT_TASK_ID = "passport";

export function computeReadiness(input: ReadinessInput): Readiness {
  parseIsoDate(input.today);
  if (diffDays(input.departureDate, input.returnDate) < 0) {
    throw new ValidationError("returnDate", "A volta não pode ser antes da ida.");
  }
  const tasks: ReadinessTask[] = [];
  const done = (id: string): boolean => input.completedTaskIds.has(id);

  for (const req of input.requirements) {
    if (req.kind === "passport") {
      const valid = isPassportValidForTrip(
        input.traveler.passportExpiry,
        input.returnDate,
        req.passportMinValidityMonthsAfterReturn ?? 0,
      );
      const lead = Math.max(req.leadTimeDays, input.passportLeadTimeDays);
      const dueDate = addDays(input.departureDate, -lead);
      tasks.push({
        id: PASSPORT_TASK_ID,
        category: "document",
        title: valid
          ? "Passaporte válido para a viagem"
          : input.traveler.passportExpiry
            ? "Renovar o passaporte"
            : "Emitir o passaporte",
        description: req.description,
        mandatory: req.mandatory,
        dueDate,
        status: statusFor(valid || done(PASSPORT_TASK_ID), input.today, dueDate),
        requirement: req,
        isRecommendation: false,
      });
      continue;
    }
    const dueDate = addDays(input.departureDate, -req.leadTimeDays);
    tasks.push({
      id: req.id,
      category: "document",
      title: req.title,
      description: req.description,
      mandatory: req.mandatory,
      dueDate,
      status: statusFor(done(req.id), input.today, dueDate),
      requirement: req,
      isRecommendation: false,
    });
  }

  for (const std of STANDARD_TASKS) {
    const dueDate = addDays(input.departureDate, -std.leadTimeDays);
    tasks.push({
      id: std.id,
      category: std.category,
      title: std.title,
      description: std.description,
      mandatory: true,
      dueDate,
      status: statusFor(done(std.id), input.today, dueDate),
      isRecommendation: true,
    });
  }

  tasks.sort((a, b) => diffDays(b.dueDate, a.dueDate) || Number(b.mandatory) - Number(a.mandatory));

  const ratio = (items: readonly ReadinessTask[]): number =>
    items.length === 0 ? 1 : items.filter((t) => t.status === "done").length / items.length;

  const money = goalProgress(input.goalSaved, input.goalTarget).ratio;
  const documents = ratio(tasks.filter((t) => t.category === "document" && t.mandatory));
  const plan = ratio(tasks.filter((t) => t.category !== "document"));
  const overall =
    money * READINESS_WEIGHTS.money + documents * READINESS_WEIGHTS.documents + plan * READINESS_WEIGHTS.plan;

  const pending = tasks.filter((t) => t.status !== "done");
  return {
    tasks,
    scores: { money, documents, plan, overall },
    nextAction: pending.find((t) => t.mandatory) ?? pending[0] ?? null,
    daysToDeparture: diffDays(input.today, input.departureDate),
  };
}

/**
 * Antecedência mínima (em dias) que a documentação exige para uma viagem com
 * retorno em `returnDate`. Usada pelo calendário de viabilidade para marcar meses
 * cedo demais.
 */
export function minimumLeadDays(
  requirements: readonly EntryRequirement[],
  traveler: TravelerDocuments,
  returnDate: string,
  passportLeadTimeDays: number,
): number {
  let lead = 0;
  for (const req of requirements) {
    if (!req.mandatory) continue;
    if (req.kind === "passport") {
      const valid = isPassportValidForTrip(
        traveler.passportExpiry,
        returnDate,
        req.passportMinValidityMonthsAfterReturn ?? 0,
      );
      if (!valid) lead = Math.max(lead, req.leadTimeDays, passportLeadTimeDays);
      continue;
    }
    lead = Math.max(lead, req.leadTimeDays);
  }
  return lead;
}
