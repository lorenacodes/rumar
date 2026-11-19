import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSessao } from '../../conta/servico';
import { rotuloDestino, type Destino } from '../../lib/lugares';
import { NOME_MOTIVO, registrarViagemFeita, type Viagem } from '../../lib/viagens';
import { EscolherDestino } from '../../ui/escolherDestino';
import { BotaoPrincipal, Voltar } from '../../ui/pecas';
import { campo } from './comum';

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** "Registrar viagem que já fiz" (D-060): destino, mês e ano. Abre a viagem para postar as fotos. */
export function JaFiz() {
  const navegar = useNavigate();
  const sessao = useSessao();
  const agora = new Date();
  const [destino, setDestino] = useState<Destino | null>(null);
  const [mes, setMes] = useState(agora.getMonth());
  const [ano, setAno] = useState(agora.getFullYear());
  const [noites, setNoites] = useState(3);
  const [pessoas, setPessoas] = useState(1);
  const [quemVe, setQuemVe] = useState<'amigos' | 'publica' | 'privada'>('amigos');
  const [motivo, setMotivo] = useState<NonNullable<Viagem['motivo']>>('passeio');
  const [evento, setEvento] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const anos = Array.from({ length: 30 }, (_, i) => agora.getFullYear() - i);
  const dataIda = `${ano}-${String(mes + 1).padStart(2, '0')}-01`;
  const futura = dataIda > agora.toISOString().slice(0, 10);

  const salvar = async () => {
    if (!sessao) return navegar('/entrar');
    if (!destino || futura) return;
    setSalvando(true);
    const id = await registrarViagemFeita({ destino: destino.nome, destinoId: destino.id, dataIda, noites, viajantes: pessoas, visibilidade: quemVe, motivo, evento: motivo === 'evento' ? evento : null });
    setSalvando(false);
    if (id) navegar(`/viagem/${id}?aba=roteiro`, { replace: true });
    else setErro('Não deu para salvar. Tente de novo.');
  };
  const seletor = { ...campo, font: "500 17px 'Open Sans'", appearance: 'none' as const };

  return (
    <main className="tela" data-tela="ja-fiz" data-real="ja-fiz">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para="/viagens" />
        <h1 style={{ margin: '4px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Viagem que já fiz</h1>
        <p style={{ fontSize: '15px', color: 'var(--texto-sec)', margin: '4px 0 0' }}>Guarde as fotos e mostre para os amigos.</p>

        <div style={{ marginTop: '18px' }}>
          {destino ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'var(--cartao-2)' }}>
              <b style={{ fontSize: '17px' }}>{rotuloDestino(destino)}</b>
              <button type="button" className="r-btn" onClick={() => setDestino(null)} style={{ minHeight: '40px', color: 'var(--azul)', fontWeight: 600 }}>Trocar</button>
            </div>
          ) : <EscolherDestino rotulo="Para onde você foi?" aoEscolher={setDestino} />}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px', marginTop: '16px' }}>
          <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Mês
            <select value={mes} onChange={(e) => setMes(Number(e.target.value))} style={seletor}>{MESES.map((m, i) => <option key={m} value={i}>{m}</option>)}</select>
          </label>
          <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Ano
            <select value={ano} onChange={(e) => setAno(Number(e.target.value))} style={seletor}>{anos.map((a) => <option key={a} value={a}>{a}</option>)}</select>
          </label>
          <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Noites
            <input type="number" inputMode="numeric" min={1} max={30} value={noites} onChange={(e) => setNoites(Math.min(30, Math.max(1, Number(e.target.value) || 1)))} className="r-input" style={seletor} />
          </label>
          <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Pessoas
            <input type="number" inputMode="numeric" min={1} max={20} value={pessoas} onChange={(e) => setPessoas(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} className="r-input" style={seletor} />
          </label>
        </div>
        <div role="radiogroup" aria-label="Por que foi" style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Por que foi?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {(Object.entries(NOME_MOTIVO) as [NonNullable<Viagem['motivo']>, string][]).map(([id, nome]) => (
              <button key={id} type="button" role="radio" aria-checked={motivo === id} className="r-btn" onClick={() => setMotivo(id)}
                style={{ minHeight: '40px', padding: '0 14px', borderRadius: '20px', font: "600 14px 'Open Sans'", ...(motivo === id ? { background: 'var(--fundo-escuro)', color: '#fff' } : { background: 'var(--cartao-2)' }) }}>{nome}</button>
            ))}
          </div>
          {motivo === 'evento' ? (
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-sec)', marginTop: '10px' }}>Qual evento?
              <input className="r-input" maxLength={80} value={evento} onChange={(e) => setEvento(e.target.value)} placeholder="Ex.: REC'n'Play" style={seletor} />
            </label>
          ) : null}
        </div>
        <div role="radiogroup" aria-label="Quem vê" style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Quem vê as fotos</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            {([['amigos', 'Amigos'], ['publica', 'Todos'], ['privada', 'Só eu']] as const).map(([id, nome]) => (
              <button key={id} type="button" role="radio" aria-checked={quemVe === id} className="r-btn" onClick={() => setQuemVe(id)}
                style={{ flex: 1, minHeight: '44px', borderRadius: '22px', textAlign: 'center', font: "600 15px 'Open Sans'", ...(quemVe === id ? { background: 'var(--fundo-escuro)', color: '#fff' } : { background: 'var(--cartao-2)' }) }}>{nome}</button>
            ))}
          </div>
          {quemVe === 'publica' ? <p style={{ fontSize: '13px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>Quem tem conta vê o roteiro e as fotos. Hotel e gastos, não.</p> : null}
        </div>
        {futura ? <p style={{ fontSize: '14px', color: 'var(--vermelho)', margin: '8px 0 0' }}>Essa data ainda não chegou. Para planejar, use Nova viagem.</p> : null}
        {erro ? <p role="alert" style={{ fontSize: '14px', color: 'var(--vermelho)', margin: '8px 0 0' }}>{erro}</p> : null}
        <div style={{ marginTop: '20px' }}>
          <BotaoPrincipal onClick={() => void salvar()} disabled={!destino || futura || salvando}>{salvando ? 'Salvando…' : sessao ? 'Salvar viagem' : 'Entre para salvar'}</BotaoPrincipal>
        </div>
      </div>
    </main>
  );
}
