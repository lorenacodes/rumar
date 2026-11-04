/**
 * Datas como strings ISO `YYYY-MM-DD` e meses como `YearMonth`, sempre em UTC,
 * para que o resultado não dependa do fuso do aparelho.
 */
export interface YearMonth {
  readonly year: number;
  /** 1–12 */
  readonly month: number;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(iso: string): Date {
  const m = ISO_DATE.exec(iso);
  if (!m) throw new RangeError(`Data inválida (esperado YYYY-MM-DD): ${iso}`);
  const [, y, mo, d] = m;
  const date = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
  if (date.getUTCMonth() !== Number(mo) - 1) {
    throw new RangeError(`Data inexistente: ${iso}`);
  }
  return date;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = parseIsoDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toIsoDate(d);
}

/** Diferença em dias (b − a). */
export function diffDays(a: string, b: string): number {
  return Math.round((parseIsoDate(b).getTime() - parseIsoDate(a).getTime()) / 86_400_000);
}

export function addMonthsToDate(iso: string, months: number): string {
  const d = parseIsoDate(iso);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return toIsoDate(d);
}

export function yearMonthOf(iso: string): YearMonth {
  const d = parseIsoDate(iso);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

export function addMonths(ym: YearMonth, months: number): YearMonth {
  const index = ym.year * 12 + (ym.month - 1) + months;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** Meses entre `a` e `b` (b − a). */
export function diffMonths(a: YearMonth, b: YearMonth): number {
  return b.year * 12 + b.month - (a.year * 12 + a.month);
}

export function firstDayOf(ym: YearMonth): string {
  return `${ym.year}-${String(ym.month).padStart(2, "0")}-01`;
}

export function formatYearMonth(ym: YearMonth): string {
  return `${ym.year}-${String(ym.month).padStart(2, "0")}`;
}

const MONTHS_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
] as const;

/** Ex.: { year: 2027, month: 5 } → "maio de 2027" */
export function formatYearMonthPt(ym: YearMonth): string {
  return `${MONTHS_PT[ym.month - 1]} de ${ym.year}`;
}
