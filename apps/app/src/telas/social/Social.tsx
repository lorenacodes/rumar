import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSessao } from '../../conta/servico';
import { buscarPessoas, minhasAmizades, pedirAmizade, responderAmizade, type Amizade, type PessoaPublica } from '../../lib/social';
import { listarViagens, type Viagem } from '../../lib/viagens';
import { Abas } from '../../ui/abas';
import { BotaoPrincipal } from '../../ui/pecas';
import { campo, periodo, Rotulo } from '../viagens/comum';

const Inicial = ({ nome }: { nome: string }) => (
  <span aria-hidden style={{ width: '44px', height: '44px', flex: 'none', background: 'var(--amarelo)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 16px 'Lexend Exa'", color: 'var(--botao-principal-texto)' }}>
    {nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
  </span>
);

/** Social: encontrar pessoas, pedidos de amizade, amigos e as viagens que eles compartilharam. */
export function Social() {
  const navegar = useNavigate();
  const sessao = useSessao();
  const [termo, setTermo] = useState('');
  const [achados, setAchados] = useState<PessoaPublica[]>([]);
  const [amizades, setAmizades] = useState<Amizade[]>([]);
  const [deAmigos, setDeAmigos] = useState<Viagem[]>([]);
  const carregar = () => {
    void minhasAmizades().then(setAmizades);
    void listarViagens().then((v) => setDeAmigos(v.deAmigos));
  };
  useEffect(() => {
    if (sessao) carregar();
  }, [sessao]);
  useEffect(() => {
    const t = setTimeout(() => void buscarPessoas(termo).then(setAchados), 300);
    return () => clearTimeout(t);
  }, [termo]);

  if (sessao === null) {
    return (
      <main className="tela" data-tela="social" data-real="social">
        <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Social</div>
          <h1 style={titulo}>Viaje com amigos.</h1>
          <p style={{ fontSize: '16px', lineHeight: '24px' }}>Adicione amigos, veja os roteiros que eles compartilham e planejem a mesma viagem juntos.</p>
        </div>
        <div className="rodape" style={{ padding: '10px 20px', borderTop: '1px solid var(--linha)', background: 'var(--fundo)', bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <BotaoPrincipal onClick={() => navegar('/conta/criar')}>Criar conta ↗</BotaoPrincipal>
        </div>
        <Abas ativa="social" logoAbaixoDoRodape />
      </main>
    );
  }

  const recebidos = amizades.filter((a) => a.status === 'pendente' && !a.enviadaPorMim);
  const enviados = amizades.filter((a) => a.status === 'pendente' && a.enviadaPorMim);
  const amigos = amizades.filter((a) => a.status === 'aceita');
  const relacao = (id: string) => amizades.find((a) => a.outro.user_id === id);

  return (
    <main className="tela" data-tela="social" data-real="social">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Social</div>
        <h1 style={titulo}>Amigos e viagens.</h1>
        <label htmlFor="busca-pessoa" className="visualmente-oculto">Buscar pessoas pelo nome</label>
        <input id="busca-pessoa" type="search" className="r-input" placeholder="Buscar pessoas pelo nome" value={termo} onChange={(e) => setTermo(e.target.value)} style={{ ...campo, marginTop: '12px' }} />
        {termo.trim().length >= 2 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0' }}>
            {achados.map((p) => {
              const r = relacao(p.user_id);
              return (
                <li key={p.user_id} style={linha}>
                  <Inicial nome={p.display_name} />
                  <span style={{ flex: 1 }}><b>{p.display_name}</b><span style={sub}>{p.origin_city ?? ''}</span></span>
                  {r ? <span style={sub}>{r.status === 'aceita' ? 'Amigos' : 'Pedido enviado'}</span> : (
                    <button type="button" className="r-btn" onClick={() => void pedirAmizade(p.user_id).then(carregar)} style={acao}>Adicionar</button>
                  )}
                </li>
              );
            })}
            {!achados.length ? <li style={{ fontSize: '14px', color: 'var(--texto-sec)', padding: '8px 0' }}>Ninguém encontrado com esse nome.</li> : null}
          </ul>
        ) : null}
        {recebidos.length ? (
          <>
            <Rotulo>Pedidos de amizade</Rotulo>
            {recebidos.map((a) => (
              <div key={a.outro.user_id} style={linha}>
                <Inicial nome={a.outro.display_name} />
                <b style={{ flex: 1 }}>{a.outro.display_name}</b>
                <button type="button" className="r-btn" onClick={() => void responderAmizade(a.outro.user_id, true).then(carregar)} style={{ ...acao, background: 'var(--amarelo)', border: 0 }}>Aceitar</button>
                <button type="button" className="r-btn" onClick={() => void responderAmizade(a.outro.user_id, false).then(carregar)} style={acao}>Recusar</button>
              </div>
            ))}
          </>
        ) : null}
        <Rotulo>Amigos ({amigos.length})</Rotulo>
        {amigos.map((a) => (
          <button key={a.outro.user_id} type="button" className="r-btn" onClick={() => navegar(`/pessoa/${a.outro.user_id}`)} style={{ ...linha, width: '100%', textAlign: 'left' }}>
            <Inicial nome={a.outro.display_name} />
            <span style={{ flex: 1 }}><b>{a.outro.display_name}</b><span style={sub}>{a.outro.origin_city ?? ''}</span></span>
            <span aria-hidden>›</span>
          </button>
        ))}
        {!amigos.length ? <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: 0 }}>Busque pelo nome de quem você conhece para adicionar.</p> : null}
        {enviados.length ? <p style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Aguardando resposta: {enviados.map((a) => a.outro.display_name).join(', ')}.</p> : null}
        {deAmigos.length ? (
          <>
            <Rotulo>Viagens compartilhadas por amigos</Rotulo>
            {deAmigos.map((v) => (
              <button key={v.id} type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}`)} style={{ ...linha, width: '100%', textAlign: 'left' }}>
                <span style={{ flex: 1 }}><b>{v.destino}</b><span style={sub}>{periodo(v.data_ida, v.noites)}</span></span>
                <span aria-hidden>›</span>
              </button>
            ))}
          </>
        ) : null}
        <div style={{ height: '24px' }} />
      </div>
      <Abas ativa="social" />
    </main>
  );
}

const titulo = { margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' } as const;
const linha = { display: 'flex', alignItems: 'center', gap: '10px', minHeight: '60px', borderBottom: '1px solid var(--linha)' } as const;
const sub = { display: 'block', fontSize: '13px', color: 'var(--texto-sec)' } as const;
const acao = { minHeight: '40px', padding: '0 12px', border: '1px solid var(--linha)', font: "600 14px 'Open Sans'" } as const;
