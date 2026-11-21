/**
 * Experiências (D-080): coisas para fazer, pesquisadas pelo Bo Vair, com site oficial e preço com fonte e data.
 * Ordem pelo jeito de viajar e pelo orçamento: estilo e gostos combinam, e quanto menos econômico, mais o
 * diferente sobe (mesma escala do roteiro, D-079). Inclui bate-voltas a até 80 km.
 */
import { supabase } from './supabase';
import { intensidadeDiferente, type Preferencias } from './planejador';

export interface Experiencia {
  id: string; destino_id: string; titulo: string; resumo: string; dica: string | null; tipo: string;
  estilos: string[]; gostos: string[]; nivel: 'economico' | 'intermediario' | 'conforto'; diferente: boolean; gratis: boolean;
  preco_min_centavos: number | null; preco_max_centavos: number | null; preco_texto: string | null; preco_fonte: string | null;
  preco_fonte_url: string | null; preco_data: string | null; site_oficial: string | null; quando: string | null;
  duracao_min: number | null; place_id: string | null; verificado_em: string;
  /** Nome da cidade quando é bate-volta (outra cidade perto). */
  bateVolta?: string | null;
  km?: number | null;
}

type Base = { todas: Experiencia[]; destinos: Map<string, { nome: string; lat: number; lon: number }> };
/** Uma busca só, compartilhada: várias telas pedindo ao mesmo tempo esperam a mesma resposta. */
let cache: Promise<Base> | null = null;
function carregar(): Promise<Base> {
  cache ??= (async () => {
    const { data } = await supabase.from('experiencias').select('*').limit(2000);
    const todas = (data ?? []) as Experiencia[];
    const ids = [...new Set(todas.map((e) => e.destino_id))];
    const { data: d } = ids.length ? await supabase.from('destinos').select('id, nome, lat, lon').in('id', ids) : { data: [] };
    return { todas, destinos: new Map((d ?? []).map((x) => [x.id as string, { nome: x.nome as string, lat: x.lat as number, lon: x.lon as number }])) };
  })().catch((e) => { cache = null; throw e; });
  return cache;
}

const km = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const r = Math.PI / 180; const x = (b.lon - a.lon) * r * Math.cos(((a.lat + b.lat) / 2) * r); const y = (b.lat - a.lat) * r;
  return Math.sqrt(x * x + y * y) * 6371;
};

/** Experiências da cidade e de bate-volta (até 80 km). */
export async function experienciasPerto(destino: { id: string; lat?: number | null; lon?: number | null }): Promise<Experiencia[]> {
  const { todas, destinos } = await carregar();
  const centro = destino.lat != null && destino.lon != null ? { lat: destino.lat, lon: destino.lon } : destinos.get(destino.id) ?? null;
  return todas.flatMap((e): Experiencia[] => {
    if (e.destino_id === destino.id) return [{ ...e, bateVolta: null, km: 0 }];
    const d = destinos.get(e.destino_id);
    if (!centro || !d) return [];
    const dist = km(centro, d);
    return dist <= 80 ? [{ ...e, bateVolta: d.nome, km: Math.round(dist) }] : [];
  });
}

/** Pontos de uma experiência para a pessoa (só ordena; nada some). */
export function pontuarExperiencia(e: Experiencia, p: Preferencias | null): number {
  if (!p) return (e.diferente ? 1 : 0) - (e.bateVolta ? 1 : 0);
  let pts = 0;
  if (e.estilos.includes(p.estilo)) pts += 3;
  pts += e.gostos.filter((g) => (p.gostos as string[]).includes(g)).length * 2;
  if (p.evitar.includes('cultura') && (e.tipo === 'museu' || e.tipo === 'cultura')) pts -= 4;
  const i = intensidadeDiferente(p);
  if (e.diferente) pts += i;
  if (p.orcamento === 'economico') pts += e.gratis ? 4 : e.nivel === 'economico' ? 1 : e.nivel === 'conforto' ? -5 : -3;
  if (p.orcamento === 'conforto' && e.gratis) pts -= 1;
  if (p.gratuitos && e.gratis) pts += 2;
  if (e.bateVolta) pts -= 1;
  return pts;
}

export function ordenarExperiencias(lista: Experiencia[], p: Preferencias | null): Experiencia[] {
  return [...lista].sort((a, b) => pontuarExperiencia(b, p) - pontuarExperiencia(a, p) || a.titulo.localeCompare(b.titulo));
}

/** place_ids dos lugares que são experiências pesquisadas (o roteiro dá preferência a eles). */
export async function lugaresDeExperiencia(destinoId: string): Promise<Set<string>> {
  const { todas } = await carregar();
  return new Set(todas.filter((e) => e.destino_id === destinoId && e.place_id).map((e) => e.place_id!));
}

/** Preços das experiências com fonte, para o custo da viagem (D-090): só as ligadas a um lugar do roteiro. */
export async function precosDeExperiencias(destinoId: string): Promise<Record<string, { min: number; max: number; selo: 'referencia'; fonte: string; url: string; moeda: 'BRL' }>> {
  const { todas } = await carregar();
  const r: Record<string, { min: number; max: number; selo: 'referencia'; fonte: string; url: string; moeda: 'BRL' }> = {};
  for (const e of todas) {
    if (e.destino_id !== destinoId || !e.place_id || e.preco_min_centavos == null || !e.preco_fonte || !e.preco_fonte_url) continue;
    r[e.place_id] = { min: e.preco_min_centavos, max: e.preco_max_centavos ?? e.preco_min_centavos, selo: 'referencia', fonte: `${e.preco_fonte}, ${e.preco_data ?? 'sem data'}`, url: e.preco_fonte_url, moeda: 'BRL' };
  }
  return r;
}
