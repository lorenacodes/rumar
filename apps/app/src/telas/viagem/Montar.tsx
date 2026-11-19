import { useState, type ReactNode } from 'react';
import { hojeLocal } from '../../lib/datas';
import { NOME_COZINHA, NOME_DIETA, ORDEM_COZINHAS, type Dieta } from '../../lib/comida';
import { NOME_AREA, ORDEM_AREAS } from '../../lib/networking';
import { Info } from '../../ui/info';
import { Rotulo } from '../viagens/comum';
import { Check } from '../../ui/check';
import { useNavigate } from 'react-router-dom';

import { CIDADE } from '../../lib/catalogo';
import type { Estilo, Evitar, Gosto, Preferencias } from '../../lib/planejador';
import { useViajante } from '../../state/viajante';
import { BotaoPrincipal, Rodape, Voltar } from '../../ui/pecas';

const ESTILOS: { id: Estilo; titulo: string; texto: string }[] = [
  { id: 'cultural', titulo: 'Cultural', texto: 'Museus, arquitetura, história e monumentos.' },
  { id: 'gastronomico', titulo: 'Gastronômico', texto: 'Restaurantes, cafés, mercados e sabores locais.' },
  { id: 'agitado', titulo: 'Agitado', texto: 'Bares, festas, shows e vida noturna.' },
  { id: 'praia', titulo: 'Praia e descanso', texto: 'Praia, sol e pouco compromisso.' },
  { id: 'relaxante', titulo: 'Relaxante', texto: 'Parques, passeios tranquilos e tempo para descansar.' },
  { id: 'aventureiro', titulo: 'Aventureiro', texto: 'Ar livre, trilhas e experiências diferentes.' },
  { id: 'compras', titulo: 'Compras', texto: 'Lojas, feiras, brechós e centros comerciais.' },
  { id: 'equilibrado', titulo: 'Equilibrado', texto: 'Um pouco de cada coisa.' },
];
const GOSTOS: { id: Gosto; nome: string }[] = [
  { id: 'museus', nome: 'Museus e história' },
  { id: 'comer', nome: 'Comer bem' },
  { id: 'cafes', nome: 'Cafés e doces' },
  { id: 'feiras', nome: 'Feiras e mercados' },
  { id: 'parques', nome: 'Parques' },
  { id: 'fotos', nome: 'Fotografar' },
  { id: 'compras', nome: 'Compras' },
  { id: 'noite', nome: 'Sair à noite' },
  { id: 'gente', nome: 'Conhecer gente' },
  { id: 'lgbt', nome: 'Cena LGBTQIA+' },
];
const EVITAR: { id: Evitar; nome: string }[] = [
  { id: 'lotados', nome: 'Lugares muito cheios' },
  { id: 'caros', nome: 'Atividades caras' },
  { id: 'festas', nome: 'Festas e baladas' },
  { id: 'longos', nome: 'Caminhadas longas' },
  { id: 'cultura', nome: 'Museus e programas culturais' },
];

const PADRAO: Preferencias = {
  estilo: 'equilibrado', gostos: [], ritmo: 'balanced', evitar: [], orcamento: 'intermediario',
  gratuitos: false, periodo: 'ambos', local: false, deslocamento: 'ambos',
  dieta: 'tudo', cozinhasAmo: [], cozinhasEvito: [], provar: true, networking: false, area: null,
};

const hojeMais = (dias: number): string => hojeLocal(dias);

/** Linha de escolha única, no visual da 3.1 do design. */
function Opcao({ marcada, aoTocar, titulo, texto }: { marcada: boolean; aoTocar: () => void; titulo: string; texto?: string }) {
  return (
    <button type="button" role="radio" aria-checked={marcada} className="r-btn" onClick={aoTocar}
      style={{ width: '100%', boxSizing: 'border-box', textAlign: 'left', border: marcada ? '2px solid var(--texto)' : '1px solid var(--linha)', padding: marcada ? '11px 13px' : '12px 14px', marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'center', minHeight: '56px' }}>
      <span aria-hidden style={{ width: '22px', height: '22px', border: '2px solid var(--texto)', borderRadius: '50%', boxSizing: 'border-box', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {marcada ? <i style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--fundo-escuro)' }} /> : null}
      </span>
      <span>
        <span style={{ display: 'block', font: "600 16px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{titulo}</span>
        {texto ? <span style={{ display: 'block', fontSize: '14px', lineHeight: '19px', color: 'var(--texto-sec)' }}>{texto}</span> : null}
      </span>
    </button>
  );
}

/** Opção que marca e desmarca (várias ao mesmo tempo), no visual dos chips do design. */
function Marcar({ marcada, aoTocar, children, unico }: { marcada: boolean; aoTocar: () => void; children: string; unico?: boolean }) {
  return (
    <button type="button" role={unico ? 'radio' : 'checkbox'} aria-checked={marcada} className="r-btn" onClick={aoTocar}
      style={{ minHeight: '48px', padding: '0 14px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', font: `${marcada ? 600 : 500} 15px 'Open Sans'`, ...(marcada ? { background: 'var(--fundo-escuro)', color: '#fff' } : { border: '1px solid var(--linha)' }) }}>
      {marcada ? <><Check />{children}</> : children}
    </button>
  );
}

const Grupo = ({ children, rotulo }: { children: ReactNode; rotulo: string }) => (
  <div role="group" aria-label={rotulo} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>{children}</div>
);
const Subtitulo = ({ children }: { children: ReactNode }) => (
  <div style={{ font: "600 15px 'Open Sans'", color: 'var(--texto-sec)', margin: '18px 0 0' }}>{children}</div>
);

/**
 * Montar a viagem: cidade e datas + descoberta do perfil de viajante, em etapas curtas.
 * Em /perfil-viajante, só as perguntas do perfil (para mudar depois).
 */
export function Montar({ soPerfil = false }: { soPerfil?: boolean }) {
  const navegar = useNavigate();
  const { preferencias, viagem, definirPreferencias, definirViagem } = useViajante();
  const [p, setP] = useState<Preferencias>(preferencias ?? PADRAO);
  const [dataIda, setDataIda] = useState(viagem?.dataIda ?? hojeMais(60));
  const [noites, setNoites] = useState(viagem?.noites ?? 5);
  const etapas = soPerfil ? ['estilo', 'gostos', 'comida', 'ritmo', 'evitar', 'trabalho', 'orcamento'] : ['viagem', 'estilo', 'gostos', 'comida', 'ritmo', 'evitar', 'trabalho', 'orcamento'];
  const [i, setI] = useState(0);
  const etapa = etapas[i];
  const [salvando, setSalvando] = useState(false);
  const muda = (parcial: Partial<Preferencias>) => setP((x) => ({ ...x, ...parcial }));
  const alterna = <T,>(lista: T[], v: T) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);

  const dataOk = dataIda >= hojeMais(0);
  const podeSeguir = etapa === 'viagem' ? dataOk : etapa === 'gostos' ? p.gostos.length > 0 : true;

  const seguir = async () => {
    if (!podeSeguir) return;
    if (i < etapas.length - 1) return setI(i + 1);
    setSalvando(true);
    await definirPreferencias(p);
    if (!soPerfil) await definirViagem({ destino: CIDADE, dataIda, noites });
    setSalvando(false);
    if (soPerfil) navegar(-1);
    else navegar('/viagens/nova', { replace: true });
  };

  return (
    <main className="tela" data-tela="montar" data-real="montar">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <Voltar />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '2px' }}>
          <span style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>{soPerfil ? 'Meu jeito de viajar' : 'Montar minha viagem'}</span>
          <span style={{ font: "600 14px 'Open Sans'", color: 'var(--texto-sec)' }}>Passo {i + 1} de {etapas.length}</span>
        </div>
        <div aria-hidden style={{ height: '4px', background: 'var(--linha)', marginTop: '8px' }}>
          <div style={{ width: `${((i + 1) / etapas.length) * 100}%`, height: '4px', background: 'var(--amarelo)', transition: 'width 150ms' }} />
        </div>

        {etapa === 'viagem' ? (
          <>
            <h1 style={titulo}>Para onde e quando?</h1>
            <Subtitulo>Destino</Subtitulo>
            <div style={{ font: "600 22px 'Lexend Exa'", marginTop: '6px' }}>{CIDADE}</div>
            <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)' }}>Primeira cidade com roteiro pronto. Outras chegam em breve.</div>
            <Subtitulo>
              <label htmlFor="data-ida">Data de ida</label>
            </Subtitulo>
            <input id="data-ida" type="date" className="r-input" value={dataIda} min={hojeMais(0)} onChange={(e) => setDataIda(e.target.value)}
              style={{ display: 'block', width: '100%', boxSizing: 'border-box', borderBottom: '2px solid var(--texto)', padding: '8px 0', font: "500 19px 'Open Sans'", color: 'var(--texto)', background: 'transparent' }} />
            {!dataOk ? <div role="alert" style={{ color: 'var(--vermelho)', fontSize: '14px', marginTop: '6px' }}>Escolha uma data a partir de hoje.</div> : null}
            <Subtitulo>Quantas noites</Subtitulo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <button type="button" className="r-btn" aria-label="Menos uma noite" onClick={() => setNoites((n) => Math.max(1, n - 1))} style={passo}>−</button>
              <output aria-live="polite" style={{ font: "600 26px 'Lexend Exa'", minWidth: '40px', textAlign: 'center' }}>{noites}</output>
              <button type="button" className="r-btn" aria-label="Mais uma noite" onClick={() => setNoites((n) => Math.min(14, n + 1))} style={passo}>+</button>
              <span style={{ color: 'var(--texto-sec)', fontSize: '15px' }}>{noites === 1 ? 'noite' : 'noites'} · {noites + 1} dias</span>
            </div>
          </>
        ) : null}

        {etapa === 'estilo' ? (
          <>
            <h1 style={titulo}>Qual estilo de viagem combina mais com você?</h1>
            <div role="radiogroup" aria-label="Estilo de viagem">
              {ESTILOS.map((e) => <Opcao key={e.id} marcada={p.estilo === e.id} aoTocar={() => muda({ estilo: e.id })} titulo={e.titulo} texto={e.texto} />)}
            </div>
          </>
        ) : null}

        {etapa === 'gostos' ? (
          <>
            <h1 style={titulo}>O que você mais gosta de fazer numa cidade?</h1>
            <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '6px' }}>Escolha quantos quiser.</div>
            <Grupo rotulo="Gostos">
              {GOSTOS.map((g) => <Marcar key={g.id} marcada={p.gostos.includes(g.id)} aoTocar={() => muda({ gostos: alterna(p.gostos, g.id) })}>{g.nome}</Marcar>)}
            </Grupo>
            {!p.gostos.length ? <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '12px' }}>Marque pelo menos uma opção para seguir.</div> : null}
          </>
        ) : null}

        {etapa === 'comida' ? (
          <>
            <h1 style={titulo}>E na comida?</h1>
            <div role="radiogroup" aria-label="Alimentação" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
              {(['tudo', 'vegetariana', 'vegana', 'pescetariana'] as Dieta[]).map((d) => <Marcar key={d} unico marcada={(p.dieta ?? 'tudo') === d} aoTocar={() => muda({ dieta: d })}>{NOME_DIETA[d]}</Marcar>)}
            </div>
            <Rotulo>Adoro</Rotulo>
            <Grupo rotulo="Cozinhas que adoro">
              {ORDEM_COZINHAS.map((c) => <Marcar key={c} marcada={(p.cozinhasAmo ?? []).includes(c)} aoTocar={() => muda({ cozinhasAmo: alterna(p.cozinhasAmo ?? [], c), cozinhasEvito: (p.cozinhasEvito ?? []).filter((x) => x !== c) })}>{NOME_COZINHA[c]}</Marcar>)}
            </Grupo>
            <Rotulo>Não quero no roteiro</Rotulo>
            <Grupo rotulo="Cozinhas que não quero">
              {ORDEM_COZINHAS.map((c) => <Marcar key={c} marcada={(p.cozinhasEvito ?? []).includes(c)} aoTocar={() => muda({ cozinhasEvito: alterna(p.cozinhasEvito ?? [], c), cozinhasAmo: (p.cozinhasAmo ?? []).filter((x) => x !== c) })}>{NOME_COZINHA[c]}</Marcar>)}
            </Grupo>
            <div style={{ marginTop: '14px' }}>
              <Marcar marcada={p.provar !== false} aoTocar={() => muda({ provar: !(p.provar !== false) })}>Quero provar a comida típica do lugar</Marcar>
            </div>
            <Info rotulo="Sobre os restaurantes" style={{ marginTop: '10px' }}>Usamos o tipo de cozinha informado no mapa. Muitos restaurantes não dizem se têm opção vegetariana: confira no local.</Info>
          </>
        ) : null}

        {etapa === 'ritmo' ? (
          <>
            <h1 style={titulo}>Qual ritmo você prefere?</h1>
            <div role="radiogroup" aria-label="Ritmo">
              <Opcao marcada={p.ritmo === 'calm'} aoTocar={() => muda({ ritmo: 'calm' })} titulo="Tranquilo" texto="Poucos compromissos e mais tempo em cada lugar." />
              <Opcao marcada={p.ritmo === 'balanced'} aoTocar={() => muda({ ritmo: 'balanced' })} titulo="Equilibrado" texto="Aproveitar o dia sem correria." />
              <Opcao marcada={p.ritmo === 'intense'} aoTocar={() => muda({ ritmo: 'intense' })} titulo="Intenso" texto="Conhecer o máximo possível." />
            </div>
            <Subtitulo>Você prefere programas de</Subtitulo>
            <Grupo rotulo="Período">
              <Marcar unico marcada={p.periodo === 'dia'} aoTocar={() => muda({ periodo: 'dia' })}>Dia</Marcar>
              <Marcar unico marcada={p.periodo === 'noite'} aoTocar={() => muda({ periodo: 'noite' })}>Noite</Marcar>
              <Marcar unico marcada={p.periodo === 'ambos'} aoTocar={() => muda({ periodo: 'ambos' })}>Os dois</Marcar>
            </Grupo>
          </>
        ) : null}

        {etapa === 'evitar' ? (
          <>
            <h1 style={titulo}>Tem algo que você prefere evitar?</h1>
            <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '6px' }}>Opcional. O roteiro deixa isso de fora.</div>
            <Grupo rotulo="Evitar">
              {EVITAR.map((e) => <Marcar key={e.id} marcada={p.evitar.includes(e.id)} aoTocar={() => muda({ evitar: alterna(p.evitar, e.id) })}>{e.nome}</Marcar>)}
            </Grupo>
          </>
        ) : null}

        {etapa === 'trabalho' ? (
          <>
            <h1 style={titulo}>Também vai trabalhar ou fazer networking?</h1>
            <div role="radiogroup" aria-label="Trabalho e networking" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
              <Marcar unico marcada={!p.networking} aoTocar={() => muda({ networking: false })}>Não, é só lazer</Marcar>
              <Marcar unico marcada={Boolean(p.networking)} aoTocar={() => muda({ networking: true })}>Sim</Marcar>
            </div>
            {p.networking ? (
              <>
                <Rotulo>Minha área</Rotulo>
                <div role="radiogroup" aria-label="Área" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ORDEM_AREAS.map((a) => <Marcar key={a} unico marcada={p.area === a} aoTocar={() => muda({ area: a })}>{NOME_AREA[a]}</Marcar>)}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '10px' }}>Mostramos coworkings, hubs de inovação e eventos da sua área.</div>
              </>
            ) : null}
          </>
        ) : null}

        {etapa === 'orcamento' ? (
          <>
            <h1 style={titulo}>Quanto quer gastar com passeios?</h1>
            <div role="radiogroup" aria-label="Orçamento">
              <Opcao marcada={p.orcamento === 'economico'} aoTocar={() => muda({ orcamento: 'economico' })} titulo="Econômico" texto="Priorizar o que é barato ou grátis." />
              <Opcao marcada={p.orcamento === 'intermediario'} aoTocar={() => muda({ orcamento: 'intermediario' })} titulo="Intermediário" texto="Algumas atrações pagas e menos lugares comuns." />
              <Opcao marcada={p.orcamento === 'conforto'} aoTocar={() => muda({ orcamento: 'conforto' })} titulo="Conforto" texto="Experiências especiais, quase nada do comum." />
            </div>
            <Grupo rotulo="Preferências">
              <Marcar marcada={p.gratuitos} aoTocar={() => muda({ gratuitos: !p.gratuitos })}>Gosto de programas grátis</Marcar>
              <Marcar marcada={p.local} aoTocar={() => muda({ local: !p.local })}>Prefiro lugares menos turísticos</Marcar>
              <Marcar marcada={p.diferente === true} aoTocar={() => muda({ diferente: !p.diferente })}>Quero experiências diferentes, fora do comum</Marcar>
            </Grupo>
            <Subtitulo>Para se locomover</Subtitulo>
            <Grupo rotulo="Deslocamento">
              <Marcar unico marcada={p.deslocamento === 'caminhar'} aoTocar={() => muda({ deslocamento: 'caminhar' })}>Gosto de caminhar</Marcar>
              <Marcar unico marcada={p.deslocamento === 'transporte'} aoTocar={() => muda({ deslocamento: 'transporte' })}>Prefiro transporte</Marcar>
              <Marcar unico marcada={p.deslocamento === 'ambos'} aoTocar={() => muda({ deslocamento: 'ambos' })}>Tanto faz</Marcar>
            </Grupo>
          </>
        ) : null}
        <div style={{ height: '16px' }} />
      </div>
      <Rodape>
        <BotaoPrincipal onClick={() => void seguir()} disabled={!podeSeguir || salvando}>
          {i < etapas.length - 1 ? 'Continuar' : soPerfil ? 'Salvar' : salvando ? 'Montando…' : 'Montar meu roteiro'}
        </BotaoPrincipal>
        {i > 0 ? (
          <button type="button" className="r-btn" onClick={() => setI(i - 1)} style={{ width: '100%', height: '44px', marginTop: '4px', font: "600 15px 'Open Sans'", color: 'var(--texto-sec)' }}>
            Voltar uma etapa
          </button>
        ) : null}
      </Rodape>
    </main>
  );
}

const titulo = { margin: '18px 0 0', font: "600 24px/30px 'Lexend Exa'", letterSpacing: '-0.02em' } as const;
const passo = { width: '48px', height: '48px', border: '2px solid var(--texto)', font: "600 22px 'Open Sans'", display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;
