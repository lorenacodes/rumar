import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontFamily, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'eyebrow'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'number'
  | 'board';

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: ThemeColor;
};

export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const theme = useTheme();
  const isHeading = variant === 'display' || variant === 'title' || variant === 'heading';
  return (
    <Text
      accessibilityRole={isHeading ? 'header' : undefined}
      maxFontSizeMultiplier={1.6}
      style={[styles[variant], { color: theme[color] }, style]}
      {...rest}
    />
  );
}

/** Fontes customizadas: o peso vem da família, nunca de `fontWeight`. */
const styles = StyleSheet.create({
  display: { fontFamily: FontFamily.display, fontSize: 30, lineHeight: 38, letterSpacing: -1 },
  title: { fontFamily: FontFamily.display, fontSize: 24, lineHeight: 30, letterSpacing: -0.8 },
  heading: { fontFamily: FontFamily.display, fontSize: 16, lineHeight: 22, letterSpacing: -0.3 },
  /** Rótulo curto, em frase normal (sem maiúsculas forçadas). */
  eyebrow: { fontFamily: FontFamily.bodyStrong, fontSize: 13, lineHeight: 18 },
  body: { fontFamily: FontFamily.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: FontFamily.bodyStrong, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 18 },
  number: { fontFamily: FontFamily.displayStrong, fontSize: 30, lineHeight: 36, letterSpacing: -1, fontVariant: ['tabular-nums'] },
  board: { fontFamily: FontFamily.display, fontSize: 15, lineHeight: 20, letterSpacing: -0.2, fontVariant: ['tabular-nums'] },
});
