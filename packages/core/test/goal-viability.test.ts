import { describe, expect, it } from "vitest";
import {
  availableBy,
  computeViabilityCalendar,
  fromMajor,
  goalProgress,
  monthsToReach,
  rankDestinations,
  reachDate,
  requiredMonthly,
  ValidationError,
  type SavingsPlan,
} from "../src";
import { SIM_DESTINATIONS, SIM_FLIGHTS, SIMULATED_PARAMS } from "../src/fixtures/simulated";

const asOf = { year: 2026, month: 11 };
const plan: SavingsPlan = { saved: fromMajor(1000), monthly: fromMajor(500), asOf };

describe("meta de viagem", () => {
  it("calcula quanto estará disponível em cada mês", () => {
    expect(availableBy(plan, { year: 2027, month: 5 }).minor).toBe(fromMajor(4000).minor);
    expect(availableBy(plan, asOf).minor).toBe(fromMajor(1000).minor);
  });
  it("calcula meses e data para atingir a meta", () => {
    expect(monthsToReach(plan, fromMajor(5000))).toBe(8);
    expect(reachDate(plan, fromMajor(5000))).toEqual({ year: 2027, month: 7 });
    expect(monthsToReach(plan, fromMajor(800))).toBe(0);
    expect(monthsToReach({ ...plan, monthly: fromMajor(0) }, fromMajor(5000))).toBeNull();
  });
  it("calcula o valor mensal necessário para um prazo", () => {
    expect(requiredMonthly(fromMajor(1000), fromMajor(5000), asOf, { year: 2027, month: 3 })?.minor).toBe(
      fromMajor(1000).minor,
    );
    expect(requiredMonthly(fromMajor(1000), fromMajor(5000), asOf, asOf)).toBeNull();
  });
  it("calcula o progresso sem passar de 100%", () => {
    expect(goalProgress(fromMajor(2500), fromMajor(5000)).ratio).toBe(0.5);
    expect(goalProgress(fromMajor(6000), fromMajor(5000)).ratio).toBe(1);
  });
  it("rejeita valores negativos", () => {
    expect(() => monthsToReach({ ...plan, monthly: fromMajor(-1) }, fromMajor(10))).toThrow(ValidationError);
  });
});

describe("calendário de viabilidade", () => {
  const results = computeViabilityCalendar({
    destinations: SIM_DESTINATIONS,
    flights: SIM_FLIGHTS,
    params: SIMULATED_PARAMS,
    originIata: "GRU",
    travelers: 1,
    nights: 5,
    style: "economic",
    savings: plan,
    horizonMonths: 12,
    minLeadMonthsByDestination: { "sim-b": 3 },
  });
  const a = results.find((r) => r.destination.id === "sim-a")!;
  const b = results.find((r) => r.destination.id === "sim-b")!;

  it("gera uma célula por mês do horizonte, a partir do mês seguinte", () => {
    expect(a.cells).toHaveLength(12);
    expect(a.cells[0]?.month).toEqual({ year: 2026, month: 12 });
  });

  it("a folga é o disponível menos o custo total", () => {
    for (const c of a.cells) {
      expect(c.slack?.minor).toBe(c.available.minor - (c.cost?.total.minor ?? 0));
    }
  });

  it("marca viável, apertado e ainda não conforme a folga", () => {
    for (const c of a.cells) {
      const total = c.cost!.total.minor;
      const slack = c.slack!.minor;
      if (slack >= 0) expect(c.status).toBe("viable");
      else if (-slack <= total * 0.1) expect(c.status).toBe("tight");
      else expect(c.status).toBe("not_yet");
    }
    expect(a.firstViable).not.toBeNull();
  });

  it("respeita a antecedência mínima dos documentos", () => {
    expect(b.cells.slice(0, 2).every((c) => c.status === "too_soon" || c.status === "no_data")).toBe(true);
  });

  it("indica falta de dados em vez de inventar", () => {
    const dez = b.cells.find((c) => c.month.month === 12)!;
    expect(dez.status).toBe("no_data");
    expect(dez.cost).toBeNull();
  });

  it("ordena destinos pelo primeiro mês viável", () => {
    const ranked = rankDestinations(results);
    expect(ranked[0]?.destination.id).toBe("sim-a");
  });
});
