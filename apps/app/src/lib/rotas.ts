/**
 * Rota pelas ruas entre as paradas do dia (D-090). Usa o serviço gratuito de rotas do OpenStreetMap
 * (FOSSGIS, sem chave). Até ~4 km em linha reta: a pé; acima disso: de carro. Se o serviço falhar,
 * o mapa volta à linha tracejada entre as paradas.
 */
export type Modo = 'a-pe' | 'carro';
export interface Rota { coords: [number, number][]; km: number; minutos: number; modo: Modo }

const cache = new Map<string, Rota | null>();

function linhaRetaKm(c: [number, number][]): number {
  let t = 0;
  for (let i = 0; i < c.length - 1; i++) {
    const [lo1, la1] = c[i]!; const [lo2, la2] = c[i + 1]!;
    const r = Math.PI / 180; const x = (lo2 - lo1) * r * Math.cos(((la1 + la2) / 2) * r); const y = (la2 - la1) * r;
    t += Math.sqrt(x * x + y * y) * 6371;
  }
  return t;
}

export const modoDaRota = (c: [number, number][]): Modo => (linhaRetaKm(c) <= 4 ? 'a-pe' : 'carro');

/** Pontos em [lon, lat], na ordem da visita (até 25). */
export async function rotaPelasRuas(c: [number, number][]): Promise<Rota | null> {
  if (c.length < 2) return null;
  const pts = c.slice(0, 25);
  const modo = modoDaRota(pts);
  const chave = `${modo}:${pts.map(([a, b]) => `${a.toFixed(5)},${b.toFixed(5)}`).join(';')}`;
  if (cache.has(chave)) return cache.get(chave)!;
  const perfil = modo === 'a-pe' ? 'routed-foot' : 'routed-car';
  try {
    const r = await fetch(`https://routing.openstreetmap.de/${perfil}/route/v1/driving/${pts.map(([a, b]) => `${a},${b}`).join(';')}?overview=full&geometries=geojson`, { signal: AbortSignal.timeout(10_000) });
    if (!r.ok) throw new Error(String(r.status));
    const j = (await r.json()) as { code?: string; routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[] };
    const rota = j.code === 'Ok' && j.routes?.[0] ? { coords: j.routes[0].geometry.coordinates, km: j.routes[0].distance / 1000, minutos: Math.round(j.routes[0].duration / 60), modo } : null;
    cache.set(chave, rota);
    return rota;
  } catch {
    return null; // sem guardar: tenta de novo na próxima vez
  }
}

/** Link que abre a rota do dia no Google Maps (navegação de verdade). Pontos em { lat, lon }, na ordem. */
export function linkGoogleMaps(pontos: { lat: number; lon: number }[], modo: Modo): string | null {
  if (pontos.length < 2) return null;
  const p = (x: { lat: number; lon: number }) => `${x.lat.toFixed(6)},${x.lon.toFixed(6)}`;
  const meio = pontos.slice(1, -1).slice(0, 8); // o Google aceita poucas paradas no link
  const q = new URLSearchParams({ api: '1', origin: p(pontos[0]!), destination: p(pontos.at(-1)!), travelmode: modo === 'a-pe' ? 'walking' : 'driving' });
  if (meio.length) q.set('waypoints', meio.map(p).join('|'));
  return `https://www.google.com/maps/dir/?${q.toString()}`;
}
