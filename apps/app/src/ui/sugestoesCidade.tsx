import { useEffect, useState } from 'react';

import { buscarCidades, carregarCidades, detalheCidade, rotuloCidade, type Cidade } from '../lib/cidades';

/**
 * Estado de um campo de cidade com sugestões (1.3 "Onde moro", 5.14 "Cidade de onde
 * saio"): o texto digitado e a cidade escolhida na lista. Só vale cidade escolhida.
 */
export function useCampoCidade(textoInicial: string, escolhidaInicial: Cidade | null) {
  const [texto, setTexto] = useState(textoInicial);
  const [escolhida, setEscolhida] = useState<Cidade | null>(escolhidaInicial);
  const [aberta, setAberta] = useState(false);
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    let vivo = true;
    void carregarCidades().then(() => vivo && setPronta(true));
    return () => {
      vivo = false;
    };
  }, []);

  const sugestoes = aberta && pronta && !escolhida ? buscarCidades(texto) : [];

  return {
    texto,
    escolhida,
    sugestoes,
    /** Mensagem embaixo do campo quando falta escolher da lista. */
    aviso:
      !escolhida && pronta && texto.trim().length >= 2 && sugestoes.length === 0
        ? aberta
          ? 'Não achamos essa cidade. Confira a grafia ou digite a cidade grande mais perto.'
          : 'Escolha sua cidade na lista para calcularmos os custos.'
        : null,
    definir(textoNovo: string, cidade: Cidade | null) {
      setTexto(textoNovo);
      setEscolhida(cidade);
    },
    digitar(v: string) {
      setTexto(v);
      setEscolhida(null);
      setAberta(true);
    },
    focar() {
      setAberta(true);
    },
    escolher(c: Cidade) {
      setEscolhida(c);
      setTexto(rotuloCidade(c));
      setAberta(false);
    },
    /** Atributos de acessibilidade para o input. */
    atributos: {
      autoComplete: 'off',
      role: 'combobox',
      'aria-autocomplete': 'list' as const,
      'aria-controls': 'cidades-sugeridas',
      'aria-expanded': false,
    },
  };
}

export function SugestoesCidade({ campo }: { campo: ReturnType<typeof useCampoCidade> }) {
  return (
    <div style={{ position: 'relative' }}>
      {campo.sugestoes.length > 0 ? (
        <ul id="cidades-sugeridas" role="listbox" aria-label="Cidades" style={{ position: 'absolute', zIndex: 2, left: 0, right: 0, top: 0, margin: 0, padding: 0, listStyle: 'none', background: 'var(--fundo)', border: '1px solid var(--linha)', borderTop: 'none', boxShadow: '0 8px 16px rgba(11,31,75,0.12)' }}>
          {campo.sugestoes.map((c) => (
            <li key={`${c.nome}|${c.regiao}|${c.pais}`} role="option" aria-selected={false}>
              <button type="button" className="r-btn" onClick={() => campo.escolher(c)} style={{ width: '100%', minHeight: '56px', padding: '8px 12px', boxSizing: 'border-box', textAlign: 'left', borderBottom: '1px solid var(--linha)', display: 'block' }}>
                <span style={{ display: 'block', font: "600 16px/22px 'Open Sans'" }}>{c.nome}</span>
                <span style={{ display: 'block', font: "400 14px/20px 'Open Sans'", color: 'var(--texto-sec)' }}>{detalheCidade(c)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : campo.aviso ? (
        <div role="status" style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '6px' }}>
          {campo.aviso}
        </div>
      ) : null}
    </div>
  );
}
