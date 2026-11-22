import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import { createHashRouter, Navigate, Outlet, RouterProvider, useNavigate, useParams, type RouteObject } from 'react-router-dom';
import { TelaDeErro } from './ui/TelaDeErro';


import { App as CapApp } from '@capacitor/app';

import { ouvirLinks } from './conta/deepLink';
import { sessaoTerminouSozinha } from './conta/servico';
import { supabase } from './lib/supabase';
import { EmBreve } from './telas/provisorias';
import { Tela1_1 } from './telas/s01/Tela1_1';
import { Tela1_2 } from './telas/s01/Tela1_2';
import { Tela1_3 } from './telas/s01/Tela1_3';
import { Tela1_4 } from './telas/s01/Tela1_4';
import { Tela1_5 } from './telas/s01/Tela1_5';
import { Tela3_1 } from './telas/s03/Tela3_1';
import { Tela5_1 } from './telas/s05/Tela5_1';
import { Tela5_3 } from './telas/s05/Tela5_3';
import { Tela5_4 } from './telas/s05/Tela5_4';
import { Tela5_5 } from './telas/s05/Tela5_5';
import { Tela5_7 } from './telas/s05/Tela5_7';
import { Tela5_13, Tela5_14, Tela5_15, Tela5_17, Tela5_18 } from './telas/s05/perfil';
import { Tela5_10, Tela5_11, Tela5_12, Tela5_16, Tela5_8, Tela5_9 } from './telas/s05/senha';
import { Tela28_7 } from './telas/s28/Tela28_7';
import { AvisoAtualizar } from './ui/atualizar';
import { SemInternet } from './ui/semInternet';
import { Viagens } from './telas/viagens/Viagens';
import { Inicio } from './telas/s25/Inicio';
import { Moeda } from './telas/s05/Moeda';
import { Usuario } from './telas/s05/Usuario';
import { Ajuda, AvisoPrivacidade, Privacidade, Sobre, Termos } from './telas/s05/Conta';

/** Raiz: links dos e-mails e sessão que terminou sozinha (28.7). */
function Raiz() {
  const navegar = useNavigate();
  useEffect(() => ouvirLinks(navegar), [navegar]);
  // Regra 16.6: o voltar do Android faz o mesmo que a seta ← e nunca fecha o app sem querer.
  useEffect(() => {
    const ouvinte = CapApp.addListener('backButton', () => {
      const raiz = ['/', '/inicio', '/descobrir', '/viagens', '/social', '/perfil'].includes(window.location.hash.slice(1) || '/');
      if (window.history.state?.idx > 0) navegar(-1);
      else if (!raiz) navegar('/inicio');
      else void CapApp.minimizeApp();
    });
    return () => void ouvinte.then((o) => o.remove());
  }, [navegar]);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'SIGNED_OUT' && sessaoTerminouSozinha()) navegar('/sessao-terminou');
    });
    return () => data.subscription.unsubscribe();
  }, [navegar]);
  return (
    <>
      <Suspense fallback={<main className="tela" aria-busy="true" />}>
        <Outlet />
      </Suspense>
      <AvisoAtualizar />
      <SemInternet />
    </>
  );
}

// Telas carregadas sob demanda (desempenho): baixam só quando a pessoa entra nelas.
const sob = <T extends Record<string, unknown>>(carregar: () => Promise<T>, nome: keyof T) =>
  lazy(async () => ({ default: (await carregar())[nome] as ComponentType<Record<string, unknown>> }));
const Descobrir = sob(() => import('./telas/descobrir/Descobrir'), 'Descobrir');
const Lugar = sob(() => import('./telas/descobrir/Lugar'), 'Lugar');
const CadastrarLugar = sob(() => import('./telas/descobrir/CadastrarLugar'), 'CadastrarLugar');
const Destinos = sob(() => import('./telas/destinos/Destinos'), 'Destinos');
const Pessoa = sob(() => import('./telas/social/Pessoa'), 'Pessoa');
const Social = sob(() => import('./telas/social/Social'), 'Social');
const FeedViagens = sob(() => import('./telas/social/FeedViagens'), 'FeedViagens');
const MinhasFotos = sob(() => import('./telas/social/MinhasFotos'), 'MinhasFotos');
const Curiosos = sob(() => import('./telas/curiosos/Curiosos'), 'Curiosos');
const Moderar = sob(() => import('./telas/s05/Moderar'), 'Moderar');
const NovaViagem = sob(() => import('./telas/viagens/NovaViagem'), 'NovaViagem');
const JaFiz = sob(() => import('./telas/viagens/JaFiz'), 'JaFiz');
const MinhasAvaliacoes = sob(() => import('./telas/s05/MinhasAvaliacoes'), 'MinhasAvaliacoes');
const Viagem = sob(() => import('./telas/viagens/Viagem'), 'Viagem');
const Montar = sob(() => import('./telas/viagem/Montar'), 'Montar');
const Idioma = sob(() => import('./telas/viagens/Idioma'), 'Idioma');
const Idiomas = sob(() => import('./telas/idiomas/Idiomas'), 'Idiomas');
const IdiomasInicio = sob(() => import('./telas/idiomas/Idiomas'), 'IdiomasInicio');
const DevIndice = sob(() => import('./dev/DevTelas'), 'DevIndice');
const DevTela = sob(() => import('./dev/DevTelas'), 'DevTela');
/** Telas geradas do design, pelo id (/tela/2.1): o registro (grande) também vem sob demanda. */
const TelaDoRegistro = lazy(async () => {
  const { TELAS } = await import('./telas/registro');
  return { default: function TelaDoRegistro({ id }: { id: string }) { const Tela = TELAS[id]; return Tela ? <Tela key={id} /> : <Navigate to={`/em-breve/${id}`} replace />; } };
});

/** Telas geradas do design, pelo id (/tela/2.1). */
function TelaPorId({ id: fixo }: { id?: string }) {
  const { id: daRota = '' } = useParams();
  const id = fixo ?? daRota;
  return <TelaDoRegistro id={id} />;
}

/** Primeira tela: conferência de idade, ou o início se ela já foi feita. */
function Comeco() {
  // Lido só na abertura: ao confirmar a idade, a própria 1.1 segue para a 1.3.
  // A idade agora é pedida só ao criar a conta (a pessoa navega antes). A 1.1 continua em /idade.
  return <Navigate to="/inicio" replace />;
}

const filhos: RouteObject[] = [
  { path: '/', element: <Comeco /> },
  { path: '/idade', element: <Tela1_1 /> },
  { path: '/menor-de-18', element: <Tela1_2 /> },
  { path: '/boas-vindas', element: <Tela1_3 /> },
  { path: '/seu-plano', element: <Tela1_4 /> },
  { path: '/sonho', element: <Tela3_1 /> },
  { path: '/avisos', element: <Tela1_5 /> },
  { path: '/inicio', element: <Inicio /> },
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
  { path: '/tela/:id', element: <TelaPorId /> },
  { path: '/minha-viagem', element: <Navigate to="/viagens" replace /> },
  { path: '/viagens', element: <Viagens /> },
  { path: '/viagens/nova', element: <NovaViagem /> },
  { path: '/viagens/ja-fiz', element: <JaFiz /> },
  { path: '/viagens/galera', element: <FeedViagens /> },
  { path: '/viagem/:id', element: <Viagem /> },
  { path: '/perfil/amigos', element: <Social /> },
  { path: '/perfil/avaliacoes', element: <MinhasAvaliacoes /> },
  { path: '/perfil/fotos', element: <MinhasFotos /> },
  { path: '/perfil/moderar', element: <Moderar /> },
  { path: '/social', element: <Navigate to="/perfil/amigos" replace /> },
  { path: '/pessoa/:id', element: <Pessoa /> },
  { path: '/destinos', element: <Destinos /> },
  { path: '/bem-vindo', element: <Destinos primeiraVez /> },
  { path: '/bem-vindo/usuario', element: <Usuario primeiraVez /> },
  { path: '/perfil/usuario', element: <Usuario /> },
  { path: '/perfil/privacidade', element: <Privacidade /> },
  { path: '/perfil/ajuda', element: <Ajuda /> },
  { path: '/perfil/sobre', element: <Sobre /> },
  { path: '/privacidade', element: <AvisoPrivacidade /> },
  { path: '/termos', element: <Termos /> },
  { path: '/montar', element: <Navigate to="/viagens/nova" replace /> },
  { path: '/perfil-viajante', element: <Montar soPerfil /> },
  { path: '/perfil-moeda', element: <Moeda /> },
  { path: '/viagem/:id/idioma', element: <Idioma /> },
  { path: '/idiomas', element: <IdiomasInicio /> },
  { path: '/idiomas/:idioma', element: <Idiomas /> },
  { path: '/idiomas/:idioma/m/:modulo', element: <Idiomas /> },
  { path: '/idiomas/:idioma/aula/:aula', element: <Idiomas /> },
  { path: '/descobrir', element: <Descobrir /> },
  { path: '/curiosos', element: <Curiosos /> },
  { path: '/lugar/:id', element: <Lugar /> },
  { path: '/cadastrar-lugar', element: <CadastrarLugar /> },
  { path: '/roteiro', element: <Navigate to="/viagens" replace /> },
  { path: '*', element: <Navigate to="/" replace /> },
];

if (__DEV_TELAS__) {
  filhos.unshift({ path: '/dev/telas', element: <DevIndice /> }, { path: '/dev/telas/:id', element: <DevTela /> });
}

// Hash router: funciona igual dentro do Capacitor (arquivos locais) e no navegador.
const router = createHashRouter([{ element: <Raiz />, errorElement: <TelaDeErro />, children: filhos.map((f) => ({ ...f, errorElement: <TelaDeErro /> })) }]);

export function App() {
  return <RouterProvider router={router} />;
}
