// app/mobile/src/wallet/ui/theme.ts
import { StyleSheet } from 'react-native';

export function useTheme() {
  // минимальная тема: цвета/тень/spacing, чтобы UI.tsx не ругался
  const shadowBase = StyleSheet.create({
    elevated: {
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  }).elevated;

  return {
    colors: { bg: '#0B0C10' },
    spacing: (n: number) => 8 * n,
    shadow: { elevated: shadowBase },
  };
}
