import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { hojeLocal } from '../../lib/datas';
import { fotosDasViagens } from '../../lib/fotosPessoa';
import { GOSTOS_VIAGEM, limparBio, MAX_BIO, MAX_GOSTOS, perfilVitrine, salvarVitrine, type GostoViagem, type Vitrine } from '../../lib/perfilVitrine';
import { desfazerAmizade, minhasAmizades, pedirAmizade } from '../../lib/social';
import { supabase } from '../../lib/supabase';
import { atualizarViagem, eu, listarViagens, textoMotivo, viagensVisiveis, type Viagem } from '../../lib/viagens';
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
  const [minhasPrivadas, setMinhasPrivadas] = useState<Viagem[]>([]);
  const [aba, setAba] = useState<'viagens' | 'fotos'>('viagens');
  const [editando, setEditando] = useState(false);
  const [pedido, setPedido] = useState<'nada' | 'enviado' | 'recebido'>('nada');

  useEffect(() => { if (param === 'eu') void eu().then((u) => (u ? setId(u) : navegar('/entrar', { replace: true }))); else setId(param); }, [param]); // eslint-disable-line react-hooks/exhaustive-deps

  const carregar = () => {
    if (!id) return;
    void perfilVitrine(id).then(setP);
    void minhasAmizades().then((l) => {
      const a = l.find((x) => x.outro.user_id === id && x.status === 'pendente');
      setPedido(a ? (a.enviadaPorMim ? 'enviado' : 'recebido') : 'nada');
    });
    void Promise.all([listarViagens(), eu()]).then(async ([v, uid]) => {
      const souEu = uid === id;
      // Eu: todas as viagens em que estou. Outra pessoa: as que fazemos juntos + as dela que posso ver (sem dinheiro).
      const lista: ViagemPerfil[] = souEu
        ? v.minhas.filter((x) => x.status === 'ativo')
        : [...v.minhas.filter((x) => x.user_id === id && x.status === 'ativo').map((x) => ({ ...x, juntos: true })), ...(await viagensVisiveis(id))];
      setViagens(lista);
      setMinhasPrivadas(souEu ? [] : v.minhas.filter((x) => x.user_id === uid && x.visibilidade === 'privada'));
      if (lista.length) {
        const ids = lista.map((x) => x.id);
        void fotosDasViagens(ids, 4).then(setCapas);
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
  const capaUrl = ordenadas.map((v) => capas.get(v.id)?.[0]?.url).find(Boolean) ?? null;
  const capaDestino = ordenadas.find((v) => fase(v, hoje) !== 'proximas')?.destino ?? ordenadas[0]?.destino ?? null;
  // Carimbos: uma por cidade onde já esteve (a visita mais recente).
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const carimbos = [...new Map(ordenadas.filter((v) => fase(v, hoje) === 'foi').map((v) => [v.destino, v] as const)).values()]
    .map((v) => ({ cidade: v.destino.split(',')[0]!, quando: `${MES[Number(v.data_ida.slice(5, 7)) - 1]} ${v.data_ida.slice(0, 4)}` })).slice(0, 12);
  const mostrarMinhas = () => {
    if (!window.confirm(`Mostrar suas ${minhasPrivadas.length} viagens privadas para todos os seus amigos? Dá para esconder de novo em cada viagem.`)) return;
    void Promise.all(minhasPrivadas.map((v) => atualizarViagem(v.id, { visibilidade: 'amigos' }))).then(carregar);
  };
  const pedir = async () => { if (await pedirAmizade(id)) { if (pedido === 'recebido') carregar(); else setPedido('enviado'); } };
  const numeros: [number, string, string][] = [
    [p.viagens, 'viagem', 'viagens'], [p.cidades, 'cidade', 'cidades'], [p.fotos, 'foto', 'fotos'],
  ];
  const semBio = !p.bio && !p.gostos_viagem.length;

  return (
    <main className="tela" data-tela="pessoa" data-real="pessoa">
      {/* Capa: a foto mais recente das viagens (ou a cidade); sem foto, o azul-marinho da marca. */}
      <div className="perfil-capa">
        {capaUrl ? <img src={capaUrl} alt="" /> : capaDestino ? <FotoLugar id={capaDestino} proporcao="390 / 170" credito={false} compacto /> : null}
        {p.eu ? null : <div className="perfil-voltar"><Voltar para="/perfil/amigos" /></div>}
        {p.eu ? (
          <div style={{ position: 'absolute', right: '16px', top: 'calc(16px + env(safe-area-inset-top))', display: 'flex', gap: '8px' }}>
            <button type="button" className="r-btn" onClick={() => navegar('/perfil/amigos')} aria-label="Amigos"
              style={{ height: '40px', padding: '0 14px', borderRadius: '20px', background: 'rgba(11,31,75,.55)', color: '#fff', fontWeight: 600, fontSize: '14px' }}>Amigos</button>
            <button type="button" className="r-btn" onClick={() => navegar('/perfil')} aria-label="Configurações da conta"
              style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(11,31,75,.55)', color: '#fff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM19.4 13.5l1.6 1.2-1.8 3.1-1.9-.7a7.4 7.4 0 0 1-1.7 1l-.3 2H10.7l-.3-2a7.4 7.4 0 0 1-1.7-1l-1.9.7-1.8-3.1 1.6-1.2a7 7 0 0 1 0-2l-1.6-1.2 1.8-3.1 1.9.7a7.4 7.4 0 0 1 1.7-1l.3-2h3.6l.3 2a7.4 7.4 0 0 1 1.7 1l1.9-.7 1.8 3.1-1.6 1.2a7 7 0 0 1 0 2z" /></svg>
            </button>
          </div>
        ) : null}
      </div>
      <div style={{ padding: '0 20px 24px' }}>
        <header className="perfil-topo">
          <span className="perfil-avatar"><Avatar userId={id} nome={nome} tamanho={96} /></span>
          <h1 style={{ margin: '8px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em', overflowWrap: 'anywhere' }}>{nome}</h1>
          <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)', overflowWrap: 'anywhere' }}>{[p.username ? `@${p.username}` : null, p.origin_city].filter(Boolean).join(' · ')}</span>
        </header>

        <dl aria-label="Números" className="perfil-numeros">
          {numeros.map(([n, um, varios]) => (
            <div key={varios}>
              <dt>{n === 1 ? um : varios}</dt>
              <dd>{n}</dd>
            </div>
          ))}
        </dl>

        {editando ? (
          <EditarVitrine inicial={p} onFim={(salvou) => { setEditando(false); if (salvou) void perfilVitrine(id).then(setP); }} />
        ) : (
          <section aria-label="Sobre" style={{ marginTop: '14px' }}>
            {p.bio ? <p style={{ margin: 0, fontSize: '15px', lineHeight: '22px', whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{p.bio}</p> : null}
            {p.gostos_viagem.length ? (
              <>
                <h2 style={{ margin: p.bio ? '12px 0 0' : 0, font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--texto-sec)' }}>Gosta numa viagem</h2>
                <ul aria-label="Gosta numa viagem" className="perfil-gostos">
                  {p.gostos_viagem.map((g) => <li key={g}>{GOSTOS_VIAGEM[g]}</li>)}
                </ul>
              </>
            ) : null}
            {p.eu ? (
              semBio ? (
                <div style={{ padding: '14px', borderRadius: '14px', border: '1px dashed var(--linha)' }}>
                  <b style={{ display: 'block', fontSize: '15px' }}>O que você gosta numa viagem?</b>
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>Amigos te conhecem melhor e combinam viagens.</span>
                  <div style={{ marginTop: '10px' }}><BotaoPrincipal onClick={() => setEditando(true)}>Escrever minha bio</BotaoPrincipal></div>
                </div>
              ) : (
                <button type="button" className="r-btn" onClick={() => setEditando(true)} style={{ marginTop: '10px', width: '100%', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px solid var(--linha)', fontWeight: 600, fontSize: '15px' }}>Editar bio</button>
              )
            ) : !p.amigos ? (
              <div style={{ marginTop: '12px' }}>
                {pedido === 'enviado' ? <p style={{ margin: 0, fontSize: '15px', color: 'var(--texto-sec)' }}>Pedido de amizade enviado.</p>
                  : <BotaoPrincipal onClick={() => void pedir()}>{pedido === 'recebido' ? 'Aceitar amizade' : 'Pedir amizade'}</BotaoPrincipal>}
              </div>
            ) : null}
          </section>
        )}

        {carimbos.length ? (
          <section aria-label="Carimbos" style={{ marginTop: '22px' }}>
            <h2 style={{ margin: 0, font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--texto-sec)' }}>Carimbos</h2>
            <ul className="perfil-carimbos" aria-label="Cidades visitadas">
              {carimbos.map((c, i) => (
                <li key={c.cidade} className={`carimbo carimbo-${i % 3}`} style={{ transform: `rotate(${[-4, 3, -2, 4, -3][i % 5]}deg)` }}>
                  <b>{c.cidade}</b><span>{c.quando}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div role="tablist" aria-label="Ver" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '20px' }}>
          {(['viagens', 'fotos'] as const).map((a) => (
            <button key={a} type="button" role="tab" aria-selected={aba === a} className="r-btn" onClick={() => setAba(a)}
              style={{ minHeight: '44px', borderRadius: '999px', textAlign: 'center', fontWeight: 600, fontSize: '15px', background: aba === a ? 'var(--fundo-escuro)' : 'var(--cartao-2)', color: aba === a ? '#fff' : 'var(--texto)' }}>
              {a === 'viagens' ? 'Viagens' : 'Fotos'}
            </button>
          ))}
        </div>

        {aba === 'fotos' ? (
          <div role="tabpanel" aria-label="Fotos" style={{ marginTop: '4px' }}>
            <GradeDeFotos userId={id} max={30} vazio={p.eu ? 'Suas fotos de viagem aparecem aqui.' : 'Nenhuma foto que você possa ver.'} />
          </div>
        ) : (
          <div role="tabpanel" aria-label="Viagens" style={{ display: 'grid', gap: '18px', marginTop: '14px' }}>
            {viagens === null ? <p aria-busy="true">Carregando…</p> : null}
            {vividas.map((v) => {
              const f = fase(v, hoje);
              const fotos = capas.get(v.id) ?? [];
              const capa = fotos[0];
              const r = roteiros.get(v.id);
              const resto = r ? r.total - r.nomes.length : 0;
              return (
                <button key={v.id} type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}?aba=roteiro`)} aria-label={`Ver a viagem para ${v.destino}`}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: 0 }}>
                  <span style={{ position: 'relative', display: 'block', borderRadius: '16px', overflow: 'hidden', background: 'var(--cartao-2)' }}>
                    {capa ? <img src={capa.url} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', display: 'block' }} />
                      : <FotoLugar id={v.destino} proporcao="16 / 10" credito={false} compacto />}
                    {f === 'agora' ? <span style={{ position: 'absolute', left: '10px', top: '10px', padding: '4px 10px', borderRadius: '999px', background: 'var(--fundo)', color: 'var(--verde)', fontSize: '12px', fontWeight: 700 }}>{NOME_FASE[f]}</span> : null}
                  </span>
                  {fotos.length > 1 ? (
                    <span aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '4px' }}>
                      {fotos.slice(1, 4).map((ft) => <img key={ft.id} src={ft.url} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', display: 'block' }} />)}
                    </span>
                  ) : null}
                  <span style={{ display: 'block', font: "600 19px/24px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '8px' }}>{v.destino}</span>
                  {r?.nomes.length ? (
                    <span style={{ display: 'block', fontSize: '15px', lineHeight: '21px', marginTop: '2px' }}>
                      {f === 'agora' ? 'No roteiro: ' : 'Passou por '}<b>{r.nomes.join(', ')}</b>{resto > 0 ? ` e mais ${resto}` : ''}
                    </span>
                  ) : null}
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)', marginTop: '2px' }}>
                    {[periodo(v.data_ida, v.noites), textoMotivo(v), v.juntos ? 'vocês foram juntos' : null, p.eu ? QUEM_VE[v.visibilidade] : null].filter(Boolean).join(' · ')}
                  </span>
                </button>
              );
            })}
            {viagens?.length && !vividas.length ? (
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--texto-sec)' }}>
                {p.eu ? 'Suas viagens feitas aparecem aqui, com fotos e roteiro.' : `${primeiro} ainda não mostrou viagens feitas.`}
              </p>
            ) : null}
            {planos.length ? (
              <section aria-label="Próximos destinos">
                <h2 style={{ margin: '4px 0 8px', font: "600 15px 'Open Sans'", color: 'var(--texto-sec)' }}>Próximos destinos</h2>
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
            {viagens && !viagens.length ? (
              p.eu ? (
                <div>
                  <p style={{ margin: 0, fontSize: '15px' }}>Suas viagens aparecem aqui.</p>
                  <button type="button" className="r-btn" onClick={() => navegar('/viagens/ja-fiz')} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600, fontSize: '15px' }}>Registrar uma viagem que fiz ›</button>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '15px', color: 'var(--texto-sec)' }}>
                  {p.amigos ? `${primeiro} ainda não mostrou viagens.` : 'Viagens para amigos aparecem quando vocês forem amigos.'}
                </p>
              )
            ) : null}
          </div>
        )}

        {p.amigos && minhasPrivadas.length ? (
          <div style={{ marginTop: '22px', padding: '12px', background: 'var(--cartao-2)', borderRadius: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Seus amigos não veem {minhasPrivadas.length === 1 ? '1 viagem sua' : `${minhasPrivadas.length} viagens suas`}.</div>
            <button type="button" className="r-btn" onClick={mostrarMinhas} style={{ marginTop: '4px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600, fontSize: '15px' }}>Mostrar para amigos</button>
          </div>
        ) : null}

        {p.amigos && !p.eu ? (
          <button type="button" className="r-btn" onClick={() => { if (window.confirm('Desfazer a amizade?')) void desfazerAmizade(id).then(() => navegar('/perfil/amigos')); }} style={{ marginTop: '20px', minHeight: '44px', color: 'var(--vermelho)', fontWeight: 600 }}>Desfazer amizade</button>
        ) : null}
      </div>
      <Abas ativa="passaporte" />
    </main>
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
