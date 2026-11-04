import { assertInteger, ValidationError } from "./errors";
import type { Provenance } from "./provenance";
import type { TravelStyle } from "./types";

/**
 * Roteiro personalizado pelo jeito de viajar da pessoa.
 *
 * Princípio: a pessoa escolhe **interesses, ritmo e necessidades**. O app não pergunta
 * idade, orientação sexual ou outros dados pessoais: um interesse como "cena
 * LGBTQIA+" é apenas mais uma opção que ela pode marcar, se quiser.
 *
 * O algoritmo é determinístico e explicável: cada item vem com os motivos da sugestão.
 * Os lugares vêm de uma base curada (hoje simulada); a IA não inventa lugares.
 */

export type InterestTag =
  | "history_culture"
  | "museums_art"
  | "food_drink"
  | "local_markets"
  | "nightlife"
  | "meet_people"
  | "lgbtqia"
  | "nature_outdoors"
  | "beach"
  | "adventure"
  | "shopping"
  | "wellness"
  | "photography"
  | "family_kids";

export const INTEREST_LABEL_PT: Readonly<Record<InterestTag, string>> = {
  history_culture: "História e cultura",
  museums_art: "Museus e arte",
  food_drink: "Comida e bebida",
  local_markets: "Mercados e feiras",
  nightlife: "Vida noturna",
  meet_people: "Conhecer gente",
  lgbtqia: "Cena LGBTQIA+",
  nature_outdoors: "Natureza e parques",
  beach: "Praia",
  adventure: "Aventura",
  shopping: "Compras",
  wellness: "Bem-estar e descanso",
  photography: "Lugares para fotografar",
  family_kids: "Programas com crianças",
};

export type Pace = "calm" | "balanced" | "intense";

export const PACE_LABEL_PT: Readonly<Record<Pace, string>> = {
  calm: "Tranquilo",
  balanced: "Equilibrado",
  intense: "Intenso",
};

export type TravelNeed = "low_walking" | "step_free" | "quiet";

export const NEED_LABEL_PT: Readonly<Record<TravelNeed, string>> = {
  low_walking: "Pouca caminhada",
  step_free: "Acesso sem degraus",
  quiet: "Lugares mais calmos",
};

export interface TravelPersona {
  readonly interests: readonly InterestTag[];
  readonly pace: Pace;
  readonly needs: readonly TravelNeed[];
}

export type DaySlot = "morning" | "afternoon" | "evening" | "night";

export const SLOT_LABEL_PT: Readonly<Record<DaySlot, string>> = {
  morning: "Manhã",
  afternoon: "Tarde",
  evening: "Fim de tarde",
  night: "Noite",
};

/** Lugar curado de um destino. */
export interface Place {
  readonly id: string;
  readonly destinationId: string;
  readonly name: string;
  readonly description: string;
  /** Bairro/região, para agrupar o dia e reduzir deslocamentos. */
  readonly area: string;
  readonly tags: readonly InterestTag[];
  /** Horários em que faz sentido ir. */
  readonly slots: readonly DaySlot[];
  /** 1 = calmo, 2 = moderado, 3 = agitado. */
  readonly energy: 1 | 2 | 3;
  readonly walking: "low" | "medium" | "high";
  /** `null` = não verificado. */
  readonly stepFree: boolean | null;
  /** 0 = grátis … 3 = caro. */
  readonly costLevel: 0 | 1 | 2 | 3;
  readonly provenance: Provenance;
  readonly sourceName: string;
  readonly verifiedAt: string;
}

export interface ItineraryItem {
  readonly slot: DaySlot;
  readonly place: Place | null;
  /** Motivos da sugestão, em linguagem simples. */
  readonly reasons: readonly string[];
}

export interface ItineraryDay {
  /** 1 = dia da chegada. */
  readonly day: number;
  readonly kind: "arrival" | "full" | "departure";
  readonly area: string | null;
  readonly items: readonly ItineraryItem[];
}

export interface Itinerary {
  readonly days: readonly ItineraryDay[];
  /** Interesses escolhidos sem nenhum lugar correspondente na base. */
  readonly uncoveredInterests: readonly InterestTag[];
  /** Lugares descartados por não atenderem às necessidades informadas. */
  readonly excludedByNeeds: number;
}

export interface ItineraryInput {
  readonly places: readonly Place[];
  readonly persona: TravelPersona;
  readonly nights: number;
  readonly style: TravelStyle;
}

const SLOTS_BY_PACE: Readonly<Record<Pace, readonly DaySlot[]>> = {
  calm: ["morning", "afternoon"],
  balanced: ["morning", "afternoon", "evening"],
  intense: ["morning", "afternoon", "evening", "night"],
};

/** Dia da chegada: só a segunda metade do dia. */
const ARRIVAL_SLOTS: Readonly<Record<Pace, readonly DaySlot[]>> = {
  calm: ["afternoon"],
  balanced: ["evening"],
  intense: ["evening", "night"],
};

/** Dia da partida: só a manhã. */
const DEPARTURE_SLOTS: readonly DaySlot[] = ["morning"];

const MAX_COST_BY_STYLE: Readonly<Record<TravelStyle, number>> = { economic: 1, intermediate: 2, comfort: 3 };

const PREFERRED_ENERGY: Readonly<Record<Pace, number>> = { calm: 1, balanced: 2, intense: 3 };

/** O lugar atende às necessidades? (filtro rígido) */
export function meetsNeeds(place: Place, needs: readonly TravelNeed[]): boolean {
  if (needs.includes("low_walking") && place.walking === "high") return false;
  if (needs.includes("step_free") && place.stepFree !== true) return false;
  if (needs.includes("quiet") && place.energy === 3) return false;
  return true;
}

interface Scored {
  readonly place: Place;
  readonly score: number;
  readonly matched: readonly InterestTag[];
}

/** Pontuação explicável: interesses em comum pesam mais; ritmo e custo ajustam. */
export function scorePlace(place: Place, persona: TravelPersona, style: TravelStyle): Scored {
  const matched = place.tags.filter((t) => persona.interests.includes(t));
  let score = matched.length * 10;
  score -= Math.abs(place.energy - PREFERRED_ENERGY[persona.pace]) * 3;
  if (place.costLevel > MAX_COST_BY_STYLE[style]) score -= 6;
  if (persona.pace === "calm" && place.walking === "high") score -= 3;
  return { place, score, matched };
}

/** "Vida noturna" → "vida noturna"; preserva siglas como "LGBTQIA+". */
export function lowerFirst(label: string): string {
  const [first = "", second = ""] = label;
  return second === second.toUpperCase() && /[A-Z]/.test(second) ? label : first.toLowerCase() + label.slice(1);
}

function reasonsFor(scored: Scored, persona: TravelPersona, style: TravelStyle): string[] {
  const reasons: string[] = [];
  if (scored.matched.length > 0) {
    reasons.push(`Combina com: ${scored.matched.map((t) => lowerFirst(INTEREST_LABEL_PT[t])).join(", ")}`);
  }
  if (persona.pace === "calm" && scored.place.energy === 1) reasons.push("Clima tranquilo, no seu ritmo");
  if (persona.pace === "intense" && scored.place.energy === 3) reasons.push("Agitado, do jeito que você gosta");
  if (persona.needs.includes("low_walking") && scored.place.walking === "low") reasons.push("Pouca caminhada");
  if (persona.needs.includes("step_free") && scored.place.stepFree) reasons.push("Acesso sem degraus");
  if (scored.place.costLevel === 0) reasons.push("Gratuito");
  else if (scored.place.costLevel > MAX_COST_BY_STYLE[style]) reasons.push("Acima do seu estilo de gasto");
  return reasons;
}

function validate(input: ItineraryInput): void {
  assertInteger("nights", input.nights, 1, 90, "Número de noites");
  if (input.persona.interests.length === 0) {
    throw new ValidationError("interests", "Escolha pelo menos um interesse para montar o roteiro.");
  }
}

/**
 * Monta o roteiro dia a dia:
 * 1. filtra lugares que não atendem às necessidades;
 * 2. pontua pelo jeito de viajar;
 * 3. para cada dia, escolhe uma região âncora (melhor lugar ainda não usado) e
 *    preenche os horários preferindo a mesma região e o horário adequado;
 * 4. horário sem lugar adequado vira "tempo livre" (nunca inventa lugar).
 */
export function buildItinerary(input: ItineraryInput): Itinerary {
  validate(input);
  const { persona, style } = input;
  const eligible = input.places.filter((p) => meetsNeeds(p, persona.needs));
  const excludedByNeeds = input.places.length - eligible.length;

  const ranked = eligible
    .map((p) => scorePlace(p, persona, style))
    .filter((s) => s.matched.length > 0)
    .sort((a, b) => b.score - a.score || a.place.id.localeCompare(b.place.id));

  const used = new Set<string>();
  const totalDays = input.nights + 1;
  const days: ItineraryDay[] = [];
  const paceSlots = SLOTS_BY_PACE[persona.pace];

  for (let day = 1; day <= totalDays; day++) {
    const kind: ItineraryDay["kind"] = day === 1 ? "arrival" : day === totalDays ? "departure" : "full";
    const slots: readonly DaySlot[] =
      kind === "arrival" ? ARRIVAL_SLOTS[persona.pace] : kind === "departure" ? DEPARTURE_SLOTS : paceSlots;
    const anchor = ranked.find((s) => !used.has(s.place.id));
    const area = anchor?.place.area ?? null;

    const items: ItineraryItem[] = slots.map((slot) => {
      const candidates = ranked.filter((s) => !used.has(s.place.id) && s.place.slots.includes(slot));
      const pick = candidates.find((s) => s.place.area === area) ?? candidates[0];
      if (!pick) {
        return { slot, place: null, reasons: ["Tempo livre para explorar ou descansar"] };
      }
      used.add(pick.place.id);
      return { slot, place: pick.place, reasons: reasonsFor(pick, persona, style) };
    });

    days.push({ day, kind, area, items });
  }

  const covered = new Set(ranked.flatMap((s) => s.matched));
  return {
    days,
    uncoveredInterests: persona.interests.filter((i) => !covered.has(i)),
    excludedByNeeds,
  };
}
