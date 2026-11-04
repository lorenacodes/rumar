import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { FontFamily, MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

type Props = { label: string; selected: boolean; onPress: () => void };

export function Chip({ label, selected, onPress }: Props) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : 'transparent',
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}>
      <AppText style={[styles.label, { color: selected ? theme.onPrimary : theme.text }]}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: MinTouchTarget - 4,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: FontFamily.bodyStrong, fontSize: 15, lineHeight: 20 },
});
