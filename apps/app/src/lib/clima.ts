/**
 * Clima da viagem (D-088), pela Open-Meteo (grátis, sem chave, CC BY 4.0):
 * - até 15 dias à frente: previsão;
 * - mais longe: clima típico (as mesmas datas do ano passado, dados históricos);
 * - viagem que já passou: o clima que fez.
 * Guarda 6 h no aparelho para não repetir a consulta.
 */
import { hojeLocal } from './datas';
import { diasEntre } from './poupanca';

export type FonteClima = 'previsao' | 'tipico' | 'real';
export interface DiaClima { data: string; max: number; min: number; chuva: number | null; chuvaMm: number | null; codigo: number | null }
export interface Clima { fonte: FonteClima; dias: DiaClima[] }

const mais = (iso: string, d: number) => { const x = new Date(`${iso}T12:00:00Z`); x.setUTCDate(x.getUTCDate() + d); return x.toISOString().slice(0, 10); };
const anoAntes = (iso: string) => `${Number(iso.slice(0, 4)) - 1}${iso.slice(4)}`;

export function fonteDoClima(dataIda: string, noites: number, hoje = hojeLocal()): FonteClima {
  const fim = mais(dataIda, noites);
  if (fim < hoje) return 'real';
  return diasEntre(hoje, fim) <= 15 ? 'previsao' : 'tipico';
}

/** Lê a resposta "daily" da Open-Meteo (listas paralelas por dia). */
export function lerDiario(j: unknown): DiaClima[] {
  const d = (j as { daily?: Record<string, (number | string | null)[]> })?.daily;
  if (!d?.time) return [];
  return (d.time as string[]).map((data, i) => ({
    data,
    max: Math.round(Number(d.temperature_2m_max?.[i])),
    min: Math.round(Number(d.temperature_2m_min?.[i])),
    chuva: d.precipitation_probability_max?.[i] != null ? Number(d.precipitation_probability_max[i]) : null,
    chuvaMm: d.precipitation_sum?.[i] != null ? Math.round(Number(d.precipitation_sum[i]) * 10) / 10 : null,
    codigo: d.weather_code?.[i] != null ? Number(d.weather_code[i]) : null,
  })).filter((x) => Number.isFinite(x.max) && Number.isFinite(x.min));
}

export async function climaDaViagem(lat: number, lon: number, dataIda: string, noites: number): Promise<Clima | null> {
  const fonte = fonteDoClima(dataIda, noites);
  const chave = `bovair.clima.${lat.toFixed(2)},${lon.toFixed(2)},${dataIda},${noites}`;
  try {
    const c = JSON.parse(localStorage.getItem(chave) ?? 'null') as { em: number; clima: Clima } | null;
    if (c && Date.now() - c.em < 6 * 3600_000) return c.clima;
  } catch { /* sem cache */ }
  const fim = mais(dataIda, noites);
  const base = `latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&timezone=auto`;
  let url: string;
  if (fonte === 'previsao') {
    // A previsão também traz os dias recentes que já passaram (viagem em andamento).
    url = `https://api.open-meteo.com/v1/forecast?${base}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&start_date=${dataIda}&end_date=${fim}`;
  } else {
    const ini = fonte === 'real' ? dataIda : anoAntes(dataIda);
    const ate = fonte === 'real' ? fim : anoAntes(fim);
    url = `https://archive-api.open-meteo.com/v1/archive?${base}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&start_date=${ini}&end_date=${ate}`;
  }
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    let dias = lerDiario(await r.json());
    // Clima típico: as datas do ano passado viram as datas da viagem.
    if (fonte === 'tipico') dias = dias.map((d, i) => ({ ...d, data: mais(dataIda, i) }));
    if (!dias.length) return null;
    const clima = { fonte, dias };
    try { localStorage.setItem(chave, JSON.stringify({ em: Date.now(), clima })); } catch { /* sem espaço */ }
    return clima;
  } catch { return null; }
}

/** Código do tempo (WMO) em palavras curtas. */
export function nomeDoTempo(c: number | null): string | null {
  if (c == null) return null;
  if (c === 0) return 'Céu limpo';
  if (c <= 2) return 'Poucas nuvens';
  if (c === 3) return 'Nublado';
  if (c === 45 || c === 48) return 'Neblina';
  if (c >= 51 && c <= 57) return 'Garoa';
  if ((c >= 61 && c <= 67) || (c >= 80 && c <= 82)) return 'Chuva';
  if (c >= 71 && c <= 77) return 'Neve';
  if (c >= 95) return 'Trovoadas';
  return null;
}

/** "29° / 23° · Chuva 40%" (previsão) ou "29° / 23° · 2 mm de chuva" (histórico). */
export function textoDoDia(d: DiaClima, fonte: FonteClima): string {
  const tempo = nomeDoTempo(d.codigo);
  const chuva = fonte === 'previsao' ? (d.chuva != null && d.chuva >= 20 ? `chuva ${d.chuva}%` : null) : (d.chuvaMm != null && d.chuvaMm >= 1 ? `${String(d.chuvaMm).replace('.', ',')} mm de chuva` : null);
  return [`${d.max}° / ${d.min}°`, chuva && (tempo === 'Chuva' || tempo === 'Garoa') ? null : tempo, chuva].filter(Boolean).join(' · ');
}
