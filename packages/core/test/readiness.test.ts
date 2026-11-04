import { describe, expect, it } from "vitest";
import {
  computeReadiness,
  fromMajor,
  isPassportValidForTrip,
  minimumLeadDays,
  ValidationError,
  type ReadinessInput,
} from "../src";
import { SIM_REQUIREMENTS } from "../src/fixtures/simulated";

const base: ReadinessInput = {
  today: "2026-11-04",
  departureDate: "2027-05-10",
  returnDate: "2027-05-20",
  requirements: SIM_REQUIREMENTS.filter((r) => r.countryCode === "XB"),
  traveler: { passportExpiry: null },
  passportLeadTimeDays: 45,
  completedTaskIds: new Set(),
  goalSaved: fromMajor(2000),
  goalTarget: fromMajor(8000),
};

describe("passaporte", () => {
  it("exige validade mínima após o retorno", () => {
    expect(isPassportValidForTrip("2027-08-20", "2027-05-20", 3)).toBe(true);
    expect(isPassportValidForTrip("2027-08-19", "2027-05-20", 3)).toBe(false);
    expect(isPassportValidForTrip(null, "2027-05-20", 0)).toBe(false);
  });
});

describe("computeReadiness", () => {
  it("sem passaporte, pede a emissão com o prazo maior entre a regra e o tempo médio", () => {
    const r = computeReadiness(base);
    const passport = r.tasks.find((t) => t.id === "passport")!;
    expect(passport.title).toBe("Emitir o passaporte");
    expect(passport.dueDate).toBe("2027-03-26"); // 45 dias antes
    expect(passport.isRecommendation).toBe(false);
    expect(passport.requirement?.sourceUrl).toBeTruthy();
  });

  it("passaporte válido conta como concluído", () => {
    const r = computeReadiness({ ...base, traveler: { passportExpiry: "2030-01-01" } });
    expect(r.tasks.find((t) => t.id === "passport")?.status).toBe("done");
  });

  it("ordena tarefas por prazo e escolhe a próxima ação", () => {
    const r = computeReadiness(base);
    const dates = r.tasks.map((t) => t.dueDate);
    expect([...dates].sort()).toEqual(dates);
    expect(r.nextAction?.id).toBe("buy_flight"); // 60 dias antes: o prazo mais cedo
  });

  it("classifica atrasadas e próximas", () => {
    const r = computeReadiness({ ...base, today: "2027-05-01" });
    expect(r.tasks.find((t) => t.id === "buy_flight")?.status).toBe("overdue");
    expect(r.tasks.find((t) => t.id === "check_in")?.status).toBe("due_soon");
  });

  it("calcula os índices de prontidão", () => {
    const r = computeReadiness({
      ...base,
      traveler: { passportExpiry: "2030-01-01" },
      completedTaskIds: new Set(["xb-insurance", "buy_flight"]),
    });
    expect(r.scores.money).toBe(0.25);
    expect(r.scores.documents).toBe(1);
    expect(r.scores.plan).toBeCloseTo(1 / 6);
    expect(r.scores.overall).toBeCloseTo(0.25 * 0.4 + 1 * 0.35 + (1 / 6) * 0.25);
    expect(r.daysToDeparture).toBe(187);
  });

  it("rejeita volta antes da ida", () => {
    expect(() => computeReadiness({ ...base, returnDate: "2027-05-01" })).toThrow(ValidationError);
  });

  it("antecedência mínima considera o passaporte só quando é preciso emitir", () => {
    expect(minimumLeadDays(SIM_REQUIREMENTS.filter((r) => r.countryCode === "XB"), { passportExpiry: null }, "2027-05-20", 45)).toBe(45);
    expect(minimumLeadDays(SIM_REQUIREMENTS.filter((r) => r.countryCode === "XB"), { passportExpiry: "2030-01-01" }, "2027-05-20", 45)).toBe(7);
  });
});
