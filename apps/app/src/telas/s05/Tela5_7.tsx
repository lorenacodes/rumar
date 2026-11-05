import { useNavigate } from 'react-router-dom';

import { guardarPlanoNaConta } from '../../conta/servico';
import { useDemo } from '../../dev/demo';
import { supabase } from '../../lib/supabase';
import { usePlano } from '../../state/plano';
import { BotaoPrincipal, Rodape } from '../../ui/pecas';
import { Nota } from '../../ui/textos';

/** 5.7 Plano deste aparelho — guardar na conta que acabou de entrar. */
export function Tela5_7() {
  const navegar = useNavigate();
  const demo = useDemo();
  const plano = usePlano();
  const guardado = demo ? 200000 : plano.guardado;

  const guardar = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) await guardarPlanoNaConta(data.user.id);
    navegar('/perfil', { replace: true });
  };

  return (
    <main className="tela" data-tela="5.7">
      <div style={{ padding: '22px 20px 0' }}>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Bem-vinda de volta</div>
        <h1 style={{ margin: 0, font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>Achamos um plano aqui.</h1>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', marginTop: '8px' }}>
          Esta conta ainda não tem viagens. Quer guardar o plano deste aparelho nela?
        </p>
        <div style={{ marginTop: '14px', border: '2px solid var(--texto)', padding: '12px 14px' }}>
          {demo ? (
            <>
              <div style={{ font: "600 22px 'Lexend Exa'", letterSpacing: '-0.03em' }}>Paris</div>
              <div style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>jul de 2027 · cofrinho R$ 2.000 · 26% pronta</div>
            </>
          ) : (
            <>
              <div style={{ font: "600 22px 'Lexend Exa'", letterSpacing: '-0.03em' }}>Seu plano</div>
              <div style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>
                R$ {(plano.mensal / 100).toLocaleString('pt-BR')} por mês · cofrinho R$ {(guardado / 100).toLocaleString('pt-BR')}
              </div>
            </>
          )}
        </div>
        <Nota marginTop="12px">Se a conta já tiver um plano, mostramos os dois e você escolhe. Nada é apagado sem você confirmar.</Nota>
      </div>
      <Rodape padding="10px 20px 14px">
        <BotaoPrincipal onClick={() => void guardar()}>Guardar na conta ↗</BotaoPrincipal>
        <button type="button" className="r-btn" onClick={() => (plano.limpar(), navegar('/perfil', { replace: true }))} style={{ width: '100%', height: '48px', border: '2px solid var(--texto)', marginTop: '8px', font: "600 16px 'Open Sans'", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Começar do zero
        </button>
      </Rodape>
    </main>
  );
}
