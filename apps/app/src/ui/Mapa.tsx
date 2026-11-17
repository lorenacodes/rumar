import 'maplibre-gl/dist/maplibre-gl.css';

import type { Map as MapaLibre, Marker } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';

/**
 * Mapa interativo de verdade: MapLibre (código aberto) com o mapa do OpenFreeMap
 * (OpenStreetMap, gratuito e sem chave). Marcadores numerados na ordem da visita, linha do
 * percurso e o hotel. Tocar num marcador chama `aoEscolher`.
 */
export interface Ponto {
  id: string;
  lat: number;
  lon: number;
  rotulo: string;
  titulo: string;
  tipo?: 'parada' | 'hotel' | 'lugar' | 'sugerido';
}

const ESTILO = 'https://tiles.openfreemap.org/styles/positron';
const COR = { parada: '#0B1F4B', hotel: '#1F4FD8', lugar: '#4A5575', sugerido: '#8A5A00' } as const;

export function Mapa({ pontos, linha = false, altura = '320px', aoEscolher, selecionado }: { pontos: Ponto[]; linha?: boolean; altura?: string; aoEscolher?: (id: string) => void; selecionado?: string | null }) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLibre | null>(null);
  const marcadores = useRef<Marker[]>([]);
  const [erro, setErro] = useState(false);
  const [pronto, setPronto] = useState(false);
  const chave = JSON.stringify(pontos.map((p) => [p.id, p.lat, p.lon, p.rotulo, p.tipo])) + linha;

  useEffect(() => {
    let vivo = true;
    void import('maplibre-gl').then(({ default: maplibregl }) => {
      if (!vivo || !caixa.current || mapa.current) return;
      try {
        const m = new maplibregl.Map({ container: caixa.current, style: ESTILO, center: [2.3488, 48.8534], zoom: 12, attributionControl: { compact: true } });
        m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        m.on('load', () => vivo && setPronto(true));
        m.on('error', (e) => {
          if (String(e?.error?.message ?? '').includes('Failed to fetch')) setErro(true);
        });
        mapa.current = m;
      } catch {
        setErro(true);
      }
    });
    return () => {
      vivo = false;
      mapa.current?.remove();
      mapa.current = null;
    };
  }, []);

  useEffect(() => {
    const m = mapa.current;
    if (!m || !pronto) return;
    void import('maplibre-gl').then(({ default: maplibregl }) => {
      for (const mk of marcadores.current) mk.remove();
      marcadores.current = pontos.map((p) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.setAttribute('aria-label', p.titulo);
        el.textContent = p.rotulo;
        const ativo = selecionado === p.id;
        Object.assign(el.style, {
          width: '30px', height: '30px', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,.4)', cursor: 'pointer',
          background: ativo ? '#FFC845' : COR[p.tipo ?? 'parada'], color: ativo ? '#0B1F4B' : '#fff',
          font: "600 13px 'Open Sans', sans-serif", borderRadius: p.tipo === 'hotel' ? '4px' : '50%', padding: '0',
        });
        el.addEventListener('click', (ev) => (ev.stopPropagation(), aoEscolher?.(p.id)));
        return new maplibregl.Marker({ element: el }).setLngLat([p.lon, p.lat]).addTo(m);
      });
      const coords = pontos.filter((p) => p.tipo !== 'hotel').map((p) => [p.lon, p.lat] as [number, number]);
      const fonte = m.getSource('percurso') as { setData?: (d: unknown) => void } | undefined;
      const dados = { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: linha ? coords : [] } };
      if (fonte?.setData) fonte.setData(dados);
      else {
        m.addSource('percurso', { type: 'geojson', data: dados as never });
        m.addLayer({ id: 'percurso', type: 'line', source: 'percurso', paint: { 'line-color': '#1F4FD8', 'line-width': 3, 'line-dasharray': [2, 1.5] } });
      }
      if (pontos.length) {
        const b = new maplibregl.LngLatBounds();
        for (const p of pontos) b.extend([p.lon, p.lat]);
        m.fitBounds(b, { padding: 48, maxZoom: 15, duration: 0 });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, pronto, selecionado]);

  return (
    <div style={{ position: 'relative', width: '100%', height: altura, background: 'var(--cartao-2)' }}>
      <div ref={caixa} style={{ position: 'absolute', inset: 0 }} role="region" aria-label="Mapa" />
      {erro ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--texto-sec)' }}>
          O mapa precisa de internet. Os lugares continuam na lista.
        </div>
      ) : null}
    </div>
  );
}
