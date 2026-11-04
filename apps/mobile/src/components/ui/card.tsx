import { StyleSheet, View, type ViewProps } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = ViewProps & { tone?: 'surface' | 'highlight' | 'muted' };

/** Cartão de cantos retos, borda fina. */
export function Card({ style, tone = 'surface', ...rest }: Props) {
  const theme = useTheme();
  const bg = tone === 'highlight' ? theme.highlight : tone === 'muted' ? theme.surfaceMuted : theme.surface;
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bg, borderColor: tone === 'highlight' ? theme.highlight : theme.border },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, padding: Spacing.lg, gap: Spacing.sm },
});
