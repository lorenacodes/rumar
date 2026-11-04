/**
 * Apresentação visual de cada destino (paleta do cartão-postal e frase de clima).
 * Não contém dados factuais: preço, regra e custo vêm do catálogo, com procedência.
 *
 * ⚠️ Os destinos atuais são fictícios; as frases abaixo descrevem só o "clima"
 * visual do cartão de demonstração.
 */
export interface DestinationLook {
  /** Gradiente do cartão-postal, do topo para a base. */
  readonly palette: readonly string[];
  /** Cor do texto sobre o gradiente. */
  readonly ink: string;
  readonly mood: string;
}

const LOOKS: Record<string, DestinationLook> = {
  'sim-a': {
    palette: ['#FF6B35', '#FF9F1C', '#FFD23F'],
    ink: '#0E0F0B',
    mood: 'Fim de tarde dourado, mesa na calçada, cidade que não tem pressa.',
  },
  'sim-b': {
    palette: ['#2B1B17', '#8A2E0E', '#E8662A'],
    ink: '#FFFCEB',
    mood: 'Ruas de pedra, museus, café quente e caminhadas sem fim.',
  },
};

const FALLBACK: DestinationLook = {
  palette: ['#C2410C', '#FF5A1F', '#FFC845'],
  ink: '#0E0F0B',
  mood: 'Um lugar novo esperando por você.',
};

export function lookFor(destinationId: string): DestinationLook {
  return LOOKS[destinationId] ?? FALLBACK;
}
