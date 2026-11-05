import { useLayoutEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { PLANO_ANA, usePlano } from '../state/plano';
import { TELAS } from '../telas/registro';
import { DemoProvider } from './demo';

/** Moldura 390 × 844 com os dados de exemplo da Ana S. (só desenvolvimento). */
export function DevTela() {
  const { id = '' } = useParams();
  const [pronto, setPronto] = useState(false);
  useLayoutEffect(() => {
    usePlano.setState(PLANO_ANA);
    setPronto(true);
  }, []);
  const Tela = TELAS[id];
  if (!Tela) return <p style={{ padding: 20 }}>Tela {id} ainda não implementada.</p>;
  if (!pronto) return null;
  return (
    <DemoProvider>
      <div style={{ width: 390, height: 844, position: 'relative' }} data-dev-tela={id}>
        <Tela />
      </div>
    </DemoProvider>
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
