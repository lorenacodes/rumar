import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSessao } from '../../conta/servico';
import { apagarAvaliacao, avaliacoesDoLugar, denunciar, midiasDasAvaliacoes, NOME_ACESSIVEL, resumir, salvarAvaliacao, type Acessivel, type Avaliacao, type Midia, type Wifi } from '../../lib/avaliacoes';
import { enviarFoto } from '../../lib/fotosEnviadas';
import { dinheiro } from '../../lib/moedas';
import { EscolherEstrelas, Estrelas } from '../../ui/estrelas';

const dataBR = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
const MAX_MIDIAS = 3;

/** Grupo de opções em pílulas (toque de novo desmarca). */
function Opcoes<T extends string>({ rotulo, valor, aoMudar, opcoes }: { rotulo: string; valor: T | null; aoMudar: (v: T | null) => void; opcoes: [T, string][] }) {
  return (
    <div style={{ marginTop: '14px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600 }}>{rotulo}</div>
      <div role="radiogroup" aria-label={rotulo} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
        {opcoes.map(([id, nome]) => (
          <button key={id} type="button" role="radio" aria-checked={valor === id} className="r-btn" onClick={() => aoMudar(valor === id ? null : id)}
            style={{ minHeight: '40px', padding: '0 14px', borderRadius: '20px', font: "600 14px 'Open Sans'", ...(valor === id ? { background: 'var(--fundo-escuro)', color: '#fff' } : { background: 'var(--fundo)', border: '1px solid var(--linha)' }) }}>{nome}</button>
        ))}
      </div>
    </div>
  );
}

/** Miniatura de foto ou vídeo. */
function Miniatura({ url, video, tamanho = 84 }: { url: string; video: boolean; tamanho?: number }) {
  const estilo = { width: `${tamanho}px`, height: `${tamanho}px`, objectFit: 'cover' as const, borderRadius: '10px', display: 'block', background: 'var(--cartao-2)' };
  return video ? <video src={url} muted playsInline preload="metadata" style={estilo} /> : <img src={url} alt="" loading="lazy" style={estilo} />;
}

/** Avaliações do lugar (D-047/D-072): resumo, lista e o formulário de quem foi (com Wi-Fi e até 3 mídias). */
export function Avaliacoes({ placeId, nome, moeda, comida = false }: { placeId: string; nome: string; moeda: string; comida?: boolean }) {
  const sessao = useSessao();
  const navegar = useNavigate();
  const [lista, setLista] = useState<Avaliacao[] | null>(null);
  const [midias, setMidias] = useState<Map<string, Midia[]>>(new Map());
  const [aberto, setAberto] = useState(false);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [acessivel, setAcessivel] = useState<Acessivel | null>(null);
  const [wifi, setWifi] = useState<Wifi | null>(null);
  const [gasto, setGasto] = useState('');
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [declaro, setDeclaro] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [denunciadas, setDenunciadas] = useState<string[]>([]);
  const previas = useMemo(() => arquivos.map((f) => URL.createObjectURL(f)), [arquivos]);
  useEffect(() => () => previas.forEach((u) => URL.revokeObjectURL(u)), [previas]);
  const texto = useRef<HTMLTextAreaElement>(null);
  const seletor = useRef<HTMLInputElement>(null);
  const carregar = () => { void avaliacoesDoLugar(placeId).then(setLista); void midiasDasAvaliacoes(placeId).then(setMidias); };
  useEffect(carregar, [placeId, sessao]); // eslint-disable-line react-hooks/exhaustive-deps
  // Abrir direto no formulário (#avaliar, vindo da viagem).
  useEffect(() => { if (window.location.hash.includes('avaliar=1') && sessao && lista) { abrir(); setTimeout(() => document.getElementById('avaliar')?.scrollIntoView({ block: 'center' }), 300); } }, [sessao, lista !== null]); // eslint-disable-line react-hooks/exhaustive-deps
  // O campo de comentário cresce com o texto.
  useEffect(() => { const t = texto.current; if (t) { t.style.height = 'auto'; t.style.height = `${t.scrollHeight}px`; } }, [comentario, aberto]);

  const minha = lista?.find((a) => a.minha);
  const jaTem = minha ? midias.get(minha.id)?.length ?? 0 : 0;
  const cabem = MAX_MIDIAS - jaTem;
  // "Já foi? Conte quanto gastou" (ficha do lugar) abre a avaliação aqui.
  useEffect(() => {
    const f = () => { abrir(); window.setTimeout(() => document.getElementById('avaliar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120); };
    window.addEventListener('bovair:abrir-avaliacao', f);
    return () => window.removeEventListener('bovair:abrir-avaliacao', f);
  });
  const abrir = () => {
    if (!sessao) return navegar('/entrar');
    if (minha) {
      setNota(minha.nota); setComentario(minha.comentario ?? ''); setAcessivel(minha.acessivel); setWifi(minha.wifi ?? null);
      setGasto(minha.gasto_centavos != null ? String(minha.gasto_centavos / 100).replace('.', ',') : '');
    }
    setAberto(true); setMsg(null);
  };
  const escolher = (lista: FileList | null) => {
    const novos = [...(lista ?? [])].filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
    setArquivos((a) => [...a, ...novos].slice(0, cabem));
  };
  const salvar = async () => {
    if (!nota) return setMsg('Escolha de 1 a 5 estrelas.');
    if (arquivos.length && !declaro) return setMsg('Confirme que as fotos são suas.');
    setSalvando(true);
    const centavos = gasto ? Math.round(Number(gasto.replace(/\./g, '').replace(',', '.')) * 100) : null;
    const r = await salvarAvaliacao(placeId, { nota, comentario, acessivel, wifi, gastoCentavos: Number.isFinite(centavos) ? centavos : null, moeda, visitouEm: null });
    if (!r.ok) { setSalvando(false); return setMsg(r.mensagem); }
    let falhou = 0;
    for (const f of arquivos) { const e = await enviarFoto(placeId, f, 'lugar', '', r.id); if (!e.ok) falhou++; }
    setSalvando(false); setAberto(false); setArquivos([]); setDeclaro(false);
    setMsg(falhou ? `Avaliação publicada. ${falhou} ${falhou === 1 ? 'arquivo não foi' : 'arquivos não foram'} enviados.` : 'Avaliação publicada. Obrigado!');
    carregar();
  };
  const r = lista ? resumir(lista) : null;
  const campo = { display: 'block', width: '100%', boxSizing: 'border-box' as const, marginTop: '6px', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--linha)', font: "500 16px/22px 'Open Sans'", color: 'var(--texto)', background: 'var(--fundo)' };
  const fatos = r ? [
    r.wifi ? `${r.wifi === 'sim' ? 'Tem Wi-Fi livre' : 'Sem Wi-Fi livre'} (${r.wifiQuantos})` : null,
    r.acessivel ? `${NOME_ACESSIVEL[r.acessivel]} (${r.acessivelQuantos})` : null,
    r.gastoTipico != null && r.moeda ? `Gasto típico ${dinheiro(r.gastoTipico, r.moeda)} por pessoa` : null,
  ].filter(Boolean) as string[] : [];

  // Gasto por pessoa: em restaurante, café e bar vem logo depois da nota (é o que mais ajuda quem vai depois).
  const blocoGasto = (
    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginTop: '14px' }}>Quanto gastou por pessoa? <span style={{ fontWeight: 400, color: 'var(--texto-sec)' }}>({moeda}, opcional)</span>
      <input className="r-input" inputMode="decimal" value={gasto} onChange={(e) => setGasto(e.target.value.replace(/[^\d.,]/g, ''))} placeholder="0,00" style={campo} />
      {comida ? <span style={{ display: 'block', fontWeight: 400, fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px' }}>Ajuda quem vai depois a saber quanto levar.</span> : null}
    </label>
  );
  return (
    <section aria-label="Avaliações" style={{ marginTop: '24px' }}>
      <h2 style={{ margin: 0, font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Avaliações</h2>
      {r ? (
        <div style={{ marginTop: '8px', padding: '14px', borderRadius: '14px', background: 'var(--cartao-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <b style={{ font: "600 32px/1 'Lexend Exa'" }}>{String(r.media).replace('.', ',')}</b>
            <span><Estrelas nota={r.media} tamanho={18} /><span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{r.quantidade} {r.quantidade === 1 ? 'avaliação' : 'avaliações'}</span></span>
          </div>
          {fatos.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              {fatos.map((f) => <span key={f} style={{ padding: '6px 10px', borderRadius: '14px', background: 'var(--fundo)', fontSize: '13px', fontWeight: 600 }}>{f}</span>)}
            </div>
          ) : null}
        </div>
      ) : lista ? <p style={{ fontSize: '15px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>Ainda sem avaliações. Já foi? Conte como é.</p> : null}

      {msg ? <p role="status" style={{ fontSize: '14px', fontWeight: 600, color: msg.startsWith('Avaliação') ? 'var(--verde)' : 'var(--vermelho)', margin: '8px 0 0' }}>{msg}</p> : null}

      {msg === 'Avaliação publicada. Obrigado!' && !jaTem ? (
        // Sem foto na avaliação: é quando a pessoa mais topa mandar uma (D-069).
        <button type="button" className="r-btn" onClick={() => window.dispatchEvent(new Event('bovair:mandar-foto'))}
          style={{ marginTop: '8px', minHeight: '44px', padding: '0 16px', borderRadius: '22px', background: 'var(--fundo-escuro)', color: '#fff', font: "600 15px 'Open Sans'" }}>Tem uma foto daqui? Mandar foto</button>
      ) : null}

      {!aberto ? (
        <button type="button" className="r-btn" onClick={abrir} style={{ width: '100%', height: '48px', marginTop: '10px', borderRadius: '999px', background: 'var(--cartao-2)', color: 'var(--texto)', font: "600 15px 'Open Sans'" }}>
          {!sessao ? 'Entre para avaliar' : minha ? 'Editar minha avaliação' : 'Avaliar este lugar'}
        </button>
      ) : (
        <div id="avaliar" style={{ marginTop: '10px', padding: '16px', borderRadius: '14px', background: 'var(--cartao-2)' }}>
          <div style={{ font: "600 16px 'Lexend Exa'" }}>Como foi em {nome}?</div>
          <div style={{ marginTop: '6px' }}><EscolherEstrelas valor={nota} aoMudar={setNota} /></div>
          {comida ? blocoGasto : null}

          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginTop: '14px' }}>Comentário <span style={{ fontWeight: 400, color: 'var(--texto-sec)' }}>(opcional)</span>
            <textarea ref={texto} className="r-input" maxLength={600} rows={2} value={comentario} onChange={(e) => setComentario(e.target.value)}
              placeholder="O que você mais gostou?" style={{ ...campo, resize: 'none', overflow: 'hidden', minHeight: '64px' }} />
          </label>
          {comentario.length > 450 ? <div style={{ fontSize: '12px', color: 'var(--texto-sec)', textAlign: 'right' }}>{comentario.length}/600</div> : null}

          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Fotos ou vídeos <span style={{ fontWeight: 400, color: 'var(--texto-sec)' }}>(até {MAX_MIDIAS})</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {minha ? (midias.get(minha.id) ?? []).map((m) => <Miniatura key={m.id} url={m.url} video={m.tipo === 'video'} tamanho={72} />) : null}
              {arquivos.map((f, i) => (
                <span key={`${f.name}-${i}`} style={{ position: 'relative' }}>
                  <Miniatura url={previas[i]!} video={f.type.startsWith('video/')} tamanho={72} />
                  <button type="button" className="r-btn" aria-label="Tirar este arquivo" onClick={() => setArquivos((a) => a.filter((_, j) => j !== i))}
                    style={{ position: 'absolute', top: '-8px', right: '-8px', width: '28px', height: '28px', borderRadius: '14px', background: 'var(--fundo-escuro)', color: '#fff', fontWeight: 700 }}>×</button>
                </span>
              ))}
              {arquivos.length < cabem ? (
                <button type="button" className="r-btn" onClick={() => seletor.current?.click()} aria-label="Adicionar foto ou vídeo"
                  style={{ width: '72px', height: '72px', borderRadius: '10px', border: '1px dashed var(--texto-sec)', background: 'var(--fundo)', fontSize: '28px', color: 'var(--texto-sec)' }}>+</button>
              ) : null}
            </div>
            <input ref={seletor} type="file" accept="image/*,video/*" multiple hidden onChange={(e) => { escolher(e.target.files); e.target.value = ''; }} aria-label="Escolher fotos ou vídeos" />
            {arquivos.length ? (
              <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', lineHeight: '18px', marginTop: '10px' }}>
                <input type="checkbox" checked={declaro} onChange={(e) => setDeclaro(e.target.checked)} style={{ width: '22px', height: '22px', flex: 'none', marginTop: '1px' }} />
                <span>São minhas, foram feitas aqui e podem aparecer na página do lugar. <a href="#/termos" style={{ color: 'var(--azul)' }}>Regras</a></span>
              </label>
            ) : null}
          </div>

          <Opcoes rotulo="Tem Wi-Fi livre?" valor={wifi} aoMudar={setWifi} opcoes={[['sim', 'Sim'], ['nao', 'Não']]} />
          <Opcoes rotulo="Acessível para cadeira de rodas?" valor={acessivel} aoMudar={setAcessivel} opcoes={[['sim', 'Sim'], ['em_parte', 'Em parte'], ['nao', 'Não']]} />

          {!comida ? blocoGasto : null}

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="r-btn" onClick={() => (setAberto(false), setArquivos([]))} style={{ flex: 1, height: '48px', borderRadius: '12px', border: '1px solid var(--linha)', font: "600 15px 'Open Sans'" }}>Cancelar</button>
            <button type="button" className="r-btn" disabled={salvando} onClick={() => void salvar()} style={{ flex: 2, height: '48px', borderRadius: '12px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>{salvando ? 'Publicando…' : 'Publicar'}</button>
          </div>
          {minha ? <button type="button" className="r-btn alvo-toque" onClick={() => void apagarAvaliacao(minha.id).then(() => { setAberto(false); carregar(); })} style={{ marginTop: '6px', color: 'var(--vermelho)', fontWeight: 600, fontSize: '14px' }}>Apagar minha avaliação</button> : null}
        </div>
      )}

      {lista?.length ? (
        <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'grid', gap: '10px' }}>
          {lista.slice(0, 20).map((a) => {
            const fotos = midias.get(a.id) ?? [];
            const meta = [a.wifi ? (a.wifi === 'sim' ? 'Wi-Fi livre' : 'Sem Wi-Fi livre') : null, a.acessivel ? NOME_ACESSIVEL[a.acessivel] : null, a.gasto_centavos != null && a.gasto_moeda ? `gastou ${dinheiro(a.gasto_centavos, a.gasto_moeda)} por pessoa` : null].filter(Boolean);
            return (
              <li key={a.id} style={{ padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--linha)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' }}>
                  <b style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.minha ? 'Você' : a.usuario ? `@${a.usuario}` : 'Viajante'}</b>
                  <span style={{ flex: 'none', fontSize: '12px', color: 'var(--texto-sec)' }}>{dataBR(a.created_at)}</span>
                </div>
                <div style={{ marginTop: '2px' }}><Estrelas nota={a.nota} tamanho={14} /></div>
                {a.comentario ? <p style={{ margin: '6px 0 0', fontSize: '15px', lineHeight: '22px', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{a.comentario}</p> : null}
                {fotos.length ? (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    {fotos.map((m) => <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer"><Miniatura url={m.url} video={m.tipo === 'video'} /></a>)}
                  </div>
                ) : null}
                {fotos.length && !a.minha && sessao ? (
                  <button type="button" className="r-btn" disabled={denunciadas.includes(`m-${a.id}`)}
                    onClick={() => { if (window.confirm('Denunciar as fotos desta avaliação?')) void Promise.all(fotos.map((m) => denunciar('foto', m.id, 'avaliação'))).then(() => setDenunciadas((d) => [...d, `m-${a.id}`])); }}
                    style={{ fontSize: '12px', color: 'var(--texto-sec)', minHeight: '32px', marginRight: '12px' }}>{denunciadas.includes(`m-${a.id}`) ? 'Fotos denunciadas' : 'Denunciar fotos'}</button>
                ) : null}
                {meta.length ? <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '6px' }}>{meta.join(' · ')}</div> : null}
                {!a.minha && sessao ? (
                  <button type="button" className="r-btn" disabled={denunciadas.includes(a.id)} onClick={() => void denunciar('avaliacao', a.id).then((ok) => ok && setDenunciadas((d) => [...d, a.id]))}
                    style={{ fontSize: '12px', color: 'var(--texto-sec)', minHeight: '32px', marginTop: '2px' }}>{denunciadas.includes(a.id) ? 'Denúncia enviada' : 'Denunciar'}</button>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
