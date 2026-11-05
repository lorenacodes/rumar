import { useNavigate } from 'react-router-dom';

/** 1.2 Menor de 18 anos — nada do que foi digitado é guardado. */
export function Tela1_2() {
  const navegar = useNavigate();
  return (
    <main className="tela" data-tela="1.2">
      <div className="tela-conteudo">
        <div className="marca">rumar</div>
        <h1 className="titulo-tela" style={{ marginTop: 60 }}>
          O Rumar ainda não é para você.
        </h1>
        <p className="texto-apoio" style={{ marginTop: 10 }}>
          O app é para maiores de 18 anos. Não guardamos nada do que você digitou. Quando fizer 18 anos, a gente te
          espera.
        </p>
        {/* Texto copiado do design, incluindo "(tela 6.4)" — ver relato da Fase 0. */}
        <div className="nota" style={{ marginTop: 16 }}>
          Vai viajar com a família? Um adulto usa o app e inclui os menores só pela idade, sem nome (tela 6.4).
        </div>
      </div>
      <div className="rodape">
        <button type="button" className="botao-principal" onClick={() => navegar('/', { replace: true })}>
          Entendi
        </button>
        <button type="button" className="botao-texto" onClick={() => navegar('/', { replace: true })}>
          Corrigir a data
        </button>
      </div>
    </main>
  );
}
