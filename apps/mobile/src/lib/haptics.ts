import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Toque leve de confirmação. Silencioso na web. */
export function tapFeedback(): void {
  if (Platform.OS === 'web') return;
  void Haptics.selectionAsync().catch(() => undefined);
}

export function successFeedback(): void {
  if (Platform.OS === 'web') return;
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
}
