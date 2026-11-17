import { useEffect, useState } from 'react';

import { buscarDestinos, NOME_TIPO_DESTINO, rotuloDestino, type Destino } from '../lib/lugares';

/** Campo de busca de destino: qualquer município do Brasil ou destino no exterior da base. */
export function EscolherDestino({ aoEscolher, rotulo = 'Buscar cidade', autoFoco = false, placeholder = 'Ex.: Aracaju, Gramado, Lisboa…' }: { aoEscolher: (d: Destino) => void; rotulo?: string; autoFoco?: boolean; placeholder?: string }) {
  const [termo, setTermo] = useState('');
  const [lista, setLista] = useState<Destino[]>([]);
  const [buscando, setBuscando] = useState(false);
  useEffect(() => {
    if (termo.trim().length < 2) return setLista([]);
    setBuscando(true);
    const t = setTimeout(() => void buscarDestinos(termo, 8).then((l) => (setLista(l), setBuscando(false))), 250);
    return () => clearTimeout(t);
  }, [termo]);
  return (
    <div>
      <label htmlFor="busca-destino-geral" className="visualmente-oculto">{rotulo}</label>
      <input id="busca-destino-geral" type="search" className="r-input" autoFocus={autoFoco} value={termo} placeholder={placeholder} onChange={(e) => setTermo(e.target.value)} autoComplete="off"
        style={{ display: 'block', width: '100%', boxSizing: 'border-box', borderBottom: '2px solid var(--texto)', padding: '10px 0', font: "500 17px 'Open Sans'", color: 'var(--texto)', background: 'transparent' }} />
      {termo.trim().length >= 2 ? (
        <ul aria-label="Cidades encontradas" style={{ listStyle: 'none', padding: 0, margin: '2px 0 0' }}>
          {lista.map((d) => (
            <li key={d.id}>
              <button type="button" className="r-btn" onClick={() => (aoEscolher(d), setTermo(''))} style={{ display: 'block', width: '100%', minHeight: '52px', textAlign: 'left', borderBottom: '1px solid var(--linha)' }}>
                <b>{d.nome}</b>
                <span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>
                  {rotuloDestino(d).replace(`${d.nome}`, '').replace(/^[ ,—]+/, '')}{d.regiao_nome && d.pais === 'BR' ? ` · ${d.regiao_nome}` : ''}{d.tipos.length ? ` · ${d.tipos.map((t) => NOME_TIPO_DESTINO[t] ?? t).join(', ')}` : ''}
                </span>
              </button>
            </li>
          ))}
          {!buscando && !lista.length ? <li style={{ fontSize: '14px', color: 'var(--texto-sec)', padding: '8px 0' }}>Nenhuma cidade com esse nome na base.</li> : null}
        </ul>
      ) : null}
    </div>
  );
}
