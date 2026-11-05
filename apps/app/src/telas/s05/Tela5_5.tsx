import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { confirmarCodigo, reenviarCodigo } from '../../conta/servico';
import { useFluxoConta } from '../../conta/fluxo';
import { ANA, useDemo, useValorInicial } from '../../dev/demo';
import { Aviso, BotaoPrincipal, BotaoTexto, Rodape, Voltar } from '../../ui/pecas';
import { Nota } from '../../ui/textos';

const caixa = { width: '46px', height: '56px', border: '2px solid var(--texto)', boxSizing: 'border-box' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 24px 'Lexend Exa'" };

/** 5.5 Confirmar e-mail — código de 6 números. Também usado na troca de e-mail (5.15). */
export function Tela5_5() {
  const navegar = useNavigate();
  const demo = useDemo();
  const { email: emailFluxo, tipoCodigo } = useFluxoConta();
  const email = useValorInicial<string>(ANA.email, emailFluxo);
  const [codigo, setCodigo] = useState(useValorInicial('483', ''));
  const [espera, setEspera] = useState(30);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (demo || espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera, demo]);

  const confirmar = async () => {
    if (codigo.length !== 6) return setErro('Digite os 6 números.');
    setEnviando(true);
    const r = await confirmarCodigo(email, codigo, tipoCodigo);
    setEnviando(false);
    if (r.ok) return navegar(tipoCodigo === 'signup' ? '/inicio' : '/perfil', { replace: true });
    setErro(r.motivo === 'codigo' ? 'Código errado ou vencido. Confira e tente de novo.' : 'Não conseguimos confirmar agora. Tente de novo.');
  };

  return (
    <main className="tela" data-tela="5.5">
      <div style={{ padding: '22px 20px 0' }}>
        <Voltar />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>{tipoCodigo === 'signup' ? 'Guardar o plano' : 'Trocar o e-mail'}</div>
        <h1 style={{ margin: 0, font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>Digite o código.</h1>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', marginTop: '8px' }}>Enviamos 6 números para {email}.</p>
        <label htmlFor="codigo" className="visualmente-oculto">
          Código de 6 números
        </label>
        <div style={{ position: 'relative', display: 'flex', gap: '8px', marginTop: '20px' }} onClick={() => campo.current?.focus()}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={caixa} aria-hidden>
              {codigo[i] ?? ''}
            </div>
          ))}
          <input
            ref={campo}
            id="codigo"
            className="r-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={codigo}
            onChange={(e) => (setErro(null), setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6)))}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'text' }}
          />
        </div>
        {erro ? <Aviso>{erro}</Aviso> : null}
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '14px' }}>
          {espera > 0 ? (
            `Não chegou? Reenviar em ${espera} segundos.`
          ) : (
            <button type="button" className="r-btn" style={{ color: 'var(--azul)', fontWeight: 600 }} onClick={() => (void reenviarCodigo(email, tipoCodigo), setEspera(30))}>
              Não chegou? Reenviar o código.
            </button>
          )}
        </div>
        <Nota marginTop="12px">Seu plano continua salvo neste aparelho enquanto você confirma.</Nota>
      </div>
      <Rodape padding="10px 20px 14px">
        <BotaoPrincipal onClick={() => void confirmar()} disabled={enviando}>
          Confirmar ✓
        </BotaoPrincipal>
        <BotaoTexto onClick={() => navegar(tipoCodigo === 'signup' ? '/conta/criar' : '/perfil/email', { replace: true })}>Trocar o e-mail</BotaoTexto>
      </Rodape>
    </main>
  );
}
