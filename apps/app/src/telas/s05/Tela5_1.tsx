import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { contaTemPlano, emailValido, entrar } from '../../conta/servico';
import { useFluxoConta } from '../../conta/fluxo';
import { useValorInicial, ANA } from '../../dev/demo';
import { supabase } from '../../lib/supabase';
import { usePlano } from '../../state/plano';
import { Aviso, BotaoContorno, BotaoPrincipal, Campo, Voltar } from '../../ui/pecas';

/** Marca quadrada "r" com faixa amarela, usada na tela de entrar. */
export function MarcaQuadrada() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '30px', height: '30px', background: 'var(--fundo-escuro)', borderTop: '5px solid var(--amarelo)', boxSizing: 'border-box', color: '#fff', font: "600 17px/22px 'Lexend Exa'", textAlign: 'center' }} aria-hidden>
        r
      </div>
      <span style={{ font: "600 22px 'Lexend Exa'", letterSpacing: '-0.04em' }}>rumar</span>
    </div>
  );
}

/** Para onde ir depois de entrar: oferecer o plano deste aparelho (5.7) ou o perfil. */
export async function destinoDepoisDeEntrar(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  const temPlanoLocal = usePlano.getState().mensal > 0;
  if (data.user && temPlanoLocal && !(await contaTemPlano(data.user.id))) return '/conta/plano-deste-aparelho';
  return '/perfil';
}

/** 5.1 Entrar (com o estado de senha incorreta da 5.2). */
export function Tela5_1() {
  const navegar = useNavigate();
  const setFluxo = useFluxoConta((s) => s.set);
  const [email, setEmail] = useState(useValorInicial<string>(ANA.email, useFluxoConta.getState().email));
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<'senha' | 'pausa' | 'rede' | 'email' | null>(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    if (!emailValido(email)) return setErro('email');
    setEnviando(true);
    const r = await entrar(email, senha);
    setEnviando(false);
    setFluxo({ email });
    if (r.ok) return navegar(await destinoDepoisDeEntrar(), { replace: true });
    if (r.motivo === 'nao_confirmado') {
      setFluxo({ email, tipoCodigo: 'signup' });
      return navegar('/conta/codigo');
    }
    setErro(r.motivo);
  };

  if (erro === 'senha' || erro === 'pausa') return <Tela5_2 email={email} setEmail={setEmail} senha={senha} setSenha={setSenha} erro={erro} enviar={enviar} enviando={enviando} />;

  return (
    <main className="tela" data-tela="5.1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void enviar();
        }}
        style={{ padding: '24px 20px 0' }}>
        <Voltar />
        <MarcaQuadrada />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '36px' }}>Que bom ver você de volta</div>
        <h1 style={{ margin: 0, font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>Entrar.</h1>
        <Campo id="email" rotulo="E-mail" type="email" autoComplete="email" inputMode="email" placeholder="nome@exemplo.com" valor={email} aoMudar={(v) => (setErro(null), setEmail(v))} erro={erro === 'email'} />
        <Campo id="senha" rotulo="Senha" type="password" autoComplete="current-password" placeholder="••••••••" valor={senha} aoMudar={setSenha} />
        {erro === 'email' ? <Aviso>Confira o e-mail digitado.</Aviso> : null}
        {erro === 'rede' ? <Aviso>Não conseguimos entrar agora. Confira a internet e tente de novo.</Aviso> : null}
        <button type="button" className="r-btn" onClick={() => (setFluxo({ email }), navegar('/conta/esqueci'))} style={{ minHeight: '48px', display: 'flex', alignItems: 'center', font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>
          Esqueci a senha
        </button>
        <BotaoPrincipal type="submit" disabled={enviando || !email || !senha}>
          Entrar ↗
        </BotaoPrincipal>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0', color: 'var(--texto-sec)', fontSize: '14px' }}>
          <i style={{ flex: '1', height: '1px', background: 'var(--linha)' }} />
          ou
          <i style={{ flex: '1', height: '1px', background: 'var(--linha)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <BotaoContorno onClick={() => navegar('/conta/indisponivel/google')}>Continuar com Google</BotaoContorno>
          <BotaoContorno onClick={() => navegar('/conta/indisponivel/celular')}>Continuar com o celular</BotaoContorno>
        </div>
      </form>
      <div style={{ position: 'absolute', left: '0', right: '0', bottom: '0', padding: '10px 20px 22px', borderTop: '1px solid var(--linha)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--fundo)' }}>
        <span style={{ fontSize: '15px', color: 'var(--texto-sec)' }}>Ainda não tem conta?</span>
        <button type="button" className="r-btn" onClick={() => navegar('/conta/criar')} style={{ font: "600 16px 'Open Sans'", color: 'var(--azul)', minHeight: '44px' }}>
          Criar conta
        </button>
      </div>
    </main>
  );
}

/** 5.2 Senha incorreta. */
export function Tela5_2(props: {
  email: string;
  setEmail: (v: string) => void;
  senha: string;
  setSenha: (v: string) => void;
  erro: 'senha' | 'pausa';
  enviar: () => void;
  enviando: boolean;
}) {
  const navegar = useNavigate();
  return (
    <main className="tela" data-tela="5.2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.enviar();
        }}>
        <div style={{ padding: '22px 20px 0' }}>
          <Voltar />
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>rumar</div>
          <h1 style={{ margin: 0, font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>Entrar.</h1>
          <div style={{ marginTop: '18px' }}>
            <Campo id="email" rotulo="E-mail" type="email" autoComplete="email" valor={props.email} aoMudar={props.setEmail} rotuloStyle={{ marginTop: 0 }} />
          </div>
          <div style={{ marginTop: '14px' }}>
            <Campo id="senha" rotulo="Senha" type="password" autoComplete="current-password" valor={props.senha} aoMudar={props.setSenha} erro rotuloStyle={{ marginTop: 0 }} />
            <div role="alert" style={{ font: "600 14px 'Open Sans'", color: 'var(--vermelho)', marginTop: '6px' }}>
              {props.erro === 'pausa' ? 'Muitas tentativas. Espere 15 minutos e tente de novo.' : 'Senha incorreta. Confira e tente de novo.'}
            </div>
          </div>
          <div style={{ marginTop: '14px', background: 'var(--cartao-1)', padding: '10px 14px', fontSize: '14px', lineHeight: '20px' }}>
            Depois de 5 tentativas erradas, pedimos 15 minutos de pausa para proteger a conta.
          </div>
        </div>
        <div style={{ position: 'absolute', left: '0', right: '0', bottom: '0px', padding: '10px 20px 14px', borderTop: '1px solid var(--linha)', background: 'var(--fundo)' }}>
          <BotaoPrincipal type="submit" disabled={props.enviando || props.erro === 'pausa'}>
            Entrar ↗
          </BotaoPrincipal>
          <button type="button" className="r-btn" onClick={() => navegar('/conta/esqueci')} style={{ width: '100%', height: '40px', font: "600 15px 'Open Sans'", color: 'var(--texto-sec)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Esqueci a senha
          </button>
        </div>
      </form>
    </main>
  );
}
