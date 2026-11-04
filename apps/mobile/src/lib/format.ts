import { formatMoney, money, type Money } from '@rumar/core';

/** "1.234" → 123400 centavos. Aceita só reais inteiros (o usuário não digita centavos). */
export function parseReais(text: string): number {
  const digits = text.replace(/\D/g, '').slice(0, 7);
  return digits ? Number(digits) * 100 : 0;
}

/** 123400 → "1.234" (sem centavos, para campo de digitação). */
export function formatReaisInput(minor: number): string {
  if (minor <= 0) return '';
  return Math.floor(minor / 100).toLocaleString('pt-BR');
}

/** Valor em reais sem centavos, para leitura rápida: "R$ 5.900". */
export function formatBrlShort(value: Money | number): string {
  const m = typeof value === 'number' ? money(value) : value;
  return formatMoney(money(Math.round(m.minor / 100) * 100)).replace(/,00$/, '');
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

export function formatDatePt(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
