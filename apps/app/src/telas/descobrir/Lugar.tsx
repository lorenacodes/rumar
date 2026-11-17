import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { CATEGORIAS, horarioLegivel, lugarPorId, OSM_ATUALIZADO_EM } from '../../lib/catalogo';
import { afinidade } from '../../lib/planejador';
import { useViajante } from '../../state/viajante';
import { FotoDestino } from '../../ui/foto';
import { Voltar } from '../../ui/pecas';

/** Detalhe do lugar: foto, categoria, endereço, horário com fonte, mapa e salvar. */
export function Lugar() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  const l = lugarPorId(id);
  const { salvos, alternarSalvo, preferencias } = useViajante();
  if (!l) return <Navigate to="/descobrir" replace />;
  const salvo = salvos.includes(l.id);
  const motivos = preferencias ? afinidade(l, preferencias).motivos : [];
  const mapa = typeof l.lat === 'number' ? `https://www.google.com/maps/search/?api=1&query=${l.lat},${l.lon}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.nome}, Paris`)}`;
  return (
    <main className="tela" data-tela="lugar" data-real="lugar">
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', maxHeight: '320px', overflow: 'hidden', background: 'linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))' }}>
        <FotoDestino nome={l.id} />
        <div style={{ position: 'absolute', top: 'calc(8px + env(safe-area-inset-top))', left: '12px', background: 'var(--fundo)', zIndex: 2 }}>
          <Voltar />
        </div>
      </div>
      <div style={{ padding: '14px 20px 24px' }}>
        <div style={{ font: "700 12px 'Open Sans'", letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--azul)' }}>{CATEGORIAS[l.categoria]}</div>
        <h1 style={{ margin: '4px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{l.nome}</h1>
        <p style={{ margin: '8px 0 0', fontSize: '16px', lineHeight: '24px' }}>{l.descricao}</p>
        {motivos.length ? <p style={{ margin: '8px 0 0', fontSize: '14px', lineHeight: '20px', color: 'var(--verde)', fontWeight: 600 }}>Combina com você: {motivos.join(', ')}.</p> : null}
        <dl style={{ margin: '14px 0 0', display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '12px', rowGap: '8px', fontSize: '15px', lineHeight: '21px' }}>
          <dt style={{ fontWeight: 600 }}>Onde</dt>
          <dd style={{ margin: 0 }}>{l.endereco ?? l.area}</dd>
          <dt style={{ fontWeight: 600 }}>Horário</dt>
          <dd style={{ margin: 0 }}>{l.horario ? horarioLegivel(l.horario) : 'Não confirmado. Confira no site oficial antes de ir.'}</dd>
          <dt style={{ fontWeight: 600 }}>Preço</dt>
          <dd style={{ margin: 0 }}>{['Grátis', 'Barato', 'Médio', 'Caro'][l.custo]}</dd>
        </dl>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <a href={mapa} target="_blank" rel="noreferrer" style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--texto)', font: "600 15px 'Open Sans'", color: 'var(--texto)', textDecoration: 'none' }}>Ver no mapa ↗</a>
          <button type="button" className="r-btn" aria-pressed={salvo} onClick={() => void alternarSalvo(l.id)} style={{ flex: 1, height: '48px', background: salvo ? 'var(--fundo-escuro)' : 'var(--amarelo)', color: salvo ? '#fff' : 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>
            {salvo ? '♥ Salvo' : '♡ Salvar'}
          </button>
        </div>
        {l.site ? <a href={l.site} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '12px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Site oficial ↗</a> : null}
        <p style={{ fontSize: '13px', lineHeight: '19px', color: 'var(--texto-sec)', marginTop: '16px' }}>
          {l.osm ? <>Endereço e horário: <a href={l.osm} target="_blank" rel="noreferrer" style={{ color: 'var(--texto-sec)' }}>OpenStreetMap</a>{OSM_ATUALIZADO_EM ? `, ${OSM_ATUALIZADO_EM.split('-').reverse().join('/')}` : ''}. </> : null}
          Lugar escolhido pela curadoria do Bo Vair.
        </p>
        <button type="button" className="r-btn" onClick={() => navegar('/descobrir')} style={{ marginTop: '4px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Ver mais lugares</button>
      </div>
    </main>
  );
}
