import { describe, expect, it } from "vitest";
import {
  addMonths,
  addMonthsToDate,
  diffDays,
  diffMonths,
  formatMoney,
  formatYearMonthPt,
  fromMajor,
  money,
  parseIsoDate,
  sum,
  weakestProvenance,
} from "../src";

describe("money", () => {
  it("guarda centavos inteiros", () => {
    expect(fromMajor(12.345).minor).toBe(1235);
    expect(money(10.4).minor).toBe(10);
  });
  it("não soma moedas diferentes", () => {
    expect(() => sum([fromMajor(1, "USD")])).toThrow(/Moedas diferentes/);
  });
  it("formata em pt-BR", () => {
    expect(formatMoney(fromMajor(1234.56)).replace(/\s/g, " ")).toBe("R$ 1.234,56");
  });
  it("rejeita valores não finitos", () => {
    expect(() => money(Number.NaN)).toThrow();
  });
});

describe("dates", () => {
  it("soma meses atravessando o ano", () => {
    expect(addMonths({ year: 2026, month: 11 }, 3)).toEqual({ year: 2027, month: 2 });
    expect(diffMonths({ year: 2026, month: 11 }, { year: 2027, month: 5 })).toBe(6);
  });
  it("respeita o último dia do mês", () => {
    expect(addMonthsToDate("2027-01-31", 1)).toBe("2027-02-28");
  });
  it("calcula diferença de dias em UTC", () => {
    expect(diffDays("2026-11-04", "2026-12-04")).toBe(30);
  });
  it("rejeita datas inexistentes", () => {
    expect(() => parseIsoDate("2026-02-30")).toThrow();
  });
  it("formata o mês em português", () => {
    expect(formatYearMonthPt({ year: 2027, month: 5 })).toBe("maio de 2027");
  });
});

describe("procedência", () => {
  it("o composto herda o insumo menos confiável", () => {
    expect(weakestProvenance(["quoted", "reference", "estimate"])).toBe("estimate");
    expect(weakestProvenance(["quoted", "simulated"])).toBe("simulated");
  });
});
