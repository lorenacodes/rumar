import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { entrar } from '../../conta/servico';
import { useFluxoConta } from '../../conta/fluxo';
import { ANA, useValorInicial } from '../../dev/demo';
import { Aviso, BotaoPrincipal, BotaoTexto, Campo, Rodape } from '../../ui/pecas';
import { Marca, Nota, Paragrafo, Titulo } from '../../ui/textos';
import { destinoDepoisDeEntrar } from '../s05/Tela5_1';

/** 28.7 Sua sessão terminou — entra de novo e volta para onde estava. */
export function Tela28_7() {
  const navegar = useNavigate();
  const [email, setEmail] = useState(useValorInicial<string>(ANA.email, useFluxoConta.getState().email));
  const [senha, setSenha] = useState(useValorInicial('12345678', ''));
  const [erro, setErro] = useState(false);
  const enviar = async () => {
    const r = await entrar(email, senha);
    if (!r.ok) return setErro(true);
    navegar(await destinoDepoisDeEntrar(), { replace: true });
  };
  return (
    <main className="tela" data-tela="28.7">
      <form onSubmit={(e) => (e.preventDefault(), void enviar())}>
        <div style={{ padding: '22px 20px 0' }}>
          <Marca />
          <Titulo marginTop="6px">Entre de novo para continuar.</Titulo>
          <Paragrafo>Por segurança, saímos da sua conta depois de um tempo sem uso. Seu plano continua salvo.</Paragrafo>
          <div style={{ marginTop: '18px' }}>
            <Campo id="email" rotulo="E-mail" type="email" autoComplete="email" valor={email} aoMudar={setEmail} rotuloStyle={{ marginTop: 0 }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <Campo id="senha" rotulo="Senha" type="password" autoComplete="current-password" valor={senha} aoMudar={setSenha} erro={erro} rotuloStyle={{ marginTop: 0 }} />
          </div>
          {erro ? <Aviso>E-mail ou senha não conferem. Confira e tente de novo.</Aviso> : null}
          <Nota marginTop="14px">O que já está salvo neste aparelho continua disponível sem internet.</Nota>
        </div>
        <Rodape padding="10px 20px 14px">
          <BotaoPrincipal type="submit">Entrar ↗</BotaoPrincipal>
          <BotaoTexto onClick={() => navegar('/conta/esqueci')}>Esqueci a senha</BotaoTexto>
        </Rodape>
      </form>
    </main>
  );
}
