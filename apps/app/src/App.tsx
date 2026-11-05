import { createHashRouter, RouterProvider, type RouteObject } from 'react-router-dom';

import { DevIndice, DevTela } from './dev/DevTelas';
import { Tela1_1 } from './telas/s01/Tela1_1';
import { Tela1_2 } from './telas/s01/Tela1_2';

function EmConstrucao({ tela }: { tela: string }) {
  return (
    <main className="tela" style={{ padding: 20 }}>
      <p className="texto-apoio">Tela {tela}: entra na Fase 1.</p>
    </main>
  );
}

const rotas: RouteObject[] = [
  { path: '/', element: <Tela1_1 /> },
  { path: '/menor-de-18', element: <Tela1_2 /> },
  { path: '/boas-vindas', element: <EmConstrucao tela="1.3" /> },
  { path: '/privacidade', element: <EmConstrucao tela="aviso de privacidade" /> },
];

if (__DEV_TELAS__) {
  rotas.push({ path: '/dev/telas', element: <DevIndice /> }, { path: '/dev/telas/:id', element: <DevTela /> });
}

// Hash router: funciona igual dentro do Capacitor (arquivos locais) e no navegador.
const router = createHashRouter(rotas);

export function App() {
  return <RouterProvider router={router} />;
}
