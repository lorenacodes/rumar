import { useEscolhas } from '../state/escolhas';

/**
 * Ações de um toque do design antes de mudar de tela. Destino no formato
 * "acao:<nome>><rota>" em tools/design/navegacao.json.
 */
export const ACOES: Record<string, () => void> = {
  /** 6.2 "Permitir e ajustar": aceite específico para usar as necessidades (LGPD art. 11). */
  consentirNecessidades: () => useEscolhas.getState().consentir(true),
  /** 6.2 "Agora não": o roteiro segue sem usar as necessidades marcadas. */
  recusarNecessidades: () => {
    const s = useEscolhas.getState();
    s.consentir(false);
    s.definir('6.1:necessidades', []);
  },
};
