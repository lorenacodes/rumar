import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useValorInicial } from '../../dev/demo';
import { usePlano, type Plano } from '../../state/plano';
import { BotaoPrincipal, Rodape } from '../../ui/pecas';

type Sonho = NonNullable<Plano['sonho']>;

const OPCOES: { id: Sonho; titulo: string; texto: string }[] = [
  { id: 'brasil', titulo: 'Brasil', texto: 'Sem passaporte. Dá para ir mais cedo.' },
  { id: 'exterior', titulo: 'Exterior', texto: 'Passaporte, câmbio e idioma entram no plano.' },
  { id: 'os-dois', titulo: 'Os dois', texto: 'Viagens no caminho e uma meta lá fora.' },
];

/** 3.1 Para onde você sonha? — passo 3 de 3 da entrada. */
export function Tela3_1() {
  const navegar = useNavigate();
  const plano = usePlano();
  const [sonho, setSonho] = useState<Sonho | null>(useValorInicial<Sonho | null>('os-dois', plano.sonho));

  const continuar = () => {
    if (!sonho) return;
    plano.atualizar({ sonho });
    navegar('/avisos');
  };

  return (
    <main className="tela" data-tela="3.1">
      <div style={{ height: '130px', background: 'linear-gradient(160deg,var(--amarelo) 0%,#8FB0F5 100%)', padding: '22px 20px 0', boxSizing: 'border-box', color: '#0B1F4B' }}>
        <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: '-0.04em' }}>bo vair</div>
        <div style={{ font: "600 14px 'Open Sans'", marginTop: '22px' }}>Passo 3 de 3</div>
      </div>
      <div style={{ padding: '16px 20px 0' }}>
        <h1 id="sonho-titulo" style={{ margin: 0, font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>
          Para onde você sonha em ir?
        </h1>
        <div role="radiogroup" aria-labelledby="sonho-titulo">
          {OPCOES.map((o) => {
            const marcado = sonho === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={marcado}
                className="r-btn"
                onClick={() => setSonho(o.id)}
                style={{ width: '100%', boxSizing: 'border-box', textAlign: 'left', border: marcado ? '2px solid var(--texto)' : '1px solid var(--linha)', padding: '14px', marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ width: '24px', height: '24px', border: '2px solid var(--texto)', borderRadius: '50%', boxSizing: 'border-box', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {marcado ? <i style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--fundo-escuro)' }} /> : null}
                </span>
                <span>
                  <span style={{ display: 'block', font: "600 17px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{o.titulo}</span>
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>{o.texto}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '14px' }}>
          Você pode mudar isso a qualquer momento no Descobrir.
        </div>
      </div>
      <Rodape>
        <BotaoPrincipal onClick={continuar} disabled={!sonho}>
          Ver as viagens
        </BotaoPrincipal>
      </Rodape>
    </main>
  );
}
