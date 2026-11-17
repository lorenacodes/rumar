import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { CATEGORIAS, CIDADE, LUGARES } from '../../lib/catalogo';
import { afinidade, type Categoria, type Lugar } from '../../lib/planejador';
import { useViajante } from '../../state/viajante';
import PRECOS from '../../dados/precos-paris.json';
import type { Precos } from '../../lib/orcamento';
import { Mapa } from '../../ui/Mapa';

const P = PRECOS as unknown as Precos;
import { Abas } from '../../ui/abas';
import { FotoLugar, temFoto } from '../../ui/foto';

const normal = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Linha de lugar: foto quadrada, categoria, nome, bairro e salvar. */
export function LinhaLugar({ l, aoAbrir }: { l: Lugar; aoAbrir: () => void }) {
  const { salvos, alternarSalvo } = useViajante();
  const salvo = salvos.includes(l.id);
  return (
    <li style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--linha)' }}>
      <button type="button" className="r-btn" onClick={aoAbrir} style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0, textAlign: 'left' }}>
        <span style={{ width: '72px', flex: 'none' }}>
          {temFoto(l.id) ? <FotoLugar id={l.id} proporcao="1 / 1" credito={false} /> : (
            <span aria-hidden style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', background: 'var(--cartao-2)', font: "600 22px 'Lexend Exa'", color: 'var(--texto-sec)' }}>{l.nome[0]}</span>
          )}
        </span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', font: "700 11px/15px 'Open Sans'", letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--azul)' }}>{CATEGORIAS[l.categoria]}</span>
          <span style={{ display: 'block', font: "600 16px/21px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{l.nome}</span>
          <span style={{ display: 'block', fontSize: '13px', lineHeight: '18px', color: 'var(--texto-sec)' }}>
            {l.area}
            {l.custo === 0 ? ' · grátis' : ''}
            {l.local ? ' · menos turístico' : ''}
          </span>
        </span>
      </button>
      <button type="button" className="r-btn" aria-pressed={salvo} aria-label={salvo ? `Tirar ${l.nome} dos salvos` : `Salvar ${l.nome}`} onClick={() => void alternarSalvo(l.id)}
        style={{ width: '44px', height: '44px', flex: 'none', fontSize: '22px', color: salvo ? 'var(--vermelho)' : 'var(--texto-sec)' }}>
        {salvo ? '♥' : '♡'}
      </button>
    </li>
  );
}

/** Descobrir: lugares reais da cidade, com busca, categorias e recomendações pelo perfil. */
export function Descobrir() {
  const navegar = useNavigate();
  const [busca, setBusca] = useState('');
  const [params, setParams] = useSearchParams();
  const filtro = (params.get('ver') ?? 'para-voce') as 'para-voce' | 'populares' | 'locais' | 'salvos' | Categoria;
  const { preferencias, salvos } = useViajante();
  const [preco, setPreco] = useState<'todos' | 'gratis' | 'ate20' | '20a40' | 'mais40'>('todos');
  const [mapa, setMapa] = useState(false);
  const viagem = params.get('viagem');
  const precoDe = (l: Lugar) => (P.lugares[l.id] ? (P.lugares[l.id]!.min + P.lugares[l.id]!.max) / 200 : l.custo === 0 ? 0 : null);

  const lista = useMemo(() => {
    let r = LUGARES;
    if (busca.trim()) {
      const q = normal(busca.trim());
      r = r.filter((l) => normal(`${l.nome} ${l.area} ${CATEGORIAS[l.categoria]} ${l.descricao}`).includes(q));
    } else if (filtro === 'populares') r = r.filter((l) => l.lotado);
    else if (filtro === 'locais') r = r.filter((l) => l.local);
    else if (filtro === 'salvos') r = r.filter((l) => salvos.includes(l.id));
    else if (filtro !== 'para-voce') r = r.filter((l) => l.categoria === filtro);
    if (preco !== 'todos') {
      r = r.filter((l) => {
        const v = precoDe(l);
        if (v === null) return false;
        return preco === 'gratis' ? v === 0 : preco === 'ate20' ? v > 0 && v <= 20 : preco === '20a40' ? v > 20 && v <= 40 : v > 40;
      });
    }
    if (filtro === 'para-voce' && preferencias && !busca.trim()) {
      r = [...r].sort((a, b) => afinidade(b, preferencias).pontos - afinidade(a, preferencias).pontos).slice(0, 12);
    }
    return r;
  }, [busca, filtro, preferencias, salvos, preco]);

  const chips: { id: string; nome: string }[] = [
    { id: 'para-voce', nome: 'Para você' },
    { id: 'salvos', nome: `Salvos${salvos.length ? ` (${salvos.length})` : ''}` },
    { id: 'populares', nome: 'Populares' },
    { id: 'locais', nome: 'Menos turísticos' },
    ...Object.entries(CATEGORIAS).map(([id, nome]) => ({ id, nome })),
  ];

  return (
    <main className="tela" data-tela="descobrir" data-real="descobrir">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Descobrir · {CIDADE}</div>
        <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>O que viver lá.</h1>
        <label htmlFor="busca-lugar" className="visualmente-oculto">Buscar lugar ou categoria</label>
        <input id="busca-lugar" className="r-input" type="search" value={busca} placeholder="Buscar: museu, café, Marais…" onChange={(e) => setBusca(e.target.value)}
          style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: '12px', borderBottom: '2px solid var(--texto)', padding: '10px 0', font: "500 17px 'Open Sans'", color: 'var(--texto)', background: 'transparent' }} />
        <div role="tablist" aria-label="Filtros" style={{ display: 'flex', gap: '6px', overflowX: 'auto', margin: '12px -20px 0', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
          {chips.map((c) => {
            const ativo = !busca && filtro === c.id;
            return (
              <button key={c.id} type="button" role="tab" aria-selected={ativo} className="r-btn" onClick={() => (setBusca(''), setParams({ ver: c.id }, { replace: true }))}
                style={{ flex: 'none', height: '44px', padding: '0 14px', boxSizing: 'border-box', whiteSpace: 'nowrap', font: `${ativo ? 600 : 500} 14px 'Open Sans'`, ...(ativo ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>
                {c.nome}
              </button>
            );
          })}
        </div>
        <div role="group" aria-label="Preço por pessoa" style={{ display: 'flex', gap: '6px', overflowX: 'auto', margin: '8px -20px 0', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
          {([['todos', 'Qualquer preço'], ['gratis', 'Grátis'], ['ate20', 'Até 20 €'], ['20a40', '20 a 40 €'], ['mais40', 'Mais de 40 €']] as const).map(([id, nome]) => (
            <button key={id} type="button" role="radio" aria-checked={preco === id} className="r-btn" onClick={() => setPreco(id)}
              style={{ flex: 'none', height: '40px', padding: '0 12px', whiteSpace: 'nowrap', font: `${preco === id ? 600 : 500} 13px 'Open Sans'`, ...(preco === id ? { background: 'var(--azul)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>{nome}</button>
          ))}
          <button type="button" className="r-btn" aria-pressed={mapa} onClick={() => setMapa(!mapa)} style={{ flex: 'none', height: '40px', padding: '0 12px', font: "600 13px 'Open Sans'", border: '2px solid var(--texto)' }}>{mapa ? 'Ver lista' : 'Ver no mapa'}</button>
        </div>
        {preco !== 'todos' ? <p style={{ fontSize: '12px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>Preço médio por pessoa com fonte; lugares sem preço confirmado ficam de fora deste filtro.</p> : null}
        {viagem ? <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--azul)', margin: '8px 0 0' }}>Escolha um lugar para adicionar à sua viagem.</p> : null}
        {mapa ? (
          <div style={{ marginTop: '10px' }}>
            <Mapa pontos={lista.filter((l) => typeof l.lat === 'number').map((l) => ({ id: l.id, lat: l.lat!, lon: l.lon!, rotulo: CATEGORIAS[l.categoria][0]!, titulo: l.nome, tipo: 'lugar' as const }))} altura="min(55vh, 420px)" aoEscolher={(id) => navegar(`/lugar/${id}${viagem ? `?viagem=${viagem}&dia=${params.get('dia') ?? 1}` : ''}`)} />
            <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '4px' }}>Mapa © OpenStreetMap · OpenFreeMap. Toque num ponto para ver o lugar.</div>
          </div>
        ) : null}
        {filtro === 'para-voce' && !busca ? (
          <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', margin: '12px 0 0' }}>
            {preferencias ? 'Em ordem do que mais combina com o seu jeito de viajar.' : 'Conte seu jeito de viajar para ver primeiro o que combina com você.'}
            {!preferencias ? (
              <button type="button" className="r-btn alvo-toque" onClick={() => navegar('/perfil-viajante')} style={{ color: 'var(--azul)', fontWeight: 600, marginLeft: '4px' }}>Responder ↗</button>
            ) : null}
          </p>
        ) : null}
        <ul style={{ listStyle: 'none', margin: '6px 0 24px', padding: 0 }}>
          {!mapa ? lista.map((l) => <LinhaLugar key={l.id} l={l} aoAbrir={() => navegar(`/lugar/${l.id}${viagem ? `?viagem=${viagem}&dia=${params.get('dia') ?? 1}` : ''}`)} />) : null}
        </ul>
        {!lista.length ? (
          <p style={{ fontSize: '15px', color: 'var(--texto-sec)' }}>{filtro === 'salvos' ? 'Toque no ♡ de um lugar para guardar aqui.' : 'Nada encontrado. Tente outra palavra.'}</p>
        ) : null}
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}
