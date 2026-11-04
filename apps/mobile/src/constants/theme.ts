/**
 * Identidade visual do Rumar — v2.
 *
 * DNA herdado da Buovai: papel creme, tinta quase preta, cantos retos, tipografia
 * Lexend Exa nos títulos e Open Sans no texto, rótulos "//01", listas numeradas e
 * gradientes acetinados verde-floresta → lima.
 *
 * Tradução para viagem: o painel de embarque do aeroporto (preto + amarelo de
 * sinalização) e o cartão de embarque. Cada destino ganha uma paleta própria
 * para os cartões-postais.
 */
import '@/global.css';

export const Palette = {
  paper: '#FFFCEB',
  paperDeep: '#F1EED8',
  paperLine: '#C9CBB5',
  ink: '#0E0F0B',
  ink2: '#2B2E24',
  inkMuted: '#6B6F60',
  forest: '#1F4905',
  leaf: '#457528',
  lime: '#DEFA9A',
  signal: '#FFD23F',
  stamp: '#C2410C',
  board: '#0E0F0B',
  boardLine: '#2B2E24',
} as const;

export const Colors = {
  light: {
    text: Palette.ink,
    textSecondary: Palette.inkMuted,
    background: Palette.paper,
    surface: '#FFFEF6',
    surfaceMuted: Palette.paperDeep,
    border: Palette.paperLine,
    strongBorder: Palette.ink,
    primary: Palette.ink,
    onPrimary: Palette.paper,
    highlight: Palette.lime,
    onHighlight: Palette.ink,
    signal: Palette.signal,
    accent: Palette.leaf,
    success: Palette.leaf,
    successSoft: Palette.lime,
    warning: '#7A5200',
    warningSoft: '#FDEFB8',
    danger: Palette.stamp,
    dangerSoft: '#FBE2D5',
  },
  dark: {
    text: Palette.paper,
    textSecondary: '#A7AA97',
    background: Palette.ink,
    surface: '#17190F',
    surfaceMuted: '#22251A',
    border: '#33362B',
    strongBorder: Palette.paper,
    primary: Palette.paper,
    onPrimary: Palette.ink,
    highlight: Palette.lime,
    onHighlight: Palette.ink,
    signal: Palette.signal,
    accent: '#9CCB6E',
    success: '#9CCB6E',
    successSoft: '#26361A',
    warning: Palette.signal,
    warningSoft: '#3A3010',
    danger: '#FF8A5C',
    dangerSoft: '#3E1F12',
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

/** Gradiente acetinado da marca (verde Buovai → lima), usado no onboarding. */
export const BrandSatin = [Palette.forest, Palette.leaf, '#8DB85A', Palette.lime] as const;
