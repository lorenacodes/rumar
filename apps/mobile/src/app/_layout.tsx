import {
  LexendExa_300Light,
  LexendExa_500Medium,
  LexendExa_600SemiBold,
} from '@expo-google-fonts/lexend-exa';
import { OpenSans_400Regular, OpenSans_500Medium, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Colors, FontFamily } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StoreProvider, useStore } from '@/state/store';

SplashScreen.preventAutoHideAsync();

function HideSplashWhenReady({ fontsReady }: { fontsReady: boolean }) {
  const { ready } = useStore();
  useEffect(() => {
    if (ready && fontsReady) void SplashScreen.hideAsync();
  }, [ready, fontsReady]);
  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    LexendExa_300Light,
    LexendExa_500Medium,
    LexendExa_600SemiBold,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
  });
  // Se as fontes falharem, o app segue com as fontes do sistema em vez de travar.
  const fontsReady = fontsLoaded || !!fontError;

  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = Colors[scheme];
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      primary: colors.text,
      border: colors.border,
    },
  };

  if (!fontsReady) return null;

  return (
    <StoreProvider>
      <ThemeProvider value={theme}>
        <HideSplashWhenReady fontsReady={fontsReady} />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerBackTitle: 'Voltar',
            headerTitleStyle: { fontFamily: FontFamily.display, fontSize: 15 },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="destino/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="jeito-de-viajar" options={{ title: 'Seu jeito de viajar' }} />
          <Stack.Screen name="roteiro" options={{ title: 'Seu roteiro' }} />
          <Stack.Screen name="aporte" options={{ presentation: 'modal', title: 'Registrar valor guardado' }} />
        </Stack>
      </ThemeProvider>
    </StoreProvider>
  );
}
