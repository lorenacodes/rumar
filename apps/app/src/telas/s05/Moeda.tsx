import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { salvarMoeda } from '../../conta/servico';
import { MOEDAS_REFERENCIA, NOME_MOEDA, paisPorCodigo, PAISES } from '../../lib/moedas';
import { usePlano } from '../../state/plano';
import { Aviso, BotaoPrincipal, Rodape, Voltar } from '../../ui/pecas';
import { campo, Rotulo } from '../viagens/comum';

/** País onde mora, moeda de referência e país do passaporte: escolhidos pela pessoa, editáveis. */
export function Moeda() {
  const navegar = useNavigate();
  const atual = usePlano();
  const [pais, setPais] = useState(atual.paisResidencia);
  const [moeda, setMoeda] = useState(atual.moedaReferencia);
  const [passaporte, setPassaporte] = useState(atual.paisPassaporte);
  const [erro, setErro] = useState<string | null>(null);
  const sugestao = paisPorCodigo(pais)?.moeda;
  const salvar = async () => {
    const ok = await salvarMoeda({ paisResidencia: pais, moedaReferencia: moeda, paisPassaporte: passaporte });
    if (!ok) return setErro('Não conseguimos salvar na conta. Confira a internet e tente de novo.');
    navegar('/perfil');
  };
  const select = { ...campo, font: "500 17px 'Open Sans'" };
  return (
    <main className="tela" data-tela="perfil-moeda" data-real="perfil-moeda">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        <Voltar para="/perfil" />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>Perfil</div>
        <h1 style={{ margin: '6px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>País e moeda</h1>
        <p style={{ fontSize: '15px', lineHeight: '21px', color: 'var(--texto-sec)' }}>Os custos das viagens aparecem na moeda do destino e na sua moeda de referência. Nada aqui é deduzido da sua nacionalidade: você escolhe.</p>
        <Rotulo><label htmlFor="pais">País onde você mora</label></Rotulo>
        <select id="pais" value={pais} onChange={(e) => setPais(e.target.value)} style={select}>
          {PAISES.map((p) => <option key={p.codigo} value={p.codigo}>{p.nome}</option>)}
        </select>
        <Rotulo><label htmlFor="moeda">Moeda de referência</label></Rotulo>
        <select id="moeda" value={moeda} onChange={(e) => setMoeda(e.target.value)} style={select}>
          {MOEDAS_REFERENCIA.map((m) => <option key={m} value={m}>{NOME_MOEDA[m]} ({m})</option>)}
        </select>
        {sugestao && sugestao !== moeda && MOEDAS_REFERENCIA.includes(sugestao) ? (
          <button type="button" className="r-btn" onClick={() => setMoeda(sugestao)} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Usar a moeda de {paisPorCodigo(pais)?.nome} ({sugestao})</button>
        ) : null}
        <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px' }}>Só aparecem moedas com cotação oficial do Banco Central no app. Viagens já criadas continuam na moeda em que foram planejadas.</div>
        <Rotulo><label htmlFor="passaporte">País do seu passaporte</label></Rotulo>
        <select id="passaporte" value={passaporte} onChange={(e) => setPassaporte(e.target.value)} style={select}>
          {PAISES.map((p) => <option key={p.codigo} value={p.codigo}>{p.nome}</option>)}
        </select>
        <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px' }}>As regras de visto dependem do passaporte, não de onde você mora. Hoje o app tem as regras conferidas para passaporte brasileiro; para outros, mostramos onde confirmar.</div>
        {erro ? <Aviso>{erro}</Aviso> : null}
        <div style={{ height: '16px' }} />
      </div>
      <Rodape>
        <BotaoPrincipal onClick={() => void salvar()}>Salvar</BotaoPrincipal>
      </Rodape>
    </main>
  );
}
