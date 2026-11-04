/**
 * Dinheiro sempre em unidades menores inteiras (centavos), para evitar erros de
 * ponto flutuante. `BRL` é a moeda-base do produto.
 */
export type CurrencyCode = string; // ISO 4217: "BRL", "USD", "EUR", "ARS"...

export interface Money {
  /** Valor em unidades menores (centavos). Sempre inteiro. */
  readonly minor: number;
  readonly currency: CurrencyCode;
}

export const BRL = "BRL";

export function money(minor: number, currency: CurrencyCode = BRL): Money {
  if (!Number.isFinite(minor)) {
    throw new RangeError(`Valor monetário inválido: ${minor}`);
  }
  return { minor: Math.round(minor), currency };
}

/** Cria a partir de unidades maiores (ex.: reais). `fromMajor(12.5)` → 1250 centavos. */
export function fromMajor(major: number, currency: CurrencyCode = BRL): Money {
  return money(major * 100, currency);
}

export function toMajor(value: Money): number {
  return value.minor / 100;
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new TypeError(`Moedas diferentes: ${a.currency} e ${b.currency}`);
  }
}

export function add(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.minor + b.minor, a.currency);
}

export function subtract(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.minor - b.minor, a.currency);
}

export function multiply(a: Money, factor: number): Money {
  return money(a.minor * factor, a.currency);
}

export function sum(values: readonly Money[], currency: CurrencyCode = BRL): Money {
  return values.reduce((acc, v) => add(acc, v), money(0, currency));
}

export function isZero(a: Money): boolean {
  return a.minor === 0;
}

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata em pt-BR. Ex.: 123456 centavos BRL → "R$ 1.234,56". */
export function formatMoney(value: Money, locale = "pt-BR"): string {
  if (value.currency === BRL && locale === "pt-BR") {
    return brlFormatter.format(toMajor(value));
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: value.currency,
  }).format(toMajor(value));
}
