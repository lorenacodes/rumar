import { describe, expect, it } from "vitest";
import { computeTripCost, MissingDataError, ValidationError, type TripCostInput } from "../src";
import { SIM_CITY_A, SIM_CITY_B, SIM_FLIGHTS, SIMULATED_PARAMS } from "../src/fixtures/simulated";

const flightA = (month: number) => SIM_FLIGHTS.find((f) => f.destinationIata === "AAA" && f.month === month);

const base: TripCostInput = {
  destination: SIM_CITY_A,
  flight: flightA(5),
  params: SIMULATED_PARAMS,
  travelers: 2,
  nights: 5,
  style: "economic",
  departureMonth: 5,
};

const line = (r: ReturnType<typeof computeTripCost>, c: string) => r.lines.find((l) => l.category === c);

describe("computeTripCost", () => {
  it("calcula cada categoria com as quantidades certas", () => {
    const r = computeTripCost(base);
    // Passagem: 1800 × 2 = R$ 3.600 (já em BRL, sem IOF)
    expect(line(r, "flight")?.amount.minor).toBe(360_000);
    // Hospedagem: US$ 40 × 5 noites × 1 quarto × 5,5 = R$ 1.100
    expect(line(r, "lodging")?.amount.minor).toBe(110_000);
    // Comida: US$ 25 × 6 dias × 2 pessoas × 5,5 = R$ 1.650
    expect(line(r, "food")?.amount.minor).toBe(165_000);
    // Seguro: R$ 12 × 6 dias × 2 = R$ 144
    expect(line(r, "insurance")?.amount.minor).toBe(14_400);
    // Econômico não inclui bagagem por padrão
    expect(line(r, "checked_bag")).toBeUndefined();
  });

  it("mostra IOF e spread separadamente só sobre gastos em moeda estrangeira", () => {
    const r = computeTripCost(base);
    const foreignBrl = r.lines
      .filter((l) => ["lodging", "food", "local_transport", "airport_transfer", "activities"].includes(l.category))
      .reduce((s, l) => s + l.amount.minor, 0);
    const expected = Math.round(foreignBrl * 0.04 + foreignBrl * 1.04 * 0.035);
    expect(Math.abs((line(r, "fx_costs")?.amount.minor ?? 0) - expected)).toBeLessThanOrEqual(5);
  });

  it("soma a reserva de imprevistos sobre o subtotal", () => {
    const r = computeTripCost(base);
    expect(line(r, "contingency")?.amount.minor).toBe(Math.round(r.subtotal.minor * 0.1));
    expect(r.total.minor).toBe(r.subtotal.minor + (line(r, "contingency")?.amount.minor ?? 0));
    expect(r.perPerson.minor).toBe(Math.round(r.total.minor / 2));
  });

  it("aplica a sazonalidade da hospedagem", () => {
    const julho = computeTripCost({ ...base, departureMonth: 7, flight: flightA(7) });
    expect(line(julho, "lodging")?.amount.minor).toBe(143_000); // 1100 × 1,3
  });

  it("inclui taxas de entrada, passaporte e bagagem quando aplicável", () => {
    const flightB = SIM_FLIGHTS.find((f) => f.destinationIata === "BBB" && f.month === 5);
    const r = computeTripCost({
      ...base,
      destination: SIM_CITY_B,
      flight: flightB,
      style: "intermediate",
      travelersNeedingPassport: 1,
    });
    expect(line(r, "entry_fees")?.amount.minor).toBe(12_000); // € 10 × 2 × 6
    expect(line(r, "passport")?.amount.minor).toBe(26_000);
    expect(line(r, "checked_bag")?.amount.minor).toBe(80_000);
  });

  it("propaga a procedência mais fraca e lista as fontes", () => {
    const r = computeTripCost(base);
    expect(r.provenance).toBe("simulated");
    expect(line(r, "lodging")?.sources.length).toBeGreaterThan(0);
  });

  it("sem referência de passagem, explica que falta o dado", () => {
    expect(() => computeTripCost({ ...base, flight: undefined })).toThrow(MissingDataError);
  });

  it("valida as entradas", () => {
    expect(() => computeTripCost({ ...base, travelers: 0 })).toThrow(ValidationError);
    expect(() => computeTripCost({ ...base, nights: 1.5 })).toThrow(ValidationError);
    expect(() => computeTripCost({ ...base, contingencyRate: 0.9 })).toThrow(ValidationError);
    expect(() => computeTripCost({ ...base, travelersNeedingPassport: 3 })).toThrow(ValidationError);
  });
});
