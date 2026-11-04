import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { FontFamily, MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

type Variant = 'primary' | 'outline' | 'highlight' | 'ghost';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  /** Seta ↗ no fim, como no site da Buovai. */
  arrow?: boolean;
};

export function Button({ label, variant = 'primary', loading, disabled, arrow, style, onPress, ...rest }: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const colors = {
    primary: { bg: theme.primary, fg: theme.onPrimary, border: theme.primary },
    outline: { bg: 'transparent', fg: theme.text, border: theme.strongBorder },
    highlight: { bg: theme.highlight, fg: theme.onHighlight, border: theme.highlight },
    ghost: { bg: 'transparent', fg: theme.text, border: 'transparent' },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      onPress={(e) => {
        tapFeedback();
        onPress?.(e);
      }}
      style={(state) => [
        styles.base,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: isDisabled ? 0.4 : state.pressed ? 0.8 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={colors.fg} />
      ) : (
        <AppText
          style={[styles.label, { color: colors.fg }, variant === 'ghost' && styles.ghostLabel]}
          numberOfLines={2}>
          {label}
          {arrow ? '  ↗' : ''}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MinTouchTarget + 4,
    borderWidth: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: FontFamily.bodyStrong, fontSize: 16, lineHeight: 22, textAlign: 'center' },
  ghostLabel: { textDecorationLine: 'underline' },
});
