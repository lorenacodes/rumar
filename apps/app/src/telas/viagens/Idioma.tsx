import { useEffect, useState } from 'react';
import { Check } from '../../ui/check';
import { useParams } from 'react-router-dom';

import { aulasDoIdioma, duracao, IDIOMA_DO_PAIS, linkVideo, miniatura, TEMAS, visualizacoes, type Aula } from '../../lib/aulas';
import { destinoPorId, destinoPorNome, type Destino } from '../../lib/lugares';
import { carregarViagem, type ViagemCompleta } from '../../lib/viagens';
import { usePlano } from '../../state/plano';
import { Abas } from '../../ui/abas';
import { Voltar } from '../../ui/pecas';
import { Rotulo } from './comum';
import { hojeISO } from './jornada';
import { diasEntre } from '../../lib/poupanca';

const chaveVistos = (id: string) => `bovair.aulas.${id}`;
const lerVistos = (id: string): string[] => {
  try { return JSON.parse(localStorage.getItem(chaveVistos(id)) ?? '[]'); } catch { return []; }
};

/** Idioma do destino: plano até a viagem e aulas específicas por tema (YouTube). */
export function Idioma() {
  const { id = '' } = useParams();
  const { idiomasFalados } = usePlano();
  const [v, setV] = useState<ViagemCompleta | null>(null);
  const [destino, setDestino] = useState<Destino | null>(null);
  const [res, setRes] = useState<{ configurado: boolean; aulas: Aula[] } | null | undefined>(undefined);
  const [vistos, setVistos] = useState<string[]>(() => lerVistos(id));

  useEffect(() => {
    void carregarViagem(id).then(async (x) => {
      setV(x);
      if (!x) return;
      setDestino(x.viagem.destino_id ? await destinoPorId(x.viagem.destino_id) : await destinoPorNome(x.viagem.destino));
    });
  }, [id]);
  const idioma = destino ? IDIOMA_DO_PAIS[destino.pais] : null;
  useEffect(() => {
    if (idioma) void aulasDoIdioma(idioma.codigo).then(setRes);
  }, [idioma?.codigo]); // eslint-disable-line react-hooks/exhaustive-deps

  const marcar = (video: string) => {
    const novo = [...new Set([...vistos, video])];
    setVistos(novo);
    try { localStorage.setItem(chaveVistos(id), JSON.stringify(novo)); } catch { /* sem armazenamento: só nesta sessão */ }
  };

  if (!v || !destino) return <main className="tela" aria-busy="true" style={{ padding: '40px 20px' }}>Carregando…</main>;
  const dias = Math.max(0, diasEntre(hojeISO(), v.viagem.data_ida));
  const semanas = Math.max(1, Math.floor(dias / 7));
  const jaFala = idioma ? idiomasFalados.includes(idioma.falado) : false;
  const aulas = res?.aulas ?? [];
  const total = TEMAS.filter((t) => aulas.some((a) => a.tema === t.id)).length;
  const feitos = TEMAS.filter((t) => aulas.some((a) => a.tema === t.id && vistos.includes(a.video_id))).length;

  return (
    <main className="tela" data-tela="idioma" data-real="idioma">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para={`/viagem/${id}`} />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>{destino.nome} · idioma</div>
        {!idioma ? (
          <>
            <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{destino.pais === 'BR' || destino.pais === 'PT' ? 'Aqui se fala português.' : 'Ainda sem aulas para este idioma.'}</h1>
            <p style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)' }}>{destino.pais === 'BR' || destino.pais === 'PT' ? 'Não precisa de aula de idioma para esta viagem.' : 'Por enquanto temos aulas de francês, inglês, espanhol, italiano e alemão.'}</p>
          </>
        ) : (
          <>
            <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Em {destino.nome} falam {idioma.nome}.</h1>
            <p style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', margin: '8px 0 0' }}>
              {jaFala ? `Você disse que fala ${idioma.nome}: as aulas abaixo servem para revisar o vocabulário de viagem.` : `Você fala ${idiomasFalados.join(' e ').toLowerCase()}. Algumas frases em ${idioma.nome} ajudam muito.`}
            </p>
            <div style={{ background: 'var(--cartao-1)', padding: '12px 14px', marginTop: '12px' }}>
              <div style={{ font: "600 14px 'Open Sans'" }}>Plano até a viagem</div>
              <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{dias ? `${TEMAS.length} temas em ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}` : 'A viagem é hoje: veja o essencial'}</div>
              <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{dias ? `Sugestão: ${Math.max(1, Math.ceil(TEMAS.length / semanas))} ${Math.ceil(TEMAS.length / semanas) === 1 ? 'tema' : 'temas'} por semana, 15 minutos por dia.` : 'Comece por cumprimentos, números e emergência.'}</div>
              {total ? (
                <>
                  <div aria-hidden="true" style={{ height: '8px', background: '#fff', marginTop: '8px' }}><div style={{ width: `${Math.round((feitos / total) * 100)}%`, height: '8px', background: 'var(--fundo-escuro)' }} /></div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>{feitos} de {total} temas vistos</div>
                </>
              ) : null}
            </div>

            {res === undefined ? <p style={{ color: 'var(--texto-sec)' }}>Buscando aulas…</p> : null}
            {res && !aulas.length ? (
              <div style={{ marginTop: '14px', padding: '12px 14px', background: 'var(--cartao-2)', fontSize: '14px', lineHeight: '20px' }}>
                {res.configurado
                  ? 'Não encontramos aulas que passem nos nossos critérios agora. Tente de novo mais tarde.'
                  : 'Estamos escolhendo as aulas de cada tema. Elas aparecem aqui em breve.'}
              </div>
            ) : null}

            {TEMAS.map((t, i) => {
              const doTema = aulas.filter((a) => a.tema === t.id);
              if (!doTema.length && aulas.length) return null;
              return (
                <section key={t.id} aria-label={t.nome}>
                  <Rotulo>Semana {Math.min(semanas, Math.floor(i / Math.max(1, Math.ceil(TEMAS.length / semanas))) + 1)} · {t.nome}</Rotulo>
                  {doTema.map((a) => {
                    const visto = vistos.includes(a.video_id);
                    return (
                      <a key={a.video_id} href={linkVideo(a.video_id)} target="_blank" rel="noreferrer" onClick={() => marcar(a.video_id)}
                        style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px dashed var(--linha)', color: 'var(--texto)', textDecoration: 'none' }}>
                        <span style={{ position: 'relative', width: '120px', height: '68px', flex: 'none', background: 'var(--fundo-escuro)' }}>
                          <img src={miniatura(a.video_id)} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          {a.duracao_s ? <span style={{ position: 'absolute', right: 3, bottom: 3, background: 'rgba(0,0,0,.75)', color: '#fff', fontSize: '11px', padding: '0 4px' }}>{duracao(a.duracao_s)}</span> : null}
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', font: "600 14px/19px 'Open Sans'" }}>{visto ? <Check cor="var(--verde)" /> : ''}{a.titulo}</span>
                          <span style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)' }}>{a.canal}{a.visualizacoes ? ` · ${visualizacoes(a.visualizacoes)}` : ''}</span>
                        </span>
                      </a>
                    );
                  })}
                </section>
              );
            })}
            {aulas.length ? (
              <p style={{ fontSize: '12px', lineHeight: '17px', color: 'var(--texto-sec)', marginTop: '12px' }}>
                Vídeos escolhidos automaticamente no YouTube: aulas em português, de 3 a 25 minutos, com o idioma no título, entre os mais relevantes e mais vistos de cada tema. Atualizados a cada 14 dias. O conteúdo é dos canais, não do Bo Vair. Ao tocar, abre no YouTube e fica marcado como visto neste aparelho.
              </p>
            ) : null}
          </>
        )}
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}
