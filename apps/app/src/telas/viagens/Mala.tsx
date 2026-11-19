import { useEffect, useMemo, useState } from 'react';

import type { Clima } from '../../lib/clima';
import { montarMala, ORDEM_GRUPOS } from '../../lib/mala';
import { Check } from '../../ui/check';

/** Lista de mala (D-088): pelo clima, destino e duração. O que já foi para a mala fica marcado neste aparelho. */
export function Mala({ tripId, noites, internacional, praia, clima, trabalho }: { tripId: string; noites: number; internacional: boolean; praia: boolean; clima: Clima | null; trabalho: boolean }) {
  const itens = useMemo(() => montarMala({ noites, internacional, praia, clima, trabalho }), [noites, internacional, praia, clima, trabalho]);
  const chave = `bovair.mala.${tripId}`;
  const [feitos, setFeitos] = useState<string[]>([]);
  const [aberta, setAberta] = useState(false);
  useEffect(() => { try { setFeitos(JSON.parse(localStorage.getItem(chave) ?? '[]') as string[]); } catch { setFeitos([]); } }, [chave]);
  const alternar = (id: string) => setFeitos((f) => {
    const n = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
    try { localStorage.setItem(chave, JSON.stringify(n)); } catch { /* sem espaço */ }
    return n;
  });
  const prontos = itens.filter((i) => feitos.includes(i.id)).length;
  return (
    <section aria-label="Mala" style={{ marginTop: '12px', padding: '14px 16px', background: 'var(--cartao-2)' }}>
      <button type="button" className="r-btn" aria-expanded={aberta} onClick={() => setAberta(!aberta)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', minHeight: '44px', textAlign: 'left' }}>
        <span>
          <b style={{ display: 'block', font: "600 17px 'Lexend Exa'" }}>Mala</b>
          <span style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>{prontos === itens.length ? 'Tudo pronto.' : `${prontos} de ${itens.length} na mala`}{clima ? ' · pelo clima da viagem' : ''}</span>
        </span>
        <span aria-hidden="true" style={{ fontSize: '22px', color: 'var(--texto-sec)' }}>{aberta ? '−' : '+'}</span>
      </button>
      {aberta ? ORDEM_GRUPOS.filter((g) => itens.some((i) => i.grupo === g)).map((g) => (
        <div key={g} style={{ marginTop: '10px' }}>
          <div style={{ font: "700 11px 'Open Sans'", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--texto-sec)' }}>{g}</div>
          {itens.filter((i) => i.grupo === g).map((i) => {
            const ok = feitos.includes(i.id);
            return (
              <button key={i.id} type="button" className="r-btn" role="checkbox" aria-checked={ok} onClick={() => alternar(i.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', minHeight: '44px', textAlign: 'left', fontSize: '15px', color: ok ? 'var(--texto-sec)' : 'var(--texto)', textDecoration: ok ? 'line-through' : 'none' }}>
                <span aria-hidden="true" style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: ok ? 'var(--verde)' : 'var(--fundo)', color: '#fff' }}>{ok ? <Check cor="#fff" /> : null}</span>
                {i.nome}
              </button>
            );
          })}
        </div>
      )) : null}
    </section>
  );
}
