import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { carregarDaConta, carregarPerfil, useSessao } from '../../conta/servico';
import { usePlano } from '../../state/plano';
import { Abas } from '../../ui/abas';
import { BotaoContorno, BotaoPrincipal } from '../../ui/pecas';
import DESTINOS from '../../dados/destinos.json';
import { meusFavoritos, type Favorito } from '../../lib/social';
import { listarViagens, type Viagem } from '../../lib/viagens';
import { FotoLugar } from '../../ui/foto';

const reais = (centavos: number) => `R$ ${(centavos / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;

/** Destinos parecidos com os favoritos (características em comum, dados/destinos.json). */
function parecidos(favoritos: Favorito[]): { nome: string; pais: string; foto?: string; porque: string }[] {
  const lista = (DESTINOS as { destinos: { nome: string; pais: string; foto?: string; tracos: string[] }[] }).destinos;
  const favs = lista.filter((d) => favoritos.some((f) => f.nome === d.nome));
  const tracos = new Map<string, string>();
  for (const f of favs) for (const t of f.tracos) if (!tracos.has(t)) tracos.set(t, f.nome);
  return lista
    .filter((d) => !favoritos.some((f) => f.nome === d.nome))
    .map((d) => ({ d, comuns: d.tracos.filter((t) => tracos.has(t)) }))
    .filter((x) => x.comuns.length >= 2)
    .sort((a, b) => b.comuns.length - a.comuns.length)
    .slice(0, 6)
    .map(({ d, comuns }) => ({ nome: d.nome, pais: d.pais, foto: d.foto, porque: `Parecido com ${tracos.get(comuns[0]!)}: ${comuns.slice(0, 2).map((t) => t.replace('-', ' ')).join(' e ')}` }));
}

/** Parte do Início para quem tem conta: próxima viagem, favoritos e sugestões. */
function ParaVoce() {
  const navegar = useNavigate();
  const [favs, setFavs] = useState<Favorito[]>([]);
  const [viagem, setViagem] = useState<Viagem | null | undefined>(undefined);
  useEffect(() => {
    void meusFavoritos().then(setFavs);
    void listarViagens().then((v) => setViagem(v.minhas.filter((x) => x.status === 'ativo' && x.data_ida >= new Date().toISOString().slice(0, 10))[0] ?? null));
  }, []);
  const sugestoes = parecidos(favs);
  const Rot = ({ t }: { t: string }) => <div style={{ font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--texto-sec)', margin: '18px 0 6px' }}>{t}</div>;
  return (
    <>
      <Rot t="Próxima viagem" />
      {viagem ? (
        <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${viagem.id}`)} style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', textAlign: 'left', border: '2px solid var(--texto)', padding: '10px' }}>
          <span style={{ width: '64px', flex: 'none' }}><FotoLugar id={viagem.destino} proporcao="1 / 1" credito={false} /></span>
          <span><b style={{ font: "600 18px 'Lexend Exa'" }}>{viagem.destino}</b><span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>Roteiro, hospedagem e orçamento ›</span></span>
        </button>
      ) : viagem === null ? (
        <BotaoContorno onClick={() => navegar('/viagens/nova')}>Planejar uma viagem ↗</BotaoContorno>
      ) : null}
      <Rot t="Seus destinos favoritos" />
      {favs.length ? (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', margin: '0 -20px', padding: '0 20px 4px' }}>
          {favs.map((f) => (
            <div key={f.chave} style={{ flex: 'none', width: '120px' }}>
              <FotoLugar id={f.nome} proporcao="4 / 3" credito={false} />
              <b style={{ display: 'block', fontSize: '14px', marginTop: '4px' }}>{f.nome}</b>
              <span style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{f.pais}</span>
            </div>
          ))}
        </div>
      ) : null}
      <button type="button" className="r-btn" onClick={() => navegar('/destinos')} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>{favs.length ? 'Mudar favoritos' : 'Escolher destinos que quero conhecer ↗'}</button>
      {sugestoes.length ? (
        <>
          <Rot t="Você também pode gostar" />
          {sugestoes.map((d) => (
            <div key={d.nome} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--linha)' }}>
              <span style={{ width: '56px', flex: 'none' }}><FotoLugar id={d.foto ?? d.nome} proporcao="1 / 1" credito={false} /></span>
              <span style={{ flex: 1 }}><b>{d.nome}</b> <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>· {d.pais}</span><span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{d.porque}</span></span>
            </div>
          ))}
        </>
      ) : null}
      {favs.some((f) => f.nome === 'Paris') ? (
        <>
          <Rot t="Experiências em Paris" />
          <BotaoContorno onClick={() => navegar('/descobrir')}>Ver lugares, preços e mapa ↗</BotaoContorno>
        </>
      ) : null}
      <div style={{ height: '16px' }} />
    </>
  );
}

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
          <ParaVoce />
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
