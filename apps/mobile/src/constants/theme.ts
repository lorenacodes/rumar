/**
 * Design tokens do Rumar.
 * Paleta: azul-profundo (horizonte, confiança) + coral (ação, calor humano).
 * As cores dos selos de procedência fazem parte da identidade e nunca são a única
 * forma de transmitir a informação (sempre ícone + texto).
 */
import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0B1F2E',
    textSecondary: '#5B7184',
    background: '#FBF8F4',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF1F4',
    border: '#DDE3E8',
    primary: '#125A86',
    primaryStrong: '#0B3D5C',
    primarySoft: '#E3F1FA',
    onPrimary: '#FFFFFF',
    accent: '#E4572E',
    accentSoft: '#FDE8DF',
    success: '#1F8A4C',
    successSoft: '#E2F4E9',
    warning: '#9A6413',
    warningSoft: '#FBF0DC',
    danger: '#C53030',
    dangerSoft: '#FCE4E4',
  },
  dark: {
    text: '#EAF2F8',
    textSecondary: '#A9B7C3',
    background: '#071520',
    surface: '#0E2232',
    surfaceMuted: '#173247',
    border: '#24445C',
    primary: '#5DB3EA',
    primaryStrong: '#8CCBF2',
    primarySoft: '#123A55',
    onPrimary: '#071520',
    accent: '#FF8A5C',
    accentSoft: '#4A2416',
    success: '#4CC283',
    successSoft: '#123826',
    warning: '#E8B04E',
    warningSoft: '#3D2C0E',
    danger: '#F07070',
    dangerSoft: '#401818',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };
export type ThemeColor = keyof ThemeColors;

export const Fonts = Platform.select({
  web: { sans: 'var(--font-display)', mono: 'var(--font-mono)' },
  default: { sans: undefined, mono: 'monospace' },
});

export const Spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const Radius = { sm: 8, md: 12, lg: 20, pill: 999 } as const;

export const MaxContentWidth = 640;

/** Alvo mínimo de toque (acessibilidade): 48dp. */
export const MinTouchTarget = 48;
