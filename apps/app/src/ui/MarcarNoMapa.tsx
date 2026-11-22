import 'maplibre-gl/dist/maplibre-gl.css';
import urlDoWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

import type { Map as MapaLibre, Marker } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';

const ESTILO = 'https://tiles.openfreemap.org/styles/positron';

/** Mapa para marcar um ponto: toque no mapa (ou arraste o marcador) para dizer onde fica o lugar. */
export function MarcarNoMapa({ centro, ponto, aoMarcar, altura = '280px' }: { centro: { lat: number; lon: number }; ponto: { lat: number; lon: number } | null; aoMarcar: (p: { lat: number; lon: number }) => void; altura?: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLibre | null>(null);
  const marcador = useRef<Marker | null>(null);
  const lib = useRef<typeof import('maplibre-gl') | null>(null);
  const aviso = useRef(aoMarcar);
  aviso.current = aoMarcar;
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let vivo = true;
    void import('maplibre-gl').then((maplibregl) => {
      if (!vivo || !caixa.current || mapa.current) return;
      lib.current = maplibregl;
      maplibregl.setWorkerUrl(urlDoWorker);
      try {
        const m = new maplibregl.Map({ container: caixa.current, style: ESTILO, center: [centro.lon, centro.lat], zoom: 14, attributionControl: { compact: true } });
        m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        m.on('click', (e) => aviso.current({ lat: e.lngLat.lat, lon: e.lngLat.lng }));
        m.on('error', (e: { error?: { message?: string } }) => { if (String(e?.error?.message ?? '').includes('Failed to fetch')) setErro(true); });
        mapa.current = m;
      } catch {
        setErro(true);
      }
    });
    return () => { vivo = false; mapa.current?.remove(); mapa.current = null; marcador.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const m = mapa.current; const L = lib.current;
    if (!m || !L) return;
    if (!ponto) { marcador.current?.remove(); marcador.current = null; return; }
    if (!marcador.current) {
      marcador.current = new L.Marker({ color: '#0B1F4B', draggable: true }).setLngLat([ponto.lon, ponto.lat]).addTo(m);
      marcador.current.on('dragend', () => { const p = marcador.current!.getLngLat(); aviso.current({ lat: p.lat, lon: p.lng }); });
    } else marcador.current.setLngLat([ponto.lon, ponto.lat]);
  }, [ponto]);

  if (erro) return <p style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>O mapa não abriu. Confira a internet e tente de novo.</p>;
  return <div ref={caixa} role="application" aria-label="Mapa: toque onde fica o lugar" style={{ width: '100%', height: altura, borderRadius: '16px', overflow: 'hidden', background: 'var(--cartao-2)' }} />;
}
