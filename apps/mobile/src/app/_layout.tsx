import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StoreProvider, useStore } from '@/state/store';

SplashScreen.preventAutoHideAsync();

function HideSplashWhenReady() {
  const { ready } = useStore();
  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);
  return null;
}

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = Colors[scheme];
  const theme = {
    ...base,
    colors: { ...base.colors, background: colors.background, card: colors.background, text: colors.text, primary: colors.primary, border: colors.border },
  };
  return (
    <StoreProvider>
      <ThemeProvider value={theme}>
        <HideSplashWhenReady />
        <Stack screenOptions={{ headerShadowVisible: false, headerBackTitle: 'Voltar' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="destino/[id]" options={{ title: '' }} />
          <Stack.Screen name="aporte" options={{ presentation: 'modal', title: 'Registrar valor guardado' }} />
        </Stack>
      </ThemeProvider>
    </StoreProvider>
  );
}
