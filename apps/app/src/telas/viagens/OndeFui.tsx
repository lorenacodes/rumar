import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CATEGORIAS_LUGAR, nomeTipo, procurarNaCidade, type LugarBase } from '../../lib/lugares';
import { adicionarLugarLivre, adicionarVisitado, informarHospedagem, removerItem, type ViagemCompleta } from '../../lib/viagens';
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
  const livres = v.itens.filter((x) => x.place_id.startsWith('livre-') && x.nome_livre);
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
      <p style={{ fontSize: '14px', color: 'var(--texto-sec)', margin: '2px 0 0' }}>Restaurante, passeio, bairro ou hotel. Ache e avalie.</p>
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
      {termo.trim().length >= 3 ? (
        // Bairro, evento ou lugar que não está na base (D-070): fica na viagem com o nome escrito.
        <button type="button" className="r-btn" disabled={salvando === 'livre'}
          onClick={() => { setSalvando('livre'); void adicionarLugarLivre(v.viagem.id, termo).then(() => { setSalvando(null); setTermo(''); recarregar(); }); }}
          style={{ display: 'block', width: '100%', textAlign: 'left', minHeight: '48px', marginTop: '6px', borderTop: '1px solid var(--linha)', color: 'var(--azul)', fontWeight: 600, fontSize: '15px' }}>
          {achados.length ? 'Não é nenhum desses? ' : 'Não achamos. '}Registrar "{termo.trim().slice(0, 40)}"
        </button>
      ) : null}
      {livres.length ? (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Você também foi</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {livres.map((it) => (
              <span key={it.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', minHeight: '36px', padding: '0 4px 0 12px', borderRadius: '18px', background: 'var(--fundo)', fontSize: '14px', fontWeight: 600 }}>
                {it.nome_livre}
                <button type="button" className="r-btn" aria-label={`Tirar ${it.nome_livre}`} onClick={() => void removerItem(it).then(recarregar)} style={{ minWidth: '32px', minHeight: '32px', color: 'var(--texto-sec)' }}>×</button>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
