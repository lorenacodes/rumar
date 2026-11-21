import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CODIGO_DIGITOS, CODIGO_VALIDADE_MIN } from '../../config';
import { confirmarCodigo, reenviarCodigo, type MotivoCodigo } from '../../conta/servico';
import { useFluxoConta } from '../../conta/fluxo';
import { ANA, useDemo, useValorInicial } from '../../dev/demo';
import { Aviso, BotaoPrincipal, BotaoTexto, Rodape, Voltar } from '../../ui/pecas';
import { Nota } from '../../ui/textos';

/** Depois de 5 tentativas erradas, só um código novo (evita adivinhação e frustração). */
const MAX_ERROS = 5;

const MENSAGEM: Record<MotivoCodigo, string> = {
  formato: '',
  invalido: 'Código incorreto. Confira os números no e-mail mais recente e tente de novo.',
  vencido: `Esse código venceu (ele vale ${CODIGO_VALIDADE_MIN} minutos). Peça um código novo abaixo.`,
  muitas_tentativas: 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  menor: 'Precisamos conferir a sua idade antes de criar a conta.',
  rede: 'Sem conexão com o servidor agora. Confira a internet e tente de novo.',
};

/** 5.5 Confirmar e-mail — código enviado por e-mail. Também usado na troca de e-mail (5.15). */
export function Tela5_5() {
  const navegar = useNavigate();
  const demo = useDemo();
  const { email: emailFluxo, tipoCodigo, erros, set: setFluxo } = useFluxoConta();
  const email = useValorInicial<string>(ANA.email, emailFluxo);
  // O design mostra 6 caixas; o app usa o tamanho que o Supabase realmente gera.
  const digitos = demo ? 6 : CODIGO_DIGITOS;
  const [codigo, setCodigo] = useState(useValorInicial('483', ''));
  const [espera, setEspera] = useState(30);
  const [erro, setErro] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const campo = useRef<HTMLInputElement>(null);
  const bloqueado = !demo && erros >= MAX_ERROS;

  useEffect(() => {
    if (demo || espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera, demo]);

  // Sem e-mail em andamento (abriu direto ou limpou o app): volta para o cadastro.
  if (!demo && !email) {
    return (
      <main className="tela" data-tela="5.5">
        <div style={{ padding: '22px 20px 0' }}>
          <Voltar />
          <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Digite o código.</h1>
          <p style={{ fontSize: '16px', lineHeight: '24px' }}>Não encontramos um cadastro em andamento neste aparelho.</p>
        </div>
        <Rodape>
          <BotaoPrincipal onClick={() => navegar('/conta/criar', { replace: true })}>Criar conta ↗</BotaoPrincipal>
          <BotaoTexto onClick={() => navegar('/entrar', { replace: true })}>Já tenho conta · Entrar</BotaoTexto>
        </Rodape>
      </main>
    );
  }

  const confirmar = async () => {
    setInfo(null);
    if (bloqueado) return setErro('Você errou o código 5 vezes. Peça um código novo abaixo.');
    // O tamanho do código é configurado no painel do Supabase (hoje 8). No app aceitamos de 6 até esse
    // tamanho: se alguém mudar o painel para 6, ninguém fica preso com caixas vazias.
    if (demo ? codigo.length !== digitos : codigo.length < 6 || codigo.length > digitos) return setErro(`Digite os ${digitos} números do código.`);
    setEnviando(true);
    const r = await confirmarCodigo(email, codigo, tipoCodigo);
    setEnviando(false);
    if (r.ok) return navegar(tipoCodigo === 'signup' ? '/bem-vindo/usuario' : '/perfil', { replace: true });
    if (r.motivo === 'menor') return navegar('/', { replace: true });
    setErro(MENSAGEM[r.motivo]);
    setCodigo('');
    campo.current?.focus();
  };

  const reenviar = async () => {
    setErro(null);
    setInfo(null);
    const r = await reenviarCodigo(email, tipoCodigo);
    if (r.ok) {
      setEspera(60);
      setCodigo('');
      setInfo(`Enviamos um código novo para ${email}. Use sempre o do e-mail mais recente.`);
    } else if (r.motivo === 'espera') {
      setEspera(r.segundos);
    } else {
      setErro(r.motivo === 'limite' ? 'Enviamos muitos e-mails agora. Espere alguns minutos para pedir outro código.' : MENSAGEM.rede);
    }
  };

  const larguraCaixa = `calc((100% - ${(digitos - 1) * 6}px) / ${digitos})`;
  return (
    <main className="tela" data-tela="5.5">
      <div style={{ padding: '22px 20px 0' }}>
        <Voltar />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>{tipoCodigo === 'signup' ? 'Guardar o plano' : 'Trocar o e-mail'}</div>
        <h1 style={{ margin: 0, font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>Digite o código.</h1>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', marginTop: '8px' }}>
          Enviamos {digitos} números para {email}.
        </p>
        <label htmlFor="codigo" className="visualmente-oculto">
          Código de {digitos} números
        </label>
        <div style={{ position: 'relative', display: 'flex', gap: demo ? '8px' : '6px', marginTop: '20px' }} onClick={() => campo.current?.focus()}>
          {Array.from({ length: digitos }, (_, i) => (
            <div
              key={i}
              aria-hidden
              style={{ width: demo ? '46px' : larguraCaixa, maxWidth: '46px', height: '56px', border: `2px solid ${erro ? 'var(--vermelho)' : 'var(--texto)'}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `600 ${digitos > 6 ? 22 : 24}px 'Lexend Exa'` }}>
              {codigo[i] ?? ''}
            </div>
          ))}
          <input
            ref={campo}
            id="codigo"
            className="r-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={digitos}
            value={codigo}
            // Colar o código inteiro (com espaços ou traços) também funciona.
            onChange={(e) => (setErro(null), setCodigo(e.target.value.replace(/\D/g, '').slice(0, digitos)))}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'text' }}
          />
        </div>
        {erro ? <Aviso>{erro}</Aviso> : null}
        {info ? <div role="status" style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--verde)', fontWeight: 600, marginTop: '10px' }}>{info}</div> : null}
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '14px' }}>
          {espera > 0 ? (
            `Não chegou? Confira o spam. Reenviar em ${espera} segundos.`
          ) : (
            <button type="button" className="r-btn alvo-toque" style={{ color: 'var(--azul)', fontWeight: 600 }} onClick={() => void reenviar()}>
              Não chegou? Reenviar o código.
            </button>
          )}
        </div>
        <Nota marginTop="12px">Seu plano continua salvo neste aparelho enquanto você confirma.</Nota>
      </div>
      <Rodape padding="10px 20px 14px">
        <BotaoPrincipal onClick={() => void confirmar()} disabled={enviando || bloqueado}>
          {enviando ? 'Confirmando…' : 'Confirmar'}
        </BotaoPrincipal>
        <BotaoTexto onClick={() => (setFluxo({ erros: 0 }), navegar(tipoCodigo === 'signup' ? '/conta/criar' : '/perfil/email', { replace: true }))}>Trocar o e-mail</BotaoTexto>
      </Rodape>
    </main>
  );
}
