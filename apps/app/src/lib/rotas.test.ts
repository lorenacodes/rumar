import { afterEach, describe, expect, it, vi } from 'vitest';

import { linkGoogleMaps, modoDaRota, rotaPelasRuas } from './rotas';

describe('rotas (D-090)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('perto vai a pé; longe vai de carro', () => {
    expect(modoDaRota([[-34.877, -8.063], [-34.871, -8.061]])).toBe('a-pe');
    expect(modoDaRota([[-34.877, -8.063], [-34.95, -8.2]])).toBe('carro');
  });

  it('link do Google Maps com origem, destino, paradas e modo', () => {
    const url = new URL(linkGoogleMaps([{ lat: -8.06, lon: -34.87 }, { lat: -8.061, lon: -34.872 }, { lat: -8.07, lon: -34.88 }], 'a-pe')!);
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
    expect(url.searchParams.get('origin')).toBe('-8.060000,-34.870000');
    expect(url.searchParams.get('destination')).toBe('-8.070000,-34.880000');
    expect(url.searchParams.get('waypoints')).toBe('-8.061000,-34.872000');
    expect(url.searchParams.get('travelmode')).toBe('walking');
    expect(linkGoogleMaps([{ lat: 1, lon: 1 }], 'carro')).toBeNull();
  });

  it('rota pelas ruas: usa a geometria do serviço e o perfil a pé', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ code: 'Ok', routes: [{ distance: 1850, duration: 1500, geometry: { coordinates: [[-34.877, -8.063], [-34.875, -8.062], [-34.871, -8.061]] } }] }) });
    vi.stubGlobal('fetch', fetchMock);
    const r = await rotaPelasRuas([[-34.877, -8.063], [-34.871, -8.061]]);
    expect(fetchMock.mock.calls[0]![0]).toContain('routing.openstreetmap.de/routed-foot/');
    expect(r).toEqual({ coords: [[-34.877, -8.063], [-34.875, -8.062], [-34.871, -8.061]], km: 1.85, minutos: 25, modo: 'a-pe' });
  });

  it('se o serviço falhar, devolve null (o mapa volta à linha tracejada)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await rotaPelasRuas([[-30, -8], [-30.01, -8.01]])).toBeNull();
  });
});
