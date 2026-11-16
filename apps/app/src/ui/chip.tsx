import type { CSSProperties, KeyboardEvent } from 'react';

import { useDemo } from '../dev/demo';
import { useEscolhas } from '../state/escolhas';

/**
 * Opção do design que a pessoa marca e desmarca (os "chips"). O visual de marcado e
 * desmarcado é o do design. No modo de comparação (/dev/telas) mostra o estado do design;
 * no app começa vazio (ou com a opção do design, quando o grupo exige uma escolha).
 */
export function Chip({
  grupo,
  valor,
  modo,
  marcadoNoDesign,
  comCheck,
  estiloMarcado,
  estiloDesmarcado,
}: {
  grupo: string;
  valor: string;
  modo: 'um' | 'varios';
  marcadoNoDesign: boolean;
  comCheck: boolean;
  estiloMarcado: CSSProperties;
  estiloDesmarcado: CSSProperties;
}) {
  const demo = useDemo();
  const salvos = useEscolhas((s) => s.valores[grupo]);
  const definir = useEscolhas((s) => s.definir);
  const padrao = INICIAIS[grupo];
  const atuais = salvos ?? padrao ?? [];
  const marcado = demo ? marcadoNoDesign : atuais.includes(valor);

  const alternar = () => {
    if (demo) return;
    if (modo === 'um') definir(grupo, [valor]);
    else definir(grupo, marcado ? atuais.filter((v) => v !== valor) : [...atuais, valor]);
  };

  return (
    <div
      role={modo === 'um' ? 'radio' : 'checkbox'}
      aria-checked={marcado}
      tabIndex={0}
      onClick={alternar}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          alternar();
        }
      }}
      style={marcado ? estiloMarcado : estiloDesmarcado}>
      {marcado && comCheck ? `✓ ${valor}` : valor}
    </div>
  );
}

/** Grupos de escolha única começam com a opção do design (ex.: ritmo, por data/valor). */
const INICIAIS: Record<string, string[]> = {};
export function registrarInicial(grupo: string, valores: string[]) {
  INICIAIS[grupo] ??= valores;
}
