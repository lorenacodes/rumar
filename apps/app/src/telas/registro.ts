import type { ComponentType } from 'react';

import { Tela1_1 } from './s01/Tela1_1';
import { Tela1_2 } from './s01/Tela1_2';
import { Tela1_3 } from './s01/Tela1_3';
import { Tela1_4 } from './s01/Tela1_4';
import { Tela1_5 } from './s01/Tela1_5';
import { Tela5_1 } from './s05/Tela5_1';
import { Tela5_2Demo } from './s05/demo';
import { Tela5_3 } from './s05/Tela5_3';
import { Tela5_4 } from './s05/Tela5_4';
import { Tela5_5 } from './s05/Tela5_5';
import { Tela5_7 } from './s05/Tela5_7';
import { Tela5_13, Tela5_14, Tela5_15, Tela5_17, Tela5_18 } from './s05/perfil';
import { Tela5_10, Tela5_11, Tela5_12, Tela5_16, Tela5_8, Tela5_9 } from './s05/senha';
import { Tela28_7 } from './s28/Tela28_7';

/**
 * Telas implementadas, pelo id do design (seção.tela).
 * Usado pela rota /dev/telas/<id> e pelo teste visual.
 */
export const TELAS: Readonly<Record<string, ComponentType>> = {
  '1.1': Tela1_1,
  '1.2': Tela1_2,
  '1.3': Tela1_3,
  '1.4': Tela1_4,
  '1.5': Tela1_5,
  '5.1': Tela5_1,
  '5.2': Tela5_2Demo,
  '5.3': Tela5_3,
  '5.4': Tela5_4,
  '5.5': Tela5_5,
  '5.7': Tela5_7,
  '5.8': Tela5_8,
  '5.9': Tela5_9,
  '5.10': Tela5_10,
  '5.11': Tela5_11,
  '5.12': Tela5_12,
  '5.13': Tela5_13,
  '5.14': Tela5_14,
  '5.15': Tela5_15,
  '5.16': Tela5_16,
  '5.17': Tela5_17,
  '5.18': Tela5_18,
  '28.7': Tela28_7,
};
