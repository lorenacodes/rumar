import { useEffect, useState } from 'react';

import { explorarCidades, TIPOS_CIDADE, UFS, type Destino } from '../../lib/lugares';

const NOME_UF: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco',
  PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
  SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};
const sem = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Explorar cidades do Brasil (D-084): por nome, estado e tipo de viagem. */
export function ExplorarCidades({ aoEscolher }: { aoEscolher: (d: Destino) => void }) {
  const [termo, setTermo] = useState('');
  const [uf, setUf] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);
  const [lista, setLista] = useState<Destino[] | null>(null);
  // Digitar o nome de um estado ("Bahia", "pernambuco") filtra pelo estado.
  const ufDoTermo = UFS.find((u) => termo.trim().length >= 4 && sem(NOME_UF[u]!) === sem(termo.trim()));
  useEffect(() => {
    const t = setTimeout(() => void explorarCidades({ uf: uf ?? ufDoTermo ?? null, tipo, termo: ufDoTermo ? '' : termo }).then(setLista), 250);
    return () => clearTimeout(t);
  }, [termo, uf, tipo, ufDoTermo]);
  const chip = (ativo: boolean) => ({ flex: 'none', height: '40px', padding: '0 14px', borderRadius: '20px', whiteSpace: 'nowrap', font: `${ativo ? 600 : 500} 14px 'Open Sans'`, ...(ativo ? { background: 'var(--fundo-escuro)', color: '#fff' } : { background: 'var(--cartao-2)' }) }) as const;
  const fileira = { display: 'flex', gap: '6px', overflowX: 'auto', margin: '8px -20px 0', padding: '0 20px 4px', scrollbarWidth: 'none' } as const;
  return (
    <section aria-label="Explorar cidades" style={{ marginTop: '18px' }}>
      <h2 style={{ margin: 0, font: "600 20px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Explorar cidades</h2>
      <label htmlFor="busca-cidade" className="visualmente-oculto">Buscar cidade ou estado</label>
      <input id="busca-cidade" className="r-input" type="search" value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Cidade ou estado: Bahia, Gramado…"
        style={{ display: 'block', width: '100%', boxSizing: 'border-box', minHeight: '52px', marginTop: '8px', padding: '0 16px', borderRadius: '26px', font: "500 16px 'Open Sans'", background: 'var(--cartao-2)', border: 0 }} />
      <div role="group" aria-label="Tipo de viagem" style={fileira}>
        {Object.entries(TIPOS_CIDADE).map(([id, nome]) => <button key={id} type="button" className="r-btn" aria-pressed={tipo === id} onClick={() => setTipo(tipo === id ? null : id)} style={chip(tipo === id)}>{nome}</button>)}
      </div>
      <div role="group" aria-label="Estado" style={fileira}>
        {UFS.map((u) => <button key={u} type="button" className="r-btn" aria-pressed={uf === u} aria-label={NOME_UF[u]} onClick={() => setUf(uf === u ? null : u)} style={chip(uf === u)}>{u}</button>)}
      </div>
      {lista === null ? null : !lista.length ? <p style={{ fontSize: '15px', color: 'var(--texto-sec)' }}>Nenhuma cidade com esses filtros.</p> : (
        <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'grid', gap: '8px' }}>
          {lista.slice(0, 24).map((d) => (
            <li key={d.id}>
              <button type="button" className="r-btn" onClick={() => aoEscolher(d)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '14px', background: 'var(--cartao-2)' }}>
                <b style={{ display: 'block', font: "600 16px 'Lexend Exa'" }}>{d.nome} <span style={{ fontWeight: 400, color: 'var(--texto-sec)' }}>· {d.regiao}</span></b>
                {d.tipos?.length ? <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{d.tipos.map((t) => TIPOS_CIDADE[t] ?? t).join(' · ')}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
