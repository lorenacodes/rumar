import { Link, useParams } from 'react-router-dom';

import { TELAS } from '../telas/registro';

/** Moldura 390 × 844 para comparar uma tela com o design (só desenvolvimento). */
export function DevTela() {
  const { id = '' } = useParams();
  const Tela = TELAS[id];
  if (!Tela) return <p style={{ padding: 20 }}>Tela {id} ainda não implementada.</p>;
  return (
    <div style={{ width: 390, height: 844, position: 'relative' }} data-dev-tela={id}>
      <Tela />
    </div>
  );
}

export function DevIndice() {
  const ids = Object.keys(TELAS);
  return (
    <ul style={{ padding: 20 }} data-telas={JSON.stringify(ids)}>
      {ids.map((id) => (
        <li key={id}>
          <Link to={`/dev/telas/${id}`}>{id}</Link>
        </li>
      ))}
    </ul>
  );
}
