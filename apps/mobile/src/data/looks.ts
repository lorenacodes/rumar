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
    palette: ['#0B3C49', '#1D7874', '#79C7C5'],
    ink: '#FFFCEB',
    mood: 'Ruas de pedra, museus, café quente e caminhadas sem fim.',
  },
};

const FALLBACK: DestinationLook = {
  palette: ['#1F4905', '#457528', '#DEFA9A'],
  ink: '#FFFCEB',
  mood: 'Um lugar novo esperando por você.',
};

export function lookFor(destinationId: string): DestinationLook {
  return LOOKS[destinationId] ?? FALLBACK;
}
