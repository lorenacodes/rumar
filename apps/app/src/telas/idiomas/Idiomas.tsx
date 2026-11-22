import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  ehIdioma, falar, IDIOMAS, linkVideoAula, marcarAula, meuProgresso, miniaturaAula, percentual, temVoz, trilha,
  type AulaIdioma, type CodigoIdioma, type Modulo,
} from '../../lib/idiomas';
import { eu } from '../../lib/viagens';
import { Abas } from '../../ui/abas';
import { Check } from '../../ui/check';
import { Info } from '../../ui/info';
import { Voltar } from '../../ui/pecas';
import { Praticar } from './Praticar';
import '../../styles/idiomas.css';

const CHAVE = 'bovair.idioma';
const lembrar = (c: CodigoIdioma) => { try { localStorage.setItem(CHAVE, c); } catch { /* sem armazenamento: tudo bem */ } };
const lembrado = (): CodigoIdioma => { try { const x = localStorage.getItem(CHAVE) ?? ''; return ehIdioma(x) ? x : 'en'; } catch { return 'en'; } };

/** /idiomas: abre o último idioma usado (ou inglês). */
export function IdiomasInicio() {
  const [params] = useSearchParams();
  return <Navigate to={`/idiomas/${lembrado()}${params.toString() ? `?${params}` : ''}`} replace />;
}

/** Dados da trilha + progresso da pessoa, com marcar/desmarcar. */
function useTrilha(idioma: CodigoIdioma) {
  const [dados, setDados] = useState<{ modulos: Modulo[]; aulas: AulaIdioma[] } | null | undefined>(undefined);
  const [feitas, setFeitas] = useState<Set<string>>(new Set());
  const [logada, setLogada] = useState<boolean | null>(null);
  useEffect(() => {
    setDados(undefined);
    void trilha(idioma).then(setDados, () => setDados(null));
    void eu().then((u) => setLogada(Boolean(u)));
    void meuProgresso().then(setFeitas);
  }, [idioma]);
  const alternar = async (aulaId: string, assistida: boolean) => {
    const antes = feitas;
    const novo = new Set(feitas); if (assistida) novo.add(aulaId); else novo.delete(aulaId);
    setFeitas(novo);
    if (!(await marcarAula(aulaId, assistida))) setFeitas(antes);
  };
  return { dados, feitas, logada, alternar };
}

function Barra({ valor }: { valor: number }) {
  return <span className="idi-barra" aria-hidden="true"><span style={{ width: `${valor}%` }} /></span>;
}

function SemConta() {
  const navegar = useNavigate();
  return (
    <p className="idi-semconta">
      <button type="button" className="r-btn" onClick={() => navegar('/entrar')}>Entre na sua conta</button> para salvar o que você já viu.
    </p>
  );
}

/** Marcar aula: dois estados claros, não assistida ou assistida. */
function Status({ aula, feita, logada, aoMudar, grande }: { aula: AulaIdioma; feita: boolean; logada: boolean | null; aoMudar: (id: string, v: boolean) => void; grande?: boolean }) {
  if (grande) {
    return (
      <div role="radiogroup" aria-label="Status da aula" className="idi-status-grande">
        {[false, true].map((v) => (
          <button key={String(v)} type="button" role="radio" aria-checked={feita === v} disabled={!logada} className="r-btn" onClick={() => aoMudar(aula.id, v)}>
            {v ? <><Check cor={feita ? '#fff' : 'var(--verde)'} />Assistida</> : 'Não assistida'}
          </button>
        ))}
      </div>
    );
  }
  return (
    <button type="button" className={`r-btn idi-marca${feita ? ' feita' : ''}`} aria-pressed={feita} disabled={!logada}
      aria-label={`${aula.titulo}: ${feita ? 'assistida' : 'não assistida'}`} onClick={() => aoMudar(aula.id, !feita)}>
      {feita ? <Check cor="#fff" /> : null}
    </button>
  );
}

/** /idiomas/:idioma (lista de módulos), /idiomas/:idioma/m/:modulo e /idiomas/:idioma/aula/:aula. */
export function Idiomas() {
  const { idioma: cod = '', modulo: moduloId, aula: aulaId } = useParams();
  const [params] = useSearchParams();
  const navegar = useNavigate();
  const idioma: CodigoIdioma = ehIdioma(cod) ? cod : 'en';
  const { dados, feitas, logada, alternar } = useTrilha(idioma);
  const [previa, setPrevia] = useState<string | null>(null);
  const [praticando, setPraticando] = useState<string | null>(null);
  useEffect(() => setPraticando(null), [aulaId]);
  useEffect(() => { if (ehIdioma(cod)) lembrar(cod); }, [cod]);
  if (!ehIdioma(cod)) return <Navigate to="/idiomas" replace />;

  const viagem = params.get('viagem');
  const sufixo = viagem ? `?viagem=${viagem}` : '';
  const nome = IDIOMAS.find((i) => i.codigo === idioma)!.nome;
  const corpo = (filho: React.ReactNode, voltar: { para: string; rotulo: string }) => (
    <main className="tela" data-tela="idiomas" data-real="idiomas">
      <div className="idi">
        <Voltar para={voltar.para} rotulo={voltar.rotulo} />
        {filho}
      </div>
      <Abas ativa="viagem" />
    </main>
  );
  if (dados === undefined) return corpo(<p aria-busy="true" className="idi-sec">Carregando as aulas…</p>, { para: viagem ? `/viagem/${viagem}` : '/perfil', rotulo: viagem ? 'Viagem' : 'Voltar' });
  if (dados === null) return corpo(<p className="idi-sec">Não conseguimos abrir as aulas. Confira a internet e tente de novo.</p>, { para: viagem ? `/viagem/${viagem}` : '/perfil', rotulo: 'Voltar' });

  const { modulos, aulas } = dados;
  const doModulo = (id: string) => aulas.filter((a) => a.modulo_id === id).sort((a, b) => a.ordem - b.ordem);
  const feitasDe = (lista: AulaIdioma[]) => lista.filter((a) => feitas.has(a.id)).length;
  const emergencia = modulos.find((m) => m.emergencia);

  // --- Uma aula ---
  if (aulaId) {
    const aula = aulas.find((a) => a.id === aulaId);
    if (!aula) return <Navigate to={`/idiomas/${idioma}${sufixo}`} replace />;
    const mod = modulos.find((m) => m.id === aula.modulo_id)!;
    const lista = doModulo(mod.id);
    const proxima = lista.find((a) => a.ordem > aula.ordem);
    const voz = temVoz();
    return corpo(
      <article aria-label={aula.titulo}>
        <div className="idi-sobre">{mod.nome} · {nome}</div>
        <h1 className="idi-h1">{aula.titulo}</h1>
        <div className="idi-sec">{aula.duracao_min} min</div>
        <p className="idi-contexto">{aula.contexto}</p>

        <h2 className="idi-h2">Frases essenciais</h2>
        <ul className="idi-frases">
          {aula.frases.map((f) => (
            <li key={f.orig}>
              <div className="idi-frase-topo">
                <span lang={idioma} className="idi-orig">{f.orig}</span>
                <span className="idi-frase-acoes">
                  {voz ? (
                    <button type="button" className="r-btn idi-ouvir" aria-label={`Ouvir: ${f.orig}`} onClick={() => void falar(f.orig, idioma)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z" /><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" /></svg>
                    </button>
                  ) : null}
                  <button type="button" className={`r-btn idi-ouvir${praticando === f.orig ? ' ativo' : ''}`} aria-label={`Praticar: ${f.orig}`} aria-expanded={praticando === f.orig}
                    onClick={() => setPraticando(praticando === f.orig ? null : f.orig)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" /><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></svg>
                  </button>
                </span>
              </div>
              <span className="idi-pron">Pronúncia: {f.pron}</span>
              <span className="idi-pt">{f.pt}</span>
              {praticando === f.orig ? <Praticar texto={f.orig} idioma={idioma} aoFechar={() => setPraticando(null)} /> : null}
            </li>
          ))}
        </ul>

        <h2 className="idi-h2">Diálogo</h2>
        <ol className="idi-dialogo">
          {aula.dialogo.map((d, i) => (
            <li key={i} className={d.quem === 'Você' ? 'voce' : ''}>
              <b>{d.quem}</b>
              <span lang={idioma} className="idi-orig-p">{d.orig}</span>
              <span className="idi-pt">{d.pt}</span>
              {voz ? <button type="button" className="r-btn idi-ouvir pequeno" aria-label={`Ouvir: ${d.orig}`} onClick={() => void falar(d.orig, idioma)}>Ouvir</button> : null}
            </li>
          ))}
        </ol>

        <div className="idi-dica"><b>Dica</b>{aula.dica}</div>

        {aula.video_id ? (
          <a className="idi-video" href={linkVideoAula(aula.video_id)} target="_blank" rel="noreferrer">
            <img src={miniaturaAula(aula.video_id)} alt="" loading="lazy" />
            <span><b>Vídeo para praticar</b>Escolhido a dedo. Abre no YouTube.</span>
          </a>
        ) : null}

        <h2 className="idi-h2">Você já viu esta aula?</h2>
        <Status aula={aula} feita={feitas.has(aula.id)} logada={logada} aoMudar={(id, v) => void alternar(id, v)} grande />
        {logada === false ? <SemConta /> : null}
        {proxima ? (
          <button type="button" className="r-btn idi-proxima" onClick={() => navegar(`/idiomas/${idioma}/aula/${proxima.id}${sufixo}`)}>Próxima aula: {proxima.titulo} ›</button>
        ) : null}
        <p className="idi-nota">A pronúncia escrita é aproximada. Toque no microfone para gravar você falando e comparar.</p>
      </article>,
      { para: `/idiomas/${idioma}/m/${mod.id}${sufixo}`, rotulo: mod.nome },
    );
  }

  // --- Um módulo ---
  if (moduloId) {
    const mod = modulos.find((m) => m.id === moduloId);
    if (!mod) return <Navigate to={`/idiomas/${idioma}${sufixo}`} replace />;
    const lista = doModulo(mod.id);
    const f = feitasDe(lista);
    return corpo(
      <section aria-label={mod.nome}>
        <div className="idi-sobre">{nome} para viagem</div>
        <h1 className="idi-h1">{mod.nome}</h1>
        <p className="idi-contexto">{mod.descricao}</p>
        <div className="idi-resumo"><span>{f} de {lista.length} assistidas</span><b>{percentual(f, lista.length)}%</b></div>
        <Barra valor={percentual(f, lista.length)} />
        {logada === false ? <SemConta /> : null}
        <ul className="idi-aulas" aria-label="Aulas">
          {lista.map((a, i) => (
            <li key={a.id}>
              <div className="idi-linha">
                <button type="button" className="r-btn idi-aula" onClick={() => navegar(`/idiomas/${idioma}/aula/${a.id}${sufixo}`)}>
                  <span className="idi-num" aria-hidden="true">{i + 1}</span>
                  <span className="idi-aula-txt"><b>{a.titulo}</b><span>{a.duracao_min} min{a.video_id ? ' · com vídeo' : ''}</span></span>
                </button>
                <Status aula={a} feita={feitas.has(a.id)} logada={logada} aoMudar={(id, v) => void alternar(id, v)} />
              </div>
              <button type="button" className="r-btn idi-ver-previa" aria-expanded={previa === a.id} aria-controls={`previa-${a.id}`} onClick={() => setPrevia(previa === a.id ? null : a.id)}>
                {previa === a.id ? 'Fechar prévia' : 'Prévia'}
              </button>
              {previa === a.id ? (
                <div id={`previa-${a.id}`} className="idi-previa" aria-label={`Prévia: ${a.titulo}`}>
                  <p>{a.contexto}</p>
                  <ul>
                    {a.frases.slice(0, 3).map((f) => (
                      <li key={f.orig}>
                        <span><b lang={idioma}>{f.orig}</b>{f.pt}</span>
                        {temVoz() ? <button type="button" className="r-btn idi-ouvir" aria-label={`Ouvir: ${f.orig}`} onClick={() => void falar(f.orig, idioma)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z" /><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M16 9.5a3.5 3.5 0 0 1 0 5" /></svg>
                        </button> : null}
                      </li>
                    ))}
                  </ul>
                  <span className="idi-previa-mais">+ {a.frases.length - 3 > 0 ? `${a.frases.length - 3} ${a.frases.length - 3 === 1 ? 'frase' : 'frases'}, ` : ''}diálogo e dica na aula completa</span>
                  <button type="button" className="r-btn idi-proxima" onClick={() => navegar(`/idiomas/${idioma}/aula/${a.id}${sufixo}`)}>Abrir a aula completa ›</button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>,
      { para: `/idiomas/${idioma}${sufixo}`, rotulo: `${nome} para viagem` },
    );
  }

  // --- Lista de módulos ---
  const total = aulas.length;
  const totalFeitas = feitasDe(aulas);
  return corpo(
    <>
      <h1 className="idi-h1 topo">{nome} para viagem</h1>
      <p className="idi-contexto">Frases prontas para se virar no exterior. Escolha o tema e vá no seu ritmo.</p>
      <div role="tablist" aria-label="Idioma" className="idi-idiomas">
        {IDIOMAS.map((i) => (
          <button key={i.codigo} type="button" role="tab" aria-selected={i.codigo === idioma} className="r-btn" onClick={() => navegar(`/idiomas/${i.codigo}${sufixo}`, { replace: true })}>{i.nome}</button>
        ))}
      </div>

      {emergencia ? (
        <button type="button" className="r-btn idi-emergencia" onClick={() => navegar(`/idiomas/${idioma}/m/${emergencia.id}${sufixo}`)}>
          <span className="idi-sos" aria-hidden="true">SOS</span>
          <span><b>Emergência</b>Socorro, médico e polícia em {nome.toLowerCase()}</span>
          <span aria-hidden="true" className="idi-seta">›</span>
        </button>
      ) : null}

      <section aria-label="Seu progresso" className="idi-progresso">
        <div className="idi-resumo"><span>{totalFeitas} de {total} aulas assistidas · {total - totalFeitas} {total - totalFeitas === 1 ? 'restante' : 'restantes'}</span><b>{percentual(totalFeitas, total)}%</b></div>
        <Barra valor={percentual(totalFeitas, total)} />
        {logada === false ? <SemConta /> : null}
      </section>

      <ul className="idi-modulos" aria-label="Módulos">
        {modulos.map((m) => {
          const lista = doModulo(m.id);
          if (!lista.length) return null;
          const f = feitasDe(lista);
          return (
            <li key={m.id}>
              <button type="button" className="r-btn idi-modulo" onClick={() => navegar(`/idiomas/${idioma}/m/${m.id}${sufixo}`)} aria-label={`${m.nome}: ${lista.length} aulas, ${percentual(f, lista.length)}% concluído`}>
                <span className="idi-modulo-topo"><b>{m.nome}</b><span>{percentual(f, lista.length)}%</span></span>
                <span className="idi-modulo-desc">{m.descricao}</span>
                {lista[0]?.frases[0] ? <span className="idi-exemplo"><b lang={idioma}>{lista[0].frases[0].orig}</b> {lista[0].frases[0].pt}</span> : null}
                <span className="idi-modulo-meta">{lista.length} {lista.length === 1 ? 'aula' : 'aulas'} · {f} {f === 1 ? 'assistida' : 'assistidas'}</span>
                <Barra valor={percentual(f, lista.length)} />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="idi-nota">Aulas escritas por nós, com vídeos escolhidos a dedo. <Info rotulo="Sobre as aulas">Cada aula tem a situação, as frases com tradução e pronúncia aproximada, um diálogo curto e uma dica. Alguns vídeos são de canais do YouTube; o conteúdo deles é dos canais.</Info></p>
    </>,
    { para: viagem ? `/viagem/${viagem}` : '/perfil', rotulo: viagem ? 'Viagem' : 'Ajustes' },
  );
}
