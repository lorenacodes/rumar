import type { ComponentType } from 'react';

import { Tela1_1 } from './s01/Tela1_1';
import { Tela1_2 } from './s01/Tela1_2';

/**
 * Telas implementadas, pelo id do design (seção.tela).
 * Usado pela rota /dev/telas/<id> e pelo teste visual.
 */
export const TELAS: Readonly<Record<string, ComponentType>> = {
  '1.1': Tela1_1,
  '1.2': Tela1_2,
};
