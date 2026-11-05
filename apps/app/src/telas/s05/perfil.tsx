import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { carregarPerfil, emailValido, conferirSenhaAtual, iniciais, pedirTrocaDeEmail, sair, salvarPerfil, useSessao, type Perfil } from '../../conta/servico';
import { useFluxoConta } from '../../conta/fluxo';
import { ANA, useDemo, useValorInicial } from '../../dev/demo';
import { Abas } from '../../ui/abas';
import { Aviso, BotaoPrincipal, Campo, Rodape, Voltar } from '../../ui/pecas';
import { Nota, Titulo } from '../../ui/textos';

const PERFIL_ANA: Perfil = { display_name: ANA.nome, origin_city: ANA.cidade, email: ANA.email };

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

function Linha({ titulo, detalhe, onClick, minHeight = '42px' }: { titulo: string; detalhe?: string; onClick?: () => void; minHeight?: string }) {
  return (
    <button type="button" className="r-btn" onClick={onClick} style={{ width: '100%', boxSizing: 'content-box', display: 'flex', alignItems: 'center', gap: '12px', minHeight, borderBottom: '1px solid var(--linha)' }}>
      <div style={{ flex: '1' }}>
        <div style={{ font: "600 16px 'Open Sans'" }}>{titulo}</div>
        {detalhe ? <div style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--texto-sec)' }}>{detalhe}</div> : null}
      </div>
      <span style={{ color: 'var(--texto-sec)', font: "600 14px 'Open Sans'", textAlign: 'right' }} aria-hidden>
        ›
      </span>
    </button>
  );
}

function Cabecalho({ children }: { children?: ReactNode }) {
  return (
    <>
      <Voltar para="/inicio" />
      <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Passaporte</div>
      <Titulo marginTop="4px">Seu perfil.</Titulo>
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

/** 5.13 Meu perfil. */
export function Tela5_13() {
  const navegar = useNavigate();
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
          <div style={{ width: '60px', height: '60px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 22px 'Lexend Exa'" }} aria-hidden>
            {iniciais(p.display_name)}
          </div>
          <div>
            <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{p.display_name}</div>
            <div style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>{p.email}</div>
          </div>
        </div>
        <div style={{ marginTop: '6px' }}>
          <Linha titulo="Nome e foto" onClick={() => navegar('/perfil/nome')} />
          <Linha minHeight="44px" titulo="Cidade de onde saio" detalhe={p.origin_city ?? 'Escolher'} onClick={() => navegar('/perfil/nome')} />
          <Linha titulo="E-mail" onClick={() => navegar('/perfil/email')} />
          <Linha titulo="Senha" detalhe="Trocar" onClick={() => navegar('/perfil/senha')} />
          <Linha titulo="Verificação em duas etapas" detalhe="Desligada" onClick={emBreve('5.20')} />
          <Linha titulo="Aparelhos conectados" onClick={emBreve('5.19')} />
          <Linha titulo="Idioma e avisos" onClick={emBreve('30.1')} />
          <Linha minHeight="44px" titulo="Privacidade" detalhe="Dados, encontros e conta" onClick={emBreve('30.3')} />
          <Linha titulo="Ajuda e contato" onClick={emBreve('29.1')} />
          <Linha minHeight="44px" titulo="Sobre o Rumar" detalhe="Termos, privacidade e versão" onClick={emBreve('30.12')} />
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
  const [cidade, setCidade] = useState('');
  const [erro, setErro] = useState(false);
  useEffect(() => {
    if (perfil) {
      setNome(perfil.display_name);
      setCidade(perfil.origin_city ?? '');
    }
  }, [perfil]);
  const salvar = async () => {
    if (!nome.trim()) return setErro(true);
    if (await salvarPerfil(nome, cidade)) navegar('/perfil', { replace: true });
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
            <div style={{ width: '72px', height: '72px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 24px 'Lexend Exa'" }} aria-hidden>
              {iniciais(nome || 'R')}
            </div>
            {/* Foto: entra junto com o armazenamento de fotos (Storage privado). */}
            <div>
              <button type="button" className="r-btn" onClick={() => navegar('/em-breve/foto')} style={{ font: "600 16px 'Open Sans'", display: 'block' }}>
                Trocar foto
              </button>
              <button type="button" className="r-btn" onClick={() => navegar('/em-breve/foto')} style={{ font: "600 15px 'Open Sans'", color: 'var(--texto-sec)', marginTop: '4px', display: 'block' }}>
                Remover foto
              </button>
            </div>
          </div>
          <div style={{ marginTop: '18px' }}>
            <Campo id="nome" rotulo="Nome" autoComplete="name" valor={nome} aoMudar={setNome} erro={erro && !nome.trim()} rotuloStyle={{ marginTop: 0 }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <Campo id="cidade" rotulo="Cidade de onde saio" autoComplete="address-level2" valor={cidade} aoMudar={setCidade} rotuloStyle={{ marginTop: 0 }} />
          </div>
          {erro ? <Aviso>Não conseguimos salvar. Confira o nome e tente de novo.</Aviso> : null}
          <Nota marginTop="14px">Mudar a cidade recalcula as passagens do plano. Mostramos a diferença antes de salvar.</Nota>
        </div>
        <Rodape padding="10px 20px 14px">
          <BotaoPrincipal type="submit">Salvar ✓</BotaoPrincipal>
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
    setFluxo({ email: novo, tipoCodigo: 'email_change' });
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
    localStorage.setItem('rumar.docs.manter', String(manterDocs));
    await sair();
    navegar('/conta/saiu', { replace: true });
  };
  return (
    <main className="tela" data-tela="5.17">
      <div style={{ padding: '22px 20px 0', opacity: '.35' }} aria-hidden>
        <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', fontSize: '24px', marginLeft: '-4px' }}>←</div>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Passaporte</div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '4px' }}>Seu perfil.</div>
      </div>
      <div style={{ position: 'absolute', inset: '0', background: 'rgba(11,31,75,.55)' }} onClick={() => navegar(-1)} />
      <div role="dialog" aria-modal="true" aria-labelledby="sair-titulo" style={{ position: 'absolute', left: '20px', right: '20px', top: '190px', background: 'var(--fundo)', padding: '20px', borderTop: '6px solid var(--amarelo)' }}>
        <h2 id="sair-titulo" style={{ margin: 0, font: "600 22px/27px 'Lexend Exa'", letterSpacing: '-0.02em' }}>
          Sair do Rumar?
        </h2>
        <p style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', margin: '8px 0 0' }}>Seu plano e seu cofrinho ficam guardados na conta. É só entrar de novo.</p>
        <div style={{ marginTop: '12px', font: "600 14px 'Open Sans'", color: 'var(--texto-sec)' }} id="docs">
          Documentos da carteira
        </div>
        <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }} role="radiogroup" aria-labelledby="docs">
          <button type="button" className="r-btn" role="radio" aria-checked={manterDocs} onClick={() => setManterDocs(true)} style={opcao(manterDocs)}>
            {manterDocs ? '✓ ' : ''}Manter neste aparelho
          </button>
          <button type="button" className="r-btn" role="radio" aria-checked={!manterDocs} onClick={() => setManterDocs(false)} style={opcao(!manterDocs)}>
            {!manterDocs ? '✓ ' : ''}Remover deste aparelho
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
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>rumar</div>
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
