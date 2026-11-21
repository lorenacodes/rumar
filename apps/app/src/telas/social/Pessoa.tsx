import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { hojeLocal } from '../../lib/datas';
import { fotosDasViagens } from '../../lib/fotosPessoa';
import { amigosDoPerfil, lugaresAmados, MAX_COMENTARIO_CIDADE, notasDaCidade, salvarNotaCidade, type Conexoes, type LugarAmado, type NotaCidade } from '../../lib/perfilVivido';
import { GOSTOS_VIAGEM, limparBio, MAX_BIO, MAX_GOSTOS, perfilVitrine, salvarVitrine, type GostoViagem, type Vitrine } from '../../lib/perfilVitrine';
import { desfazerAmizade, minhasAmizades, pedirAmizade } from '../../lib/social';
import { supabase } from '../../lib/supabase';
import { eu, listarViagens, textoMotivo, viagensDoPerfil, type Viagem } from '../../lib/viagens';
import { Abas } from '../../ui/abas';
import { Avatar } from '../../ui/avatar';
import { FotoLugar } from '../../ui/foto';
import { GradeDeFotos } from '../../ui/GradeDeFotos';
import { BotaoPrincipal, Voltar } from '../../ui/pecas';
import { periodo } from '../viagens/comum';
import '../../styles/perfil.css';

type Fase = 'agora' | 'proximas' | 'foi';
const NOME_FASE: Record<Fase, string> = { agora: 'Viajando agora', proximas: 'Vai viajar', foi: 'Já foi' };
const QUEM_VE: Record<Viagem['visibilidade'], string> = { privada: 'Só quem vai', amigos: 'Amigos veem', publica: 'Todos veem' };
function fase(v: Viagem, hoje: string): Fase {
  if ((v.diagnostico as { registrada?: boolean } | null)?.registrada) return 'foi';
  const fim = new Date(Date.parse(`${v.data_ida}T12:00:00Z`) + v.noites * 864e5).toISOString().slice(0, 10);
  return hoje < v.data_ida ? 'proximas' : hoje <= fim ? 'agora' : 'foi';
}

type ViagemPerfil = Viagem & { juntos?: boolean };

/**
 * Perfil como vitrine (para mim e para os outros): foto, bio, o que a pessoa gosta numa viagem,
 * números, fotos em grade e viagens em cartões grandes. Rota /pessoa/:id; /pessoa/eu abre o meu.
 */
export function Pessoa() {
  const { id: param = '' } = useParams();
  const navegar = useNavigate();
  const [id, setId] = useState(param === 'eu' ? '' : param);
  const [p, setP] = useState<Vitrine | null | undefined>(undefined);
  const [viagens, setViagens] = useState<ViagemPerfil[] | null>(null);
  const [capas, setCapas] = useState<Map<string, { id: string; url: string }[]>>(new Map());
  const [roteiros, setRoteiros] = useState<Map<string, { nomes: string[]; total: number }>>(new Map());
  const [aba, setAba] = useState<'viagens' | 'lugares' | 'fotos'>('viagens');
  const [notas, setNotas] = useState<Map<string, NotaCidade>>(new Map());
  const [amados, setAmados] = useState<LugarAmado[] | null>(null);
  const [conexoes, setConexoes] = useState<Conexoes | null>(null);
  const [carimbo, setCarimbo] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [pedido, setPedido] = useState<'nada' | 'enviado' | 'recebido'>('nada');

  useEffect(() => { if (param === 'eu') void eu().then((u) => (u ? setId(u) : navegar('/entrar', { replace: true }))); else setId(param); }, [param]); // eslint-disable-line react-hooks/exhaustive-deps

  const carregar = () => {
    if (!id) return;
    void perfilVitrine(id).then(setP);
    void lugaresAmados(id).then(setAmados);
    void amigosDoPerfil(id).then(setConexoes);
    void minhasAmizades().then((l) => {
      const a = l.find((x) => x.outro.user_id === id && x.status === 'pendente');
      setPedido(a ? (a.enviadaPorMim ? 'enviado' : 'recebido') : 'nada');
    });
    void Promise.all([listarViagens(), eu()]).then(async ([v, uid]) => {
      const souEu = uid === id;
      // Eu: todas as viagens em que estou. Outra pessoa: todas em que ela participa e que posso ver (sem dinheiro).
      const lista: ViagemPerfil[] = souEu
        ? v.minhas.filter((x) => x.status === 'ativo')
        : await viagensDoPerfil(id);
      setViagens(lista);
      if (lista.length) {
        const ids = lista.map((x) => x.id);
        void fotosDasViagens(ids, 4).then(setCapas);
        void notasDaCidade(id, ids).then(setNotas);
        // O que importa no perfil: por onde a pessoa passou (os lugares mais conhecidos do roteiro).
        const { data } = await supabase.from('trip_items').select('trip_id, place_id').in('trip_id', ids).limit(2000);
        const linhas = (data ?? []) as { trip_id: string; place_id: string }[];
        const lugIds = [...new Set(linhas.map((l) => l.place_id).filter((x) => !x.startsWith('livre-')))].slice(0, 400);
        const { data: lug } = lugIds.length ? await supabase.from('lugares').select('id, nome, fama').in('id', lugIds) : { data: [] };
        const info = new Map(((lug ?? []) as { id: string; nome: string; fama: number | null }[]).map((l) => [l.id, l]));
        const m = new Map<string, { nomes: string[]; total: number }>();
        for (const tid of ids) {
          const doRoteiro = linhas.filter((l) => l.trip_id === tid);
          const conhecidos = [...new Map(doRoteiro.map((l) => info.get(l.place_id)).filter((x): x is { id: string; nome: string; fama: number | null } => Boolean(x)).map((x) => [x.nome, x])).values()];
          m.set(tid, { nomes: conhecidos.sort((a, b) => (b.fama ?? 0) - (a.fama ?? 0)).slice(0, 3).map((x) => x.nome), total: doRoteiro.length });
        }
        setRoteiros(m);
      }
    });
  };
  useEffect(carregar, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (p && viagens && !viagens.length && p.fotos) setAba('fotos'); }, [p, viagens]);

  if (p === undefined) return <main className="tela" aria-busy="true" />;
  if (p === null) return (
    <main className="tela" data-tela="pessoa">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px' }}><Voltar para="/perfil/amigos" /><p style={{ fontSize: '15px' }}>Perfil não encontrado.</p></div>
    </main>
  );

  const hoje = hojeLocal();
  const nome = p.display_name || 'Viajante';
  const primeiro = nome.split(' ')[0];
  const ordenadas = [...(viagens ?? [])].sort((a, b) => {
    const ord = { agora: 0, proximas: 1, foi: 2 };
    const fa = fase(a, hoje); const fb = fase(b, hoje);
    return ord[fa] - ord[fb] || (fa === 'foi' ? b.data_ida.localeCompare(a.data_ida) : a.data_ida.localeCompare(b.data_ida));
  });
  // Perfil mostra o que a pessoa viveu (feitas e em andamento); planos ficam numa linha discreta no fim.
  const vividas = ordenadas.filter((v) => fase(v, hoje) !== 'proximas');
  const planos = ordenadas.filter((v) => fase(v, hoje) === 'proximas');
  const capaUrl = vividas.map((v) => capas.get(v.id)?.[0]?.url).find(Boolean) ?? null;
  const capaDestino = vividas[0]?.destino ?? ordenadas[0]?.destino ?? null;
  // Carimbos: um por cidade onde já esteve (a viagem mais recente), ligado à viagem real.
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const carimbos = [...new Map(ordenadas.filter((v) => fase(v, hoje) === 'foi').reverse().map((v) => [v.destino, v] as const)).values()].reverse()
    .map((v) => ({ v, cidade: v.destino.split(',')[0]!, quando: `${MES[Number(v.data_ida.slice(5, 7)) - 1]} ${v.data_ida.slice(0, 4)}` })).slice(0, 12);

  const pedir = async () => { if (await pedirAmizade(id)) { if (pedido === 'recebido') carregar(); else setPedido('enviado'); } };
  const numeros: [number, string, string][] = [
    [p.viagens, 'viagem', 'viagens'], [p.cidades, 'cidade', 'cidades'], [p.fotos, 'foto', 'fotos'],
  ];
  const semBio = !p.bio && !p.gostos_viagem.length;
  const aberto = carimbo ? vividas.find((v) => v.id === carimbo) ?? null : null;
  const rotuloLugares = p.eu ? 'Lugares que amei' : 'Lugares que amou';

  return (
    <main className="tela" data-tela="pessoa" data-real="pessoa">
      {/* Capa: a foto mais recente das viagens (ou a cidade); sem foto, o azul-marinho da marca. */}
      <div className="perfil-capa">
        {capaUrl ? <img src={capaUrl} alt="" /> : capaDestino ? <FotoLugar id={capaDestino} proporcao="390 / 190" credito={false} compacto /> : null}
        {p.eu ? null : <div className="perfil-voltar"><Voltar para="/perfil/amigos" /></div>}
        {p.eu ? (
          <button type="button" className="r-btn perfil-icone" onClick={() => navegar('/perfil')} aria-label="Configurações da conta" style={{ position: 'absolute', right: '16px', top: 'calc(16px + env(safe-area-inset-top))' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.9-1.4-1.9-3.3-2.2.9a7.4 7.4 0 0 0-2.6-1.5L14.3 3h-3.8l-.3 2.2a7.4 7.4 0 0 0-2.6 1.5l-2.2-.9-1.9 3.3 1.9 1.4a7.6 7.6 0 0 0 0 3l-1.9 1.4 1.9 3.3 2.2-.9a7.4 7.4 0 0 0 2.6 1.5l.3 2.2h3.8l.3-2.2a7.4 7.4 0 0 0 2.6-1.5l2.2.9 1.9-3.3z" /></svg>
          </button>
        ) : null}
      </div>
      <div style={{ padding: '0 20px 28px' }}>
        <header className="perfil-topo">
          <span className="perfil-avatar"><Avatar userId={id} nome={nome} tamanho={92} /></span>
          <div style={{ minWidth: 0, paddingBottom: '4px' }}>
            <h1 style={{ margin: 0, font: "600 24px/29px 'Lexend Exa'", letterSpacing: '-0.02em', overflowWrap: 'anywhere' }}>{nome}</h1>
            <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)', overflowWrap: 'anywhere' }}>
              {[p.username ? `@${p.username}` : null, !p.eu && p.amigos ? 'Vocês são amigos' : p.origin_city].filter(Boolean).join(' · ')}
            </span>
          </div>
        </header>

        {editando ? (
          <EditarVitrine inicial={p} onFim={(salvou) => { setEditando(false); if (salvou) void perfilVitrine(id).then(setP); }} />
        ) : (
          <section aria-label="Sobre" style={{ marginTop: '14px' }}>
            {p.bio || (p.eu && !semBio) ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <p style={{ flex: 1, margin: 0, fontSize: '15px', lineHeight: '22px', whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{p.bio}</p>
                {p.eu ? (
                  <button type="button" className="r-btn perfil-icone claro" onClick={() => setEditando(true)} aria-label="Editar bio">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" /></svg>
                  </button>
                ) : null}
              </div>
            ) : null}
            {p.gostos_viagem.length ? (
              <ul aria-label="Gosta numa viagem" className="perfil-gostos">
                {p.gostos_viagem.map((g) => <li key={g}>{GOSTOS_VIAGEM[g]}</li>)}
              </ul>
            ) : null}
            {p.eu && semBio ? (
              <div className="perfil-convite">
                <span><b>O que você gosta numa viagem?</b> Amigos combinam viagens com você.</span>
                <button type="button" className="r-btn" onClick={() => setEditando(true)}>Escrever minha bio</button>
              </div>
            ) : null}
            {!p.eu && !p.amigos ? (
              <div style={{ marginTop: '14px' }}>
                {pedido === 'enviado' ? <p style={{ margin: 0, fontSize: '15px', color: 'var(--texto-sec)' }}>Pedido de amizade enviado.</p>
                  : <BotaoPrincipal onClick={() => void pedir()}>{pedido === 'recebido' ? 'Aceitar amizade' : 'Pedir amizade'}</BotaoPrincipal>}
              </div>
            ) : null}
          </section>
        )}

        {/* Só números que dizem algo: sem zeros e sem um número sozinho. */}
        {numeros.filter(([n]) => n > 0).length >= 2 ? <dl aria-label="Números" className="perfil-numeros" style={{ gridTemplateColumns: `repeat(${numeros.filter(([n]) => n > 0).length}, 1fr)` }}>
          {numeros.filter(([n]) => n > 0).map(([n, um, varios]) => (
            <div key={varios}>
              <dt>{n === 1 ? um : varios}</dt>
              <dd>{n}</dd>
            </div>
          ))}
        </dl> : null}

        {/* Conexões: rostos de verdade. No meu, meus amigos; no de outra pessoa, os amigos em comum. */}
        {conexoes && (p.eu || conexoes.pessoas.length) ? (
          <button type="button" className="r-btn perfil-conexoes" onClick={() => (p.eu ? navegar('/perfil/amigos') : undefined)} disabled={!p.eu} aria-label={p.eu ? 'Ver meus amigos' : undefined}>
            {conexoes.pessoas.length ? (
              <span className="perfil-rostos" aria-hidden="true">
                {conexoes.pessoas.slice(0, 5).map((a) => <span key={a.user_id}><Avatar userId={a.user_id} nome={a.display_name} tamanho={32} /></span>)}
              </span>
            ) : (
              <span className="perfil-icone claro" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.8c1.9.7 3.2 2.6 3.5 5.2" /></svg>
              </span>
            )}
            <span style={{ flex: 1, minWidth: 0, fontSize: '14px', lineHeight: '19px' }}>
              {p.eu
                ? conexoes.total ? <><b>{conexoes.total} {conexoes.total === 1 ? 'amigo' : 'amigos'}</b>{conexoes.pessoas[0] ? ` · ${conexoes.pessoas.slice(0, 2).map((a) => a.display_name.split(' ')[0]).join(', ')}` : ''}</> : <b>Chame amigos para viajar junto</b>
                : <><b>{conexoes.pessoas.length} {conexoes.pessoas.length === 1 ? 'amigo' : 'amigos'} em comum</b>{` · ${conexoes.pessoas.slice(0, 2).map((x) => x.display_name.split(' ')[0]).join(', ')}`}</>}
            </span>
            {p.eu ? <span aria-hidden="true" className="perfil-seta">›</span> : null}
          </button>
        ) : null}

        {carimbos.length ? (
          <section aria-label="Carimbos" style={{ marginTop: '22px' }}>
            <h2 className="perfil-h2">Onde {p.eu ? 'já estive' : 'já esteve'}</h2>
            <ul className="perfil-carimbos" aria-label="Cidades visitadas">
              {carimbos.map((c, i) => {
                const n = notas.get(c.v.id);
                return (
                  <li key={c.cidade}>
                    <button type="button" className={`r-btn carimbo carimbo-${i % 3}`} onClick={() => setCarimbo(c.v.id)} aria-label={`${c.cidade}, ${c.quando}: abrir`}
                      style={{ transform: `rotate(${[-4, 3, -2, 4, -3][i % 5]}deg)` }}>
                      <b>{c.cidade}</b><span>{c.quando}</span>
                      {n ? <span className="carimbo-nota">{n.nota} de 5</span> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <div role="tablist" aria-label="Ver" className="perfil-abas">
          {(['viagens', 'lugares', 'fotos'] as const).map((a) => (
            <button key={a} type="button" role="tab" aria-selected={aba === a} className="r-btn" onClick={() => setAba(a)}>
              {a === 'viagens' ? 'Viagens' : a === 'lugares' ? 'Lugares' : 'Fotos'}
            </button>
          ))}
        </div>

        {aba === 'fotos' ? (
          <div role="tabpanel" aria-label="Fotos" style={{ marginTop: '12px' }}>
            <GradeDeFotos userId={id} max={30} vazio={p.eu ? 'Suas fotos de viagem aparecem aqui.' : 'Nenhuma foto que você possa ver.'} />
          </div>
        ) : aba === 'lugares' ? (
          <div role="tabpanel" aria-label={rotuloLugares} style={{ marginTop: '14px' }}>
            {amados === null ? <p aria-busy="true">Carregando…</p> : amados.length ? (
              <ul className="perfil-amados" aria-label={rotuloLugares}>
                {amados.map((l) => (
                  <li key={l.id}>
                    <button type="button" className="r-btn" onClick={() => navegar(`/lugar/${l.id}`)} aria-label={`${l.nome}: nota ${l.nota} de 5`}>
                      {l.foto ? <img src={l.foto} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} /> : <FotoLugar id={l.nome} proporcao="1" credito={false} compacto />}
                      <span className="perfil-amado-nome">{l.nome}</span>
                      <span className="perfil-amado-nota"><Pontos nota={l.nota} /></span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--texto-sec)' }}>
                {p.eu ? 'Dê nota aos lugares que visitou. Os que amou aparecem aqui.' : `${primeiro} ainda não deu nota a lugares.`}
              </p>
            )}
          </div>
        ) : (
          <div role="tabpanel" aria-label="Viagens" style={{ display: 'grid', gap: '20px', marginTop: '14px' }}>
            {viagens === null ? <p aria-busy="true">Carregando…</p> : null}
            {p.eu && viagens && !vividas.length ? (
              <div className="perfil-primeira">
                <FotoLugar id={capaDestino ?? 'Salvador'} proporcao="16 / 9" credito={false} compacto />
                <div style={{ padding: '14px' }}>
                  <b style={{ display: 'block', font: "600 18px/23px 'Lexend Exa'" }}>Mostre por onde você já passou.</b>
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)', margin: '2px 0 12px' }}>Fotos e roteiro inspiram seus amigos.</span>
                  <BotaoPrincipal onClick={() => navegar('/viagens/ja-fiz')}>Registrar uma viagem que fiz</BotaoPrincipal>
                </div>
              </div>
            ) : null}
            {vividas.map((v) => {
              const f = fase(v, hoje);
              const fotos = capas.get(v.id) ?? [];
              const capa = fotos[0];
              const r = roteiros.get(v.id);
              const resto = r ? r.total - r.nomes.length : 0;
              const n = notas.get(v.id);
              return (
                <article key={v.id} className="perfil-viagem">
                  <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}?aba=roteiro`)} aria-label={`Ver a viagem para ${v.destino}`}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: 0 }}>
                    <span style={{ position: 'relative', display: 'block' }}>
                      {capa ? <img src={capa.url} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', display: 'block' }} />
                        : <FotoLugar id={v.destino} proporcao="16 / 10" credito={false} compacto />}
                      {f === 'agora' ? <span className="perfil-selo" style={{ left: '10px', color: 'var(--verde)' }}>{NOME_FASE[f]}</span> : null}
                      {r?.total ? <span className="perfil-selo" style={{ right: '10px' }}>{r.total} {r.total === 1 ? 'lugar' : 'lugares'}</span> : null}
                    </span>
                    {fotos.length > 1 ? (
                      <span aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginTop: '2px' }}>
                        {fotos.slice(1, 4).map((ft) => <img key={ft.id} src={ft.url} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />)}
                      </span>
                    ) : null}
                    <span style={{ display: 'block', padding: '12px 14px 4px' }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'baseline' }}>
                        <span style={{ font: "600 19px/24px 'Lexend Exa'", letterSpacing: '-0.02em', minWidth: 0, overflowWrap: 'anywhere' }}>{v.destino}</span>
                        {n ? <span style={{ flex: 'none' }}><Pontos nota={n.nota} /></span> : null}
                      </span>
                      {n?.comentario ? <span style={{ display: 'block', fontSize: '15px', lineHeight: '21px', marginTop: '4px' }}>"{n.comentario}"</span> : null}
                      {r?.nomes.length ? (
                        <span style={{ display: 'block', fontSize: '15px', lineHeight: '21px', marginTop: '4px' }}>
                          {f === 'agora' ? 'No roteiro: ' : p.eu ? 'Passei por ' : 'Passou por '}<b>{r.nomes.join(', ')}</b>{resto > 0 ? ` e mais ${resto}` : ''}
                        </span>
                      ) : null}
                      <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)', marginTop: '2px' }}>
                        {[periodo(v.data_ida, v.noites), textoMotivo(v), v.juntos ? 'vocês foram juntos' : null, p.eu ? QUEM_VE[v.visibilidade] : null].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                  </button>
                  <div className="perfil-viagem-acoes">
                    <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}?aba=roteiro`)}>Ver roteiro por dia</button>
                    {!p.eu && v.destino_id ? <button type="button" className="r-btn forte" onClick={() => navegar(`/viagens/nova?d=${v.destino_id}`)}>Montar uma parecida</button> : null}
                    {p.eu && !n ? <button type="button" className="r-btn forte" onClick={() => setCarimbo(v.id)}>Dar nota à cidade</button> : null}
                  </div>
                </article>
              );
            })}
            {!p.eu && viagens?.length && !vividas.length ? (
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--texto-sec)' }}>{primeiro} ainda não mostrou viagens feitas.</p>
            ) : null}
            {planos.length ? (
              <section aria-label="Próximos destinos">
                <h2 className="perfil-h2" style={{ marginBottom: '8px' }}>Próximos destinos</h2>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {planos.map((v) => (
                    <li key={v.id}>
                      <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}?aba=roteiro`)} aria-label={`Ver a viagem para ${v.destino}`}
                        style={{ minHeight: '40px', padding: '0 14px', borderRadius: '999px', background: 'var(--cartao-2)', fontSize: '14px', fontWeight: 600 }}>
                        {v.destino.split(',')[0]} <span style={{ fontWeight: 400, color: 'var(--texto-sec)' }}>· {periodo(v.data_ida, v.noites).split(' →')[0]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {viagens && !viagens.length && !p.eu ? (
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--texto-sec)' }}>
                {p.amigos ? `${primeiro} ainda não mostrou viagens.` : 'Viagens para amigos aparecem quando vocês forem amigos.'}
              </p>
            ) : null}
          </div>
        )}


        {p.amigos && !p.eu ? (
          <button type="button" className="r-btn" onClick={() => { if (window.confirm('Desfazer a amizade?')) void desfazerAmizade(id).then(() => navegar('/perfil/amigos')); }} style={{ marginTop: '20px', minHeight: '44px', color: 'var(--vermelho)', fontWeight: 600 }}>Desfazer amizade</button>
        ) : null}
      </div>
      {aberto ? (
        <CarimboAberto v={aberto} eu={p.eu} dona={id} fotos={capas.get(aberto.id) ?? []} roteiro={roteiros.get(aberto.id)} nota={notas.get(aberto.id) ?? null}
          onFechar={() => setCarimbo(null)} onSalvou={() => void notasDaCidade(id, vividas.map((v) => v.id)).then(setNotas)} />
      ) : null}
      <Abas ativa="passaporte" />
    </main>
  );
}

/** Nota em 5 pontos desenhados (sem estrela-emoji), com o número para leitores de tela. */
function Pontos({ nota }: { nota: number }) {
  return (
    <span className="perfil-pontos" role="img" aria-label={`${nota} de 5`}>
      {[1, 2, 3, 4, 5].map((k) => <i key={k} className={k <= nota ? 'cheio' : ''} />)}
    </span>
  );
}

/** Carimbo aberto: a cidade vivida, com nota, fotos, lugares e o roteiro. Dona dá ou muda a nota. */
function CarimboAberto({ v, eu: souEu, dona, fotos, roteiro, nota, onFechar, onSalvou }: {
  v: ViagemPerfil; eu: boolean; dona: string; fotos: { id: string; url: string }[]; roteiro?: { nomes: string[]; total: number }; nota: NotaCidade | null;
  onFechar: () => void; onSalvou: () => void;
}) {
  const navegar = useNavigate();
  const [editar, setEditar] = useState(souEu && !nota);
  const [valor, setValor] = useState(nota?.nota ?? 0);
  const [texto, setTexto] = useState(nota?.comentario ?? '');
  const [erro, setErro] = useState('');
  const cidade = v.destino.split(',')[0];
  const salvar = async () => {
    if (!valor) { setErro('Escolha uma nota de 1 a 5.'); return; }
    if (await salvarNotaCidade(dona, v.id, valor, texto)) { onSalvou(); setEditar(false); setErro(''); } else setErro('Não deu para salvar. Tente de novo.');
  };
  return (
    <div className="perfil-folha-fundo" onClick={onFechar}>
      <div role="dialog" aria-modal="true" aria-label={cidade} className="perfil-folha" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, font: "600 22px/27px 'Lexend Exa'" }}>{cidade}</h2>
            <span style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>{periodo(v.data_ida, v.noites)} · {v.noites} {v.noites === 1 ? 'noite' : 'noites'}</span>
          </div>
          <button type="button" className="r-btn perfil-icone claro" onClick={onFechar} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>

        {editar ? (
          <div style={{ marginTop: '14px' }}>
            <b style={{ display: 'block', fontSize: '15px' }}>Que nota você dá para {cidade}?</b>
            <div role="radiogroup" aria-label="Nota da cidade" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {[1, 2, 3, 4, 5].map((k) => (
                <button key={k} type="button" role="radio" aria-checked={valor === k} className="r-btn" onClick={() => setValor(k)}
                  style={{ flex: 1, minHeight: '44px', borderRadius: '12px', textAlign: 'center', fontWeight: 700, fontSize: '16px', background: k <= valor ? 'var(--amarelo)' : 'var(--cartao-2)', color: 'var(--marinho)' }}>{k}</button>
              ))}
            </div>
            <label htmlFor="comentario-cidade" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginTop: '12px' }}>Em uma frase (opcional)</label>
            <input id="comentario-cidade" value={texto} maxLength={MAX_COMENTARIO_CIDADE} onChange={(e) => setTexto(e.target.value)} placeholder="O que mais marcou?"
              style={{ width: '100%', minHeight: '44px', marginTop: '4px', padding: '0 12px', borderRadius: '12px', border: '1px solid var(--linha)', background: 'var(--fundo)', color: 'var(--texto)', fontSize: '15px' }} />
            {erro ? <p role="alert" style={{ margin: '8px 0 0', color: 'var(--vermelho)', fontSize: '14px' }}>{erro}</p> : null}
            <div style={{ marginTop: '12px' }}><BotaoPrincipal onClick={() => void salvar()}>Salvar nota</BotaoPrincipal></div>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--texto-sec)' }}>Quem vê esta viagem vê sua nota.</p>
          </div>
        ) : nota ? (
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Pontos nota={nota.nota} /><b style={{ fontSize: '15px' }}>{nota.nota} de 5 para a cidade</b></div>
            {nota.comentario ? <p style={{ margin: '6px 0 0', fontSize: '15px', lineHeight: '21px' }}>"{nota.comentario}"</p> : null}
            {souEu ? <button type="button" className="r-btn" onClick={() => setEditar(true)} style={{ minHeight: '40px', color: 'var(--azul)', fontWeight: 600, fontSize: '14px' }}>Mudar nota</button> : null}
          </div>
        ) : null}

        {fotos.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '14px', borderRadius: '12px', overflow: 'hidden' }}>
            {fotos.slice(0, 3).map((f) => <img key={f.id} src={f.url} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />)}
          </div>
        ) : null}
        {roteiro?.nomes.length ? (
          <p style={{ margin: '12px 0 0', fontSize: '15px', lineHeight: '21px' }}>
            {souEu ? 'Passei por ' : 'Passou por '}<b>{roteiro.nomes.join(', ')}</b>{roteiro.total > roteiro.nomes.length ? ` e mais ${roteiro.total - roteiro.nomes.length}` : ''}.
          </p>
        ) : null}
        <div style={{ display: 'grid', gap: '8px', marginTop: '14px' }}>
          <button type="button" className="r-btn perfil-secundario" onClick={() => navegar(`/viagem/${v.id}?aba=roteiro`)}>Ver roteiro por dia</button>
          {!souEu && v.destino_id ? <BotaoPrincipal onClick={() => navegar(`/viagens/nova?d=${v.destino_id}`)}>Montar uma viagem parecida</BotaoPrincipal> : null}
        </div>
      </div>
    </div>
  );
}

/** Editar bio e "gosto numa viagem" (até 6). Todos no app veem. */
function EditarVitrine({ inicial, onFim }: { inicial: Vitrine; onFim: (salvou: boolean) => void }) {
  const [bio, setBio] = useState(inicial.bio ?? '');
  const [gostos, setGostos] = useState<GostoViagem[]>(inicial.gostos_viagem);
  const [erro, setErro] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const alternar = (g: GostoViagem) => setGostos((l) => (l.includes(g) ? l.filter((x) => x !== g) : l.length < MAX_GOSTOS ? [...l, g] : l));
  const salvar = async () => {
    setSalvando(true); setErro(false);
    const ok = await salvarVitrine(limparBio(bio), gostos);
    setSalvando(false);
    if (ok) onFim(true); else setErro(true);
  };
  return (
    <section aria-label="Editar bio" style={{ marginTop: '14px' }}>
      <label htmlFor="bio" style={{ display: 'block', fontWeight: 600, fontSize: '15px' }}>Sua bio</label>
      <textarea id="bio" value={bio} maxLength={MAX_BIO} rows={3} onChange={(e) => setBio(e.target.value)} placeholder="Ex.: Viajo pela comida e por praias calmas."
        style={{ width: '100%', boxSizing: 'border-box', marginTop: '6px', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--linha)', background: 'var(--fundo)', color: 'var(--texto)', font: "15px/21px 'Open Sans'", resize: 'vertical' }} />
      <span aria-live="polite" style={{ display: 'block', textAlign: 'right', fontSize: '12px', color: 'var(--texto-sec)' }}>{bio.length}/{MAX_BIO}</span>
      <fieldset style={{ border: 0, padding: 0, margin: '6px 0 0' }}>
        <legend style={{ fontWeight: 600, fontSize: '15px' }}>Gosto numa viagem <span style={{ fontWeight: 400, color: 'var(--texto-sec)' }}>(até {MAX_GOSTOS})</span></legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {(Object.keys(GOSTOS_VIAGEM) as GostoViagem[]).map((g) => (
            <button key={g} type="button" className="r-btn" aria-pressed={gostos.includes(g)} onClick={() => alternar(g)}
              disabled={!gostos.includes(g) && gostos.length >= MAX_GOSTOS}
              style={{ minHeight: '40px', padding: '0 14px', borderRadius: '999px', fontSize: '14px', fontWeight: 600,
                border: `1.5px solid ${gostos.includes(g) ? 'var(--azul)' : 'var(--linha)'}`,
                background: gostos.includes(g) ? 'var(--azul)' : 'transparent', color: gostos.includes(g) ? '#fff' : 'var(--texto)',
                opacity: !gostos.includes(g) && gostos.length >= MAX_GOSTOS ? 0.45 : 1 }}>{GOSTOS_VIAGEM[g]}</button>
          ))}
        </div>
      </fieldset>
      <p style={{ fontSize: '13px', color: 'var(--texto-sec)', margin: '10px 0 0' }}>Todos no app veem sua bio.</p>
      {erro ? <p role="alert" style={{ color: 'var(--vermelho)', fontSize: '14px', margin: '6px 0 0' }}>Não deu para salvar. Tente de novo.</p> : null}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}><BotaoPrincipal onClick={() => void salvar()} disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</BotaoPrincipal></div>
        <button type="button" className="r-btn" onClick={() => onFim(false)} style={{ minHeight: '48px', padding: '0 14px', fontWeight: 600, fontSize: '15px', color: 'var(--texto-sec)' }}>Cancelar</button>
      </div>
    </section>
  );
}
