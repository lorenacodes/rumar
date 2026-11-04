import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  colors: readonly string[];
  style?: ViewStyle;
  children?: ReactNode;
};

/**
 * Gradiente "acetinado" (herdado do site da Buovai): duas camadas em ângulos
 * diferentes criam profundidade sem precisar de foto.
 */
export function Satin({ colors, style, children }: Props) {
  const stops = colors.length >= 2 ? colors : [colors[0] ?? '#000', colors[0] ?? '#000'];
  const reversed = [...stops].reverse();
  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={stops as unknown as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[`${reversed[0]}00`, `${reversed[0]}99`, `${reversed[1]}00`]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0.9 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ root: { overflow: 'hidden' } });
