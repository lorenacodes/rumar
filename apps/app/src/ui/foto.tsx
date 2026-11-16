import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { useEffect, useState } from 'react';

import { useDemo } from '../dev/demo';

/**
 * Fotos dos destinos: imagem principal do artigo da Wikipédia (fotos livres do
 * Wikimedia Commons), com crédito. Grátis e sem chave. Guardadas na memória da sessão.
 */
const ARTIGO: Record<string, string> = {
  Paris: 'Paris',
  Lisboa: 'Lisboa',
  Penedo: 'Penedo (Alagoas)',
  Maceió: 'Maceió',
  Salvador: 'Salvador (Bahia)',
  Recife: 'Recife',
  Cascais: 'Cascais',
  Lagos: 'Lagos (Portugal)',
  Itália: 'Itália',
  Roma: 'Roma',
  Aracaju: 'Aracaju',
  Montmartre: 'Montmartre',
};
export const DESTINOS_COM_FOTO = Object.keys(ARTIGO);

const cache = new Map<string, Promise<string | null>>();

function buscarFoto(nome: string): Promise<string | null> {
  const artigo = ARTIGO[nome] ?? nome;
  if (!cache.has(artigo)) {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artigo.replace(/ /g, '_'))}`;
    const pedido = (async () => {
      try {
        const dados = Capacitor.isNativePlatform()
          ? (await CapacitorHttp.get({ url, responseType: 'json' })).data
          : await (await fetch(url)).json();
        const d = (typeof dados === 'string' ? JSON.parse(dados) : dados) as { thumbnail?: { source: string }; originalimage?: { source: string } };
        // Miniatura maior (800 px) em vez do original pesado.
        const mini = d.thumbnail?.source?.replace(/\/\d+px-/, '/800px-');
        return mini ?? d.originalimage?.source ?? null;
      } catch {
        return null;
      }
    })();
    cache.set(artigo, pedido);
  }
  return cache.get(artigo)!;
}

/** Ocupa o espaço da foto do design (o elemento pai precisa ter position). */
export function FotoDestino({ nome }: { nome: string }) {
  const demo = useDemo();
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (demo) return;
    let vivo = true;
    void buscarFoto(nome).then((s) => vivo && setSrc(s));
    return () => {
      vivo = false;
    };
  }, [nome, demo]);
  if (!src) return null;
  return (
    <>
      <img src={src} alt={`Foto de ${nome}`} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
      <span style={{ position: 'absolute', left: 6, bottom: 4, zIndex: 1, font: "400 10px 'Open Sans'", color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,.6)' }}>Foto: Wikimedia Commons</span>
    </>
  );
}

/** Rótulo "Foto de X" do design: aparece só enquanto não há foto (e no modo de comparação). */
export function RotuloFoto({ nome, style }: { nome: string; style?: React.CSSProperties }) {
  const demo = useDemo();
  const [temFoto, setTemFoto] = useState(false);
  useEffect(() => {
    if (demo) return;
    void buscarFoto(nome).then((s) => setTemFoto(Boolean(s)));
  }, [nome, demo]);
  if (temFoto) return null;
  return <span style={style}>Foto de {nome}</span>;
}
