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
  const [paradas, setParadas] = useState<Map<string, number>>(new Map());
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
        void fotosDasViagens(ids, 1).then(setCapas);
        const { data } = await supabase.from('trip_items').select('trip_id').in('trip_id', ids);
        const m = new Map<string, number>();
        for (const r of data ?? []) m.set(r.trip_id as string, (m.get(r.trip_id as string) ?? 0) + 1);
        setParadas(m);
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
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para={p.eu ? '/perfil' : '/perfil/amigos'} />

        <header style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
          <Avatar userId={id} nome={nome} tamanho={84} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ margin: 0, font: "600 24px/29px 'Lexend Exa'", letterSpacing: '-0.02em', overflowWrap: 'anywhere' }}>{nome}</h1>
            <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)', overflowWrap: 'anywhere' }}>{[p.username ? `@${p.username}` : null, p.origin_city].filter(Boolean).join(' · ')}</span>
          </div>
        </header>

        <dl aria-label="Números" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', margin: '16px 0 0', textAlign: 'center', background: 'var(--cartao-2)', borderRadius: '14px', padding: '10px 0' }}>
          {numeros.map(([n, um, varios]) => (
            <div key={varios} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
              <dt style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{n === 1 ? um : varios}</dt>
              <dd style={{ margin: 0, font: "600 20px/26px 'Lexend Exa'" }}>{n}</dd>
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
                <ul aria-label="Gosta numa viagem" style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {p.gostos_viagem.map((g) => <li key={g} style={{ padding: '6px 12px', borderRadius: '999px', background: 'var(--cartao-2)', fontSize: '14px', fontWeight: 600 }}>{GOSTOS_VIAGEM[g]}</li>)}
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

        <div role="tablist" aria-label="Ver" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '20px', borderBottom: '1px solid var(--linha)' }}>
          {(['viagens', 'fotos'] as const).map((a) => (
            <button key={a} type="button" role="tab" aria-selected={aba === a} className="r-btn" onClick={() => setAba(a)}
              style={{ minHeight: '44px', fontWeight: 600, fontSize: '15px', color: aba === a ? 'var(--texto)' : 'var(--texto-sec)', boxShadow: aba === a ? 'inset 0 -3px 0 var(--azul)' : 'none' }}>
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
            {ordenadas.map((v) => {
              const f = fase(v, hoje);
              const capa = capas.get(v.id)?.[0];
              const n = paradas.get(v.id) ?? 0;
              return (
                <button key={v.id} type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}?aba=roteiro`)} aria-label={`Ver a viagem para ${v.destino}`}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: 0 }}>
                  <span style={{ position: 'relative', display: 'block', borderRadius: '16px', overflow: 'hidden', background: 'var(--cartao-2)' }}>
                    {capa ? <img src={capa.url} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', display: 'block' }} />
                      : <FotoLugar id={v.destino} proporcao="16 / 10" credito={false} compacto />}
                    <span style={{ position: 'absolute', left: '10px', top: '10px', padding: '4px 10px', borderRadius: '999px', background: 'var(--fundo)', color: f === 'agora' ? 'var(--verde)' : 'var(--texto)', fontSize: '12px', fontWeight: 700 }}>{NOME_FASE[f]}</span>
                  </span>
                  <span style={{ display: 'block', font: "600 19px/24px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '8px' }}>{v.destino}</span>
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>
                    {[periodo(v.data_ida, v.noites), textoMotivo(v), n ? `${n} ${n === 1 ? 'parada' : 'paradas'}` : null, v.juntos ? 'vocês vão juntos' : null, p.eu ? QUEM_VE[v.visibilidade] : null].filter(Boolean).join(' · ')}
                  </span>
                </button>
              );
            })}
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
