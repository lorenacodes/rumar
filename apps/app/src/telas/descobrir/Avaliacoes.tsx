import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSessao } from '../../conta/servico';
import { apagarAvaliacao, avaliacoesDoLugar, denunciar, NOME_ACESSIVEL, resumir, salvarAvaliacao, type Acessivel, type Avaliacao } from '../../lib/avaliacoes';
import { dinheiro } from '../../lib/moedas';
import { EscolherEstrelas, Estrelas } from '../../ui/estrelas';

const dataBR = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');

/** Avaliações do lugar (D-047): resumo, lista e o formulário de quem foi. */
export function Avaliacoes({ placeId, nome, moeda }: { placeId: string; nome: string; moeda: string }) {
  const sessao = useSessao();
  const navegar = useNavigate();
  const [lista, setLista] = useState<Avaliacao[] | null>(null);
  const [aberto, setAberto] = useState(false);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [acessivel, setAcessivel] = useState<Acessivel | null>(null);
  const [gasto, setGasto] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [denunciadas, setDenunciadas] = useState<string[]>([]);
  const carregar = () => void avaliacoesDoLugar(placeId).then(setLista);
  useEffect(carregar, [placeId, sessao]); // eslint-disable-line react-hooks/exhaustive-deps
  // Abrir direto no formulário (#avaliar, vindo da viagem).
  useEffect(() => { if (window.location.hash.includes('avaliar=1') && sessao) { setAberto(true); setTimeout(() => document.getElementById('avaliar')?.scrollIntoView({ block: 'center' }), 300); } }, [sessao]);

  const minha = lista?.find((a) => a.minha);
  const abrir = () => {
    if (!sessao) return navegar('/entrar');
    if (minha) {
      setNota(minha.nota); setComentario(minha.comentario ?? ''); setAcessivel(minha.acessivel);
      setGasto(minha.gasto_centavos != null ? String(minha.gasto_centavos / 100).replace('.', ',') : '');
    }
    setAberto(true); setMsg(null);
  };
  const salvar = async () => {
    if (!nota) return setMsg('Escolha de 1 a 5 estrelas.');
    const centavos = gasto ? Math.round(Number(gasto.replace(/\./g, '').replace(',', '.')) * 100) : null;
    const r = await salvarAvaliacao(placeId, { nota, comentario, acessivel, gastoCentavos: Number.isFinite(centavos) ? centavos : null, moeda, visitouEm: null });
    if (r.ok) { setAberto(false); setMsg('Avaliação publicada. Obrigado!'); carregar(); } else setMsg(r.mensagem);
  };
  const r = lista ? resumir(lista) : null;
  const campo = { display: 'block', width: '100%', boxSizing: 'border-box' as const, borderBottom: '2px solid var(--texto)', padding: '8px 0', font: "500 16px 'Open Sans'", color: 'var(--texto)', background: 'transparent' };

  return (
    <section aria-label="Avaliações" style={{ marginTop: '22px' }}>
      <h2 style={{ margin: 0, font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Avaliações</h2>
      {r ? (
        <div style={{ marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <b style={{ font: "600 28px 'Lexend Exa'" }}>{String(r.media).replace('.', ',')}</b>
            <span><Estrelas nota={r.media} tamanho={18} /><span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{r.quantidade} {r.quantidade === 1 ? 'avaliação' : 'avaliações'}</span></span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: '14px', marginTop: '6px' }}>
            {r.acessivel ? <span>{NOME_ACESSIVEL[r.acessivel]} <span style={{ color: 'var(--texto-sec)' }}>({r.acessivelQuantos})</span></span> : null}
            {r.gastoTipico != null && r.moeda ? <span>Gasto típico: {dinheiro(r.gastoTipico, r.moeda)} por pessoa <span style={{ color: 'var(--texto-sec)' }}>({r.gastosQuantos})</span></span> : null}
          </div>
        </div>
      ) : lista ? <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>Ninguém avaliou ainda.</p> : null}

      {msg ? <p role="status" style={{ fontSize: '14px', fontWeight: 600, color: msg.startsWith('Avaliação') ? 'var(--verde)' : 'var(--vermelho)', margin: '6px 0 0' }}>{msg}</p> : null}

      {!aberto ? (
        <button type="button" className="r-btn" onClick={abrir} style={{ width: '100%', height: '48px', marginTop: '10px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>
          {!sessao ? 'Entre para avaliar' : minha ? 'Editar minha avaliação' : 'Avaliar este lugar'}
        </button>
      ) : (
        <div id="avaliar" style={{ marginTop: '10px', padding: '12px', background: 'var(--cartao-2)' }}>
          <div style={{ font: "600 15px 'Open Sans'" }}>Como foi em {nome}?</div>
          <EscolherEstrelas valor={nota} aoMudar={setNota} />
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)', marginTop: '10px' }}>Comentário (opcional)
            <textarea className="r-input" maxLength={600} rows={3} value={comentario} onChange={(e) => setComentario(e.target.value)} style={{ ...campo, resize: 'vertical' }} />
          </label>
          <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '10px' }}>Acessível para quem usa cadeira de rodas ou tem mobilidade reduzida?</div>
          <div role="radiogroup" aria-label="Acessibilidade" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {(['sim', 'em_parte', 'nao'] as Acessivel[]).map((a) => (
              <button key={a} type="button" role="radio" aria-checked={acessivel === a} className="r-btn" onClick={() => setAcessivel(acessivel === a ? null : a)}
                style={{ minHeight: '40px', padding: '0 12px', font: "600 14px 'Open Sans'", ...(acessivel === a ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>{({ sim: 'Sim', em_parte: 'Em parte', nao: 'Não' } as const)[a]}</button>
            ))}
          </div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)', marginTop: '10px' }}>Quanto gastou por pessoa? (opcional, em {moeda})
            <input className="r-input" inputMode="decimal" value={gasto} onChange={(e) => setGasto(e.target.value.replace(/[^\d.,]/g, ''))} style={campo} />
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button type="button" className="r-btn" onClick={() => setAberto(false)} style={{ flex: 1, height: '48px', border: '1px solid var(--linha)', font: "600 15px 'Open Sans'" }}>Cancelar</button>
            <button type="button" className="r-btn" onClick={() => void salvar()} style={{ flex: 2, height: '48px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>Publicar</button>
          </div>
          {minha ? <button type="button" className="r-btn alvo-toque" onClick={() => void apagarAvaliacao(minha.id).then(() => { setAberto(false); carregar(); })} style={{ marginTop: '6px', color: 'var(--vermelho)', fontWeight: 600, fontSize: '14px' }}>Apagar minha avaliação</button> : null}
        </div>
      )}

      {lista?.length ? (
        <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0 }}>
          {lista.slice(0, 20).map((a) => (
            <li key={a.id} style={{ padding: '10px 0', borderTop: '1px solid var(--linha)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                <span><Estrelas nota={a.nota} tamanho={14} /> <b style={{ fontSize: '14px', marginLeft: '4px' }}>{a.usuario ? `@${a.usuario}` : 'Viajante'}</b></span>
                <span style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{dataBR(a.created_at)}</span>
              </div>
              {a.comentario ? <p style={{ margin: '4px 0 0', fontSize: '15px', lineHeight: '21px' }}>{a.comentario}</p> : null}
              <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '2px' }}>
                {[a.acessivel ? NOME_ACESSIVEL[a.acessivel] : null, a.gasto_centavos != null && a.gasto_moeda ? `gastou ${dinheiro(a.gasto_centavos, a.gasto_moeda)} por pessoa` : null].filter(Boolean).join(' · ')}
              </div>
              {!a.minha && sessao ? (
                <button type="button" className="r-btn" disabled={denunciadas.includes(a.id)} onClick={() => void denunciar('avaliacao', a.id).then((ok) => ok && setDenunciadas((d) => [...d, a.id]))}
                  style={{ fontSize: '12px', color: 'var(--texto-sec)', minHeight: '32px', textDecoration: 'underline' }}>{denunciadas.includes(a.id) ? 'Denúncia enviada' : 'Denunciar'}</button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
