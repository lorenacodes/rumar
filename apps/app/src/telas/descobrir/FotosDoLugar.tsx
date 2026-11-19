import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSessao } from '../../conta/servico';
import { apagarMinhaFoto, enviarFoto, fotoGoogle, fotosAprovadas, minhasFotos, type FotoEnviada, type FotoGoogle } from '../../lib/fotosEnviadas';

/** Capa da página do lugar quando não há foto livre: 1º foto aprovada de quem foi, 2º Google (se ligado). */
export function CapaAlternativa({ placeId, nome }: { placeId: string; nome: string }) {
  const [enviada, setEnviada] = useState<FotoEnviada | null | undefined>(undefined);
  const [g, setG] = useState<FotoGoogle | null>(null);
  useEffect(() => {
    void fotosAprovadas([placeId]).then((m) => {
      const f = m.get(placeId)?.find((x) => x.tipo !== 'video') ?? null;
      setEnviada(f);
      if (!f) void fotoGoogle(placeId).then(setG);
    });
  }, [placeId]);
  if (enviada) {
    return (
      <figure style={{ margin: 0 }}>
        <img src={enviada.url} alt={`Foto de ${nome}`} style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }} />
        <figcaption style={{ fontSize: '11px', color: 'var(--texto-sec)', padding: '2px 20px 0', textAlign: 'right' }}>Foto: {enviada.usuario ? `@${enviada.usuario}` : 'quem foi'}, enviada por quem foi</figcaption>
      </figure>
    );
  }
  if (g?.url) {
    return (
      <figure style={{ margin: 0 }}>
        <img src={g.url} alt={`Foto de ${nome}`} referrerPolicy="no-referrer" style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }} />
        <figcaption style={{ fontSize: '11px', color: 'var(--texto-sec)', padding: '2px 20px 0', textAlign: 'right' }}>
          Foto: {g.autores.length ? g.autores.map((a, i) => <span key={a.nome}>{i ? ', ' : ''}{a.link ? <a href={a.link} target="_blank" rel="noreferrer" style={{ color: 'var(--texto-sec)' }}>{a.nome}</a> : a.nome}</span>) : 'autor no Google'} · Google
        </figcaption>
      </figure>
    );
  }
  return null;
}

/** "Fotos de quem foi": galeria aprovada + enviar (lugar ou prato), com declarações e moderação. */
export function FotosDeQuemFoi({ placeId, nome, comida }: { placeId: string; nome: string; comida: boolean }) {
  const sessao = useSessao();
  const navegar = useNavigate();
  const [fotos, setFotos] = useState<FotoEnviada[]>([]);
  const [minhas, setMinhas] = useState<{ id: string; status: string; caminho: string }[]>([]);
  const [aberto, setAberto] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [tipo, setTipo] = useState<'lugar' | 'prato'>(comida ? 'prato' : 'lugar');
  const [legenda, setLegenda] = useState('');
  const [declaro, setDeclaro] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const campo = useRef<HTMLInputElement>(null);
  const carregar = () => {
    void fotosAprovadas([placeId]).then((m) => setFotos(m.get(placeId) ?? []));
    void minhasFotos(placeId).then(setMinhas);
  };
  useEffect(carregar, [placeId, sessao]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!arquivo) { setPrevia(null); return; } const u = URL.createObjectURL(arquivo); setPrevia(u); return () => URL.revokeObjectURL(u); }, [arquivo]);

  const enviar = async () => {
    if (!arquivo || !declaro) return;
    setEnviando(true);
    const r = await enviarFoto(placeId, arquivo, tipo, legenda);
    setEnviando(false);
    if (r.ok) { setMsg('Recebemos! A foto aparece depois de aprovada.'); setArquivo(null); setLegenda(''); setDeclaro(false); setAberto(false); carregar(); }
    else setMsg(r.mensagem);
  };
  const pendentes = minhas.filter((m) => m.status === 'pendente').length;
  const recusadas = minhas.filter((m) => m.status === 'recusada');

  return (
    <section aria-label="Fotos de quem foi" style={{ marginTop: '20px' }}>
      <h2 style={{ margin: 0, font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Fotos de quem foi</h2>
      {fotos.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '8px' }}>
          {fotos.slice(0, 12).map((f) => (
            <figure key={f.id} style={{ margin: 0, position: 'relative' }}>
              {f.tipo === 'video'
                ? <video src={f.url} controls playsInline preload="metadata" aria-label={f.legenda ?? `Vídeo em ${nome}`} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block', background: '#000' }} />
                : <img src={f.url} alt={f.legenda ?? `${f.tipo === 'prato' ? 'Prato' : 'Foto'} em ${nome}`} loading="lazy" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />}
              <figcaption style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 4px 2px', background: 'linear-gradient(transparent, rgba(0,0,0,.6))', color: '#fff', fontSize: '10px', lineHeight: '13px' }}>{f.tipo === 'prato' ? 'Prato · ' : ''}{f.usuario ? `@${f.usuario}` : ''}</figcaption>
            </figure>
          ))}
        </div>
      ) : <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>{comida ? 'Já comeu aqui? Mostre o prato.' : 'Já foi? Mostre como é.'}</p>}

      {pendentes ? <p role="status" style={{ fontSize: '13px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>{pendentes === 1 ? '1 foto sua esperando aprovação.' : `${pendentes} fotos suas esperando aprovação.`}</p> : null}
      {recusadas.length ? <p style={{ fontSize: '13px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>{recusadas.length === 1 ? '1 foto sua não foi aprovada.' : `${recusadas.length} fotos suas não foram aprovadas.`} <button type="button" className="r-btn" onClick={() => void Promise.all(recusadas.map((r) => apagarMinhaFoto(r.id, r.caminho))).then(carregar)} style={{ color: 'var(--azul)', fontWeight: 600 }}>Apagar</button></p> : null}
      {msg ? <p role="status" style={{ fontSize: '14px', fontWeight: 600, color: msg.startsWith('Recebemos') ? 'var(--verde)' : 'var(--vermelho)', margin: '6px 0 0' }}>{msg}</p> : null}

      {!aberto ? (
        <button type="button" className="r-btn" onClick={() => (sessao ? (setAberto(true), setMsg(null)) : navegar('/entrar'))}
          style={{ width: '100%', height: '48px', marginTop: '10px', border: '2px solid var(--texto)', font: "600 15px 'Open Sans'" }}>
          {sessao ? 'Mandar foto ou vídeo' : 'Entre para mandar fotos'}
        </button>
      ) : (
        <div style={{ marginTop: '10px', padding: '12px', border: '2px solid var(--texto)' }}>
          <input ref={campo} type="file" accept="image/*,video/mp4,video/quicktime,video/webm" onChange={(e) => setArquivo(e.target.files?.[0] ?? null)} style={{ display: 'none' }} aria-label="Escolher foto" />
          {previa ? (arquivo?.type.startsWith('video/')
            ? <video src={previa} controls playsInline style={{ width: '100%', maxHeight: '260px', display: 'block', background: '#000' }} />
            : <img src={previa} alt="Prévia da foto" style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', display: 'block' }} />) : null}
          <button type="button" className="r-btn" onClick={() => campo.current?.click()} style={{ width: '100%', height: '46px', marginTop: previa ? '8px' : 0, background: 'var(--cartao-2)', font: "600 15px 'Open Sans'" }}>{previa ? 'Trocar' : 'Escolher foto ou vídeo (até 20 s)'}</button>
          {comida ? (
            <div role="radiogroup" aria-label="A foto é de quê" style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              {(['prato', 'lugar'] as const).map((t) => (
                <button key={t} type="button" role="radio" aria-checked={tipo === t} className="r-btn" onClick={() => setTipo(t)} style={{ flex: 1, height: '42px', font: "600 14px 'Open Sans'", ...(tipo === t ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>{t === 'prato' ? 'Prato ou bebida' : 'O lugar'}</button>
              ))}
            </div>
          ) : null}
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)', marginTop: '10px' }}>{tipo === 'prato' ? 'Nome do prato (opcional)' : 'Legenda (opcional)'}
            <input className="r-input" maxLength={140} value={legenda} onChange={(e) => setLegenda(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', borderBottom: '2px solid var(--texto)', padding: '8px 0', font: "500 16px 'Open Sans'", color: 'var(--texto)', background: 'transparent' }} />
          </label>
          <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', lineHeight: '18px', marginTop: '10px' }}>
            <input type="checkbox" checked={declaro} onChange={(e) => setDeclaro(e.target.checked)} style={{ width: '22px', height: '22px', flex: 'none', marginTop: '1px' }} />
            <span>A foto ou vídeo é meu, foi feito aqui e não mostra rostos de outras pessoas. <a href="#/termos" style={{ color: 'var(--azul)' }}>Regras</a></span>
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button type="button" className="r-btn" onClick={() => (setAberto(false), setArquivo(null))} style={{ flex: 1, height: '48px', border: '1px solid var(--linha)', font: "600 15px 'Open Sans'" }}>Cancelar</button>
            <button type="button" className="r-btn" disabled={!arquivo || !declaro || enviando} onClick={() => void enviar()} style={{ flex: 2, height: '48px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'", opacity: !arquivo || !declaro ? 0.5 : 1 }}>{enviando ? 'Enviando…' : 'Enviar para aprovação'}</button>
          </div>
        </div>
      )}
    </section>
  );
}
