import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CIDADE } from '../../lib/catalogo';
import { criarViagem } from '../../lib/viagens';
import { useViajante } from '../../state/viajante';
import { Aviso, BotaoPrincipal, Rodape, Voltar } from '../../ui/pecas';
import { campo, Rotulo } from './comum';

const hoje = (dias = 0) => new Date(Date.now() + dias * 86_400_000).toISOString().slice(0, 10);

/** Nova viagem: destino, datas, viajantes e orçamento. O roteiro nasce do perfil de viajante. */
export function NovaViagem() {
  const navegar = useNavigate();
  const { preferencias } = useViajante();
  const [dataIda, setDataIda] = useState(hoje(60));
  const [noites, setNoites] = useState(5);
  const [viajantes, setViajantes] = useState(1);
  const [orcamento, setOrcamento] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);

  const criar = async () => {
    if (dataIda < hoje()) return setErro('Escolha uma data a partir de hoje.');
    if (!preferencias) return navegar('/perfil-viajante');
    setCriando(true);
    const valor = Number(orcamento.replace(/\D/g, ''));
    const id = await criarViagem({ destino: CIDADE, dataIda, noites, viajantes, orcamento: valor ? valor * 100 : null }, preferencias);
    setCriando(false);
    if (!id) return setErro('Não conseguimos criar a viagem. Confira a internet e tente de novo.');
    navegar(`/viagem/${id}`, { replace: true });
  };

  const Passo = ({ valor, menor, maior, aoMudar, rotulo }: { valor: number; menor: number; maior: number; aoMudar: (n: number) => void; rotulo: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
      <button type="button" className="r-btn" aria-label={`Menos ${rotulo}`} onClick={() => aoMudar(Math.max(menor, valor - 1))} style={passo}>−</button>
      <output aria-live="polite" style={{ font: "600 24px 'Lexend Exa'", minWidth: '36px', textAlign: 'center' }}>{valor}</output>
      <button type="button" className="r-btn" aria-label={`Mais ${rotulo}`} onClick={() => aoMudar(Math.min(maior, valor + 1))} style={passo}>+</button>
    </div>
  );

  return (
    <main className="tela" data-tela="nova-viagem" data-real="nova-viagem">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <Voltar para="/viagens" />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Nova viagem</div>
        <h1 style={{ margin: '6px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Para onde e quando?</h1>
        <Rotulo>Destino</Rotulo>
        <div style={{ font: "600 22px 'Lexend Exa'" }}>{CIDADE}</div>
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)' }}>Por enquanto, a cidade com lugares, preços e mapa conferidos. Outras chegam com a curadoria.</div>
        <Rotulo><label htmlFor="ida">Data de ida</label></Rotulo>
        <input id="ida" type="date" className="r-input" value={dataIda} min={hoje()} onChange={(e) => setDataIda(e.target.value)} style={campo} />
        <Rotulo>Noites</Rotulo>
        <Passo valor={noites} menor={1} maior={14} aoMudar={setNoites} rotulo="uma noite" />
        <Rotulo>Quantas pessoas viajam</Rotulo>
        <Passo valor={viajantes} menor={1} maior={10} aoMudar={setViajantes} rotulo="uma pessoa" />
        <Rotulo><label htmlFor="orc">Orçamento total (opcional, em reais)</label></Rotulo>
        <input id="orc" className="r-input" inputMode="numeric" placeholder="Ex.: 15.000" value={orcamento} onChange={(e) => setOrcamento(e.target.value.replace(/[^\d.]/g, ''))} style={campo} />
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '6px' }}>Avisamos se o roteiro passar desse valor e sugerimos trocas.</div>
        {!preferencias ? <p style={{ fontSize: '14px', color: 'var(--azul)', fontWeight: 600 }}>Antes, conte seu jeito de viajar (1 minuto): o roteiro nasce dele.</p> : null}
        {erro ? <Aviso>{erro}</Aviso> : null}
        <div style={{ height: '16px' }} />
      </div>
      <Rodape>
        <BotaoPrincipal onClick={() => void criar()} disabled={criando}>{criando ? 'Montando o roteiro…' : preferencias ? 'Criar viagem ↗' : 'Responder meu jeito de viajar ↗'}</BotaoPrincipal>
      </Rodape>
    </main>
  );
}

const passo = { width: '48px', height: '48px', border: '2px solid var(--texto)', font: "600 22px 'Open Sans'", display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;
