import { useEffect, useState } from 'react';
import { createHashRouter, Navigate, Outlet, RouterProvider, useNavigate, type RouteObject } from 'react-router-dom';

import { ouvirLinks } from './conta/deepLink';
import { sessaoTerminouSozinha } from './conta/servico';
import { DevIndice, DevTela } from './dev/DevTelas';
import { supabase } from './lib/supabase';
import { usePlano } from './state/plano';
import { EmBreve, InicioProvisorio } from './telas/provisorias';
import { Tela1_1 } from './telas/s01/Tela1_1';
import { Tela1_2 } from './telas/s01/Tela1_2';
import { Tela1_3 } from './telas/s01/Tela1_3';
import { Tela1_4 } from './telas/s01/Tela1_4';
import { Tela1_5 } from './telas/s01/Tela1_5';
import { Tela5_1 } from './telas/s05/Tela5_1';
import { Tela5_3 } from './telas/s05/Tela5_3';
import { Tela5_4 } from './telas/s05/Tela5_4';
import { Tela5_5 } from './telas/s05/Tela5_5';
import { Tela5_7 } from './telas/s05/Tela5_7';
import { Tela5_13, Tela5_14, Tela5_15, Tela5_17, Tela5_18 } from './telas/s05/perfil';
import { Tela5_10, Tela5_11, Tela5_12, Tela5_16, Tela5_8, Tela5_9 } from './telas/s05/senha';
import { Tela28_7 } from './telas/s28/Tela28_7';

/** Raiz: links dos e-mails e sessão que terminou sozinha (28.7). */
function Raiz() {
  const navegar = useNavigate();
  useEffect(() => ouvirLinks(navegar), [navegar]);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'SIGNED_OUT' && sessaoTerminouSozinha()) navegar('/sessao-terminou');
    });
    return () => data.subscription.unsubscribe();
  }, [navegar]);
  return <Outlet />;
}

/** Primeira tela: conferência de idade, ou o início se ela já foi feita. */
function Comeco() {
  // Lido só na abertura: ao confirmar a idade, a própria 1.1 segue para a 1.3.
  const [jaConferida] = useState(() => usePlano.getState().maior18);
  return jaConferida ? <Navigate to="/inicio" replace /> : <Tela1_1 />;
}

const filhos: RouteObject[] = [
  { path: '/', element: <Comeco /> },
  { path: '/menor-de-18', element: <Tela1_2 /> },
  { path: '/boas-vindas', element: <Tela1_3 /> },
  { path: '/seu-plano', element: <Tela1_4 /> },
  { path: '/avisos', element: <Tela1_5 /> },
  { path: '/inicio', element: <InicioProvisorio /> },
  { path: '/entrar', element: <Tela5_1 /> },
  { path: '/conta/criar', element: <Tela5_3 /> },
  { path: '/conta/ja-existe', element: <Tela5_4 /> },
  { path: '/conta/codigo', element: <Tela5_5 /> },
  { path: '/conta/plano-deste-aparelho', element: <Tela5_7 /> },
  { path: '/conta/esqueci', element: <Tela5_8 /> },
  { path: '/conta/confira-email', element: <Tela5_9 /> },
  { path: '/conta/senha-nova', element: <Tela5_10 /> },
  { path: '/conta/senha-trocada', element: <Tela5_11 /> },
  { path: '/conta/link-vencido', element: <Tela5_12 /> },
  { path: '/conta/saiu', element: <Tela5_18 /> },
  { path: '/perfil', element: <Tela5_13 /> },
  { path: '/perfil/nome', element: <Tela5_14 /> },
  { path: '/perfil/email', element: <Tela5_15 /> },
  { path: '/perfil/senha', element: <Tela5_16 /> },
  { path: '/perfil/sair', element: <Tela5_17 /> },
  { path: '/sessao-terminou', element: <Tela28_7 /> },
  { path: '/conta/indisponivel/:tela', element: <EmBreve /> },
  { path: '/em-breve/:tela', element: <EmBreve /> },
  { path: '*', element: <Navigate to="/" replace /> },
];

if (__DEV_TELAS__) {
  filhos.unshift({ path: '/dev/telas', element: <DevIndice /> }, { path: '/dev/telas/:id', element: <DevTela /> });
}

// Hash router: funciona igual dentro do Capacitor (arquivos locais) e no navegador.
const router = createHashRouter([{ element: <Raiz />, children: filhos }]);

export function App() {
  return <RouterProvider router={router} />;
}
