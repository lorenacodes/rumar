import type { Destination } from '@rumar/core';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Satin } from '@/components/satin';
import { AppText } from '@/components/ui/app-text';
import { Spacing } from '@/constants/theme';
import { lookFor } from '@/data/looks';

type Props = {
  destination: Destination;
  originIata: string;
  height?: number;
  /** Espaço extra no topo (área segura + botão voltar). */
  topInset?: number;
  children?: ReactNode;
};

/** Cartão-postal do destino: gradiente próprio, nome grande, rota e clima. */
export function Postcard({ destination, originIata, height = 200, topInset = 0, children }: Props) {
  const look = lookFor(destination.id);
  return (
    <Satin colors={look.palette} style={{ minHeight: height }}>
      <View style={[styles.inner, topInset > 0 && { paddingTop: topInset }]}>
        <View style={styles.top}>
          <AppText variant="eyebrow" style={{ color: look.ink }}>
            {originIata} → {destination.mainAirportIata}
          </AppText>
          <View style={[styles.stamp, { borderColor: look.ink }]}>
            <AppText variant="eyebrow" style={[styles.stampText, { color: look.ink }]}>
              {destination.countryCode}
            </AppText>
          </View>
        </View>
        <View style={styles.bottom}>
          <AppText variant="display" style={[styles.city, { color: look.ink }]}>
            {destination.city}
          </AppText>
          <AppText variant="body" style={{ color: look.ink }}>
            {look.mood}
          </AppText>
          {children}
        </View>
      </View>
    </Satin>
  );
}

const styles = StyleSheet.create({
  inner: { flex: 1, padding: Spacing.lg, justifyContent: 'space-between', gap: Spacing.lg },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bottom: { gap: Spacing.xs },
  city: { fontSize: 30, lineHeight: 36 },
  stamp: { borderWidth: 1.5, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xxs, transform: [{ rotate: '-6deg' }] },
  stampText: { fontSize: 12 },
});
