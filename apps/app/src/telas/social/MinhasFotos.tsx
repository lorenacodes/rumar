import { useEffect, useState } from 'react';

import { eu } from '../../lib/viagens';
import { Abas } from '../../ui/abas';
import { GradeDeFotos } from '../../ui/GradeDeFotos';
import { Voltar } from '../../ui/pecas';

/** Minhas fotos (D-082): tudo o que eu postei, de viagens e de lugares, num lugar só. */
export function MinhasFotos() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => void eu().then(setId), []);
  return (
    <main className="tela" data-tela="minhas-fotos" data-real="minhas-fotos">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para="/perfil" />
        <h1 style={{ margin: '4px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Minhas fotos</h1>
        <p style={{ fontSize: '15px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>De viagens e de lugares onde você foi.</p>
        {id ? <GradeDeFotos userId={id} vazio="Você ainda não postou fotos. Poste no álbum de uma viagem." /> : null}
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}
