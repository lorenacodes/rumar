import { useEffect, useState } from 'react';
import { Check } from '../../ui/check';
import { useNavigate } from 'react-router-dom';

import DESTINOS from '../../dados/destinos.json';
import { NOME_PAIS, rotuloDestino } from '../../lib/lugares';
import { EscolherDestino } from '../../ui/escolherDestino';
import { favoritar, meusFavoritos, type Favorito } from '../../lib/social';
import { BotaoPrincipal, Rodape, Voltar } from '../../ui/pecas';
import { Rotulo } from '../viagens/comum';

const chave = (nome: string, pais: string) => `${nome}|${pais}`;

/**
 * Destinos que despertam interesse (logo depois do cadastro e no perfil). Favoritar não é
 * marcar viagem: só ajuda o app a sugerir o que tem a ver com a pessoa.
 */
export function Destinos({ primeiraVez = false }: { primeiraVez?: boolean }) {
  const navegar = useNavigate();
  const [favs, setFavs] = useState<Favorito[]>([]);
  useEffect(() => {
    void meusFavoritos().then(setFavs);
  }, []);
  const tem = (k: string) => favs.some((f) => f.chave === k);
  const alternar = async (f: Favorito) => {
    const sim = !tem(f.chave);
    setFavs((x) => (sim ? [...x, f] : x.filter((y) => y.chave !== f.chave)));
    await favoritar(f, sim);
  };
  const populares = (DESTINOS as { destinos: { nome: string; pais: string }[] }).destinos;

  return (
    <main className="tela" data-tela="destinos" data-real="destinos">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        {!primeiraVez ? <Voltar /> : null}
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: primeiraVez ? '8px' : 0 }}>Destinos dos sonhos</div>
        <h1 style={{ margin: '6px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Que lugares você quer conhecer?</h1>
        <p style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>Marque quantos quiser, no Brasil ou fora. Não precisa ter data: é só para sugerirmos o que combina com você.</p>
        <div style={{ marginTop: '12px' }}>
          <EscolherDestino rotulo="Buscar cidade para favoritar" placeholder="Qualquer cidade: Bonito, Ouro Preto, Lisboa…" aoEscolher={(d) => {
            const f: Favorito = { chave: chave(d.nome, NOME_PAIS[d.pais] ?? d.pais), nome: d.nome, regiao: d.regiao, pais: NOME_PAIS[d.pais] ?? d.pais, destino_id: d.id };
            if (!tem(f.chave)) void alternar(f);
          }} />
        </div>
        {favs.length ? (
          <>
            <Rotulo>Seus favoritos</Rotulo>
            <div role="group" aria-label="Seus favoritos" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {favs.map((f) => (
                <button key={f.chave} type="button" className="r-btn" aria-label={`Tirar ${f.nome} dos favoritos`} onClick={() => void alternar(f)} style={{ minHeight: '44px', padding: '0 12px', background: 'var(--fundo-escuro)', color: '#fff', font: "600 14px 'Open Sans'" }}>
                  {f.destino_id ? rotuloDestino({ nome: f.nome, regiao: f.regiao, pais: f.destino_id.slice(0, 2).toUpperCase() }) : f.nome} ×
                </button>
              ))}
            </div>
          </>
        ) : null}
        <Rotulo>Mais procurados</Rotulo>
        <div role="group" aria-label="Destinos populares" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {populares.map((d) => {
            const f = { chave: chave(d.nome, d.pais), nome: d.nome, regiao: null, pais: d.pais };
            const sim = tem(f.chave);
            return (
              <button key={f.chave} type="button" role="checkbox" aria-checked={sim} className="r-btn" onClick={() => void alternar(f)}
                style={{ minHeight: '44px', padding: '0 12px', font: `${sim ? 600 : 500} 14px 'Open Sans'`, ...(sim ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>
                {sim ? <><Check />{d.nome}</> : d.nome}
              </button>
            );
          })}
        </div>
        <div style={{ height: '16px' }} />
      </div>
      <Rodape>
        <BotaoPrincipal onClick={() => navegar(primeiraVez ? '/inicio' : -1 as never)}>{primeiraVez ? (favs.length ? 'Continuar ↗' : 'Pular por agora') : 'Pronto'}</BotaoPrincipal>
      </Rodape>
    </main>
  );
}
