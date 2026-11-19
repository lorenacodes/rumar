import { useEffect, useRef, useState } from 'react';

import { apagarDaViagem, fotosDaViagem, postarNaViagem, type FotoDaViagem } from '../../lib/album';
import type { Lugar } from '../../lib/planejador';
import type { ViagemCompleta } from '../../lib/viagens';

/** "Fotos da viagem" (D-059): álbum do grupo. Aparece quando a viagem começa; quem participa posta. */
export function AlbumDaViagem({ v, lugares, pode }: { v: ViagemCompleta; lugares: Lugar[]; pode: boolean }) {
  const [fotos, setFotos] = useState<FotoDaViagem[] | null>(null);
  const [aberto, setAberto] = useState(false);
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [lugar, setLugar] = useState('');
  const [legenda, setLegenda] = useState('');
  const [noLugar, setNoLugar] = useState(false);
  const [declaro, setDeclaro] = useState(false);
  const [progresso, setProgresso] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [vendo, setVendo] = useState<FotoDaViagem | null>(null);
  const campo = useRef<HTMLInputElement>(null);
  const participa = v.papel !== null;
  const carregar = () => void fotosDaViagem(v.viagem.id).then(setFotos);
  useEffect(carregar, [v.viagem.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const hoje = new Date().toISOString().slice(0, 10);
  if (v.viagem.data_ida > hoje) return null;
  if (!participa && !fotos?.length) return null;
  const nome = (uid: string) => v.membros.find((m) => m.user_id === uid)?.nome ?? 'Alguém do grupo';
  const opcoesLugar = [...new Map(lugares.map((l) => [l.id, l])).values()];

  const postar = async () => {
    if (!arquivos.length || (noLugar && (!lugar || !declaro))) return;
    let ok = 0;
    let erro: string | null = null;
    for (let i = 0; i < arquivos.length; i++) {
      setProgresso(`Enviando ${i + 1} de ${arquivos.length}…`);
      const r = await postarNaViagem(v.viagem.id, arquivos[i]!, { legenda, placeId: lugar || null, tambemNoLugar: noLugar });
      if (r.ok) ok++; else erro = r.mensagem;
    }
    setProgresso(null);
    setMsg(erro ? `${ok} de ${arquivos.length} postadas. ${erro}` : ok === 1 ? 'Foto postada.' : `${ok} fotos postadas.`);
    setArquivos([]); setLegenda(''); setNoLugar(false); setDeclaro(false); setAberto(false);
    carregar();
  };

  return (
    <section aria-label="Fotos da viagem" style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <h2 style={{ margin: 0, font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Fotos da viagem{fotos?.length ? ` (${fotos.length})` : ''}</h2>
        {pode && participa && !aberto ? <button type="button" className="r-btn" onClick={() => { setAberto(true); setMsg(null); }} style={{ minHeight: '40px', padding: '0 14px', borderRadius: '20px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 14px 'Open Sans'" }}>Postar fotos</button> : null}
      </div>
      {msg ? <p role="status" style={{ fontSize: '14px', fontWeight: 600, color: msg.includes('postad') && !msg.includes(' de ') ? 'var(--verde)' : 'var(--texto)', margin: '6px 0 0' }}>{msg}</p> : null}

      {aberto ? (
        <div style={{ marginTop: '10px', padding: '12px', borderRadius: '12px', background: 'var(--cartao-2)' }}>
          <input ref={campo} type="file" multiple accept="image/*,video/mp4,video/quicktime,video/webm" onChange={(e) => setArquivos([...(e.target.files ?? [])].slice(0, 20))} style={{ display: 'none' }} aria-label="Escolher fotos e vídeos" />
          <button type="button" className="r-btn" onClick={() => campo.current?.click()} style={{ width: '100%', height: '46px', borderRadius: '10px', background: 'var(--fundo)', font: "600 15px 'Open Sans'" }}>
            {arquivos.length ? `${arquivos.length} ${arquivos.length === 1 ? 'arquivo escolhido' : 'arquivos escolhidos'} · trocar` : 'Escolher fotos e vídeos'}
          </button>
          {opcoesLugar.length ? (
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)', marginTop: '10px' }}>Onde foi? (opcional)
              <select value={lugar} onChange={(e) => setLugar(e.target.value)} style={{ display: 'block', width: '100%', minHeight: '44px', marginTop: '2px', font: "500 15px 'Open Sans'", color: 'var(--texto)', background: 'var(--fundo)', border: 0, borderRadius: '8px' }}>
                <option value="">Sem lugar</option>
                {opcoesLugar.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
              </select>
            </label>
          ) : null}
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)', marginTop: '10px' }}>Legenda (opcional)
            <input className="r-input" maxLength={200} value={legenda} onChange={(e) => setLegenda(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', borderBottom: '2px solid var(--texto)', padding: '8px 0', font: "500 16px 'Open Sans'", color: 'var(--texto)', background: 'transparent' }} />
          </label>
          {lugar ? (
            <>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '14px', lineHeight: '19px', marginTop: '10px' }}>
                <input type="checkbox" checked={noLugar} onChange={(e) => setNoLugar(e.target.checked)} style={{ width: '22px', height: '22px', flex: 'none' }} />
                <span>Mostrar também na página do lugar, para todos (passa por aprovação)</span>
              </label>
              {noLugar ? (
                <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', lineHeight: '18px', marginTop: '8px' }}>
                  <input type="checkbox" checked={declaro} onChange={(e) => setDeclaro(e.target.checked)} style={{ width: '22px', height: '22px', flex: 'none' }} />
                  <span>A foto é minha e não mostra rostos de outras pessoas. <a href="#/termos" style={{ color: 'var(--azul)' }}>Regras</a></span>
                </label>
              ) : null}
            </>
          ) : null}
          <p style={{ fontSize: '12px', color: 'var(--texto-sec)', margin: '8px 0 0' }}>No álbum, só o grupo e os amigos que veem a viagem.</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button type="button" className="r-btn" onClick={() => { setAberto(false); setArquivos([]); }} style={{ flex: 1, height: '48px', borderRadius: '10px', background: 'var(--fundo)', font: "600 15px 'Open Sans'" }}>Cancelar</button>
            <button type="button" className="r-btn" disabled={!arquivos.length || Boolean(progresso) || (noLugar && !declaro)} onClick={() => void postar()}
              style={{ flex: 2, height: '48px', borderRadius: '10px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'", opacity: !arquivos.length || (noLugar && !declaro) ? 0.5 : 1 }}>{progresso ?? 'Postar'}</button>
          </div>
        </div>
      ) : null}

      {fotos?.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', marginTop: '10px' }}>
          {fotos.map((f) => (
            <button key={f.id} type="button" className="r-btn" onClick={() => setVendo(f)} aria-label={f.legenda ?? `Foto de ${nome(f.user_id)}`} style={{ padding: 0, position: 'relative' }}>
              {f.tipo === 'video'
                ? <video src={f.url} muted playsInline preload="metadata" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block', background: '#000' }} />
                : <img src={f.url} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />}
              {f.tipo === 'video' ? <span style={{ position: 'absolute', right: '4px', bottom: '4px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: '10px' }}>Vídeo</span> : null}
            </button>
          ))}
        </div>
      ) : participa && !aberto ? <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>Guarde aqui as fotos da viagem.</p> : null}

      {vendo ? (
        <div role="dialog" aria-label="Foto" onClick={() => setVendo(null)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,.92)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom)' }}>
          {vendo.tipo === 'video'
            ? <video src={vendo.url} controls autoPlay playsInline onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxHeight: '80vh' }} />
            : <img src={vendo.url} alt={vendo.legenda ?? ''} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />}
          <div style={{ color: '#fff', padding: '10px 16px', fontSize: '14px' }} onClick={(e) => e.stopPropagation()}>
            <b>{vendo.minha ? 'Você' : nome(vendo.user_id)}</b>{vendo.legenda ? ` · ${vendo.legenda}` : ''}
            {vendo.place_id ? <span style={{ display: 'block', opacity: 0.8 }}>{lugares.find((l) => l.id === vendo.place_id)?.nome ?? ''}</span> : null}
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <button type="button" className="r-btn" onClick={() => setVendo(null)} style={{ color: '#fff', fontWeight: 600, minHeight: '44px' }}>Fechar</button>
              {vendo.minha || v.papel === 'dono' ? <button type="button" className="r-btn" onClick={() => { if (window.confirm('Apagar esta foto da viagem?')) void apagarDaViagem(vendo).then(() => { setVendo(null); carregar(); }); }} style={{ color: '#ff9b9b', fontWeight: 600, minHeight: '44px' }}>Apagar</button> : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
