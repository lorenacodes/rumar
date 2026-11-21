import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { criarConta, emailValido, entrarComGoogle, googleDisponivel, regrasSenha, senhaValida, sugerirEmail } from '../../conta/servico';
import { lerData, maiorDe18, mascararData } from '../../lib/idade';
import { useFluxoConta } from '../../conta/fluxo';
import { ANA, useDemo, useValorInicial } from '../../dev/demo';
import { usePlano } from '../../state/plano';
import { Aviso, BotaoPrincipal, Caixa, Campo, Rodape, Voltar } from '../../ui/pecas';

/** Cartão com o plano deste aparelho enquanto o destino ainda não foi escolhido. */
function CartaoPlano({ mensal, guardado }: { mensal: number; guardado: number }) {
  const reais = (c: number) => `R$ ${Math.round(c / 100).toLocaleString('pt-BR')}`;
  return (
    <div style={{ background: 'var(--fundo-escuro)', borderTop: '6px solid var(--faixa-design)', color: '#fff', marginTop: '14px', padding: '12px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <b style={{ font: "600 26px/34px 'Lexend Exa'" }}>{reais(mensal)}</b>
        <span style={{ fontSize: '14px', color: '#AEBBE0' }}>por mês</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '14px', color: '#AEBBE0' }}>
        <span>Já guardado</span>
        <b style={{ color: 'var(--amarelo)' }}>{reais(guardado)}</b>
      </div>
    </div>
  );
}

/** Cartão da viagem do plano (aparece quando o plano já tem destino). */
function CartaoViagem() {
  return (
    <div style={{ background: 'var(--fundo-escuro)', borderTop: '6px solid var(--faixa-design)', color: '#fff', marginTop: '14px', padding: '12px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <b style={{ font: "600 32px/34px 'Lexend Exa'" }}>AJU</b>
        <span style={{ color: 'var(--amarelo)' }}>→</span>
        <b style={{ font: "600 32px/34px 'Lexend Exa'" }}>CDG</b>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '14px', color: '#AEBBE0' }}>
        <span>jul de 2027</span>
        <b style={{ color: 'var(--amarelo)' }}>26% pronta</b>
      </div>
    </div>
  );
}

/** 5.3 Guardar o plano — criar conta. Nada é pré-marcado (seção 8). */
export function Tela5_3() {
  const navegar = useNavigate();
  const demo = useDemo();
  const maior18 = usePlano((p) => p.maior18);
  const atualizarPlano = usePlano((p) => p.atualizar);
  // A idade é pedida aqui, só na hora de criar a conta (antes a pessoa navega à vontade).
  const [nascimento, setNascimento] = useState('');
  const [google, setGoogle] = useState(false);
  useEffect(() => { void googleDisponivel().then(setGoogle); }, []);
  /** Confere a idade (se ainda não foi conferida). false = parou (erro ou menor de 18). */
  const conferirIdade = (): boolean => {
    if (maior18) return true;
    const d = lerData(nascimento);
    if (!d) { setErro('Confira a data de nascimento.'); return false; }
    const maior = maiorDe18(d, new Date());
    atualizarPlano({ maior18: maior });
    if (!maior) { navegar('/menor-de-18', { replace: true }); return false; }
    return true;
  };
  const comGoogle = async () => {
    if (!(termos && privacidade)) { setErro('Marque que aceita os Termos e a Política de Privacidade.'); return; }
    if (!conferirIdade()) return;
    if (!(await entrarComGoogle())) setErro('Não deu para abrir o Google agora. Tente de novo.');
  };
  const mensal = usePlano((p) => p.mensal);
  const guardadoPlano = usePlano((p) => p.guardado);
  const setFluxo = useFluxoConta((s) => s.set);
  const [nome, setNome] = useState(useValorInicial<string>(ANA.nome, ''));
  const [email, setEmail] = useState(useValorInicial<string>(ANA.email, ''));
  const [senha, setSenha] = useState('');
  const [termos, setTermos] = useState(useValorInicial(true, false));
  const [privacidade, setPrivacidade] = useState(useValorInicial(true, false));
  const [novidades, setNovidades] = useState(false);
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const regras = regrasSenha(senha);
  const pronto = nome.trim() && emailValido(email) && senhaValida(senha) && termos && privacidade;

  const enviar = async () => {
    if (!pronto) {
      // Diz exatamente o que falta (um item por vez).
      setErro(!nome.trim() ? 'Escreva seu nome.' : !emailValido(email) ? 'Confira o e-mail.' : !senhaValida(senha) ? 'A senha precisa ter pelo menos 8 caracteres, com uma letra e um número.' : 'Marque que aceita os Termos e a Política de Privacidade.');
      return;
    }
    if (!conferirIdade()) return;
    setEnviando(true);
    const r = await criarConta({ nome, email, senha, novidades });
    setEnviando(false);
    setFluxo({ email, tipoCodigo: 'signup', ...(r.ok ? { enviadoEm: Date.now(), erros: 0 } : {}) });
    if (r.ok) return navegar('/conta/codigo');
    if (r.motivo === 'existe') return navegar('/conta/ja-existe');
    const mensagens: Record<string, string> = {
      email_invalido: 'Esse e-mail não existe ou tem um erro de digitação. Confira o endereço (por exemplo, gmail.com).',
      limite_email: 'Enviamos muitos e-mails em pouco tempo. Espere alguns minutos e tente de novo.',
      email_nao_autorizado: 'Ainda não conseguimos enviar e-mail para esse endereço. Tente com outro e-mail.',
      invalido: 'Confira o e-mail e a senha.',
      vazada: 'Essa senha já vazou na internet. Escolha outra.',
    };
    setErro(mensagens[r.motivo] ?? 'Não conseguimos criar a conta agora. Confira a internet e tente de novo.');
  };

  return (
    <main className="tela" data-tela="5.3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void enviar();
        }}>
        <div style={{ padding: '20px 20px 0' }}>
          <Voltar />
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>{demo ? 'Seu plano está pronto' : 'Conta grátis'}</div>
          <h1 style={{ margin: 0, font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>{demo ? 'Guarde seu plano.' : 'Crie sua conta.'}</h1>
          {/* O destino entra com a Fase 1 (Descobrir); até lá o cartão só aparece no modo demonstração. */}
          {demo ? <CartaoViagem /> : mensal > 0 ? <CartaoPlano mensal={mensal} guardado={guardadoPlano} /> : null}
          <Campo id="nome" rotulo="Seu nome" autoComplete="name" valor={nome} aoMudar={setNome} />
          <Campo id="email" rotulo="E-mail" type="email" inputMode="email" autoComplete="email" placeholder="nome@exemplo.com" valor={email} aoMudar={setEmail} />
          {sugerirEmail(email) ? (
            <button type="button" className="r-btn" onClick={() => setEmail(sugerirEmail(email)!)} style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--azul)', fontWeight: 600, marginTop: '6px' }}>
              Você quis dizer {sugerirEmail(email)}?
            </button>
          ) : null}
          <Campo id="senha" rotulo="Senha" type={verSenha ? 'text' : 'password'} autoComplete="new-password" placeholder={demo ? '••••••••' : 'Mínimo 8, com letra e número'} valor={senha} aoMudar={setSenha} aria-describedby="regras-senha" />
          {!demo ? (
            <button type="button" className="r-btn" aria-pressed={verSenha} onClick={() => setVerSenha(!verSenha)} style={{ minHeight: '36px', marginTop: '2px', color: 'var(--azul)', fontWeight: 600, fontSize: '14px' }}>{verSenha ? 'Esconder senha' : 'Mostrar senha'}</button>
          ) : null}
          {senha ? (
            <div id="regras-senha" style={{ fontSize: '13px', lineHeight: '20px', marginTop: '4px' }}>
              <span style={{ color: regras.tamanho ? 'var(--verde)' : 'var(--texto-sec)' }}>{regras.tamanho ? <span className="visualmente-oculto">Atendido: </span> : null}Pelo menos 8 caracteres</span>
              {'  '}
              <span style={{ color: regras.letraENumero ? 'var(--verde)' : 'var(--texto-sec)' }}>{regras.letraENumero ? <span className="visualmente-oculto">Atendido: </span> : null}Uma letra e um número</span>
            </div>
          ) : null}
          {!maior18 && !demo ? (
            <>
              <Campo id="nascimento" rotulo="Data de nascimento" inputMode="numeric" autoComplete="bday" placeholder="dd/mm/aaaa" valor={nascimento} aoMudar={(v) => setNascimento(mascararData(v))} aria-describedby="nascimento-ajuda" />
              <div id="nascimento-ajuda" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--texto-sec)', marginTop: '4px' }}>O Bo Vair é para 18+. Guardamos só isso, não a data.</div>
            </>
          ) : null}
          <div style={{ marginTop: '8px' }}>
            {demo ? (
              <>
                <Caixa marcada={termos} aoMudar={setTermos}>
                  Li e concordo com os Termos de uso.
                </Caixa>
                <Caixa marcada={privacidade} aoMudar={setPrivacidade}>
                  Li a Política de Privacidade.
                </Caixa>
              </>
            ) : (
              // No app, um aceite só (os dois registros continuam salvos separados).
              <Caixa marcada={termos && privacidade} aoMudar={(v) => { setTermos(v); setPrivacidade(v); }}>
                Li e aceito os Termos de uso e a Política de Privacidade.
              </Caixa>
            )}
            {/* Links para ler o que se aceita (D-029); a comparação com o design mantém a 5.3 original. */}
            {!demo ? (
              <div style={{ display: 'flex', gap: '16px', margin: '0 0 6px 34px' }}>
                <button type="button" className="r-btn" onClick={() => navegar('/termos')} style={{ minHeight: '40px', color: 'var(--azul)', fontWeight: 600, fontSize: '14px' }}>Ler os Termos ›</button>
                <button type="button" className="r-btn" onClick={() => navegar('/privacidade')} style={{ minHeight: '40px', color: 'var(--azul)', fontWeight: 600, fontSize: '14px' }}>Ler a Política ›</button>
              </div>
            ) : null}
            <Caixa marcada={novidades} aoMudar={setNovidades}>
              Quero receber novidades por e-mail (opcional).
            </Caixa>
          </div>
          <div style={{ fontSize: '14px', lineHeight: '18px', color: 'var(--texto-sec)' }}>O Bo Vair não guarda nem movimenta seu dinheiro.</div>
        </div>
        <Rodape>
          {/* Aviso logo acima do botão: sempre à vista, sem precisar rolar. */}
          {erro ? (
            <div style={{ marginBottom: '8px', marginTop: '-8px' }}>
              <Aviso>{erro}</Aviso>
            </div>
          ) : null}
          <BotaoPrincipal type="submit" disabled={enviando}>
            {enviando ? 'Criando sua conta…' : demo ? 'Criar conta e guardar ↗' : 'Criar conta ↗'}
          </BotaoPrincipal>
          {google && !demo ? (
            <button type="button" className="r-btn" onClick={() => void comGoogle()}
              style={{ width: '100%', minHeight: '48px', marginTop: '8px', borderRadius: '24px', border: '1.5px solid var(--texto)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', font: "600 15px 'Open Sans'" }}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
              Continuar com Google
            </button>
          ) : null}
        </Rodape>
      </form>
    </main>
  );
}
