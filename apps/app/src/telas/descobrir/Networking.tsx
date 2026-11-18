import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { nomeTipo, type LugarBase } from '../../lib/lugares';
import { linksDeEventos, lugaresDeTrabalho, NOME_AREA, type Area } from '../../lib/networking';
import { Info } from '../../ui/info';

/** Trabalho e networking numa cidade (D-046): lugares da área e atalhos para os eventos. */
export function BlocoNetworking({ destinoId, cidade, area }: { destinoId: string; cidade: string; area: Area | null | undefined }) {
  const navegar = useNavigate();
  const [lugares, setLugares] = useState<LugarBase[] | null>(null);
  useEffect(() => void lugaresDeTrabalho(destinoId, area).then(setLugares), [destinoId, area]);
  const pais = destinoId.slice(0, 2);
  const eventos = linksDeEventos(cidade, pais, area);
  return (
    <section aria-label="Trabalho e networking" style={{ marginTop: '14px', padding: '14px', background: 'var(--cartao-2)' }}>
      <h2 style={{ margin: 0, font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Trabalho e networking</h2>
      {lugares === null ? <p style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Carregando…</p> : lugares.length ? (
        <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
          {lugares.map((l) => (
            <li key={l.id}>
              <button type="button" className="r-btn" onClick={() => navegar(`/lugar/${l.id}`)} style={{ display: 'block', width: '100%', textAlign: 'left', minHeight: '48px', padding: '6px 0', borderBottom: '1px solid var(--linha)' }}>
                <span style={{ display: 'block', font: "600 15px/20px 'Open Sans'" }}>{l.nome}</span>
                <span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{[nomeTipo(l.tipo), l.bairro].filter(Boolean).join(' · ')}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>Ainda não achamos coworkings ou hubs aqui no mapa.</p>}
      <div style={{ font: "600 14px 'Open Sans'", marginTop: '12px' }}>Eventos de {NOME_AREA[area ?? 'tecnologia'].toLowerCase()} em {cidade}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
        {eventos.map((e) => (
          <a key={e.nome} href={e.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 14px', background: 'var(--fundo)', borderRadius: '10px', color: 'var(--azul)', font: "600 14px 'Open Sans'", textDecoration: 'none' }}>{e.nome} ↗</a>
        ))}
      </div>
      <Info rotulo="Sobre os eventos" style={{ marginTop: '6px' }}>Abrimos a busca já filtrada nos sites de eventos. Os lugares vêm do mapa colaborativo: confira horários e se aceitam visitantes por dia.</Info>
    </section>
  );
}
