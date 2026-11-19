import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { desfazerAmizade, perfilPublico, type PessoaPublica } from '../../lib/social';
import { supabase } from '../../lib/supabase';
import { atualizarViagem, eu, listarViagens, textoMotivo, viagensVisiveis, type Viagem } from '../../lib/viagens';
import { FotoLugar } from '../../ui/foto';
import { Avatar } from '../../ui/avatar';
import { GradeDeFotos } from '../../ui/GradeDeFotos';
import { Voltar } from '../../ui/pecas';
import { periodo, Rotulo } from '../viagens/comum';

type Fase = 'agora' | 'proximas' | 'foi';
const NOME_FASE: Record<Fase, string> = { agora: 'Viajando agora', proximas: 'Próximas viagens', foi: 'Já foi' };
function fase(v: Viagem, hoje: string): Fase {
  const fim = new Date(Date.parse(`${v.data_ida}T12:00:00Z`) + v.noites * 864e5).toISOString().slice(0, 10);
  return hoje < v.data_ida ? 'proximas' : hoje <= fim ? 'agora' : 'foi';
}

/** Perfil de um amigo (D-052): as viagens que ele mostra aos amigos e as que vocês fazem juntos. */
export function Pessoa() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  const [p, setP] = useState<(PessoaPublica & { amigos: boolean }) | null | undefined>(undefined);
  const [viagens, setViagens] = useState<(Viagem & { juntos?: boolean })[]>([]);
  const [paradas, setParadas] = useState<Map<string, number>>(new Map());
  const [minhasPrivadas, setMinhasPrivadas] = useState<Viagem[]>([]);
  const carregar = () => {
    void perfilPublico(id).then(setP);
    void Promise.all([listarViagens(), eu()]).then(async ([v, uid]) => {
      // Minhas viagens com ela (dados completos) + as dela que posso ver (resumo seguro, sem dinheiro).
      const comigo = v.minhas.filter((x) => x.user_id === id && x.status === 'ativo');
      const dela = await viagensVisiveis(id);
      const dele = [...comigo.map((x) => ({ ...x, juntos: true })), ...dela.map((x) => ({ ...x, juntos: false }))];
      setViagens(dele);
      setMinhasPrivadas(v.minhas.filter((x) => x.user_id === uid && x.visibilidade === 'privada'));
      if (dele.length) {
        const { data } = await supabase.from('trip_items').select('trip_id').in('trip_id', dele.map((x) => x.id));
        const m = new Map<string, number>();
        for (const r of data ?? []) m.set(r.trip_id as string, (m.get(r.trip_id as string) ?? 0) + 1);
        setParadas(m);
      }
    });
  };
  useEffect(carregar, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (p === undefined) return <main className="tela" aria-busy="true" />;

  const hoje = new Date().toISOString().slice(0, 10);
  const grupos = (['agora', 'proximas', 'foi'] as Fase[]).map((f) => ({ f, lista: viagens.filter((v) => fase(v, hoje) === f).sort((a, b) => (f === 'foi' ? b.data_ida.localeCompare(a.data_ida) : a.data_ida.localeCompare(b.data_ida))) })).filter((g) => g.lista.length);
  const cidades = new Set(viagens.filter((v) => fase(v, hoje) !== 'proximas').map((v) => v.destino)).size;
  const nome = p?.display_name ?? 'Pessoa';
  const mostrarMinhas = () => {
    if (!window.confirm(`Mostrar suas ${minhasPrivadas.length} viagens privadas para todos os seus amigos? Dá para esconder de novo em cada viagem.`)) return;
    void Promise.all(minhasPrivadas.map((v) => atualizarViagem(v.id, { visibilidade: 'amigos' }))).then(carregar);
  };

  return (
    <main className="tela" data-tela="pessoa" data-real="pessoa">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para="/perfil/amigos" />
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '8px' }}>
          <Avatar userId={id} nome={nome} tamanho={64} />
          <span style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, font: "600 24px/29px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{nome}</h1>
            <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>{[p?.username ? `@${p.username}` : null, p?.origin_city].filter(Boolean).join(' · ')}</span>
          </span>
        </div>
        {viagens.length ? (
          <div style={{ display: 'flex', gap: '24px', marginTop: '14px' }}>
            <span><b style={{ display: 'block', font: "600 20px 'Lexend Exa'" }}>{viagens.length}</b><span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{viagens.length === 1 ? 'viagem' : 'viagens'}</span></span>
            {cidades ? <span><b style={{ display: 'block', font: "600 20px 'Lexend Exa'" }}>{cidades}</b><span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{cidades === 1 ? 'cidade visitada' : 'cidades visitadas'}</span></span> : null}
          </div>
        ) : null}

        <section aria-label="Fotos" style={{ marginTop: '6px' }}>
          <Rotulo>Fotos</Rotulo>
          <GradeDeFotos userId={id} max={9} vazio="Nenhuma foto que você possa ver." />
        </section>

        {grupos.map(({ f, lista }) => (
          <section key={f} aria-label={NOME_FASE[f]}>
            <Rotulo>{NOME_FASE[f]}</Rotulo>
            {lista.map((v) => (
              <button key={v.id} type="button" className="r-btn" onClick={() => navegar(`/viagem/${v.id}?aba=roteiro`)} aria-label={`Ver a viagem para ${v.destino}`}
                style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', textAlign: 'left', padding: '8px 0' }}>
                <span style={{ width: '72px', flex: 'none', borderRadius: '10px', overflow: 'hidden' }}><FotoLugar id={v.destino} proporcao="1 / 1" credito={false} compacto /></span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', font: "600 18px/23px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{v.destino}</span>
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--texto-sec)' }}>{[periodo(v.data_ida, v.noites), textoMotivo(v)].filter(Boolean).join(' · ')}</span>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: f === 'agora' ? 'var(--verde)' : 'var(--azul)' }}>
                    {[paradas.get(v.id) ? `${paradas.get(v.id)} ${paradas.get(v.id) === 1 ? 'parada' : 'paradas'} no roteiro` : 'Roteiro ainda vazio', v.juntos ? 'vocês vão juntos' : null].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span aria-hidden="true" style={{ fontSize: '20px', color: 'var(--texto-sec)' }}>›</span>
              </button>
            ))}
          </section>
        ))}
        {!viagens.length ? (
          <p style={{ fontSize: '15px', color: 'var(--texto-sec)', marginTop: '18px' }}>
            {p?.amigos ? `${nome.split(' ')[0]} ainda não mostrou viagens para os amigos.` : 'Nenhuma viagem pública. Viagens para amigos aparecem quando vocês forem amigos.'}
          </p>
        ) : null}

        {p?.amigos && minhasPrivadas.length ? (
          <div style={{ marginTop: '22px', padding: '12px', background: 'var(--cartao-2)', borderRadius: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Seus amigos não veem {minhasPrivadas.length === 1 ? '1 viagem sua' : `${minhasPrivadas.length} viagens suas`}.</div>
            <button type="button" className="r-btn" onClick={mostrarMinhas} style={{ marginTop: '4px', minHeight: '44px', color: 'var(--azul)', fontWeight: 600, fontSize: '15px' }}>Mostrar para amigos</button>
          </div>
        ) : null}

        {p?.amigos ? (
          <button type="button" className="r-btn" onClick={() => { if (window.confirm('Desfazer a amizade?')) void desfazerAmizade(id).then(() => navegar('/perfil/amigos')); }} style={{ marginTop: '20px', minHeight: '44px', color: 'var(--vermelho)', fontWeight: 600 }}>Desfazer amizade</button>
        ) : null}
      </div>
    </main>
  );
}
