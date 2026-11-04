import type { ViabilityStatus } from '@rumar/core';

import type { ThemeColor } from '@/constants/theme';

export const VIABILITY_UI: Record<ViabilityStatus, { label: string; fg: ThemeColor; bg: ThemeColor; icon: string }> = {
  viable: { label: 'Dá para ir', fg: 'success', bg: 'successSoft', icon: '✓' },
  tight: { label: 'Quase lá', fg: 'warning', bg: 'warningSoft', icon: '~' },
  not_yet: { label: 'Ainda não', fg: 'textSecondary', bg: 'surfaceMuted', icon: '·' },
  too_soon: { label: 'Sem tempo p/ documentos', fg: 'danger', bg: 'dangerSoft', icon: '!' },
  no_data: { label: 'Sem dados', fg: 'textSecondary', bg: 'surfaceMuted', icon: '?' },
};
