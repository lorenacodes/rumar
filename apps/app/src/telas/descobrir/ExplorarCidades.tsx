import { useEffect, useState } from 'react';

import { explorarCidades, TIPOS_CIDADE, UFS, type Destino } from '../../lib/lugares';

const NOME_UF: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco',
  PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
  SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};
const sem = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Explorar cidades do Brasil (D-084), compacto: busca + estado numa linha, tipos numa fileira.
 * A lista só aparece quando a pessoa busca ou filtra, para não empurrar as recomendações para baixo.
 */
export function ExplorarCidades({ aoEscolher }: { aoEscolher: (d: Destino) => void }) {
  const [termo, setTermo] = useState('');
  const [uf, setUf] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);
  const [lista, setLista] = useState<Destino[] | null>(null);
  const [todas, setTodas] = useState(false);
  // Digitar o nome de um estado ("Bahia", "pernambuco") filtra pelo estado.
  const ufDoTermo = UFS.find((u) => termo.trim().length >= 4 && sem(NOME_UF[u]!) === sem(termo.trim()));
  const ativo = !!(termo.trim() || uf || tipo);
  useEffect(() => {
    setTodas(false);
    if (!ativo) { setLista(null); return; }
    const t = setTimeout(() => void explorarCidades({ uf: uf ?? ufDoTermo ?? null, tipo, termo: ufDoTermo ? '' : termo }).then(setLista), 250);
    return () => clearTimeout(t);
  }, [termo, uf, tipo, ufDoTermo, ativo]);
  const chip = (on: boolean) => ({ flex: 'none', height: '36px', padding: '0 14px', borderRadius: '18px', whiteSpace: 'nowrap', font: `${on ? 600 : 500} 14px 'Open Sans'`, ...(on ? { background: 'var(--fundo-escuro)', color: '#fff' } : { background: 'var(--cartao-2)' }) }) as const;
  const mostrar = lista ? (todas ? lista.slice(0, 24) : lista.slice(0, 5)) : [];
  return (
    <section aria-label="Explorar cidades" style={{ marginTop: '16px' }}>
      <h2 style={{ margin: 0, font: "600 17px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Explorar cidades</h2>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <span style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--texto-sec)' }}><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <label htmlFor="busca-cidade" className="visualmente-oculto">Buscar cidade ou estado</label>
          <input id="busca-cidade" className="r-input busca-com-icone" type="search" value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Cidade ou estado"
            style={{ display: 'block', width: '100%', boxSizing: 'border-box', minHeight: '46px', padding: '0 14px 0 40px', borderRadius: '23px', font: "500 16px 'Open Sans'", background: 'var(--cartao-2)', border: 0 }} />
        </span>
        <label htmlFor="estado-cidade" className="visualmente-oculto">Estado</label>
        <select id="estado-cidade" value={uf ?? ''} onChange={(e) => setUf(e.target.value || null)}
          style={{ flex: 'none', minHeight: '46px', maxWidth: '112px', padding: '0 12px', borderRadius: '23px', border: 0, font: `${uf ? 600 : 500} 15px 'Open Sans'`, ...(uf ? { background: 'var(--fundo-escuro)', color: '#fff' } : { background: 'var(--cartao-2)', color: 'var(--texto)' }) }}>
          <option value="">Estado</option>
          {UFS.map((u) => <option key={u} value={u}>{NOME_UF[u]}</option>)}
        </select>
      </div>
      <div role="group" aria-label="Tipo de viagem" style={{ display: 'flex', gap: '6px', overflowX: 'auto', margin: '8px -20px 0', padding: '0 20px 2px', scrollbarWidth: 'none' }}>
        {Object.entries(TIPOS_CIDADE).map(([id, nome]) => <button key={id} type="button" className="r-btn" aria-pressed={tipo === id} onClick={() => setTipo(tipo === id ? null : id)} style={chip(tipo === id)}>{nome}</button>)}
      </div>
      {lista === null ? null : !lista.length ? <p style={{ fontSize: '15px', color: 'var(--texto-sec)', margin: '8px 0 0' }}>Nenhuma cidade com esses filtros.</p> : (
        <>
          <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
            {mostrar.map((d) => (
              <li key={d.id}>
                <button type="button" className="r-btn" onClick={() => aoEscolher(d)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', minHeight: '52px', textAlign: 'left', borderBottom: '1px solid var(--linha)' }}>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ display: 'block', font: "600 15px 'Lexend Exa'" }}>{d.nome} <span style={{ fontWeight: 400, color: 'var(--texto-sec)' }}>· {d.regiao}</span></b>
                    {d.tipos?.length ? <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{d.tipos.map((t) => TIPOS_CIDADE[t] ?? t).join(' · ')}</span> : null}
                  </span>
                  <span aria-hidden="true" style={{ color: 'var(--texto-sec)' }}>›</span>
                </button>
              </li>
            ))}
          </ul>
          {lista.length > 5 ? <button type="button" className="r-btn" onClick={() => setTodas(!todas)} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600, fontSize: '15px' }}>{todas ? 'Ver menos' : `Ver mais ${Math.min(lista.length, 24) - 5}`}</button> : null}
        </>
      )}
    </section>
  );
}
