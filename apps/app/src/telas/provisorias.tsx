/**
 * Telas PROVISÓRIAS — não existem no design. Ficam só até as fases seguintes
 * entregarem as telas reais (Início/Descobrir da Fase 1, configurações da Fase 2).
 * Seguem o visual do design e dizem a verdade sobre o que ainda falta.
 */
import { useNavigate, useParams } from 'react-router-dom';

import { useSessao } from '../conta/servico';
import { usePlano } from '../state/plano';
import { Abas } from '../ui/abas';
import { BotaoPrincipal, Rodape, Voltar } from '../ui/pecas';
import { Marca, Nota, Paragrafo, Titulo } from '../ui/textos';

/** Início provisório: resume o plano e leva a guardar na conta. */
export function InicioProvisorio() {
  const navegar = useNavigate();
  const sessao = useSessao();
  const plano = usePlano();
  return (
    <main className="tela" data-provisoria="inicio">
      <div style={{ padding: 'calc(22px + env(safe-area-inset-top)) 20px 0' }}>
        <Marca />
        <Titulo marginTop="30px">Seu plano está começando.</Titulo>
        {plano.mensal > 0 ? (
          <Paragrafo>
            Você guarda R$ {(plano.mensal / 100).toLocaleString('pt-BR')} por mês
            {plano.guardado > 0 ? ` e já tem R$ ${(plano.guardado / 100).toLocaleString('pt-BR')}` : ''}.
          </Paragrafo>
        ) : (
          <Paragrafo>Conte quanto você consegue guardar por mês para ver o que cabe.</Paragrafo>
        )}
        <Nota>As viagens que cabem no seu bolso (Descobrir) chegam na próxima versão.</Nota>
      </div>
      <Rodape style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
        {sessao ? (
          <BotaoPrincipal onClick={() => navegar('/perfil')}>Ver meu perfil ↗</BotaoPrincipal>
        ) : plano.mensal > 0 ? (
          <BotaoPrincipal onClick={() => navegar('/conta/criar')}>Guardar o plano ↗</BotaoPrincipal>
        ) : (
          <BotaoPrincipal onClick={() => navegar('/seu-plano')}>Montar meu plano ↗</BotaoPrincipal>
        )}
      </Rodape>
      <Abas ativa="inicio" />
    </main>
  );
}

const MOTIVOS: Record<string, string> = {
  google: 'Entrar com o Google precisa ser ligado nas configurações do projeto. Por enquanto, use e-mail e senha.',
  celular: 'Entrar com o celular depende de um serviço de SMS pago. Por enquanto, use e-mail e senha.',
  foto: 'A foto do perfil chega junto com o armazenamento seguro de fotos.',
  descobrir:
    'Aqui você vai ver as viagens que cabem no seu bolso, com passagem, hospedagem, comida e passeios estimados e o selo de cada valor. Chega na próxima versão.',
  'minha-viagem':
    'Aqui fica a sua viagem: cofrinho, reservas, documentos, mala e roteiro do dia. Chega depois do Descobrir.',
  'aviso-de-privacidade': 'O aviso de privacidade completo está em revisão jurídica e entra na próxima versão.',
};

/** Recurso do design que ainda não foi construído nesta versão. */
export function EmBreve() {
  const { tela = '' } = useParams();
  const aba = tela === 'descobrir' ? 'descobrir' : tela === 'minha-viagem' ? 'viagem' : null;
  const texto = MOTIVOS[tela] ?? `Esta parte (tela ${tela} do design) entra numa próxima versão.`;
  return (
    <main className="tela" data-provisoria="em-breve">
      <div style={{ padding: 'calc(22px + env(safe-area-inset-top)) 20px 0' }}>
        {aba ? null : <Voltar />}
        <Marca />
        <Titulo marginTop="30px">Quase lá.</Titulo>
        <Paragrafo>{texto}</Paragrafo>
      </div>
      {aba ? <Abas ativa={aba} /> : null}
    </main>
  );
}
