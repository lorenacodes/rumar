import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

import { experienciasPerto, ordenarExperiencias, type Experiencia } from '../../lib/experiencias';
import type { Preferencias } from '../../lib/planejador';
import { Info } from '../../ui/info';

const NOME_TIPO: Record<string, string> = { passeio: 'Passeio', museu: 'Museu', natureza: 'Natureza', cultura: 'Cultura', gastronomia: 'Comida', noite: 'Noite' };

/** "Experiências" (D-080): pesquisadas pelo Bo Vair, em ordem do jeito de viajar e do orçamento. */
export function Experiencias({ destino, cidade, preferencias, titulo = 'Experiências', max = 4 }: { destino: { id: string; lat?: number | null; lon?: number | null }; cidade: string; preferencias: Preferencias | null; titulo?: string; max?: number }) {
  const navegar = useNavigate();
  const [lista, setLista] = useState<Experiencia[] | null>(null);
  const [todas, setTodas] = useState(false);
  useEffect(() => { void experienciasPerto(destino).then((l) => setLista(ordenarExperiencias(l, preferencias))); }, [destino.id, preferencias]); // eslint-disable-line react-hooks/exhaustive-deps
  // Foto de cada experiência: a do lugar dela; sem lugar, uma foto diferente de outro lugar da mesma cidade.
  const [fotos, setFotos] = useState<Map<string, string>>(new Map());
  useEffect(() => {
    if (!lista?.length) return;
    void (async () => {
      const ids = lista.map((e) => e.place_id).filter((x): x is string => Boolean(x));
      const cidades = [...new Set(lista.map((e) => e.destino_id))];
      const [doLugar, daCidade] = await Promise.all([
        ids.length ? supabase.from('lugares').select('id, foto').in('id', ids).not('foto', 'is', null) : Promise.resolve({ data: [] }),
        supabase.from('lugares').select('destino_id, foto').in('destino_id', cidades).eq('ativo', true).not('foto', 'is', null)
          .in('categoria', ['praias', 'atracoes', 'historico', 'museus', 'parques', 'cultura', 'mercados']).order('fama', { ascending: false, nullsFirst: false }).limit(60),
      ]);
      const porLugar = new Map(((doLugar.data ?? []) as { id: string; foto: string }[]).map((l) => [l.id, l.foto]));
      const reserva = new Map<string, string[]>();
      for (const l of (daCidade.data ?? []) as { destino_id: string; foto: string }[]) reserva.set(l.destino_id, [...(reserva.get(l.destino_id) ?? []), l.foto]);
      const usadas = new Set(porLugar.values());
      const m = new Map<string, string>();
      for (const e of lista) {
        const f = (e.place_id && porLugar.get(e.place_id)) || (reserva.get(e.destino_id) ?? []).find((x) => !usadas.has(x));
        if (f) { m.set(e.id, f); usadas.add(f); }
      }
      setFotos(m);
    })();
  }, [lista]);
  if (!lista?.length) return null;
  const vistas = todas ? lista : lista.slice(0, max);
  return (
    <section aria-label={titulo} style={{ margin: '18px 0' }}>
      <h2 style={{ margin: 0, font: "600 20px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{titulo}</h2>
      <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: '2px 0 0' }}>{preferencias ? 'Pesquisadas por nós, na ordem do seu jeito.' : `O que viver em ${cidade}, pesquisado por nós.`}</p>
      <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
        {vistas.map((e) => (
          <article key={e.id} aria-label={e.titulo} style={{ padding: fotos.get(e.id) ? '0 16px 14px' : '14px 16px', borderRadius: '16px', background: 'var(--cartao-2)', overflow: 'hidden' }}>
            {fotos.get(e.id) ? <img src={fotos.get(e.id)} alt="" loading="lazy" style={{ display: 'block', width: 'calc(100% + 32px)', margin: '0 -16px 12px', aspectRatio: '16 / 9', objectFit: 'cover' }} /> : null}
            <div style={{ font: "600 13px/17px 'Open Sans'", color: 'var(--azul)' }}>
              {[NOME_TIPO[e.tipo] ?? 'Experiência', e.bateVolta ? `Bate-volta · ${e.bateVolta}, ${e.km} km` : null].filter(Boolean).join(' · ')}
            </div>
            <b style={{ display: 'block', font: "600 17px/22px 'Lexend Exa'", marginTop: '4px' }}>{e.titulo}</b>
            <p style={{ margin: '4px 0 0', fontSize: '15px', lineHeight: '21px' }}>{e.resumo}</p>
            {e.dica ? <p style={{ margin: '4px 0 0', fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)' }}>{e.dica}</p> : null}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              {e.gratis ? <span style={selo('var(--verde)')}>Grátis</span> : e.preco_texto ? <span style={selo('var(--texto)')}>{e.preco_texto}</span> : <span style={selo('var(--texto-sec)')}>Preço: confirme no local</span>}
              {e.duracao_min ? <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{e.duracao_min >= 60 ? `${Math.round(e.duracao_min / 30) / 2} h`.replace('.', ',') : `${e.duracao_min} min`}</span> : null}
            </div>
            {e.preco_fonte ? (
              <Info rotulo="De onde vem o preço" style={{ marginTop: '2px' }}>
                {e.preco_fonte}, {e.preco_data}. Preços mudam: confirme antes de ir. {e.preco_fonte_url ? <a href={e.preco_fonte_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--azul)' }}>Ver fonte</a> : null}
              </Info>
            ) : null}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {e.place_id ? <button type="button" className="r-btn" onClick={() => navegar(`/lugar/${e.place_id}`)} style={botao(true)}>Ver o lugar</button> : null}
              {e.site_oficial ? <a href={e.site_oficial} target="_blank" rel="noopener noreferrer" style={{ ...botao(!e.place_id), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Site oficial ↗</a> : null}
            </div>
          </article>
        ))}
      </div>
      {lista.length > max ? <button type="button" className="r-btn" onClick={() => setTodas(!todas)} style={{ minHeight: '44px', marginTop: '6px', color: 'var(--azul)', font: "600 15px 'Open Sans'" }}>{todas ? 'Ver menos' : `Ver todas (${lista.length})`}</button> : null}
    </section>
  );
}

const selo = (cor: string) => ({ padding: '4px 10px', borderRadius: '12px', background: 'var(--fundo)', color: cor, font: "700 13px 'Open Sans'" }) as const;
const botao = (principal: boolean) => ({ minHeight: '40px', padding: '0 16px', borderRadius: '20px', font: "600 14px 'Open Sans'", color: 'var(--texto)', background: principal ? 'var(--amarelo)' : 'var(--cartao-1)' }) as const;
