import { useNavigate } from 'react-router-dom';

import { useFluxoConta } from '../../conta/fluxo';
import { ANA, useValorInicial } from '../../dev/demo';
import { BotaoPrincipal, BotaoTexto, Rodape, Voltar } from '../../ui/pecas';
import { Nota } from '../../ui/textos';

/** 5.4 E-mail já tem conta. */
export function Tela5_4() {
  const navegar = useNavigate();
  const email = useValorInicial<string>(ANA.email, useFluxoConta((s) => s.email));
  return (
    <main className="tela" data-tela="5.4">
      <div style={{ padding: '22px 20px 0' }}>
        <Voltar />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Guardar o plano</div>
        <h1 style={{ margin: 0, font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>Esse e-mail já está no Rumar.</h1>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', marginTop: '8px' }}>
          Achamos uma conta com {email}. Entre nela e escolha o que fazer com o plano deste aparelho.
        </p>
        <Nota marginTop="14px">Criou com o Google? Toque em “Continuar com Google” na tela de entrar.</Nota>
      </div>
      <Rodape padding="10px 20px 14px">
        <BotaoPrincipal onClick={() => navegar('/entrar')}>Entrar nessa conta ↗</BotaoPrincipal>
        <button type="button" className="r-btn" onClick={() => navegar('/conta/criar', { replace: true })} style={{ width: '100%', height: '48px', border: '2px solid var(--texto)', marginTop: '8px', font: "600 16px 'Open Sans'", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Usar outro e-mail
        </button>
        <BotaoTexto onClick={() => navegar('/conta/esqueci')}>Esqueci a senha</BotaoTexto>
      </Rodape>
    </main>
  );
}
