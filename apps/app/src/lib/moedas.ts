/**
 * Moedas: país de residência, moeda de referência, moeda do destino e conversões.
 *
 * Três valores diferentes, nunca misturados:
 * - Cotação de referência: PTAX de venda do Banco Central (dados/cambio.json, com data).
 *   É a taxa "de mercado"; ninguém compra a esse preço no balcão.
 * - Estimativa de conversão: a referência + IOF (alíquota oficial). O spread da instituição
 *   NÃO entra, porque varia de banco para banco e não temos fonte: avisamos.
 * - Custo efetivo informado: o VET que a instituição informou à pessoa (inclui taxa, tarifas
 *   e tributos). Só aparece se a pessoa digitar.
 * Valores em centavos (ou na menor unidade × 100 para moedas sem centavos, como o iene).
 */
import CAMBIO from '../dados/cambio.json';

export interface Pais { codigo: string; nome: string; moeda: string }

/** Países para residência e destino (os que o app conhece). */
export const PAISES: Pais[] = [
  { codigo: 'BR', nome: 'Brasil', moeda: 'BRL' },
  { codigo: 'AR', nome: 'Argentina', moeda: 'ARS' },
  { codigo: 'CL', nome: 'Chile', moeda: 'CLP' },
  { codigo: 'UY', nome: 'Uruguai', moeda: 'UYU' },
  { codigo: 'PY', nome: 'Paraguai', moeda: 'PYG' },
  { codigo: 'PT', nome: 'Portugal', moeda: 'EUR' },
  { codigo: 'FR', nome: 'França', moeda: 'EUR' },
  { codigo: 'ES', nome: 'Espanha', moeda: 'EUR' },
  { codigo: 'IT', nome: 'Itália', moeda: 'EUR' },
  { codigo: 'DE', nome: 'Alemanha', moeda: 'EUR' },
  { codigo: 'IE', nome: 'Irlanda', moeda: 'EUR' },
  { codigo: 'NL', nome: 'Países Baixos', moeda: 'EUR' },
  { codigo: 'GB', nome: 'Reino Unido', moeda: 'GBP' },
  { codigo: 'CH', nome: 'Suíça', moeda: 'CHF' },
  { codigo: 'US', nome: 'Estados Unidos', moeda: 'USD' },
  { codigo: 'CA', nome: 'Canadá', moeda: 'CAD' },
  { codigo: 'AU', nome: 'Austrália', moeda: 'AUD' },
  { codigo: 'JP', nome: 'Japão', moeda: 'JPY' },
];
export const paisPorCodigo = (c?: string | null) => PAISES.find((p) => p.codigo === c) ?? null;
export const paisPorNome = (n?: string | null) => PAISES.find((p) => p.nome === n) ?? null;

export const NOME_MOEDA: Record<string, string> = {
  BRL: 'Real', USD: 'Dólar americano', EUR: 'Euro', GBP: 'Libra esterlina', CHF: 'Franco suíço', CAD: 'Dólar canadense',
  AUD: 'Dólar australiano', JPY: 'Iene', DKK: 'Coroa dinamarquesa', NOK: 'Coroa norueguesa', SEK: 'Coroa sueca',
  ARS: 'Peso argentino', CLP: 'Peso chileno', UYU: 'Peso uruguaio', PYG: 'Guarani',
};
/** Moedas que a pessoa pode escolher como referência (as que têm cotação oficial no app + real). */
export const MOEDAS_REFERENCIA = ['BRL', 'USD', 'EUR', 'GBP', 'CHF', 'CAD', 'AUD', 'JPY'];

type Tabela = { fonte: string; url: string; moedas: Record<string, { venda: number; data: string }> };
const TAB = CAMBIO as Tabela;
export const FONTE_CAMBIO = { nome: TAB.fonte, url: TAB.url };

export interface Taxa {
  /** Quanto 1 unidade de `de` vale em `para`. */
  valor: number;
  /** Data da cotação mais antiga usada (quando há conversão cruzada). */
  data: string;
  fonte: string;
  tipo: 'referencia' | 'informado';
}

/** Valor em reais de 1 unidade (PTAX venda). Real = 1. */
function emReais(m: string, tab: Tabela): { v: number; data: string } | null {
  if (m === 'BRL') return { v: 1, data: '' };
  const c = tab.moedas[m];
  return c ? { v: c.venda, data: c.data } : null;
}

/** Cotação de referência entre duas moedas, cruzando pelo real (PTAX). Null se não houver fonte. */
export function taxa(de: string, para: string, tab: Tabela = TAB): Taxa | null {
  if (de === para) return { valor: 1, data: '', fonte: 'mesma moeda', tipo: 'referencia' };
  const a = emReais(de, tab);
  const b = emReais(para, tab);
  if (!a || !b) return null;
  const datas = [a.data, b.data].filter(Boolean).sort();
  return {
    valor: a.v / b.v,
    data: datas[0] ?? '',
    fonte: de === 'BRL' || para === 'BRL' ? 'Banco Central, PTAX de venda' : 'Banco Central, PTAX de venda (conversão cruzada pelo real)',
    tipo: 'referencia',
  };
}

export const converter = (centavos: number, t: Taxa | null) => (t ? Math.round(centavos * t.valor) : null);

export function dinheiro(centavos: number, moeda: string, casas?: number): string {
  const semCentavos = moeda === 'JPY' || moeda === 'CLP' || moeda === 'PYG';
  const d = casas ?? (semCentavos || centavos % 100 === 0 ? 0 : 2);
  try {
    return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: moeda, minimumFractionDigits: d, maximumFractionDigits: d });
  } catch {
    return `${(centavos / 100).toFixed(d)} ${moeda}`;
  }
}

export const dataBR = (iso: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '');

/**
 * IOF sobre compras no exterior com cartão (crédito, débito, pré-pago) e compra de moeda em
 * espécie: 3,5% desde 17/07/2025 (Decreto nº 12.499/2025, que alterou o Decreto 6.306/2007).
 * Só vale para quem paga a partir do Brasil, em reais. Alguns bancos absorvem o IOF.
 */
export const IOF = {
  aliquota: 0.035,
  texto: 'IOF de 3,5% (cartão de crédito, débito, pré-pago e compra de moeda em espécie)',
  fonte: 'Decreto nº 12.499/2025',
  url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/D12499.htm',
  consultadoEm: '2026-11-17',
};

export interface Custo {
  /** Valor no destino, como está na fonte. */
  original: { centavos: number; moeda: string };
  /** Conversão pela PTAX (sem IOF nem spread). */
  referencia: number | null;
  /** Referência + IOF, quando a moeda de referência é o real. Spread não incluído. */
  estimativa: number | null;
  /** Pelo VET informado pela pessoa (reais por unidade). */
  efetivo: number | null;
  taxa: Taxa | null;
}

export function custo(centavos: number, moedaDestino: string, moedaRef: string, vetInformado?: number | null): Custo {
  const t = taxa(moedaDestino, moedaRef);
  const referencia = converter(centavos, t);
  const temIof = moedaRef === 'BRL' && moedaDestino !== 'BRL';
  return {
    original: { centavos, moeda: moedaDestino },
    referencia,
    estimativa: referencia === null ? null : temIof ? Math.round(referencia * (1 + IOF.aliquota)) : referencia,
    efetivo: vetInformado && moedaRef === 'BRL' ? Math.round(centavos * vetInformado) : null,
    taxa: t,
  };
}

/** Fontes oficiais para entender câmbio e comparar instituições. */
export const FONTES_CAMBIO = {
  vet: { nome: 'Banco Central — ranking do VET (custo total do câmbio por instituição)', url: 'https://www.bcb.gov.br/rex/vet/vet.asp' },
  cartilha: { nome: 'Banco Central — Cartilha de câmbio 2026', url: 'https://www.bcb.gov.br/content/estabilidadefinanceira/politica_cambial/Cartilha_cambio_2026.pdf' },
  ptax: { nome: 'Banco Central — cotações e boletins (PTAX)', url: 'https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes' },
};
