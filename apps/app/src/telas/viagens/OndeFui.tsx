import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CATEGORIAS_LUGAR, nomeTipo, procurarNaCidade, type LugarBase } from '../../lib/lugares';
import { adicionarVisitado, informarHospedagem, type ViagemCompleta } from '../../lib/viagens';
import { dataMais } from './comum';

/**
 * "Onde você foi?" (D-061): na viagem que já começou ou foi registrada, achar pelo nome o restaurante,
 * o ponto turístico ou o hotel, marcar "Fui aqui" e ir direto para a avaliação (estrelas, comentário,
 * acessibilidade e quanto gastou).
 */
export function OndeFui({ v, recarregar }: { v: ViagemCompleta; recarregar: () => void }) {
  const navegar = useNavigate();
  const [termo, setTermo] = useState('');
  const [achados, setAchados] = useState<LugarBase[]>([]);
  const [salvando, setSalvando] = useState<string | null>(null);
  const destino = v.viagem.destino_id;
  useEffect(() => {
    if (!destino) return;
    const t = setTimeout(() => void procurarNaCidade(destino, termo).then(setAchados), 300);
    return () => clearTimeout(t);
  }, [termo, destino]);
  if (!destino) return null;

  const fuiAqui = async (b: LugarBase) => {
    setSalvando(b.id);
    if (b.categoria === 'hospedagem') {
      // Hotel vira a hospedagem da viagem (sem preço) e abre a avaliação.
      if (typeof b.lat === 'number' && typeof b.lon === 'number') await informarHospedagem(v.viagem.id, { id: b.id, nome: b.nome, endereco: b.endereco ?? null, lat: b.lat, lon: b.lon }, v.viagem.data_ida, dataMais(v.viagem.data_ida, v.viagem.noites), null);
    } else {
      await adicionarVisitado(v.viagem.id, b.id, CATEGORIAS_LUGAR[b.categoria]?.roteiro?.slots[0] ?? 'afternoon');
    }
    setSalvando(null);
    recarregar();
    navegar(`/lugar/${b.id}?viagem=${v.viagem.id}#avaliar=1`);
  };

  return (
    <section aria-label="Onde você foi" style={{ marginBottom: '14px', padding: '14px', borderRadius: '12px', background: 'var(--cartao-2)' }}>
      <h2 style={{ margin: 0, font: "600 18px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Onde você foi?</h2>
      <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: '2px 0 0' }}>Restaurante, passeio ou hotel. Ache e avalie.</p>
      <label style={{ display: 'block', marginTop: '8px' }}>
        <span className="visualmente-oculto">Nome do lugar</span>
        <input className="r-input" value={termo} onChange={(e) => setTermo(e.target.value)} placeholder={`Ex.: um restaurante de ${v.viagem.destino}`}
          style={{ display: 'block', width: '100%', boxSizing: 'border-box', minHeight: '46px', padding: '0 12px', borderRadius: '10px', font: "500 16px 'Open Sans'", color: 'var(--texto)', background: 'var(--fundo)', border: 0 }} />
      </label>
      {achados.map((b) => (
        <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', minHeight: '52px', borderTop: '1px solid var(--linha)' }}>
          <span style={{ minWidth: 0 }}>
            <b style={{ display: 'block', fontSize: '15px' }}>{b.nome}</b>
            <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{[nomeTipo(b.tipo), b.bairro].filter(Boolean).join(' · ')}</span>
          </span>
          <button type="button" className="r-btn" disabled={salvando === b.id} onClick={() => void fuiAqui(b)}
            style={{ flex: 'none', minHeight: '40px', padding: '0 12px', borderRadius: '20px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 14px 'Open Sans'" }}>{salvando === b.id ? 'Salvando…' : 'Fui aqui'}</button>
        </div>
      ))}
      {termo.trim().length >= 2 && !achados.length ? <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>Não achamos. Tente outra parte do nome.</p> : null}
    </section>
  );
}
