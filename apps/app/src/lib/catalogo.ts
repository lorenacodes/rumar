import CATALOGO from '../dados/catalogo.json';
import OSM from '../dados/lugares-osm.json';
import type { Categoria, Lugar } from './planejador';

/**
 * Catálogo de lugares reais (curadoria) + localização, endereço e horário do OpenStreetMap
 * (dados/lugares-osm.json, gerado pela automação "Fotos dos lugares").
 */
interface Osm {
  lat: number;
  lon: number;
  endereco: string | null;
  horario: string | null;
  site: string | null;
  osm: string;
}

const osm = (OSM as { lugares: Record<string, Osm>; atualizadoEm: string | null }).lugares;
export const OSM_ATUALIZADO_EM = (OSM as { atualizadoEm: string | null }).atualizadoEm;
export const CIDADE = CATALOGO.cidade;
export const CATEGORIAS = CATALOGO.categorias as Record<Categoria, string>;

/** Horário do OpenStreetMap só vale se estiver no formato padrão (às vezes vem um aviso em texto). */
const horarioValido = (h: string | null | undefined) => (h && !/["]|check|website/i.test(h) ? h : null);

export const LUGARES: Lugar[] = (CATALOGO.lugares as unknown as Lugar[]).map((l) => {
  const o = osm[l.id];
  return o ? { ...l, ...o, horario: horarioValido(o.horario) } : l;
});

export function lugarPorId(id: string): Lugar | undefined {
  return LUGARES.find((l) => l.id === id);
}

const DIAS: Record<string, string> = { Mo: 'seg', Tu: 'ter', We: 'qua', Th: 'qui', Fr: 'sex', Sa: 'sáb', Su: 'dom', PH: 'feriados' };
const MESES: Record<string, string> = { Jan: 'jan', Feb: 'fev', Mar: 'mar', Apr: 'abr', May: 'mai', Jun: 'jun', Jul: 'jul', Aug: 'ago', Sep: 'set', Oct: 'out', Nov: 'nov', Dec: 'dez' };
/** "Tu-Su 10:00-18:00; Mo off" → "ter–dom 10:00–18:00 · seg fechado" (texto do OpenStreetMap). */
export function horarioLegivel(h: string): string {
  return h
    .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (m) => MESES[m] ?? m)
    .replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su|PH)\b/g, (d) => DIAS[d] ?? d)
    .replace(/(\d)-(\d)/g, '$1–$2')
    .replace(/([a-zá]{3})-([a-zá]{3})/g, '$1–$2')
    .replace(/\boff\b/g, 'fechado')
    .replace(/24\/7/, 'aberto 24 horas')
    .replace(/;\s*/g, ' · ');
}
