import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDemo } from '../../dev/demo';

import { carregarDaConta, carregarPerfil, useSessao } from '../../conta/servico';
import DESTINOS from '../../dados/destinos.json';
import { destinoPorNome } from '../../lib/lugares';
import { cancelarExclusao, estadoExclusao } from '../../lib/privacidade';
import { meusFavoritos, minhasAmizades, type Favorito } from '../../lib/social';
import { meuUsuario } from '../../lib/usuario';
import { lugarPorId } from '../../lib/catalogo';
import { useViajante } from '../../state/viajante';
import { hojeISO } from '../viagens/jornada';
import { carregarViagem, listarViagens, textoMotivo, type Viagem } from '../../lib/viagens';
import { Abas } from '../../ui/abas';
import { curiosidades } from '../../lib/curiosidades';
import { amigosEstiveram, type AmigoEsteve } from '../../lib/amigos';
import { feedViagens, type PostViagem } from '../../lib/feed';
import { lugaresCuriosos, nomesDestinos } from '../../lib/lugares';
import { Avatar } from '../../ui/avatar';
import { Estrelas } from '../../ui/estrelas';
import { DESTINOS_COM_FOTO, FotoDestino } from '../../ui/foto';
import { BotaoContorno, BotaoPrincipal } from '../../ui/pecas';

interface DestinoCartao { nome: string; pais: string; foto?: string | null; tracos: string[] }
const TODOS = (DESTINOS as { destinos: DestinoCartao[] }).destinos;
const COM_FOTO = TODOS.filter((d) => d.foto && DESTINOS_COM_FOTO.includes(d.foto));
const TRACO: Record<string, string> = { cultura: 'cultura', museus: 'museus', gastronomia: 'comida boa', romantico: 'romântico', compras: 'compras', 'cidade-grande': 'cidade grande', historia: 'história', mirantes: 'mirantes', litoral: 'litoral', praia: 'praia', natureza: 'natureza', aventura: 'aventura', vinhos: 'vinhos', serra: 'serra', frio: 'clima de serra', festa: 'festa', noite: 'vida noturna', arquitetura: 'arquitetura', 'historia-colonial': 'história colonial', ecoturismo: 'ecoturismo', mergulho: 'mergulho' };
const chamada = (d: DestinoCartao) => d.tracos.slice(0, 3).map((t) => TRACO[t] ?? t.replace('-', ' ')).join(' · ');

/** Destinos parecidos com os favoritos (características em comum). */
function ordenar(favs: Favorito[]): DestinoCartao[] {
  if (!favs.length) {
    // Sem favoritos: alterna Brasil e exterior para mostrar as duas possibilidades.
    const br = COM_FOTO.filter((d) => d.pais === 'Brasil');
    const fora = COM_FOTO.filter((d) => d.pais !== 'Brasil');
    return Array.from({ length: Math.max(br.length, fora.length) }, (_, i) => [fora[i], br[i]]).flat().filter((x): x is DestinoCartao => Boolean(x));
  }
  const tracos = new Set(TODOS.filter((d) => favs.some((f) => f.nome === d.nome)).flatMap((d) => d.tracos));
  return [...COM_FOTO].sort((a, b) => {
    const fa = favs.some((f) => f.nome === a.nome) ? 10 : 0;
    const fb = favs.some((f) => f.nome === b.nome) ? 10 : 0;
    return fb + b.tracos.filter((t) => tracos.has(t)).length - (fa + a.tracos.filter((t) => tracos.has(t)).length);
  });
}

function useAbrirDestino() {
  const navegar = useNavigate();
  return async (d: DestinoCartao) => {
    const achado = await destinoPorNome(d.nome);
    navegar(achado ? `/descobrir?d=${achado.id}` : '/descobrir');
  };
}

/** Cartão grande com foto, para o carrossel principal. */
function CartaoGrande({ d, favorito }: { d: DestinoCartao; favorito: boolean }) {
  const abrir = useAbrirDestino();
  return (
    <button type="button" className="r-btn" onClick={() => void abrir(d)} aria-label={`${d.nome}, ${d.pais}: ver o que viver lá`}
      style={{ position: 'relative', flex: 'none', width: '88%', maxWidth: '400px', aspectRatio: '4 / 5', overflow: 'hidden', scrollSnapAlign: 'start', background: 'linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))', textAlign: 'left' }}>
      <FotoDestino nome={d.foto ?? d.nome} credito={false} />
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.72) 100%)' }} />
      <span style={{ position: 'absolute', left: 14, right: 14, bottom: 14, zIndex: 2, color: '#fff' }}>
        {favorito ? <span style={{ display: 'inline-block', font: "700 11px 'Open Sans'", letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', padding: '2px 6px', marginBottom: '6px' }}>Seu favorito</span> : null}
        <span style={{ display: 'block', font: "600 26px/30px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{d.nome}</span>
        <span style={{ display: 'block', fontSize: '14px', opacity: 0.92 }}>{d.pais} · {chamada(d)}</span>
      </span>
    </button>
  );
}

function CartaoPequeno({ d }: { d: DestinoCartao }) {
  const abrir = useAbrirDestino();
  return (
    <button type="button" className="r-btn" onClick={() => void abrir(d)} aria-label={`${d.nome}: ver o que viver lá`} style={{ flex: 'none', width: '200px', textAlign: 'left' }}>
      <span style={{ position: 'relative', display: 'block', width: '200px', aspectRatio: '4 / 5', overflow: 'hidden', background: 'var(--cartao-2)' }}><FotoDestino nome={d.foto ?? d.nome} credito={false} /></span>
      <b style={{ display: 'block', font: "600 15px/20px 'Lexend Exa'", marginTop: '6px' }}>{d.nome}</b>
      <span style={{ display: 'block', fontSize: '12px', color: 'var(--texto-sec)' }}>{chamada(d)}</span>
    </button>
  );
}

/** "Onde seus amigos estiveram" (D-063): só o que tem foto (álbum das viagens e fotos de lugares aprovadas). */
function AmigosEstiveram() {
  const navegar = useNavigate();
  const [itens, setItens] = useState<AmigoEsteve[]>([]);
  useEffect(() => void amigosEstiveram(20).then(setItens), []);
  if (!itens.length) return null;
  return (
    <>
      <Rot t="Onde seus amigos estiveram" />
      <div role="list" aria-label="Onde seus amigos estiveram" style={fileira}>
        {itens.map((c) => (
          <div role="listitem" key={`${c.tipo}-${c.trip_id ?? c.place_id}-${c.user_id}`} style={{ display: 'contents' }}>
            <button type="button" className="r-btn" onClick={() => navegar(c.trip_id ? `/viagem/${c.trip_id}` : `/lugar/${c.place_id}`)}
              aria-label={`${c.nome} esteve em ${c.titulo}`} style={{ flex: 'none', width: '260px', textAlign: 'left', scrollSnapAlign: 'start' }}>
              <span style={{ position: 'relative', display: 'block', width: '260px', aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: '14px', background: 'var(--cartao-2)' }}>
                <img src={c.url} alt="" loading="lazy" onError={() => setItens((l) => l.filter((x) => x !== c))} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '28px 10px 10px', background: 'linear-gradient(transparent, rgba(0,0,0,.72))', color: '#fff' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Avatar userId={c.user_id} nome={c.nome} tamanho={24} />
                    <b style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nome.split(' ')[0]}</b>
                  </span>
                  <b style={{ display: 'block', font: "600 15px/19px 'Lexend Exa'", marginTop: '4px' }}>{c.titulo}</b>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '2px' }}>
                    {c.nota ? <Estrelas nota={c.nota} tamanho={12} /> : null}
                    <span>{c.tipo === 'viagem' ? `${c.fotos} ${c.fotos === 1 ? 'foto' : 'fotos'}` : c.cidade ?? ''}</span>
                  </span>
                </span>
              </span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

/** Faixa "Viagens da galera" (D-071): prévia do feed; o último cartão abre o feed inteiro. */
function ViagensDaGalera() {
  const navegar = useNavigate();
  const [itens, setItens] = useState<PostViagem[]>([]);
  useEffect(() => void feedViagens(8).then(setItens), []);
  if (!itens.length) return null;
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Rot t="Viagens da galera" />
        <button type="button" className="r-btn" onClick={() => navegar('/viagens/galera')} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Ver todas</button>
      </div>
      <div role="list" aria-label="Viagens da galera" style={fileira}>
        {itens.map((c) => (
          <div role="listitem" key={c.trip_id} style={{ display: 'contents' }}>
            <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${c.trip_id}?aba=roteiro`)} aria-label={`Viagem de ${c.nome} para ${c.destino}`}
              style={{ flex: 'none', width: '260px', textAlign: 'left', scrollSnapAlign: 'start' }}>
              <span style={{ position: 'relative', display: 'block', width: '260px', aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: '14px', background: 'var(--cartao-2)' }}>
                <img src={c.url} alt="" loading="lazy" onError={() => setItens((l) => l.filter((x) => x !== c))} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '28px 10px 10px', background: 'linear-gradient(transparent, rgba(0,0,0,.72))', color: '#fff' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Avatar userId={c.user_id} nome={c.nome} tamanho={24} />
                    <b style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nome.split(' ')[0]}</b>
                  </span>
                  <b style={{ display: 'block', font: "600 15px/19px 'Lexend Exa'", marginTop: '4px' }}>{c.destino}</b>
                  <span style={{ display: 'block', fontSize: '12px', marginTop: '2px' }}>{textoMotivo(c) ?? (c.fotos ? `${c.fotos} ${c.fotos === 1 ? 'foto' : 'fotos'}` : `${c.lugares} lugares`)}</span>
                </span>
              </span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

/** Faixa "Lugares curiosos" (D-038/D-039): curiosidades do mundo; toque abre a ficha. */
function Curiosos() {
  const navegar = useNavigate();
  const [itens, setItens] = useState<{ id: string; nome: string; foto: string; onde: string; mundo: boolean }[]>([]);
  useEffect(() => {
    void curiosidades(0, 12).then(async (mundo) => {
      if (mundo.length) { setItens(mundo.map((c) => ({ id: c.id, nome: c.nome, foto: c.foto, onde: c.pais ?? '', mundo: true }))); return; }
      // Antes da 1ª coleta mundial: os curiosos das cidades já coletadas.
      const { itens: l } = await lugaresCuriosos(null, 0, 24);
      const comFoto = l.filter((x) => x.foto).slice(0, 12);
      const nomes = await nomesDestinos(comFoto.map((x) => x.destino_id));
      setItens(comFoto.map((x) => ({ id: x.id, nome: x.nome, foto: x.foto!, onde: nomes.get(x.destino_id) ?? '', mundo: false })));
    });
  }, []);
  if (!itens.length) return null;
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Rot t="Lugares curiosos" />
        <button type="button" className="r-btn alvo-toque" onClick={() => navegar('/curiosos')} style={{ color: 'var(--azul)', fontWeight: 600, fontSize: '14px' }}>Ver todos ›</button>
      </div>
      <div role="list" aria-label="Lugares curiosos" style={fileira}>
        {itens.map((c) => (
          <div role="listitem" key={c.id} style={{ display: 'contents' }}>
            <button type="button" className="r-btn" onClick={() => navegar(c.mundo ? `/curiosos?c=${c.id}` : `/lugar/${c.id}`)} style={{ flex: 'none', width: '200px', textAlign: 'left' }}>
              <span style={{ display: 'block', width: '200px', aspectRatio: '4 / 5', overflow: 'hidden', background: 'var(--cartao-2)' }}>
                <img src={c.foto} alt={`Foto de ${c.nome}`} loading="lazy" onError={() => setItens((l) => l.filter((x) => x.id !== c.id))} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(1.1) contrast(1.05)' }} />
              </span>
              <b style={{ font: "600 14px/19px 'Lexend Exa'", marginTop: '6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{c.nome}</b>
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--texto-sec)' }}>{c.onde}</span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

const Rot = ({ t }: { t: string }) => <h2 style={{ font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em', margin: '22px 0 8px' }}>{t}</h2>;
const fileira = { display: 'flex', alignItems: 'flex-start', gap: '10px', overflowX: 'auto', margin: '0 -20px', padding: '0 20px 6px', scrollbarWidth: 'none', scrollSnapType: 'x mandatory' } as const;
/** Avisos de quem tem conta: o que espera resposta e o que falta para aproveitar o app. */
function Pendencias({ convites, pedidos, semUsuario, semJeito }: { convites: number; pedidos: number; semUsuario: boolean; semJeito: boolean }) {
  const navegar = useNavigate();
  const itens: { texto: string; ir: string; destaque?: boolean }[] = [];
  if (convites) itens.push({ texto: convites === 1 ? 'Você tem 1 convite para uma viagem' : `Você tem ${convites} convites para viagens`, ir: '/viagens', destaque: true });
  if (pedidos) itens.push({ texto: pedidos === 1 ? '1 pedido de amizade esperando resposta' : `${pedidos} pedidos de amizade esperando resposta`, ir: '/perfil/amigos', destaque: true });
  if (semJeito) itens.push({ texto: 'Conte seu jeito de viajar (1 minuto): os roteiros nascem dele', ir: '/perfil-viajante' });
  if (semUsuario) itens.push({ texto: 'Escolha seu @ para seus amigos te acharem', ir: '/perfil/usuario' });
  if (!itens.length) return null;
  return (
    <ul aria-label="Avisos" style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, border: '1px solid var(--linha)' }}>
      {itens.map((x, i) => (
        <li key={x.ir + i} style={{ borderTop: i ? '1px solid var(--linha)' : 0 }}>
          <button type="button" className="r-btn" onClick={() => navegar(x.ir)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', width: '100%', minHeight: '52px', padding: '0 12px', textAlign: 'left', font: `${x.destaque ? 700 : 600} 15px/20px 'Open Sans'`, background: x.destaque ? 'var(--cartao-1)' : 'transparent' }}>
            <span>{x.destaque ? '● ' : ''}{x.texto}</span><span aria-hidden="true">›</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

const diasAte = (iso: string) => Math.round((Date.parse(`${iso}T12:00:00`) - Date.now()) / 86_400_000);

/**
 * Início: dá vontade de viajar logo na primeira tela (fotos de destinos), mostra a próxima
 * viagem com contagem regressiva para quem tem conta e convida a criar conta sem bloquear nada.
 */
/** O que o app faz (D-048): para quem ainda não tem viagem — "como uma agência, no seu bolso". */
function OQueFaz() {
  const navegar = useNavigate();
  const itens: [string, string][] = [
    ['Roteiro', 'feito do seu jeito, dia a dia'],
    ['Dinheiro', 'quanto custa e quanto guardar'],
    ['Hospedagem e prazos', 'documentos, reservas e lembretes'],
    ['Com amigos', 'planejem juntos e dividam os custos'],
  ];
  return (
    <section aria-label="O que o Bo Vair faz" style={{ marginTop: '14px', padding: '18px 16px', background: 'var(--fundo-escuro)', color: '#fff' }}>
      <div style={{ font: "700 12px 'Open Sans'", letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amarelo)' }}>Como uma agência, no seu bolso</div>
      <div style={{ font: "600 24px/29px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>Sua viagem inteira num lugar só.</div>
      <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 12px' }}>
        {itens.map(([t, d]) => (
          <li key={t}><b style={{ display: 'block', fontSize: '15px' }}>{t}</b><span style={{ fontSize: '13px', lineHeight: '17px', color: 'var(--sobre-escuro-sec)' }}>{d}</span></li>
        ))}
      </ul>
      <button type="button" className="r-btn" onClick={() => navegar('/viagens/nova')} style={{ width: '100%', height: '50px', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 16px 'Open Sans'" }}>Planejar uma viagem</button>
    </section>
  );
}

export function Inicio() {
  const navegar = useNavigate();
  const sessao = useSessao();
  const useDemoInicio = useDemo();
  const [nome, setNome] = useState<string | null>(null);
  const [favs, setFavs] = useState<Favorito[]>([]);
  const [viagem, setViagem] = useState<Viagem | null | undefined>(undefined);
  const [exclusao, setExclusao] = useState<Date | null>(null);
  const { preferencias } = useViajante();
  const [pend, setPend] = useState<{ convites: number; pedidos: number; semUsuario: boolean } | null>(null);
  const [hoje, setHoje] = useState<{ dia: number; total: number; paradas: string[] } | null>(null);

  useEffect(() => {
    if (!sessao) return;
    void carregarDaConta();
    void carregarPerfil().then((p) => setNome(p?.display_name ?? null));
    void meusFavoritos().then(setFavs);
    void (async () => {
      const [v, amizades, usuario] = await Promise.all([listarViagens(), minhasAmizades(), meuUsuario()]);
      const agora = hojeISO();
      const fim = (x: Viagem) => new Date(Date.parse(`${x.data_ida}T12:00:00Z`) + x.noites * 86_400_000).toISOString().slice(0, 10);
      // Próxima viagem = a que ainda não terminou (inclui a que está acontecendo agora).
      const proxima = v.minhas.filter((x) => x.status === 'ativo' && fim(x) >= agora).sort((a, b) => a.data_ida.localeCompare(b.data_ida))[0] ?? null;
      setViagem(proxima);
      setPend({ convites: v.minhas.filter((x) => x.status === 'convidado').length, pedidos: amizades.filter((a) => a.status === 'pendente' && !a.enviadaPorMim).length, semUsuario: !usuario?.username });
      if (proxima && proxima.data_ida <= agora) {
        const dia = Math.round((Date.parse(`${agora}T12:00:00Z`) - Date.parse(`${proxima.data_ida}T12:00:00Z`)) / 86_400_000) + 1;
        const completa = await carregarViagem(proxima.id);
        const paradas = (completa?.itens ?? []).filter((i) => i.dia === dia).sort((a, b) => a.ordem - b.ordem).map((i) => lugarPorId(i.place_id)?.nome).filter(Boolean) as string[];
        setHoje({ dia, total: proxima.noites + 1, paradas });
      } else setHoje(null);
    })();
    void estadoExclusao().then((e) => setExclusao(e?.apagaEm ?? null));
  }, [sessao]);

  const destaques = useMemo(() => ordenar(favs), [favs]);
  const brasil = COM_FOTO.filter((d) => d.pais === 'Brasil');
  const fora = COM_FOTO.filter((d) => d.pais !== 'Brasil');
  const primeiroNome = (nome ?? '').split(' ')[0];
  const dias = viagem ? diasAte(viagem.data_ida) : null;

  return (
    <main className="tela" data-tela="inicio" data-real="inicio">
      <div style={{ padding: 'calc(22px + env(safe-area-inset-top)) 20px 0' }}>
        <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: '-0.04em' }}>bo vair</div>
        {exclusao ? (
          <div role="status" style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--cartao-1)', fontSize: '14px', lineHeight: '20px' }}>
            Sua conta será apagada em <b>{exclusao.toLocaleDateString('pt-BR')}</b>.{' '}
            <button type="button" className="r-btn" onClick={() => void cancelarExclusao().then(() => setExclusao(null))} style={{ color: 'var(--azul)', fontWeight: 600, minHeight: '36px' }}>Desistir da exclusão</button>
          </div>
        ) : null}

        {!useDemoInicio && (!sessao || viagem === null) ? <OQueFaz /> : null}
        <h1 style={{ margin: '14px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>
          {sessao && hoje ? `Boa viagem${primeiroNome ? `, ${primeiroNome}` : ''}!` : sessao && primeiroNome ? `Olá, ${primeiroNome}. Para onde agora?` : 'Para onde você quer ir?'}
        </h1>

        {sessao && pend ? (
          <Pendencias convites={pend.convites} pedidos={pend.pedidos} semUsuario={pend.semUsuario} semJeito={!preferencias} />
        ) : null}

        {sessao && viagem && hoje ? (
          <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${viagem.id}?aba=roteiro`)} aria-label={`Hoje em ${viagem.destino}: ver o roteiro do dia`}
            style={{ display: 'block', width: '100%', marginTop: '14px', padding: '14px 16px', background: 'var(--fundo-escuro)', color: '#fff', textAlign: 'left' }}>
            <span style={{ display: 'block', font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--amarelo)' }}>Você está viajando</span>
            <span style={{ display: 'block', font: "600 24px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '4px' }}>Hoje em {viagem.destino}</span>
            <span style={{ display: 'block', fontSize: '14px', color: 'var(--sobre-escuro-sec)' }}>Dia {Math.min(hoje.dia, hoje.total)} de {hoje.total}</span>
            {hoje.paradas.length ? (
              <span style={{ display: 'block', marginTop: '8px', fontSize: '15px', lineHeight: '22px' }}>{hoje.paradas.slice(0, 4).map((n, i) => <span key={n} style={{ display: 'block' }}>{i + 1}. {n}</span>)}</span>
            ) : <span style={{ display: 'block', marginTop: '8px', fontSize: '14px' }}>Dia livre no roteiro. Toque para adicionar lugares.</span>}
            <span style={{ display: 'block', fontSize: '13px', marginTop: '8px', color: 'var(--sobre-escuro-sec)' }}>Ver o roteiro, marcar o que fez e anotar gastos ›</span>
          </button>
        ) : sessao && viagem ? (
          <button type="button" className="r-btn" onClick={() => navegar(`/viagem/${viagem.id}`)} aria-label={`Próxima viagem: ${viagem.destino}`}
            style={{ position: 'relative', display: 'block', width: '100%', height: '200px', marginTop: '14px', overflow: 'hidden', textAlign: 'left', background: 'var(--fundo-escuro)' }}>
            {DESTINOS_COM_FOTO.includes(viagem.destino) ? <FotoDestino nome={viagem.destino} credito={false} /> : null}
            <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(90deg, rgba(11,31,75,.88) 0%, rgba(11,31,75,.35) 75%)' }} />
            <span style={{ position: 'absolute', left: 16, top: 14, right: 16, zIndex: 2, color: '#fff' }}>
              <span style={{ display: 'block', font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--amarelo)' }}>Sua próxima viagem</span>
              <span style={{ display: 'block', font: "600 26px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '4px' }}>{viagem.destino}</span>
              <span style={{ display: 'block', font: "600 16px 'Open Sans'", marginTop: '2px' }}>{dias === 0 ? 'É hoje!' : dias === 1 ? 'Falta 1 dia' : `Faltam ${dias} dias`}</span>
              <span style={{ display: 'block', fontSize: '13px', opacity: 0.85, marginTop: '6px' }}>Etapas, roteiro e dinheiro ›</span>
            </span>
          </button>
        ) : null}

        <div role="list" aria-label="Destinos em destaque" style={{ ...fileira, marginTop: '14px' }}>
          {destaques.slice(0, 10).map((d) => <div role="listitem" key={d.nome} style={{ display: 'contents' }}><CartaoGrande d={d} favorito={favs.some((f) => f.nome === d.nome)} /></div>)}
        </div>
        <p style={{ fontSize: '12px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>Fotos: Wikimedia Commons.</p>

        {sessao && viagem === null ? (
          <div style={{ marginTop: '14px' }}><BotaoPrincipal onClick={() => navegar('/viagens/nova')}>Planejar uma viagem</BotaoPrincipal></div>
        ) : null}

        <Rot t="No Brasil" />
        <div role="list" aria-label="Destinos no Brasil" style={fileira}>{brasil.map((d) => <div role="listitem" key={d.nome} style={{ display: 'contents' }}><CartaoPequeno d={d} /></div>)}</div>
        {sessao ? <ViagensDaGalera /> : null}
        {sessao ? <AmigosEstiveram /> : null}
        <Curiosos />
        <Rot t="Lá fora" />
        <div role="list" aria-label="Destinos no exterior" style={fileira}>{fora.map((d) => <div role="listitem" key={d.nome} style={{ display: 'contents' }}><CartaoPequeno d={d} /></div>)}</div>

        <button type="button" className="r-btn" onClick={() => navegar(sessao ? '/destinos' : '/descobrir')} style={{ minHeight: '44px', marginTop: '10px', color: 'var(--azul)', fontWeight: 600 }}>
          {sessao ? (favs.length ? 'Mudar meus destinos favoritos' : 'Marcar destinos que quero conhecer') : 'Buscar qualquer cidade do Brasil ou do mundo'}
        </button>
        <div style={{ height: sessao ? '24px' : '110px' }} />
      </div>

      {!sessao && sessao !== undefined ? (
        <div className="rodape" style={{ padding: '10px 20px 10px', borderTop: '1px solid var(--linha)', background: 'var(--fundo)', bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <div style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--texto-sec)', marginBottom: '8px' }}>Conta grátis: roteiros, dinheiro e amigos num lugar só.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
            <BotaoPrincipal onClick={() => navegar('/conta/criar')}>Criar conta</BotaoPrincipal>
            <BotaoContorno onClick={() => navegar('/entrar')}>Entrar</BotaoContorno>
          </div>
        </div>
      ) : null}
      <Abas ativa="inicio" logoAbaixoDoRodape={!sessao} />
    </main>
  );
}
