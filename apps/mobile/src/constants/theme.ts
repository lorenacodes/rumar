/**
 * Identidade visual do Rumar — v3.
 *
 * Base herdada da Buovai: papel creme, tinta quase preta, cantos retos e a
 * tipografia Lexend Exa (títulos) + Open Sans (texto).
 *
 * Personalidade de viagem: preto + laranja de pôr do sol, com amarelo-sol e areia
 * só como apoio. Tom humano e editorial (revista de viagem), não tecnológico:
 * rótulos em frase normal, sem códigos "//01" nem texto todo em maiúsculas.
 */
import '@/global.css';

export const Palette = {
  paper: '#FFFCEB',
  sand: '#F4EBD6',
  sandLine: '#D9CDB3',
  ink: '#0E0F0B',
  ink2: '#2B2A26',
  inkMuted: '#6E6A5E',
  /** Laranja de preenchimento (botões de destaque, barras, selos). */
  orange: '#FF5A1F',
  /** Laranja para texto sobre o creme (contraste AA). */
  orangeDeep: '#B8400C',
  orangeSoft: '#FFE2D2',
  sun: '#FFC845',
  sunSoft: '#FFF0C7',
  board: '#0E0F0B',
  boardLine: '#2B2A26',
} as const;

export const Colors = {
  light: {
    text: Palette.ink,
    textSecondary: Palette.inkMuted,
    background: Palette.paper,
    surface: '#FFFEF7',
    surfaceMuted: Palette.sand,
    border: Palette.sandLine,
    strongBorder: Palette.ink,
    primary: Palette.ink,
    onPrimary: Palette.paper,
    highlight: Palette.orange,
    onHighlight: Palette.ink,
    accent: Palette.orangeDeep,
    accentFill: Palette.orange,
    accentSoft: Palette.orangeSoft,
    success: Palette.orangeDeep,
    successSoft: Palette.orangeSoft,
    warning: '#7A5200',
    warningSoft: Palette.sunSoft,
    danger: '#A32A0A',
    dangerSoft: '#F6D9CF',
  },
  dark: {
    text: Palette.paper,
    textSecondary: '#ABA594',
    background: Palette.ink,
    surface: '#1A1915',
    surfaceMuted: '#25231E',
    border: '#3A3730',
    strongBorder: Palette.paper,
    primary: Palette.paper,
    onPrimary: Palette.ink,
    highlight: Palette.orange,
    onHighlight: Palette.ink,
    accent: '#FF8A5C',
    accentFill: Palette.orange,
    accentSoft: '#3D1E10',
    success: '#FF8A5C',
    successSoft: '#3D1E10',
    warning: Palette.sun,
    warningSoft: '#3A2E10',
    danger: '#FF8A70',
    dangerSoft: '#40180E',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };
export type ThemeColor = keyof ThemeColors;

/** Nomes registrados em `useFonts` no layout raiz. */
export const FontFamily = {
  display: 'LexendExa_500Medium',
  displayStrong: 'LexendExa_600SemiBold',
  displayLight: 'LexendExa_300Light',
  body: 'OpenSans_400Regular',
  bodyMedium: 'OpenSans_500Medium',
  bodyStrong: 'OpenSans_600SemiBold',
} as const;

export const Spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

/** Cantos retos são parte da identidade. */
export const Radius = { none: 0, hairline: 2, pill: 999 } as const;

export const MaxContentWidth = 640;

/** Alvo mínimo de toque (acessibilidade): 48dp. */
export const MinTouchTarget = 48;

/** Gradiente de pôr do sol da marca, usado no onboarding. */
export const BrandSunset = ['#C2410C', Palette.orange, '#FF8A3D', Palette.sun] as const;
