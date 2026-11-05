import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useValorInicial } from '../../dev/demo';
import { usePlano } from '../../state/plano';
import { BotaoPrincipal, Rodape } from '../../ui/pecas';

const SUGESTOES = [30000, 60000, 100000];
const fmt = (centavos: number) => (centavos > 0 ? Math.round(centavos / 100).toLocaleString('pt-BR') : '');
const ler = (texto: string) => {
  const d = texto.replace(/\D/g, '').slice(0, 7);
  return d ? Number(d) * 100 : 0;
};

/** 1.4 Seu plano — passo 2 de 3: quanto guarda por mês e quanto já tem. */
export function Tela1_4() {
  const navegar = useNavigate();
  const plano = usePlano();
  const [mensal, setMensal] = useState(useValorInicial(60000, plano.mensal));
  const [guardado, setGuardado] = useState(useValorInicial(200000, plano.guardado));

  const continuar = () => {
    if (mensal <= 0) return;
    plano.atualizar({ mensal, guardado });
    navegar('/avisos');
  };

  return (
    <main className="tela" data-tela="1.4">
      <div style={{ height: '130px', background: 'linear-gradient(160deg,var(--amarelo) 0%,#8FB0F5 100%)', padding: '22px 20px 0', boxSizing: 'border-box', color: '#0B1F4B' }}>
        <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: '-0.04em' }}>rumar</div>
        <div style={{ font: "600 14px 'Open Sans'", marginTop: '22px' }}>Passo 2 de 3</div>
      </div>
      <div style={{ padding: '14px 20px 0' }}>
        <h1 style={{ margin: 0, font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>
          <label htmlFor="mensal">Quanto você consegue guardar por mês?</label>
        </h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', borderBottom: '2px solid var(--texto)', padding: '10px 0 4px' }}>
          <span style={{ font: "600 20px 'Lexend Exa'", color: 'var(--texto-sec)' }}>R$</span>
          <input
            id="mensal"
            className="r-input"
            inputMode="numeric"
            placeholder="0"
            value={fmt(mensal)}
            onChange={(e) => setMensal(ler(e.target.value))}
            style={{ font: "600 44px/52px 'Lexend Exa'", letterSpacing: '-0.03em' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }} role="group" aria-label="Sugestões de valor">
          {SUGESTOES.map((v) => {
            const marcado = mensal === v;
            return (
              <button
                key={v}
                type="button"
                className="r-btn"
                aria-pressed={marcado}
                onClick={() => setMensal(v)}
                style={
                  marcado
                    ? { flex: '1', height: '48px', background: 'var(--fundo-escuro)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "500 15px 'Open Sans'" }
                    : { flex: '1', height: '48px', border: '1px solid var(--linha)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "500 15px 'Open Sans'" }
                }>
                R$ {(v / 100).toLocaleString('pt-BR')}
              </button>
            );
          })}
        </div>
        <label htmlFor="guardado" style={{ display: 'block', font: "600 15px 'Open Sans'", color: 'var(--texto-sec)', margin: '16px 0 6px' }}>
          Já tenho guardado (opcional)
        </label>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', borderBottom: '2px solid var(--linha)', padding: '4px 0' }}>
          <span style={{ font: "600 18px 'Lexend Exa'", color: 'var(--texto-sec)' }}>R$</span>
          <input
            id="guardado"
            className="r-input"
            inputMode="numeric"
            placeholder="0"
            value={fmt(guardado)}
            onChange={(e) => setGuardado(ler(e.target.value))}
            style={{ font: "600 30px/38px 'Lexend Exa'", letterSpacing: '-0.03em' }}
          />
        </div>
        <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', margin: '14px 0 0' }}>
          Seu dinheiro continua com você. O Rumar só soma, acompanha e lembra. Sem cadastro por enquanto.
        </p>
      </div>
      <Rodape>
        <BotaoPrincipal onClick={continuar} disabled={mensal <= 0}>
          Ver as viagens ↗
        </BotaoPrincipal>
      </Rodape>
    </main>
  );
}
