import { describe, expect, it } from "vitest";
import { buildItinerary, meetsNeeds, scorePlace, ValidationError, type TravelPersona } from "../src";
import { SIM_PLACES } from "../src/fixtures/simulated";

const placesA = SIM_PLACES.filter((p) => p.destinationId === "sim-a");

const young: TravelPersona = { interests: ["nightlife", "meet_people", "food_drink"], pace: "intense", needs: [] };
const calm: TravelPersona = { interests: ["museums_art", "food_drink", "nature_outdoors"], pace: "calm", needs: ["low_walking", "quiet"] };

describe("buildItinerary", () => {
  it("cria um dia por noite + 1, com chegada e partida reduzidas", () => {
    const it = buildItinerary({ places: placesA, persona: young, nights: 3, style: "economic" });
    expect(it.days).toHaveLength(4);
    expect(it.days[0]?.kind).toBe("arrival");
    expect(it.days[0]?.items.map((i) => i.slot)).toEqual(["evening", "night"]);
    expect(it.days[3]?.kind).toBe("departure");
    expect(it.days[3]?.items.map((i) => i.slot)).toEqual(["morning"]);
    expect(it.days[1]?.items).toHaveLength(4); // ritmo intenso
  });

  it("ritmo tranquilo tem menos atividades por dia", () => {
    const it = buildItinerary({ places: placesA, persona: calm, nights: 3, style: "economic" });
    expect(it.days[1]?.items).toHaveLength(2);
  });

  it("nunca repete um lugar e nunca inventa: sem opção, vira tempo livre", () => {
    const it = buildItinerary({ places: placesA, persona: young, nights: 6, style: "economic" });
    const ids = it.days.flatMap((d) => d.items).flatMap((i) => (i.place ? [i.place.id] : []));
    expect(new Set(ids).size).toBe(ids.length);
    const free = it.days.flatMap((d) => d.items).filter((i) => i.place === null);
    expect(free.length).toBeGreaterThan(0);
    expect(free[0]?.reasons[0]).toMatch(/Tempo livre/);
  });

  it("respeita as necessidades: pouca caminhada e lugares calmos", () => {
    const it = buildItinerary({ places: placesA, persona: calm, nights: 3, style: "economic" });
    for (const item of it.days.flatMap((d) => d.items)) {
      if (!item.place) continue;
      expect(item.place.walking).not.toBe("high");
      expect(item.place.energy).not.toBe(3);
    }
    expect(it.excludedByNeeds).toBeGreaterThan(0);
  });

  it("perfis diferentes geram roteiros diferentes, com motivos", () => {
    const a = buildItinerary({ places: placesA, persona: young, nights: 2, style: "economic" });
    const b = buildItinerary({ places: placesA, persona: calm, nights: 2, style: "economic" });
    const first = (x: typeof a) => x.days.flatMap((d) => d.items).find((i) => i.place)?.place?.id;
    expect(first(a)).not.toBe(first(b));
    const withPlace = a.days.flatMap((d) => d.items).find((i) => i.place);
    expect(withPlace?.reasons.join(" ")).toMatch(/Combina com/);
  });

  it("interesse LGBTQIA+ prioriza lugares marcados com esse interesse", () => {
    const persona: TravelPersona = { interests: ["lgbtqia"], pace: "balanced", needs: [] };
    const it = buildItinerary({ places: placesA, persona, nights: 2, style: "intermediate" });
    const ids = it.days.flatMap((d) => d.items).flatMap((i) => (i.place ? [i.place.id] : []));
    expect(ids).toContain("a-rua-diversa");
  });

  it("agrupa o dia na mesma região quando possível", () => {
    const persona: TravelPersona = { interests: ["history_culture", "museums_art", "local_markets"], pace: "balanced", needs: [] };
    const it = buildItinerary({ places: placesA, persona, nights: 2, style: "comfort" });
    const day2 = it.days[1]!;
    const areas = day2.items.flatMap((i) => (i.place ? [i.place.area] : []));
    expect(areas.every((a) => a === day2.area)).toBe(true);
  });

  it("informa interesses sem lugar correspondente", () => {
    const persona: TravelPersona = { interests: ["beach", "food_drink"], pace: "balanced", needs: [] };
    expect(buildItinerary({ places: placesA, persona, nights: 2, style: "economic" }).uncoveredInterests).toEqual(["beach"]);
  });

  it("exige pelo menos um interesse", () => {
    expect(() => buildItinerary({ places: placesA, persona: { interests: [], pace: "calm", needs: [] }, nights: 2, style: "economic" })).toThrow(ValidationError);
  });
});

describe("regras de pontuação", () => {
  it("acesso sem degraus exige confirmação (null não passa)", () => {
    const unknown = SIM_PLACES.find((p) => p.stepFree === null)!;
    expect(meetsNeeds(unknown, ["step_free"])).toBe(false);
  });
  it("lugar acima do estilo de gasto perde pontos", () => {
    const expensive = SIM_PLACES.find((p) => p.id === "a-restaurante")!;
    const persona: TravelPersona = { interests: ["food_drink"], pace: "calm", needs: [] };
    expect(scorePlace(expensive, persona, "economic").score).toBeLessThan(scorePlace(expensive, persona, "comfort").score);
  });
});
