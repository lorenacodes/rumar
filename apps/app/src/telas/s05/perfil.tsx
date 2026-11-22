import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check } from '../../ui/check';
import { Navigate, useNavigate } from 'react-router-dom';

import { carregarPerfil, emailValido, conferirSenhaAtual, enviarFoto, iniciais, pedirTrocaDeEmail, removerFoto, sair, salvarPerfil, useSessao, type Perfil } from '../../conta/servico';
import { useFluxoConta } from '../../conta/fluxo';
import { ANA, useDemo, useValorInicial } from '../../dev/demo';
import { ORIGEM_ANA, usePlano } from '../../state/plano';
import { paisPorCodigo } from '../../lib/moedas';
import { meuUsuario } from '../../lib/usuario';
import { minhasAmizades, type Amizade } from '../../lib/social';
import { souModerador } from '../../lib/fotosEnviadas';
import { NOME_ESTILO } from '../../lib/planejador';
import { useViajante } from '../../state/viajante';
import { Abas } from '../../ui/abas';
import { Aviso, BotaoPrincipal, Campo, Rodape, Voltar } from '../../ui/pecas';
import { SugestoesCidade, useCampoCidade } from '../../ui/sugestoesCidade';
import { Nota, Titulo } from '../../ui/textos';

const PERFIL_ANA: Perfil = { display_name: ANA.nome, origin_city: ANA.cidade, origem: ORIGEM_ANA, email: ANA.email };

/** Perfil da conta: dados de exemplo no modo demonstração, do Supabase no app. */
function usePerfil(): Perfil | null | undefined {
  const demo = useDemo();
  const [perfil, setPerfil] = useState<Perfil | null | undefined>(demo ? PERFIL_ANA : undefined);
  useEffect(() => {
    if (demo) return;
    void carregarPerfil().then(setPerfil);
  }, [demo]);
  return perfil;
}

/** Quadrado amarelo com as iniciais (como no design) ou a foto da pessoa. */
function Avatar({ nome, foto, lado, fonte }: { nome: string; foto?: string | null; lado: string; fonte: string }) {
  return (
    <div className="avatar-perfil" style={{ width: lado, height: lado, flex: 'none', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: fonte, overflow: 'hidden' }} aria-hidden>
      {foto ? <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : iniciais(nome)}
    </div>
  );
}

function Linha({ titulo, detalhe, onClick, minHeight = '42px' }: { titulo: string; detalhe?: string; onClick?: () => void; minHeight?: string }) {
  return (
    <button type="button" className="r-btn alvo-toque linha-lista" onClick={onClick} style={{ width: '100%', boxSizing: 'content-box', display: 'flex', alignItems: 'center', gap: '12px', minHeight, borderBottom: '1px solid var(--linha)' }}>
      <div style={{ flex: '1' }}>
        <div style={{ font: "600 16px 'Open Sans'" }}>{titulo}</div>
        {detalhe ? <div style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--texto-sec)' }}>{detalhe}</div> : null}
      </div>
      <span className="linha-seta" style={{ color: 'var(--texto-sec)', font: "600 14px 'Open Sans'", textAlign: 'right' }} aria-hidden>
        ›
      </span>
    </button>
  );
}

function Cabecalho({ children }: { children?: ReactNode }) {
  const demo = useDemo();
  return (
    <>
      {/* No app, as configurações abrem a partir do perfil (feed): voltar leva a ele. */}
      <Voltar para={demo ? '/inicio' : '/pessoa/eu'} rotulo={demo ? undefined : 'Meu perfil'} />
      <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Perfil</div>
      <Titulo marginTop="4px">{demo ? 'Seu perfil.' : 'Ajustes.'}</Titulo>
      {children}
    </>
  );
}

/** Exige sessão: sem conta, leva para entrar. */
function useExigirSessao(): 'carregando' | 'ok' | 'sem' {
  const demo = useDemo();
  const sessao = useSessao();
  if (demo) return 'ok';
  if (sessao === undefined) return 'carregando';
  return sessao ? 'ok' : 'sem';
}

/** Perfil de viajante, viagens e salvos da pessoa (dados do aparelho e do banco). */
function SecaoViajante() {
  const navegar = useNavigate();
  const { preferencias, salvos } = useViajante();
  const { paisResidencia, moedaReferencia } = usePlano();
  const [usuario, setUsuario] = useState<string | null | undefined>(undefined);
  const [amizades, setAmizades] = useState<Amizade[] | null>(null);
  useEffect(() => void meuUsuario().then((m) => setUsuario(m?.username ?? null)), []);
  useEffect(() => void minhasAmizades().then(setAmizades), []);
  const demo = useDemo();
  const [moderadora, setModeradora] = useState(false);
  useEffect(() => void souModerador().then(setModeradora), []);
  const pedidos = amizades?.filter((a) => a.status === 'pendente' && !a.enviadaPorMim).length ?? 0;
  const nAmigos = amizades?.filter((a) => a.status === 'aceita').length ?? 0;
  const RITMO = { calm: 'tranquilo', balanced: 'equilibrado', intense: 'intenso' } as const;
  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ font: "700 15px/20px 'Open Sans'", color: 'var(--texto)', margin: '8px 0 2px' }}>{demo ? 'Viagens' : 'Viagens e amigos'}</div>
      <Linha minHeight="44px" titulo={pedidos ? `Amigos · ${pedidos} ${pedidos === 1 ? 'pedido' : 'pedidos'} esperando` : 'Amigos'}
        detalhe={amizades === null ? '…' : nAmigos ? `${nAmigos} ${nAmigos === 1 ? 'amigo' : 'amigos'} · encontrar mais pelo nome ou @` : 'Encontrar amigos pelo nome ou @ e viajar junto'} onClick={() => navegar('/perfil/amigos')} />
      {moderadora ? <Linha minHeight="44px" titulo="Moderação de fotos" detalhe="Aprovar fotos enviadas" onClick={() => navegar('/perfil/moderar')} /> : null}
      <Linha minHeight="44px" titulo="Nome de usuário" detalhe={usuario ? `@${usuario}` : usuario === null ? 'Escolher (para amigos te encontrarem)' : '…'} onClick={() => navegar('/perfil/usuario')} />
      <Linha minHeight="44px" titulo="Meu jeito de viajar" detalhe={preferencias ? `Estilo ${NOME_ESTILO[preferencias.estilo]} · ritmo ${RITMO[preferencias.ritmo]}` : 'Responder em 1 minuto'} onClick={() => navegar('/perfil-viajante')} />
      {!demo ? <Linha minHeight="44px" titulo="Idiomas para viagem" detalhe="Frases prontas para o exterior" onClick={() => navegar('/idiomas')} /> : null}
      <Linha minHeight="44px" titulo="Minhas viagens" detalhe="Roteiros, hospedagem e orçamento" onClick={() => navegar('/viagens')} />
      <Linha minHeight="44px" titulo="Minhas avaliações" detalhe="Restaurantes, passeios e hotéis onde fui" onClick={() => navegar('/perfil/avaliacoes')} />
      <Linha minHeight="44px" titulo="Minhas fotos" detalhe="De viagens e de lugares" onClick={() => navegar('/perfil/fotos')} />
      <Linha minHeight="44px" titulo="País e moeda" detalhe={`${paisPorCodigo(paisResidencia)?.nome ?? paisResidencia} · ${moedaReferencia}`} onClick={() => navegar('/perfil-moeda')} />
      <Linha minHeight="44px" titulo="Destinos favoritos" detalhe="Lugares que quero conhecer" onClick={() => navegar('/destinos')} />
      <Linha minHeight="44px" titulo="Lugares que quero ir" detalhe={salvos.length ? `${salvos.length} ${salvos.length === 1 ? 'lugar' : 'lugares'}` : 'Nenhum ainda'} onClick={() => navegar('/descobrir?ver=salvos')} />
    </div>
  );
}

/** 5.13 Meu perfil. */
export function Tela5_13() {
  const navegar = useNavigate();
  const demo = useDemo();
  const estado = useExigirSessao();
  const perfil = usePerfil();
  if (estado === 'sem') return <Navigate to="/entrar" replace />;
  if (estado === 'carregando' || perfil === undefined) return <main className="tela" aria-busy="true" />;
  const p = perfil ?? { display_name: 'Viajante', origin_city: null, email: '' };
  const emBreve = (tela: string) => () => navegar(`/em-breve/${tela}`);
  return (
    <main className="tela" data-tela="5.13">
      <div style={{ padding: '22px 20px 0' }}>
        <Cabecalho />
        {demo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
            <Avatar nome={p.display_name} foto={p.foto} lado="60px" fonte="600 22px 'Lexend Exa'" />
            <div>
              <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{p.display_name}</div>
              <div style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>{p.email}</div>
            </div>
          </div>
        ) : (
          // No app: o topo abre o meu perfil como os outros veem (bio, fotos e viagens).
          <button type="button" className="r-btn" onClick={() => navegar('/pessoa/eu')} aria-label="Ver meu perfil"
            style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', width: '100%', textAlign: 'left', padding: 0 }}>
            <Avatar nome={p.display_name} foto={p.foto} lado="60px" fonte="600 22px 'Lexend Exa'" />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', font: "600 20px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{p.display_name}</span>
              <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--azul)' }}>Ver meu perfil ›</span>
            </span>
          </button>
        )}
        {/* Viagem e preferências da pessoa (no app; a comparação com o design mostra só a 5.13 original). */}
        {!demo ? <SecaoViajante /> : null}
        <div style={{ marginTop: '6px' }}>
          {!demo ? <div style={{ font: "700 15px/20px 'Open Sans'", color: 'var(--texto)', margin: '14px 0 2px' }}>Conta</div> : null}
          <Linha titulo="Nome e foto" onClick={() => navegar('/perfil/nome')} />
          <Linha minHeight="44px" titulo="Cidade de onde saio" detalhe={p.origin_city ?? 'Escolher'} onClick={() => navegar('/perfil/nome')} />
          <Linha titulo="E-mail" onClick={() => navegar('/perfil/email')} />
          <Linha titulo="Senha" detalhe="Trocar" onClick={() => navegar('/perfil/senha')} />
          {/* Itens que ainda não existem (duas etapas, aparelhos, avisos) saem do app (D-028); a comparação com o design mantém a 5.13 original. */}
          {demo ? (
            <>
              <Linha titulo="Verificação em duas etapas" detalhe="Desligada" onClick={emBreve('5.20')} />
              <Linha titulo="Aparelhos conectados" onClick={emBreve('5.19')} />
              <Linha titulo="Idioma e avisos" onClick={emBreve('30.1')} />
            </>
          ) : null}
          <Linha minHeight="44px" titulo="Privacidade" detalhe={demo ? 'Dados, encontros e conta' : 'Baixar dados e excluir a conta'} onClick={demo ? emBreve('30.3') : () => navegar('/perfil/privacidade')} />
          <Linha titulo="Ajuda e contato" onClick={demo ? emBreve('29.1') : () => navegar('/perfil/ajuda')} />
          <Linha minHeight="44px" titulo="Sobre o Bo Vair" detalhe="Termos, privacidade e versão" onClick={demo ? emBreve('30.12') : () => navegar('/perfil/sobre')} />
        </div>
        <button type="button" className="r-btn" onClick={() => navegar('/perfil/sair')} style={{ width: '100%', height: '48px', marginTop: '0px', font: "600 15px 'Open Sans'", color: 'var(--vermelho)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Sair da conta
        </button>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 5.14 Nome e foto. */
export function Tela5_14() {
  const navegar = useNavigate();
  const perfil = usePerfil();
  const [nome, setNome] = useState('');
  const campo = useCampoCidade('', null);
  const [erro, setErro] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoMsg, setFotoMsg] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const seletor = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (perfil) {
      setNome(perfil.display_name);
      campo.definir(perfil.origin_city ?? '', perfil.origem ?? null);
      setFoto(perfil.foto ?? null);
    }
  }, [perfil]);
  const escolherFoto = async (arquivo: File | undefined) => {
    if (!arquivo) return;
    setEnviando(true);
    setFotoMsg(null);
    const r = await enviarFoto(arquivo);
    if (r.ok) setFoto((await carregarPerfil())?.foto ?? null);
    else setFotoMsg(r.motivo === 'tipo' ? 'Escolha uma foto (JPG ou PNG).' : 'Não conseguimos enviar a foto. Confira a internet e tente de novo.');
    setEnviando(false);
  };
  const tirarFoto = async () => {
    setFotoMsg(null);
    if (await removerFoto()) setFoto(null);
    else setFotoMsg('Não conseguimos remover a foto agora. Tente de novo.');
  };
  const cidadeInvalida = campo.texto.trim().length > 0 && !campo.escolhida;
  const salvar = async () => {
    if (!nome.trim() || cidadeInvalida) return setErro(true);
    if (await salvarPerfil(nome, campo.escolhida)) navegar('/perfil', { replace: true });
    else setErro(true);
  };
  return (
    <main className="tela" data-tela="5.14">
      <form onSubmit={(e) => (e.preventDefault(), void salvar())}>
        <div style={{ padding: '22px 20px 0' }}>
          <Voltar />
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Meu perfil</div>
          <Titulo marginTop="6px">Nome e foto.</Titulo>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '16px' }}>
            <Avatar nome={nome || 'R'} foto={foto} lado="72px" fonte="600 24px 'Lexend Exa'" />
          </div>
          <div style={{ marginTop: '18px' }}>
            <Campo id="nome" rotulo="Nome" autoComplete="name" valor={nome} aoMudar={setNome} erro={erro && !nome.trim()} rotuloStyle={{ marginTop: 0 }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <Campo id="cidade" rotulo="Cidade de onde saio" valor={campo.texto} aoMudar={campo.digitar} onFocus={campo.focar} rotuloStyle={{ marginTop: 0 }} {...campo.atributos} aria-expanded={campo.sugestoes.length > 0} erro={erro && cidadeInvalida} />
            <SugestoesCidade campo={campo} />
          </div>
          {fotoMsg ? <Aviso>{fotoMsg}</Aviso> : null}
          {erro ? <Aviso>Não conseguimos salvar. Confira o nome e tente de novo.</Aviso> : null}
          <Nota marginTop="14px">Mudar a cidade recalcula as passagens do plano. Mostramos a diferença antes de salvar.</Nota>
        </div>
        <Rodape padding="10px 20px 14px">
          {/*
           * Ajuste aprovado pela fundadora (16/11/2026, D-014): as ações da foto saíram do alto
           * da tela para perto do polegar. A foto fica em pasta privada (só a pessoa vê).
           */}
          <input ref={seletor} type="file" accept="image/*" className="visualmente-oculto" tabIndex={-1} aria-hidden onChange={(e) => void escolherFoto(e.target.files?.[0]).finally(() => (e.target.value = ''))} />
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button type="button" className="r-btn" disabled={enviando} onClick={() => seletor.current?.click()} style={{ flex: 1, height: '48px', boxSizing: 'border-box', border: '1px solid var(--linha)', font: "600 15px 'Open Sans'" }}>
              {enviando ? 'Enviando…' : 'Trocar foto'}
            </button>
            <button type="button" className="r-btn" disabled={!foto || enviando} onClick={() => void tirarFoto()} style={{ flex: 1, height: '48px', boxSizing: 'border-box', border: '1px solid var(--linha)', font: "600 15px 'Open Sans'", color: 'var(--texto-sec)', opacity: foto ? 1 : 0.5 }}>
              Remover foto
            </button>
          </div>
          <BotaoPrincipal type="submit">Salvar</BotaoPrincipal>
        </Rodape>
      </form>
    </main>
  );
}

/** 5.15 Trocar o e-mail — código vai para o e-mail novo (5.5). */
export function Tela5_15() {
  const navegar = useNavigate();
  const perfil = usePerfil();
  const setFluxo = useFluxoConta((s) => s.set);
  const [novo, setNovo] = useState('');
  const [senha, setSenha] = useState(useValorInicial('12345678', ''));
  const [erro, setErro] = useState<string | null>(null);
  const enviar = async () => {
    if (!emailValido(novo)) return setErro('Confira o e-mail novo.');
    if (!(await conferirSenhaAtual(senha))) return setErro('A senha não confere.');
    if (!(await pedirTrocaDeEmail(novo))) return setErro('Não conseguimos enviar o código agora. Tente de novo.');
    setFluxo({ email: novo, tipoCodigo: 'email_change', enviadoEm: Date.now(), erros: 0 });
    navegar('/conta/codigo');
  };
  return (
    <main className="tela" data-tela="5.15">
      <form onSubmit={(e) => (e.preventDefault(), void enviar())}>
        <div style={{ padding: '22px 20px 0' }}>
          <Voltar />
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Meu perfil</div>
          <Titulo marginTop="6px">Trocar o e-mail.</Titulo>
          <div style={{ marginTop: '18px' }}>
            <Campo id="atual" rotulo="E-mail atual" valor={perfil?.email ?? ''} aoMudar={() => undefined} readOnly rotuloStyle={{ marginTop: 0 }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <Campo id="novo" rotulo="E-mail novo" type="email" inputMode="email" autoComplete="email" placeholder="nome@exemplo.com" valor={novo} aoMudar={setNovo} rotuloStyle={{ marginTop: 0 }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <Campo id="senha" rotulo="Sua senha" type="password" autoComplete="current-password" valor={senha} aoMudar={setSenha} rotuloStyle={{ marginTop: 0 }} />
          </div>
          {erro ? <Aviso>{erro}</Aviso> : null}
          <Nota marginTop="14px">Enviamos um código para o e-mail novo. Até você confirmar, o atual continua valendo.</Nota>
        </div>
        <Rodape padding="10px 20px 14px">
          <BotaoPrincipal type="submit">Enviar código ↗</BotaoPrincipal>
        </Rodape>
      </form>
    </main>
  );
}

/** 5.17 Sair da conta? — diálogo sobre o perfil. */
export function Tela5_17() {
  const navegar = useNavigate();
  const [manterDocs, setManterDocs] = useState(true);
  const opcao = (marcado: boolean) =>
    marcado
      ? { height: '48px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '6px', font: "600 15px 'Open Sans'", boxSizing: 'border-box' as const, background: 'var(--fundo-escuro)', color: '#fff', width: '100%' }
      : { height: '48px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '6px', font: "500 15px 'Open Sans'", boxSizing: 'border-box' as const, border: '1px solid var(--linha)', width: '100%' };
  const confirmar = async () => {
    // A carteira de documentos (seção 17) ainda não existe: a escolha fica registrada para ela.
    localStorage.setItem('bovair.docs.manter', String(manterDocs));
    await sair();
    navegar('/conta/saiu', { replace: true });
  };
  return (
    <main className="tela" data-tela="5.17">
      <div style={{ padding: '22px 20px 0', opacity: '.35' }} aria-hidden>
        <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', fontSize: '24px', marginLeft: '-4px' }}>←</div>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Perfil</div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '4px' }}>Seu perfil.</div>
      </div>
      <div style={{ position: 'absolute', inset: '0', background: 'rgba(11,31,75,.55)' }} onClick={() => navegar(-1)} />
      <div role="dialog" aria-modal="true" aria-labelledby="sair-titulo" style={{ position: 'absolute', left: '20px', right: '20px', top: 'clamp(16px, calc(100% - 524px), 190px)', maxHeight: 'calc(100% - 32px)', overflowY: 'auto', background: 'var(--fundo)', padding: '20px', borderTop: '6px solid var(--faixa-design)' }}>
        <h2 id="sair-titulo" style={{ margin: 0, font: "600 22px/27px 'Lexend Exa'", letterSpacing: '-0.02em' }}>
          Sair do Bo Vair?
        </h2>
        <p style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', margin: '8px 0 0' }}>Seu plano e seu cofrinho ficam guardados na conta. É só entrar de novo.</p>
        <div style={{ marginTop: '12px', font: "600 14px 'Open Sans'", color: 'var(--texto-sec)' }} id="docs">
          Documentos da carteira
        </div>
        <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }} role="radiogroup" aria-labelledby="docs">
          <button type="button" className="r-btn" role="radio" aria-checked={manterDocs} onClick={() => setManterDocs(true)} style={opcao(manterDocs)}>
            {manterDocs ? <Check /> : ''}Manter neste aparelho
          </button>
          <button type="button" className="r-btn" role="radio" aria-checked={!manterDocs} onClick={() => setManterDocs(false)} style={opcao(!manterDocs)}>
            {!manterDocs ? <Check /> : ''}Remover deste aparelho
          </button>
        </div>
        <div style={{ marginTop: '12px', background: 'var(--cartao-1)', padding: '10px 12px', fontSize: '14px', lineHeight: '20px' }}>Viajando? Sem internet você não consegue entrar de novo. Vale ficar até voltar.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          <button type="button" className="r-btn" autoFocus onClick={() => navegar(-1)} style={{ height: '52px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 16px 'Open Sans'", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Ficar
          </button>
          <button type="button" className="r-btn" onClick={() => void confirmar()} style={{ height: '52px', border: '2px solid var(--texto)', font: "600 16px 'Open Sans'", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Sair da conta
          </button>
        </div>
      </div>
    </main>
  );
}

/** 5.18 Você saiu. */
export function Tela5_18() {
  const navegar = useNavigate();
  return (
    <main className="tela" data-tela="5.18">
      <div style={{ padding: '22px 20px 0' }}>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>bo vair</div>
        <Titulo marginTop="60px">Até a próxima.</Titulo>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: '24px', color: 'var(--texto-sec)', marginTop: '10px' }}>Você saiu desta conta. Seu plano continua guardado e volta quando você entrar.</p>
        <Nota>Se removeu os documentos deste aparelho, é só adicioná-los de novo depois.</Nota>
      </div>
      <Rodape padding="10px 20px 14px">
        <BotaoPrincipal onClick={() => navegar('/entrar', { replace: true })}>Entrar de novo ↗</BotaoPrincipal>
        <button type="button" className="r-btn" onClick={() => navegar('/inicio', { replace: true })} style={{ width: '100%', height: '48px', border: '2px solid var(--texto)', marginTop: '8px', font: "600 16px 'Open Sans'", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Ver o que cabe hoje
        </button>
      </Rodape>
    </main>
  );
}
