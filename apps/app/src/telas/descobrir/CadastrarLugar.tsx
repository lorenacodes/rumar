import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useSessao } from '../../conta/servico';
import { destinoPorId, type Destino } from '../../lib/lugares';
import { cadastrarLugar, type CategoriaCadastro } from '../../lib/cadastroLugar';
import { Abas } from '../../ui/abas';
import { MarcarNoMapa } from '../../ui/MarcarNoMapa';
import { BotaoPrincipal, Voltar } from '../../ui/pecas';

const TIPOS: { id: CategoriaCadastro; nome: string }[] = [
  { id: 'restaurantes', nome: 'Restaurante' },
  { id: 'bares', nome: 'Bar' },
  { id: 'cafes', nome: 'Café ou padaria' },
];

/**
 * Cadastrar um restaurante, bar ou café que ainda não está no app (D-089): nome, tipo e o ponto no mapa.
 * Depois abre a ficha com a avaliação pronta para preencher.
 */
export function CadastrarLugar() {
  const [params] = useSearchParams();
  const navegar = useNavigate();
  const sessao = useSessao();
  const destinoId = params.get('d') ?? '';
  const [destino, setDestino] = useState<Destino | null | undefined>(undefined);
  const [nome, setNome] = useState(params.get('nome') ?? '');
  const [tipo, setTipo] = useState<CategoriaCadastro>((['restaurantes', 'bares', 'cafes'] as string[]).includes(params.get('tipo') ?? '') ? (params.get('tipo') as CategoriaCadastro) : 'restaurantes');
  const [ponto, setPonto] = useState<{ lat: number; lon: number } | null>(null);
  const [endereco, setEndereco] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => { void destinoPorId(destinoId).then((d) => setDestino(d ?? null)); }, [destinoId]);
  useEffect(() => { if (sessao === null) navegar('/entrar', { replace: true }); }, [sessao, navegar]);

  if (destino === undefined || sessao === undefined) return <main className="tela" aria-busy="true" style={{ padding: '40px 20px' }}>Carregando…</main>;
  if (!destino || destino.lat == null || destino.lon == null) {
    return (
      <main className="tela" data-tela="cadastrar-lugar">
        <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
          <Voltar para="/descobrir" />
          <p style={{ fontSize: '15px' }}>Escolha a cidade no Descobrir antes de cadastrar.</p>
        </div>
        <Abas ativa="descobrir" />
      </main>
    );
  }

  const pronto = nome.trim().length >= 2 && ponto !== null && !enviando;
  const enviar = async () => {
    if (!ponto) return;
    setEnviando(true); setErro(null);
    const r = await cadastrarLugar({ destino: destino.id, nome, categoria: tipo, lat: ponto.lat, lon: ponto.lon, endereco });
    setEnviando(false);
    if ('erro' in r) { setErro(r.erro); return; }
    navegar(`/lugar/${r.id}#avaliar=1`, { replace: true });
  };

  const rotulo = { display: 'block', margin: '18px 0 6px', font: "600 15px 'Open Sans'" } as const;
  const campo = { width: '100%', boxSizing: 'border-box', minHeight: '48px', padding: '0 14px', borderRadius: '12px', border: '1px solid var(--linha)', background: 'var(--cartao-1)', color: 'var(--texto)', font: "400 16px 'Open Sans'" } as const;
  return (
    <main className="tela" data-tela="cadastrar-lugar">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 24px' }}>
        <Voltar para={`/descobrir?d=${destino.id}`} />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>{destino.nome}</div>
        <h1 style={{ margin: '6px 0 0', font: "600 28px/33px 'Lexend Exa'", letterSpacing: '-0.02em' }}>Cadastre onde você comeu.</h1>
        <p style={{ margin: '8px 0 0', fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)' }}>Depois é só avaliar e contar quanto gastou.</p>

        <label htmlFor="cad-nome" style={rotulo}>Nome do lugar</label>
        <input id="cad-nome" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={120} autoComplete="off" placeholder="Ex.: Bar do Peixe" style={campo} />

        <div role="radiogroup" aria-label="Tipo" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
          {TIPOS.map((t) => (
            <button key={t.id} type="button" role="radio" aria-checked={tipo === t.id} className="r-btn" onClick={() => setTipo(t.id)}
              style={{ minHeight: '44px', padding: '0 16px', borderRadius: '999px', background: tipo === t.id ? 'var(--fundo-escuro)' : 'var(--cartao-2)', color: tipo === t.id ? '#fff' : 'var(--texto)', font: "600 14px 'Open Sans'" }}>
              {t.nome}
            </button>
          ))}
        </div>

        <span style={rotulo}>Toque no mapa onde ele fica</span>
        <MarcarNoMapa centro={{ lat: destino.lat, lon: destino.lon }} ponto={ponto} aoMarcar={setPonto} />
        <p aria-live="polite" style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--texto-sec)' }}>{ponto ? 'Marcado. Arraste o marcador para ajustar.' : 'Aproxime o mapa para acertar a rua.'}</p>

        <label htmlFor="cad-endereco" style={rotulo}>Endereço (se souber)</label>
        <input id="cad-endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} maxLength={200} autoComplete="off" placeholder="Rua e número" style={campo} />

        {erro ? <p role="alert" style={{ margin: '14px 0 0', fontSize: '15px', color: 'var(--vermelho)' }}>{erro}</p> : null}
        <div style={{ marginTop: '20px' }}>
          <BotaoPrincipal onClick={() => void enviar()} disabled={!pronto}>{enviando ? 'Cadastrando…' : 'Cadastrar e avaliar'}</BotaoPrincipal>
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '13px', color: 'var(--texto-sec)' }}>Só estabelecimentos. Nada de endereço de casa.</p>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}
