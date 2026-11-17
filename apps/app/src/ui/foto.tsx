import { useEffect, useState, type CSSProperties } from 'react';

import FOTOS_EMBUTIDAS from '../dados/fotos.json';
import { useDemo } from '../dev/demo';
import { supabase } from '../lib/supabase';

/**
 * Fotos dos destinos e lugares (Wikimedia Commons, com autor e licença).
 *
 * De onde vêm: resolvidas uma vez pela automação "Fotos dos lugares" (GitHub Actions,
 * tools/dados/fotos.mjs) e gravadas em dados/fotos.json (embutido no app) e na tabela
 * public.fotos_lugares (Supabase). O app NÃO chama a API da Wikipédia durante o uso:
 * ela limita pedidos e falhava em celulares e servidores. A imagem vem direto do CDN
 * upload.wikimedia.org. Sem foto ou sem internet: fica o fundo do design, sem quebrar.
 */
interface Foto {
  /** Arquivo embutido no app (public/fotos), baixado pela automação. */
  arquivo?: string;
  url: string;
  autor: string;
  licenca: string;
  pagina?: string;
}

const embutidas = FOTOS_EMBUTIDAS as Record<string, Foto>;
let doBanco: Promise<Record<string, Foto>> | null = null;

/** Lê a tabela uma vez por abertura do app (fotos novas sem precisar de APK novo). */
function fotosDoBanco(): Promise<Record<string, Foto>> {
  doBanco ??= (async () => {
    const { data, error } = await supabase.from('fotos_lugares').select('chave, url, autor, licenca, pagina_arquivo');
    if (error || !data) return {};
    return Object.fromEntries(data.map((f) => [f.chave as string, { url: f.url as string, autor: f.autor as string, licenca: f.licenca as string, pagina: f.pagina_arquivo as string }]));
  })();
  return doBanco;
}

export const DESTINOS_COM_FOTO = Object.keys(embutidas);

function useFoto(nome: string): Foto | null {
  const demo = useDemo();
  const [foto, setFoto] = useState<Foto | null>(demo ? null : (embutidas[nome] ?? null));
  useEffect(() => {
    if (demo) return;
    let vivo = true;
    void fotosDoBanco().then((banco) => {
      if (vivo && banco[nome]) setFoto({ ...banco[nome], arquivo: embutidas[nome]?.arquivo });
    });
    return () => {
      vivo = false;
    };
  }, [nome, demo]);
  return foto;
}

/** Ocupa o espaço da foto do design (o elemento pai precisa ter position). */
export function FotoDestino({ nome, credito = true }: { nome: string; credito?: boolean }) {
  const foto = useFoto(nome);
  // 1º o arquivo embutido; se faltar, o CDN da Wikimedia; se falhar, fica o fundo do design.
  const fontes = foto ? [foto.arquivo ? `${import.meta.env.BASE_URL}${foto.arquivo}` : null, foto.url].filter((x): x is string => Boolean(x)) : [];
  const [tentativa, setTentativa] = useState(0);
  const src = fontes[tentativa];
  if (!foto || !src) return null;
  return (
    <>
      <img
        src={src}
        alt={`Foto de ${nome}`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setTentativa((t) => t + 1)}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />
      {credito ? (
      <span
        title={`${foto.autor} · ${foto.licenca}`}
        style={{ position: 'absolute', left: 6, bottom: 4, right: 6, zIndex: 1, font: "400 10px/13px 'Open Sans'", color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        Foto: {foto.autor} · {foto.licenca}
      </span>
      ) : null}
    </>
  );
}

/** Rótulo "Foto de X" do design: aparece só enquanto não há foto (e no modo de comparação). */
export function RotuloFoto({ nome, style }: { nome: string; style?: CSSProperties }) {
  const foto = useFoto(nome);
  if (foto) return null;
  return <span style={style}>Foto de {nome}</span>;
}

/** Existe foto para esta chave? (para mostrar o aviso "sem foto" em vez de um bloco vazio) */
export function temFoto(nome: string): boolean {
  return Boolean(embutidas[nome]);
}

/**
 * Foto do lugar com o aviso discreto quando não há foto conferida: nunca imagem
 * aleatória, nunca espaço quebrado.
 */
export function FotoLugar({ id, proporcao = '16 / 9', credito = true }: { id: string; proporcao?: string; credito?: boolean }) {
  const tem = temFoto(id);
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: proporcao, overflow: 'hidden', background: tem ? 'linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))' : 'var(--cartao-2)' }}>
      {tem ? (
        <FotoDestino nome={id} credito={credito} />
      ) : (
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: "500 13px 'Open Sans'", color: 'var(--texto-sec)', textAlign: 'center', padding: '8px' }}>
          Sem foto conferida deste lugar
        </span>
      )}
    </div>
  );
}
