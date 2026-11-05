import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { emailValido, pedirLinkDeSenha, regrasSenha, salvarSenhaNova, conferirSenhaAtual, senhaValida } from '../../conta/servico';
import { useFluxoConta } from '../../conta/fluxo';
import { ANA, useValorInicial } from '../../dev/demo';
import { Aviso, BotaoPrincipal, BotaoTexto, Campo, Rodape, Voltar } from '../../ui/pecas';
import { CartaoApoio, Marca, Nota, Paragrafo, Titulo } from '../../ui/textos';

/** 5.8 Esqueci a senha. */
export function Tela5_8() {
  const navegar = useNavigate();
  const setFluxo = useFluxoConta((s) => s.set);
  const [email, setEmail] = useState(useValorInicial<string>(ANA.email, useFluxoConta.getState().email));
  const [erro, setErro] = useState(false);
  const enviar = async () => {
    if (!emailValido(email)) return setErro(true);
    setFluxo({ email });
    await pedirLinkDeSenha(email);
    navegar('/conta/confira-email', { replace: true });
  };
  return (
    <main className="tela" data-tela="5.8">
      <form onSubmit={(e) => (e.preventDefault(), void enviar())}>
        <div style={{ padding: '22px 20px 0' }}>
          <Voltar />
          <Marca />
          <Titulo marginTop="6px">Vamos recuperar.</Titulo>
          <Paragrafo tamanho={15} marginTop="8px">
            Digite o e-mail da sua conta. Enviaremos um link para criar uma senha nova.
          </Paragrafo>
          <div style={{ marginTop: '14px' }}>
            <Campo id="email" rotulo="E-mail" type="email" inputMode="email" autoComplete="email" placeholder="nome@exemplo.com" valor={email} aoMudar={(v) => (setErro(false), setEmail(v))} erro={erro} rotuloStyle={{ marginTop: 0 }} />
          </div>
          {erro ? <Aviso>Confira o e-mail digitado.</Aviso> : null}
          <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '10px' }}>O link vale por 1 hora. Se não chegar, olhe o spam ou peça outro.</div>
        </div>
        <Rodape padding="10px 20px 14px">
          <BotaoPrincipal type="submit">Enviar link ↗</BotaoPrincipal>
          <BotaoTexto onClick={() => navegar('/entrar')}>Voltar para entrar</BotaoTexto>
        </Rodape>
      </form>
    </main>
  );
}

/** 5.9 Confira seu e-mail — mesma mensagem exista ou não a conta. */
export function Tela5_9() {
  const navegar = useNavigate();
  const email = useValorInicial<string>(ANA.email, useFluxoConta((s) => s.email));
  return (
    <main className="tela" data-tela="5.9">
      <div style={{ padding: '22px 20px 0' }}>
        <Marca />
        <Titulo marginTop="30px">Confira seu e-mail.</Titulo>
        <Paragrafo>Se {email} tiver uma conta, enviamos um link para criar a senha nova. Ele vale por 1 hora.</Paragrafo>
        <CartaoApoio titulo="Não chegou?">Olhe o spam. Dá para pedir outro link em 60 segundos. Se digitou o e-mail errado, volte e corrija.</CartaoApoio>
        <Nota marginTop="12px">Por segurança, a mensagem é a mesma exista ou não uma conta com esse e-mail.</Nota>
      </div>
      <Rodape padding="10px 20px 14px">
        {/* Abre o app de e-mail do aparelho. */}
        <BotaoPrincipal onClick={() => window.open('mailto:', '_system')}>Abrir meu e-mail ↗</BotaoPrincipal>
        <BotaoTexto onClick={() => navegar('/entrar')}>Voltar para entrar</BotaoTexto>
      </Rodape>
    </main>
  );
}

function Regras({ senha, anterior = true }: { senha: string; anterior?: boolean }) {
  const r = regrasSenha(senha);
  const cor = (ok: boolean) => (ok ? 'var(--verde)' : 'var(--texto-sec)');
  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ fontSize: '14px', lineHeight: '24px', color: cor(r.tamanho) }}>{r.tamanho ? '✓' : '·'} Pelo menos 8 caracteres</div>
      <div style={{ fontSize: '14px', lineHeight: '24px', color: cor(r.letraENumero) }}>{r.letraENumero ? '✓' : '·'} Uma letra e um número</div>
      {anterior ? <div style={{ fontSize: '14px', lineHeight: '24px', color: cor(senha.length > 0) }}>{senha.length > 0 ? '✓' : '·'} Não pode ser a senha anterior</div> : null}
    </div>
  );
}

/** 5.10 Criar senha nova (aberta pelo link do e-mail). */
export function Tela5_10() {
  const navegar = useNavigate();
  const [senha, setSenha] = useState(useValorInicial('abcde12345', ''));
  const [repetir, setRepetir] = useState(useValorInicial('abcde12345', ''));
  const [erro, setErro] = useState<string | null>(null);
  const salvar = async () => {
    if (!senhaValida(senha)) return setErro('A senha precisa ter pelo menos 8 caracteres, com uma letra e um número.');
    if (senha !== repetir) return setErro('As duas senhas precisam ser iguais.');
    const r = await salvarSenhaNova(senha);
    if (r.ok) return navegar('/conta/senha-trocada', { replace: true });
    setErro(r.motivo === 'igual' ? 'Essa é a senha anterior. Escolha outra.' : 'Não conseguimos salvar agora. Se o link venceu, peça outro.');
  };
  return (
    <main className="tela" data-tela="5.10">
      <form onSubmit={(e) => (e.preventDefault(), void salvar())}>
        <div style={{ padding: '22px 20px 0' }}>
          <Marca />
          <Titulo marginTop="30px">Senha nova.</Titulo>
          <Paragrafo tamanho={15} marginTop="8px">
            Escolha uma senha que você ainda não usou aqui.
          </Paragrafo>
          <div style={{ marginTop: '16px' }}>
            <Campo id="senha" rotulo="Senha nova" type="password" autoComplete="new-password" valor={senha} aoMudar={setSenha} rotuloStyle={{ marginTop: 0 }} />
          </div>
          <Regras senha={senha} />
          <div style={{ marginTop: '12px' }}>
            <Campo id="repetir" rotulo="Repetir senha" type="password" autoComplete="new-password" valor={repetir} aoMudar={setRepetir} rotuloStyle={{ marginTop: 0 }} />
          </div>
          {erro ? <Aviso>{erro}</Aviso> : null}
          <Nota marginTop="14px">Depois de salvar, saímos da sua conta nos outros aparelhos. Seu plano continua salvo.</Nota>
        </div>
        <Rodape padding="10px 20px 14px">
          <BotaoPrincipal type="submit">Salvar senha nova ✓</BotaoPrincipal>
        </Rodape>
      </form>
    </main>
  );
}

/** 5.11 Senha trocada. */
export function Tela5_11() {
  const navegar = useNavigate();
  const email = useValorInicial<string>(ANA.email, useFluxoConta((s) => s.email));
  return (
    <main className="tela" data-tela="5.11">
      <div style={{ padding: '22px 20px 0' }}>
        <Marca />
        <Titulo marginTop="60px">Pronto, senha nova.</Titulo>
        <Paragrafo>Você já pode entrar. Por segurança, saímos da conta nos outros aparelhos e enviamos um aviso para {email}.</Paragrafo>
        <Nota>Não foi você? Fale com a gente pela Ajuda e a conta fica protegida.</Nota>
      </div>
      <Rodape padding="10px 20px 14px">
        <BotaoPrincipal onClick={() => navegar('/perfil', { replace: true })}>Entrar ↗</BotaoPrincipal>
      </Rodape>
    </main>
  );
}

/** 5.12 Link vencido. */
export function Tela5_12() {
  const navegar = useNavigate();
  return (
    <main className="tela" data-tela="5.12">
      <div style={{ padding: '22px 20px 0' }}>
        <Marca />
        <Titulo marginTop="60px">Esse link já venceu.</Titulo>
        <Paragrafo>Links de senha valem por 1 hora e só funcionam uma vez. Peça outro, é rápido.</Paragrafo>
      </div>
      <Rodape padding="10px 20px 14px">
        <BotaoPrincipal onClick={() => navegar('/conta/esqueci', { replace: true })}>Pedir outro link ↗</BotaoPrincipal>
        <BotaoTexto onClick={() => navegar('/entrar', { replace: true })}>Voltar para entrar</BotaoTexto>
      </Rodape>
    </main>
  );
}

/** 5.16 Trocar a senha (com a senha atual). */
export function Tela5_16() {
  const navegar = useNavigate();
  const [atual, setAtual] = useState(useValorInicial('12345678', ''));
  const [senha, setSenha] = useState(useValorInicial('abcde12345', ''));
  const [repetir, setRepetir] = useState(useValorInicial('abcde12345', ''));
  const [erro, setErro] = useState<string | null>(null);
  const salvar = async () => {
    if (!senhaValida(senha)) return setErro('A senha precisa ter pelo menos 8 caracteres, com uma letra e um número.');
    if (senha !== repetir) return setErro('As duas senhas precisam ser iguais.');
    if (!(await conferirSenhaAtual(atual))) return setErro('A senha atual não confere.');
    const r = await salvarSenhaNova(senha);
    if (r.ok) return navegar('/conta/senha-trocada', { replace: true });
    setErro(r.motivo === 'igual' ? 'Essa é a senha atual. Escolha outra.' : 'Não conseguimos salvar agora. Tente de novo.');
  };
  return (
    <main className="tela" data-tela="5.16">
      <form onSubmit={(e) => (e.preventDefault(), void salvar())}>
        <div style={{ padding: '22px 20px 0' }}>
          <Voltar />
          <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>Meu perfil</div>
          <Titulo marginTop="6px">Trocar a senha.</Titulo>
          <div style={{ marginTop: '18px' }}>
            <Campo id="atual" rotulo="Senha atual" type="password" autoComplete="current-password" valor={atual} aoMudar={setAtual} rotuloStyle={{ marginTop: 0 }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <Campo id="nova" rotulo="Senha nova" type="password" autoComplete="new-password" valor={senha} aoMudar={setSenha} rotuloStyle={{ marginTop: 0 }} />
          </div>
          <Regras senha={senha} anterior={false} />
          <div style={{ marginTop: '10px' }}>
            <Campo id="repetir" rotulo="Repetir senha" type="password" autoComplete="new-password" valor={repetir} aoMudar={setRepetir} rotuloStyle={{ marginTop: 0 }} />
          </div>
          {erro ? <Aviso>{erro}</Aviso> : null}
          <Nota marginTop="14px">Ao trocar, saímos da conta nos outros aparelhos.</Nota>
        </div>
        <Rodape padding="10px 20px 14px">
          <BotaoPrincipal type="submit">Salvar senha nova ✓</BotaoPrincipal>
          <BotaoTexto onClick={() => navegar('/conta/esqueci')}>Esqueci a senha atual</BotaoTexto>
        </Rodape>
      </form>
    </main>
  );
}
