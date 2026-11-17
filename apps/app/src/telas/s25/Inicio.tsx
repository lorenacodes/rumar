import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { carregarDaConta, carregarPerfil, useSessao } from '../../conta/servico';
import { usePlano } from '../../state/plano';
import { Abas } from '../../ui/abas';
import { BotaoContorno, BotaoPrincipal } from '../../ui/pecas';

const reais = (centavos: number) => `R$ ${(centavos / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;

/**
 * Início com os dados REAIS da pessoa (plano do aparelho ou da conta no Supabase).
 * Sem conta: mostra o plano montado e o próximo passo claro, "Criar conta e guardar".
 * Com conta: cumprimenta pelo nome e mostra o plano guardado no banco.
 * (A 25.1 do design, o feed de quem viaja, depende da comunidade, ainda sem dados reais.)
 */
export function Inicio() {
  const navegar = useNavigate();
  const sessao = useSessao();
  const plano = usePlano();
  const [nome, setNome] = useState<string | null>(null);

  useEffect(() => {
    if (!sessao) return;
    void carregarDaConta();
    void carregarPerfil().then((p) => setNome(p?.display_name ?? null));
  }, [sessao]);

  const temPlano = plano.mensal > 0;
  const passos = [
    { feito: plano.maior18, texto: 'Conferir a idade' },
    { feito: Boolean(plano.origem), texto: 'Cidade de onde você sai' },
    { feito: temPlano, texto: 'Quanto você guarda por mês' },
    { feito: Boolean(sessao), texto: 'Criar conta e guardar o plano' },
  ];
  const proximo = passos.find((p) => !p.feito);

  return (
    <main className="tela" data-tela="inicio" data-real="inicio">
      <div style={{ padding: 'calc(22px + env(safe-area-inset-top)) 20px 0' }}>
        <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: '-0.04em' }}>bo vair</div>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '22px' }}>{sessao ? 'Sua conta' : 'Seu plano'}</div>
        <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>
          {sessao ? `Olá, ${(nome ?? '').split(' ')[0] || 'viajante'}.` : temPlano ? 'Seu plano está pronto.' : 'Vamos montar seu plano.'}
        </h1>

        {temPlano ? (
          <div style={{ background: 'var(--fundo-escuro)', color: '#fff', borderTop: '8px solid var(--amarelo)', padding: '14px 18px', marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <b style={{ font: "600 32px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{reais(plano.mensal)}</b>
              <span style={{ fontSize: '15px', color: '#AEBBE0' }}>por mês</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '15px', color: '#AEBBE0' }}>
              <span>Já guardado</span>
              <b style={{ color: 'var(--amarelo)' }}>{reais(plano.guardado)}</b>
            </div>
            {plano.cidade ? <div style={{ fontSize: '14px', color: '#AEBBE0', marginTop: '6px' }}>Saindo de {plano.cidade}</div> : null}
          </div>
        ) : null}

        {!sessao ? (
          <>
            <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: '-0.02em', margin: '18px 0 4px' }}>Passo a passo</div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {passos.map((p, i) => (
                <li key={p.texto} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--linha)' }}>
                  <span aria-hidden style={{ width: '24px', height: '24px', flex: 'none', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 13px 'Open Sans'", ...(p.feito ? { background: 'var(--fundo-escuro)', color: '#fff' } : p === proximo ? { background: 'var(--amarelo)', border: '2px solid var(--texto)' } : { border: '2px solid var(--linha)' }) }}>
                    {p.feito ? '✓' : i + 1}
                  </span>
                  <span style={{ flex: 1, font: "600 15px/20px 'Open Sans'", color: p.feito ? 'var(--texto-sec)' : 'var(--texto)', textDecoration: p.feito ? 'line-through' : 'none' }}>{p.texto}</span>
                  <span className="visualmente-oculto">{p.feito ? 'feito' : p === proximo ? 'próximo passo' : 'a fazer'}</span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', marginTop: '14px' }}>
            {[
              ['Roteiro', 'Do seu jeito', '/roteiro'],
              ['O que cabe hoje', 'Viagens no seu bolso', '/tela/4.1'],
              ['Descobrir', 'Destinos e preços', '/tela/2.1'],
              ['Meu perfil', 'Nome, foto e cidade', '/perfil'],
            ].map(([t, d, rota]) => (
              <button key={t} type="button" className="r-btn" onClick={() => navegar(rota!)} style={{ textAlign: 'left', background: 'var(--cartao-2)', padding: '12px', minHeight: '76px', boxSizing: 'border-box' }}>
                <span style={{ display: 'block', font: "600 16px 'Open Sans'" }}>{t}</span>
                <span style={{ display: 'block', fontSize: '14px', lineHeight: '19px', color: 'var(--texto-sec)', marginTop: '4px' }}>{d}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!sessao && sessao !== undefined ? (
        <div className="rodape" style={{ padding: '10px 20px 10px', borderTop: '1px solid var(--linha)', background: 'var(--fundo)', bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          {!plano.maior18 ? (
            <BotaoPrincipal onClick={() => navegar('/')}>Começar ↗</BotaoPrincipal>
          ) : !plano.origem ? (
            <BotaoPrincipal onClick={() => navegar('/boas-vindas')}>Escolher minha cidade ↗</BotaoPrincipal>
          ) : !temPlano ? (
            <BotaoPrincipal onClick={() => navegar('/seu-plano')}>Dizer quanto guardo ↗</BotaoPrincipal>
          ) : (
            <BotaoPrincipal onClick={() => navegar('/conta/criar')}>Criar conta e guardar ↗</BotaoPrincipal>
          )}
          <div style={{ marginTop: '8px' }}>
            <BotaoContorno onClick={() => navegar('/entrar')}>Já tenho conta · Entrar</BotaoContorno>
          </div>
        </div>
      ) : null}
      <Abas ativa="inicio" logoAbaixoDoRodape={!sessao} />
    </main>
  );
}
