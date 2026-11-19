import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

import { registrarErro } from '../lib/erros';

/** Quando uma tela quebra (D-085): mensagem clara e caminho de volta, em vez de tela branca. O erro é registrado. */
export function TelaDeErro() {
  const erro = useRouteError();
  useEffect(() => registrarErro(erro, 'tela'), [erro]);
  return (
    <main className="tela" role="alert" style={{ padding: 'calc(40px + env(safe-area-inset-top)) 20px 24px' }}>
      <h1 style={{ margin: 0, font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Algo deu errado.</h1>
      <p style={{ fontSize: '16px', lineHeight: '23px', color: 'var(--texto-sec)', margin: '8px 0 0' }}>Já registramos o problema. Seus dados estão salvos.</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        <button type="button" className="r-btn" onClick={() => location.reload()} style={{ flex: 1, minHeight: '48px', borderRadius: '24px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>Tentar de novo</button>
        <button type="button" className="r-btn" onClick={() => { location.hash = '#/inicio'; location.reload(); }} style={{ flex: 1, minHeight: '48px', borderRadius: '24px', background: 'var(--cartao-1)', font: "600 15px 'Open Sans'" }}>Ir para o início</button>
      </div>
    </main>
  );
}
