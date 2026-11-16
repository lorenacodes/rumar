import { useEffect, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { useValorInicial } from '../../dev/demo';
import { BotaoPrincipal, BotaoTexto, Rodape } from '../../ui/pecas';
import { buscarCidades, carregarCidades, detalheCidade, rotuloCidade, type Cidade } from '../../lib/cidades';
import { ORIGEM_ANA, usePlano, type Plano } from '../../state/plano';

const IDIOMAS_APP: { id: Plano['idiomaApp']; nome: string }[] = [
  { id: 'pt', nome: 'Português' },
  { id: 'en', nome: 'English' },
  { id: 'es', nome: 'Español' },
  { id: 'fr', nome: 'Français' },
];
const IDIOMAS_FALADOS = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Italiano', 'Outro'];

const rotulo: CSSProperties = { font: "600 15px 'Open Sans'", color: 'var(--texto-sec)', margin: '16px 0 6px' };

function Chip({ marcado, aoTocar, children }: { marcado: boolean; aoTocar: () => void; children: string }) {
  return (
    <button
      type="button"
      className="r-btn"
      role="checkbox"
      aria-checked={marcado}
      onClick={aoTocar}
      style={
        marcado
          ? { height: '48px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '6px', font: "600 15px 'Open Sans'", boxSizing: 'border-box', background: 'var(--fundo-escuro)', color: '#fff' }
          : { height: '48px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '6px', font: "500 15px 'Open Sans'", boxSizing: 'border-box', border: '1px solid var(--linha)' }
      }>
      {marcado ? `✓ ${children}` : children}
    </button>
  );
}

/** 1.3 Boas-vindas — passo 1 de 3: cidade e idiomas. */
export function Tela1_3() {
  const navegar = useNavigate();
  const plano = usePlano();
  const [cidade, setCidade] = useState(useValorInicial('Aracaju, Brasil', plano.cidade));
  const [idiomaApp, setIdiomaApp] = useState(useValorInicial<Plano['idiomaApp']>('pt', plano.idiomaApp));
  const [falados, setFalados] = useState<string[]>(useValorInicial(['Português', 'Inglês'], plano.idiomasFalados));
  const [origem, setOrigem] = useState<Cidade | null>(useValorInicial<Cidade | null>(ORIGEM_ANA, plano.origem));
  const [aberta, setAberta] = useState(false);
  const [pronta, setPronta] = useState(false);
  // Só vale cidade escolhida na lista: é dela que vêm os aeroportos e os custos.
  const cidadeOk = origem !== null;
  const sugestoes = aberta && pronta && !cidadeOk ? buscarCidades(cidade) : [];

  useEffect(() => {
    let vivo = true;
    void carregarCidades().then(() => vivo && setPronta(true));
    return () => {
      vivo = false;
    };
  }, []);

  const escolher = (c: Cidade) => {
    setOrigem(c);
    setCidade(rotuloCidade(c));
    setAberta(false);
  };

  const continuar = () => {
    if (!cidadeOk) return;
    plano.atualizar({ cidade: cidade.trim(), origem, idiomaApp, idiomasFalados: falados });
    navegar('/seu-plano');
  };

  return (
    <main className="tela" data-tela="1.3">
      <div style={{ height: '130px', background: 'linear-gradient(160deg,var(--amarelo) 0%,#8FB0F5 100%)', padding: '22px 20px 0', boxSizing: 'border-box', color: '#0B1F4B' }}>
        <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: '-0.04em' }}>bo vair</div>
        <div style={{ font: "600 14px 'Open Sans'", marginTop: '22px' }}>Passo 1 de 3</div>
      </div>
      <div style={{ padding: '14px 20px 0' }}>
        <h1 style={{ margin: 0, font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Que bom ter você aqui.</h1>
        <label htmlFor="cidade" style={{ display: 'block', ...rotulo }}>
          Onde moro
        </label>
        <label htmlFor="cidade" style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--texto)', padding: '4px 0' }}>
          <input
            id="cidade"
            className="r-input"
            value={cidade}
            placeholder="Sua cidade"
            autoComplete="off"
            role="combobox"
            aria-expanded={sugestoes.length > 0}
            aria-controls="cidades-sugeridas"
            aria-autocomplete="list"
            onFocus={() => setAberta(true)}
            onChange={(e) => {
              setCidade(e.target.value);
              setOrigem(null);
              setAberta(true);
            }}
            style={{ flex: '1', font: "600 22px/30px 'Lexend Exa'", letterSpacing: '-0.02em' }}
          />
          {cidadeOk ? <span style={{ color: 'var(--azul)', fontWeight: '600' }}>✓</span> : null}
        </label>
        <div style={{ position: 'relative' }}>
          {sugestoes.length > 0 ? (
            <ul id="cidades-sugeridas" role="listbox" aria-label="Cidades" style={{ position: 'absolute', zIndex: 2, left: 0, right: 0, top: 0, margin: 0, padding: 0, listStyle: 'none', background: 'var(--fundo)', border: '1px solid var(--linha)', borderTop: 'none', boxShadow: '0 8px 16px rgba(11,31,75,0.12)' }}>
              {sugestoes.map((c) => (
                <li key={`${c.nome}|${c.regiao}|${c.pais}`} role="option" aria-selected={false}>
                  <button type="button" className="r-btn" onClick={() => escolher(c)} style={{ width: '100%', minHeight: '56px', padding: '8px 12px', boxSizing: 'border-box', textAlign: 'left', borderBottom: '1px solid var(--linha)', display: 'block' }}>
                    <span style={{ display: 'block', font: "600 16px/22px 'Open Sans'" }}>{c.nome}</span>
                    <span style={{ display: 'block', font: "400 14px/20px 'Open Sans'", color: 'var(--texto-sec)' }}>{detalheCidade(c)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : aberta && pronta && !cidadeOk && cidade.trim().length >= 2 ? (
            <div role="status" style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '6px' }}>
              Não achamos essa cidade. Confira a grafia ou digite a cidade grande mais perto.
            </div>
          ) : !cidadeOk && cidade.trim().length >= 2 && pronta ? (
            <div role="status" style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '6px' }}>
              Escolha sua cidade na lista para calcularmos os custos.
            </div>
          ) : null}
        </div>
        <div style={rotulo} id="idioma-app">
          Idioma do app
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} role="group" aria-labelledby="idioma-app">
          {IDIOMAS_APP.map((i) => (
            <Chip key={i.id} marcado={idiomaApp === i.id} aoTocar={() => setIdiomaApp(i.id)}>
              {i.nome}
            </Chip>
          ))}
        </div>
        <div style={rotulo} id="idiomas-falados">
          Idiomas que falo
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} role="group" aria-labelledby="idiomas-falados">
          {IDIOMAS_FALADOS.map((nome) => (
            <Chip
              key={nome}
              marcado={falados.includes(nome)}
              aoTocar={() => setFalados((f) => (f.includes(nome) ? f.filter((x) => x !== nome) : [...f, nome]))}>
              {nome}
            </Chip>
          ))}
        </div>
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '12px' }}>
          Assim avisamos onde você pode precisar de ajuda com o idioma. Dá para mudar depois.
        </div>
      </div>
      <Rodape>
        <BotaoPrincipal onClick={continuar} disabled={!cidadeOk}>
          Continuar ↗
        </BotaoPrincipal>
        <BotaoTexto marginTop="4px" onClick={() => navegar('/entrar')}>
          Já tenho conta · Entrar
        </BotaoTexto>
      </Rodape>
    </main>
  );
}
