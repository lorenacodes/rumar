import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { lerData, maiorDe18, mascararData } from '../../lib/idade';
import { usePlano } from '../../state/plano';

/** 1.1 Antes de começar — conferência de idade e resumo de privacidade. */
export function Tela1_1() {
  const navegar = useNavigate();
  const [data, setData] = useState('');
  const [erro, setErro] = useState(false);
  const atualizar = usePlano((p) => p.atualizar);

  const continuar = () => {
    const nascimento = lerData(data);
    if (!nascimento) {
      setErro(true);
      return;
    }
    // A data não é guardada: só o resultado "maior de 18" segue adiante.
    const maior = maiorDe18(nascimento, new Date());
    atualizar({ maior18: maior });
    navegar(maior ? '/boas-vindas' : '/menor-de-18', { replace: true });
  };

  return (
    <main className="tela" data-tela="1.1">
      <div className="tela-conteudo">
        <div className="marca">rumar</div>
        <h1 className="titulo-tela" style={{ marginTop: 40 }}>
          Antes de começar.
        </h1>
        <p className="texto-apoio" style={{ marginTop: 10 }}>
          O Rumar é para maiores de 18 anos. Qual é a sua data de nascimento?
        </p>
        <div style={{ marginTop: 18 }}>
          <label className="campo-rotulo" htmlFor="nascimento">
            Data de nascimento
          </label>
          <input
            id="nascimento"
            className="campo"
            inputMode="numeric"
            autoComplete="bday"
            placeholder="dd / mm / aaaa"
            value={data}
            aria-invalid={erro}
            aria-describedby="nascimento-nota"
            onChange={(e) => {
              setErro(false);
              setData(mascararData(e.target.value));
            }}
          />
        </div>
        <div id="nascimento-nota" className="nota" style={{ marginTop: 12 }}>
          Usamos a data só para conferir a idade. Guardamos apenas “maior de 18”, não o dia em que você nasceu.
        </div>
        <div className="cartao-apoio" style={{ marginTop: 12 }}>
          <div className="cartao-apoio-titulo">Como usamos seus dados</div>
          <div className="cartao-apoio-texto">
            Seu plano e seus valores ficam na sua conta, só para o app funcionar.
            <br />
            Não vendemos seus dados.
            <br />
            Você vê, corrige, baixa e apaga quando quiser.
          </div>
          <button type="button" className="link-acao" style={{ marginTop: 6 }} onClick={() => navegar('/em-breve/aviso-de-privacidade')}>
            Ler o aviso completo ›
          </button>
        </div>
      </div>
      <div className="rodape">
        <button type="button" className="botao-principal" onClick={continuar}>
          Continuar ↗
        </button>
      </div>
    </main>
  );
}
