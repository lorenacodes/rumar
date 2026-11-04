import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribe = () => () => {};

/**
 * Na renderização estática (web), o servidor não sabe o tema do usuário:
 * usa "light" no servidor e o valor real no cliente, sem efeito extra.
 */
export function useColorScheme() {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const colorScheme = useRNColorScheme();
  return isClient ? colorScheme : 'light';
}
