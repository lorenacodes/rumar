import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { denunciar } from '../../lib/avaliacoes';
import { feedViagens, type PostViagem } from '../../lib/feed';
import { tempoRelativo } from '../../lib/datas';
import { textoMotivo } from '../../lib/viagens';
import { fotosDasViagens } from '../../lib/fotosPessoa';
import { useSessao } from '../../conta/servico';
import { Abas } from '../../ui/abas';
import { Avatar } from '../../ui/avatar';
import { BotaoPrincipal, Voltar } from '../../ui/pecas';
import { periodo } from '../viagens/comum';

/** Feed de viagens (D-071): de amigos e de quem mostrou para todos. Toque abre o roteiro e o álbum. */
export function FeedViagens() {
  const navegar = useNavigate();
  const sessao = useSessao();
  const meuId = sessao?.user.id;
  const [posts, setPosts] = useState<PostViagem[] | null>(null);
  const [fim, setFim] = useState(false);
  const [denunciados, setDenunciados] = useState<Set<string>>(new Set());
  // Até 5 fotos do álbum por viagem, para deslizar no próprio cartão (D-082).
  const [album, setAlbum] = useState<Map<string, { id: string; url: string }[]>>(new Map());
  useEffect(() => {
    const faltam = (posts ?? []).map((p) => p.trip_id).filter((id) => !album.has(id));
    if (faltam.length) void fotosDasViagens(faltam).then((m) => setAlbum((a) => new Map([...a, ...faltam.map((id) => [id, m.get(id) ?? []] as const)])));
  }, [posts]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (sessao) void feedViagens(20).then((p) => { setPosts(p); setFim(p.length < 20); }); else if (sessao === null) setPosts([]); }, [sessao]);
  const mais = async () => {
    const ultimo = posts?.at(-1); if (!ultimo) return;
    const novos = await feedViagens(20, ultimo.quando);
    setPosts((p) => [...(p ?? []), ...novos.filter((n) => !p?.some((x) => x.trip_id === n.trip_id))]); setFim(novos.length < 20);
  };
  const denunciarFoto = async (p: PostViagem) => {
    if (!p.foto_id || !window.confirm('Denunciar esta foto? A moderação vai olhar.')) return;
    if (await denunciar('foto', p.foto_id, 'feed de viagens')) setDenunciados((s) => new Set(s).add(p.trip_id));
  };

  return (
    <main className="tela" data-tela="feed-viagens" data-real="feed-viagens">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <Voltar para="/inicio" />
        <h1 style={{ margin: '4px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Viagens da galera</h1>
        <p style={{ fontSize: '15px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>Veja onde o pessoal foi e se inspire.</p>

        {sessao === null ? (
          <div style={{ marginTop: '20px' }}><BotaoPrincipal onClick={() => navegar('/entrar')}>Entre para ver</BotaoPrincipal></div>
        ) : posts === null ? <p aria-busy="true" style={{ marginTop: '20px' }}>Carregando…</p> : !posts.length ? (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '15px', margin: 0, fontWeight: 600 }}>Ainda não tem viagem para mostrar.</p>
            <p style={{ fontSize: '14px', margin: '4px 0 12px', color: 'var(--texto-sec)' }}>Mostre uma viagem ou chame amigos.</p>
            <BotaoPrincipal onClick={() => navegar('/viagens/ja-fiz')}>Mostrar uma viagem que fiz</BotaoPrincipal>
            <button type="button" className="r-btn" onClick={() => navegar('/perfil/amigos')} style={{ width: '100%', minHeight: '44px', marginTop: '6px', color: 'var(--azul)', fontWeight: 600, fontSize: '15px' }}>Encontrar amigos</button>
          </div>
        ) : (
          <div role="feed" aria-label="Viagens da galera" style={{ display: 'grid', gap: '22px', marginTop: '16px' }}>
            {posts.filter((p) => !denunciados.has(p.trip_id)).map((p) => {
              const eu = p.user_id === meuId;
              const extra = [periodo(p.data_ida, p.noites), textoMotivo(p), p.fotos ? `${p.fotos} ${p.fotos === 1 ? 'foto' : 'fotos'}` : null, p.lugares ? `${p.lugares} ${p.lugares === 1 ? 'lugar' : 'lugares'}` : null].filter(Boolean).join(' · ');
              return (
                <article key={p.trip_id} aria-label={`${p.nome} em ${p.destino}`}>
                  <button type="button" className="r-btn" onClick={() => navegar(`/pessoa/${eu ? 'eu' : p.user_id}`)} aria-label={eu ? 'Ver meu perfil' : `Ver o perfil de ${p.nome}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '44px', textAlign: 'left' }}>
                    <Avatar userId={p.user_id} nome={p.nome} tamanho={32} />
                    <span>
                      <b style={{ display: 'block', fontSize: '15px' }}>{eu ? 'Você' : p.nome}</b>
                      <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{[eu ? null : p.amigo ? 'Amigo' : 'Viajante', tempoRelativo(p.quando)].filter(Boolean).join(' · ')}</span>
                    </span>
                  </button>
                  <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${p.trip_id}?aba=roteiro`)} aria-label={`Ver a viagem de ${p.nome} para ${p.destino}`}
                    style={{ display: 'block', width: '100%', marginTop: '6px', textAlign: 'left' }}>
                    {(album.get(p.trip_id)?.length ?? 0) > 1 ? (
                      <Carrossel fotos={album.get(p.trip_id)!} />
                    ) : (
                      <span style={{ display: 'block', aspectRatio: '4 / 5', borderRadius: '16px', overflow: 'hidden', background: 'var(--cartao-2)' }}>
                        <img src={p.url} alt="" loading="lazy" onError={() => setPosts((l) => l?.filter((x) => x !== p) ?? null)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </span>
                    )}
                    <b style={{ display: 'block', font: "600 20px/25px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '8px' }}>{p.destino}</b>
                    {extra ? <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>{extra}</span> : null}
                  </button>
                  {p.foto_id && !eu ? (
                    <button type="button" className="r-btn" onClick={() => void denunciarFoto(p)} style={{ minHeight: '40px', fontSize: '13px', color: 'var(--texto-sec)' }}>Denunciar foto</button>
                  ) : null}
                </article>
              );
            })}
            {!fim ? <button type="button" className="r-btn" onClick={() => void mais()} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Ver mais viagens</button> : null}
          </div>
        )}
        <div style={{ height: '24px' }} />
      </div>
      <Abas ativa="inicio" />
    </main>
  );
}

/** Fotos da viagem deslizando no cartão, com pontinhos que mostram em qual está. */
function Carrossel({ fotos }: { fotos: { id: string; url: string }[] }) {
  const [atual, setAtual] = useState(0);
  return (
    <span style={{ position: 'relative', display: 'block' }}>
      <span onScroll={(e) => { const el = e.currentTarget; setAtual(Math.round(el.scrollLeft / Math.max(1, el.clientWidth))); }}
        style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', aspectRatio: '4 / 5', borderRadius: '16px', background: 'var(--cartao-2)' }}>
        {fotos.map((f) => <img key={f.id} src={f.url} alt="" loading="lazy" style={{ flex: 'none', width: '100%', height: '100%', objectFit: 'cover', scrollSnapAlign: 'start', display: 'block' }} />)}
      </span>
      <span aria-label={`Foto ${atual + 1} de ${fotos.length}`} style={{ position: 'absolute', left: 0, right: 0, bottom: '10px', display: 'flex', justifyContent: 'center', gap: '6px', pointerEvents: 'none' }}>
        {fotos.map((f, i) => <span key={f.id} style={{ width: '7px', height: '7px', borderRadius: '50%', background: i === atual ? '#fff' : 'rgba(255,255,255,.5)' }} />)}
      </span>
    </span>
  );
}
