import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { criarConta, emailValido, regrasSenha, senhaValida } from '../../conta/servico';
import { useFluxoConta } from '../../conta/fluxo';
import { ANA, useDemo, useValorInicial } from '../../dev/demo';
import { usePlano } from '../../state/plano';
import { Aviso, BotaoPrincipal, Caixa, Campo, Rodape, Voltar } from '../../ui/pecas';

/** Cartão da viagem do plano (aparece quando o plano já tem destino). */
function CartaoViagem() {
  return (
    <div style={{ background: 'var(--fundo-escuro)', borderTop: '6px solid var(--amarelo)', color: '#fff', marginTop: '14px', padding: '12px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <b style={{ font: "600 32px/34px 'Lexend Exa'" }}>AJU</b>
        <span style={{ color: 'var(--amarelo)' }}>✈</span>
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
  const setFluxo = useFluxoConta((s) => s.set);
  const [nome, setNome] = useState(useValorInicial<string>(ANA.nome, ''));
  const [email, setEmail] = useState(useValorInicial<string>(ANA.email, ''));
  const [senha, setSenha] = useState('');
  const [termos, setTermos] = useState(useValorInicial(true, false));
  const [privacidade, setPrivacidade] = useState(useValorInicial(true, false));
  const [novidades, setNovidades] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const regras = regrasSenha(senha);
  const pronto = nome.trim() && emailValido(email) && senhaValida(senha) && termos && privacidade;

  const enviar = async () => {
    if (!maior18) return navegar('/', { replace: true }); // idade precisa ser conferida antes (1.1)
    if (!pronto) {
      setErro(!senhaValida(senha) ? 'A senha precisa ter pelo menos 8 caracteres, com uma letra e um número.' : 'Preencha os campos e aceite os Termos e a Política de Privacidade.');
      return;
    }
    setEnviando(true);
    const r = await criarConta({ nome, email, senha, novidades });
    setEnviando(false);
    setFluxo({ email, tipoCodigo: 'signup' });
    if (r.ok) return navegar('/conta/codigo');
    if (r.motivo === 'existe') return navegar('/conta/ja-existe');
    setErro(r.motivo === 'invalido' ? 'Confira o e-mail e a senha.' : 'Não conseguimos criar a conta agora. Confira a internet e tente de novo.');
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
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Seu plano está pronto</div>
          <h1 style={{ margin: 0, font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>Guarde seu plano.</h1>
          {/* O destino entra com a Fase 1 (Descobrir); até lá o cartão só aparece no modo demonstração. */}
          {demo ? <CartaoViagem /> : null}
          <Campo id="nome" rotulo="Seu nome" autoComplete="name" valor={nome} aoMudar={setNome} />
          <Campo id="email" rotulo="E-mail" type="email" inputMode="email" autoComplete="email" placeholder="nome@exemplo.com" valor={email} aoMudar={setEmail} />
          <Campo id="senha" rotulo="Senha" type="password" autoComplete="new-password" placeholder="••••••••" valor={senha} aoMudar={setSenha} aria-describedby="regras-senha" />
          {senha ? (
            <div id="regras-senha" style={{ fontSize: '13px', lineHeight: '20px', marginTop: '4px' }}>
              <span style={{ color: regras.tamanho ? 'var(--verde)' : 'var(--texto-sec)' }}>{regras.tamanho ? '✓' : '·'} Pelo menos 8 caracteres</span>
              {'  '}
              <span style={{ color: regras.letraENumero ? 'var(--verde)' : 'var(--texto-sec)' }}>{regras.letraENumero ? '✓' : '·'} Uma letra e um número</span>
            </div>
          ) : null}
          <div style={{ marginTop: '8px' }}>
            <Caixa marcada={termos} aoMudar={setTermos}>
              Li e concordo com os Termos de uso.
            </Caixa>
            <Caixa marcada={privacidade} aoMudar={setPrivacidade}>
              Li a Política de Privacidade.
            </Caixa>
            <Caixa marcada={novidades} aoMudar={setNovidades}>
              Quero receber novidades por e-mail (opcional).
            </Caixa>
          </div>
          <div style={{ fontSize: '14px', lineHeight: '18px', color: 'var(--texto-sec)' }}>O Rumar não guarda nem movimenta seu dinheiro.</div>
          {erro ? <Aviso>{erro}</Aviso> : null}
        </div>
        <Rodape>
          <BotaoPrincipal type="submit" disabled={enviando}>
            Criar conta e guardar ↗
          </BotaoPrincipal>
        </Rodape>
      </form>
    </main>
  );
}
