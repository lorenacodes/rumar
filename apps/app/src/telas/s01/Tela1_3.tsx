import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { useValorInicial } from '../../dev/demo';
import { BotaoPrincipal, BotaoTexto, Rodape } from '../../ui/pecas';
import { usePlano, type Plano } from '../../state/plano';

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
  const cidadeOk = cidade.trim().length >= 2;

  const continuar = () => {
    if (!cidadeOk) return;
    plano.atualizar({ cidade: cidade.trim(), idiomaApp, idiomasFalados: falados });
    navegar('/seu-plano');
  };

  return (
    <main className="tela" data-tela="1.3">
      <div style={{ height: '130px', background: 'linear-gradient(160deg,var(--amarelo) 0%,#8FB0F5 100%)', padding: '22px 20px 0', boxSizing: 'border-box', color: '#0B1F4B' }}>
        <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: '-0.04em' }}>rumar</div>
        <div style={{ font: "600 14px 'Open Sans'", marginTop: '22px' }}>Passo 1 de 3</div>
      </div>
      <div style={{ padding: '14px 20px 0' }}>
        <h1 style={{ margin: 0, font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Que bom ter você aqui.</h1>
        <label htmlFor="cidade" style={{ display: 'block', ...rotulo }}>
          Onde moro
        </label>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--texto)', padding: '4px 0' }}>
          <input
            id="cidade"
            className="r-input"
            value={cidade}
            placeholder="Sua cidade"
            autoComplete="address-level2"
            onChange={(e) => setCidade(e.target.value)}
            style={{ flex: '1', font: "600 22px/30px 'Lexend Exa'", letterSpacing: '-0.02em' }}
          />
          {cidadeOk ? <span style={{ color: 'var(--azul)', fontWeight: '600' }}>✓</span> : null}
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
