import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DESTINOS from '../../dados/destinos.json';
import { buscarCidades, carregarCidades, detalheCidade } from '../../lib/cidades';
import { favoritar, meusFavoritos, type Favorito } from '../../lib/social';
import { BotaoPrincipal, Rodape, Voltar } from '../../ui/pecas';
import { campo, Rotulo } from '../viagens/comum';

const chave = (nome: string, pais: string) => `${nome}|${pais}`;

/**
 * Destinos que despertam interesse (logo depois do cadastro e no perfil). Favoritar não é
 * marcar viagem: só ajuda o app a sugerir o que tem a ver com a pessoa.
 */
export function Destinos({ primeiraVez = false }: { primeiraVez?: boolean }) {
  const navegar = useNavigate();
  const [favs, setFavs] = useState<Favorito[]>([]);
  const [termo, setTermo] = useState('');
  const [pronta, setPronta] = useState(false);
  useEffect(() => {
    void meusFavoritos().then(setFavs);
    void carregarCidades().then(() => setPronta(true));
  }, []);
  const tem = (k: string) => favs.some((f) => f.chave === k);
  const alternar = async (f: Favorito) => {
    const sim = !tem(f.chave);
    setFavs((x) => (sim ? [...x, f] : x.filter((y) => y.chave !== f.chave)));
    await favoritar(f, sim);
  };
  const achados = pronta ? buscarCidades(termo, 6) : [];
  const populares = (DESTINOS as { destinos: { nome: string; pais: string }[] }).destinos;

  return (
    <main className="tela" data-tela="destinos" data-real="destinos">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        {!primeiraVez ? <Voltar /> : null}
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: primeiraVez ? '8px' : 0 }}>Destinos dos sonhos</div>
        <h1 style={{ margin: '6px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Que lugares você quer conhecer?</h1>
        <p style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>Marque quantos quiser, no Brasil ou fora. Não precisa ter data: é só para sugerirmos o que combina com você.</p>
        <label htmlFor="busca-destino" className="visualmente-oculto">Buscar cidade ou país</label>
        <input id="busca-destino" type="search" className="r-input" placeholder="Buscar cidade: Gramado, Buenos Aires…" value={termo} onChange={(e) => setTermo(e.target.value)} style={{ ...campo, marginTop: '12px' }} />
        {termo.trim().length >= 2 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
            {achados.map((c) => {
              const f = { chave: chave(c.nome, c.pais), nome: c.nome, regiao: c.regiao || null, pais: c.pais };
              return (
                <li key={f.chave + c.regiao}>
                  <button type="button" className="r-btn" aria-pressed={tem(f.chave)} onClick={() => void alternar(f)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', minHeight: '52px', borderBottom: '1px solid var(--linha)', textAlign: 'left' }}>
                    <span><b>{c.nome}</b><span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{detalheCidade(c) || c.pais}</span></span>
                    <span style={{ fontSize: '22px', color: tem(f.chave) ? 'var(--vermelho)' : 'var(--texto-sec)' }}>{tem(f.chave) ? '♥' : '♡'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
        <Rotulo>Mais procurados</Rotulo>
        <div role="group" aria-label="Destinos populares" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {populares.map((d) => {
            const f = { chave: chave(d.nome, d.pais), nome: d.nome, regiao: null, pais: d.pais };
            const sim = tem(f.chave);
            return (
              <button key={f.chave} type="button" role="checkbox" aria-checked={sim} className="r-btn" onClick={() => void alternar(f)}
                style={{ minHeight: '44px', padding: '0 12px', font: `${sim ? 600 : 500} 14px 'Open Sans'`, ...(sim ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>
                {sim ? `♥ ${d.nome}` : d.nome}
              </button>
            );
          })}
        </div>
        {favs.length ? <p style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>{favs.length} {favs.length === 1 ? 'destino favorito' : 'destinos favoritos'}: {favs.map((f) => f.nome).join(', ')}.</p> : null}
        <div style={{ height: '16px' }} />
      </div>
      <Rodape>
        <BotaoPrincipal onClick={() => navegar(primeiraVez ? '/inicio' : -1 as never)}>{primeiraVez ? (favs.length ? 'Continuar ↗' : 'Pular por agora') : 'Pronto ✓'}</BotaoPrincipal>
      </Rodape>
    </main>
  );
}
