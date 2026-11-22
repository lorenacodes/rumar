import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { IDIOMA_DO_PAIS } from '../../lib/aulas';
import { destinoPorId, destinoPorNome, type Destino } from '../../lib/lugares';
import { carregarViagem, type ViagemCompleta } from '../../lib/viagens';
import { Abas } from '../../ui/abas';
import { BotaoContorno, Voltar } from '../../ui/pecas';

/**
 * Idioma da viagem: abre a trilha por módulos do idioma do destino (a mesma para todos, em /idiomas).
 * Destinos em português ou sem trilha mostram só um aviso curto e o atalho para as outras línguas.
 */
export function Idioma() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  const [v, setV] = useState<ViagemCompleta | null>(null);
  const [destino, setDestino] = useState<Destino | null>(null);

  useEffect(() => {
    void carregarViagem(id).then(async (x) => {
      setV(x);
      if (!x) return;
      setDestino(x.viagem.destino_id ? await destinoPorId(x.viagem.destino_id) : await destinoPorNome(x.viagem.destino));
    });
  }, [id]);
  const idioma = destino ? IDIOMA_DO_PAIS[destino.pais] : null;

  if (idioma) return <Navigate to={`/idiomas/${idioma.codigo}?viagem=${id}`} replace />;
  if (!v || !destino) return <main className="tela" aria-busy="true" style={{ padding: '40px 20px' }}>Carregando…</main>;
  const portugues = destino.pais === 'BR' || destino.pais === 'PT';
  return (
    <main className="tela" data-tela="idioma" data-real="idioma">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para={`/viagem/${id}`} />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>{destino.nome} · idioma</div>
        <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{portugues ? 'Aqui se fala português.' : 'Ainda sem aulas para este idioma.'}</h1>
        <p style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)' }}>{portugues ? 'Não precisa de aula de idioma para esta viagem.' : 'Temos aulas de inglês, espanhol, francês, italiano e alemão.'}</p>
        <div style={{ marginTop: '12px' }}><BotaoContorno onClick={() => navegar(`/idiomas?viagem=${id}`)}>Ver as aulas de idiomas</BotaoContorno></div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}
