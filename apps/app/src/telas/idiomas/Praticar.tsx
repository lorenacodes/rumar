import { useEffect, useRef, useState } from 'react';

import { falar, pararFala, temVoz, type CodigoIdioma } from '../../lib/idiomas';

const LIMITE_S = 10;
type Estado = 'pronto' | 'pedindo' | 'gravando' | 'gravado' | 'negado' | 'sem-microfone' | 'erro';

const podeGravar = () => typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined';
/** Formato de áudio que o aparelho grava (Android/Chrome: webm; Safari: mp4). */
const formato = () => ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported?.(t)) ?? '';

/**
 * "Pratique a frase": grava a pessoa falando e deixa comparar com a pronúncia certa.
 * A gravação fica só na memória deste aparelho: não vai para servidor e some ao fechar a prática ou sair da aula.
 */
export function Praticar({ texto, idioma, aoFechar }: { texto: string; idioma: CodigoIdioma; aoFechar: () => void }) {
  const [estado, setEstado] = useState<Estado>(podeGravar() ? 'pronto' : 'sem-microfone');
  const [segundos, setSegundos] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [tocando, setTocando] = useState<'certa' | 'minha' | 'duas' | null>(null);
  const gravador = useRef<MediaRecorder | null>(null);
  const fluxo = useRef<MediaStream | null>(null);
  const relogio = useRef<number | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const voz = temVoz();

  const soltarMicrofone = () => {
    if (relogio.current) { window.clearInterval(relogio.current); relogio.current = null; }
    fluxo.current?.getTracks().forEach((t) => t.stop());
    fluxo.current = null;
  };
  // Ao fechar: para tudo e apaga a gravação da memória.
  useEffect(() => () => {
    try { if (gravador.current?.state === 'recording') gravador.current.stop(); } catch { /* já parou */ }
    soltarMicrofone();
    audio.current?.pause();
    pararFala();
  }, []);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const parar = () => { if (gravador.current?.state === 'recording') gravador.current.stop(); };

  const gravar = async () => {
    pararFala(); audio.current?.pause(); setTocando(null);
    setEstado('pedindo');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      fluxo.current = s;
      const tipo = formato();
      const r = new MediaRecorder(s, tipo ? { mimeType: tipo } : undefined);
      const pedacos: BlobPart[] = [];
      r.ondataavailable = (e) => { if (e.data.size) pedacos.push(e.data); };
      r.onstop = () => {
        soltarMicrofone();
        const blob = new Blob(pedacos, { type: r.mimeType || tipo || 'audio/webm' });
        if (!blob.size) { setEstado('erro'); return; }
        setUrl((antiga) => { if (antiga) URL.revokeObjectURL(antiga); return URL.createObjectURL(blob); });
        setEstado('gravado');
      };
      gravador.current = r;
      r.start();
      setSegundos(0);
      setEstado('gravando');
      const inicio = Date.now();
      relogio.current = window.setInterval(() => {
        const s2 = Math.floor((Date.now() - inicio) / 1000);
        setSegundos(s2);
        if (s2 >= LIMITE_S) parar();
      }, 250);
    } catch (e) {
      soltarMicrofone();
      const nome = (e as { name?: string })?.name ?? '';
      setEstado(nome === 'NotAllowedError' || nome === 'SecurityError' ? 'negado' : nome === 'NotFoundError' ? 'sem-microfone' : 'erro');
    }
  };

  const tocarMinha = () => new Promise<void>((resolve) => {
    if (!url) return resolve();
    const a = audio.current ?? new Audio();
    audio.current = a;
    a.src = url;
    a.onended = () => resolve();
    a.onerror = () => resolve();
    void a.play().catch(() => resolve());
  });
  const ouvir = async (qual: 'certa' | 'minha' | 'duas') => {
    pararFala(); audio.current?.pause();
    setTocando(qual);
    if (qual !== 'minha') await falar(texto, idioma);
    if (qual !== 'certa') {
      if (qual === 'duas') await new Promise((r) => window.setTimeout(r, 350));
      await tocarMinha();
    }
    setTocando(null);
  };

  return (
    <div className="idi-pratica" role="group" aria-label={`Praticar: ${texto}`}>
      <p className="idi-pratica-dica" aria-live="polite">
        {estado === 'pronto' && 'Ouça, depois grave você falando a frase.'}
        {estado === 'pedindo' && 'Permita o uso do microfone.'}
        {estado === 'gravando' && `Gravando… ${segundos}s de ${LIMITE_S}s`}
        {estado === 'gravado' && 'Compare a sua com a pronúncia certa.'}
        {estado === 'negado' && 'O microfone está bloqueado. Libere nas configurações do celular, em Apps, e tente de novo.'}
        {estado === 'sem-microfone' && 'Este aparelho não deixa gravar aqui. Você ainda pode ouvir e repetir em voz alta.'}
        {estado === 'erro' && 'Não deu para gravar. Tente de novo.'}
      </p>

      <div className="idi-pratica-botoes">
        {voz && estado !== 'gravando' ? (
          <button type="button" className="r-btn idi-pbtn" onClick={() => void ouvir('certa')} disabled={tocando !== null}>
            {tocando === 'certa' ? 'Tocando…' : 'Ouvir a certa'}
          </button>
        ) : null}
        {estado === 'gravando' ? (
          <button type="button" className="r-btn idi-pbtn gravando" onClick={parar}><span className="idi-ponto" aria-hidden="true" />Parar</button>
        ) : estado !== 'sem-microfone' ? (
          <button type="button" className="r-btn idi-pbtn principal" onClick={() => void gravar()} disabled={estado === 'pedindo' || tocando !== null}>
            {estado === 'gravado' ? 'Gravar de novo' : 'Gravar minha voz'}
          </button>
        ) : null}
      </div>

      {estado === 'gravado' && url ? (
        <div className="idi-pratica-botoes">
          <button type="button" className="r-btn idi-pbtn" onClick={() => void ouvir('minha')} disabled={tocando !== null}>{tocando === 'minha' ? 'Tocando…' : 'Ouvir a minha'}</button>
          {voz ? <button type="button" className="r-btn idi-pbtn" onClick={() => void ouvir('duas')} disabled={tocando !== null}>{tocando === 'duas' ? 'Tocando…' : 'Ouvir as duas'}</button> : null}
        </div>
      ) : null}

      <div className="idi-pratica-rodape">
        <span>Sua gravação fica só neste aparelho e some ao fechar.</span>
        <button type="button" className="r-btn" onClick={aoFechar}>Fechar</button>
      </div>
    </div>
  );
}
