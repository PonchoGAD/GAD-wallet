// app/mobile/src/wallet/ui/theme.ts
// ---------------------------------------------
//   GAD Wallet Theme — единый стиль для мобилки
//   (подготовлено под будущие light/dark темы)
// ---------------------------------------------

import { StyleSheet } from 'react-native';

export type GTheme = {
  colors: {
    // базовые
    bg: string;
    card: string;
    cardAlt: string;
    border: string;

    // акценты / бренд
    primary: string;
    primarySoft: string;
    accent: string;
    accentSoft: string;

    // текст
    text: string;
    textMuted: string;

    // состояния
    danger: string;
    success: string;

    // инпуты / чипы
    inputBg: string;
    chipBg: string;
  };
  spacing: (n: number) => number;
  shadow: {
    elevated: ReturnType<typeof StyleSheet.create>['elevated'];
  };
};

/**
 * Пока тема одна (dark), но структура уже готова, чтобы позже
 * добавить переключение light/dark или кастомизацию из настроек.
 */
export function useTheme(): GTheme {
  const shadowBase = StyleSheet.create({
    elevated: {
      shadowColor: '#000000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  }).elevated;

  return {
    colors: {
      // общий фон кошелька
      bg: '#05060A',
      // карточки / панели
      card: '#10121A',
      cardAlt: '#151824',
      // бордеры
      border: '#2A2E37',

      // главное бренд-ощущение (кнопки / ссылки)
      primary: '#0A84FF',      // основной action-цвет
      primarySoft: '#1D4ED8',  // наведение / pressed

      // фирменное золото + мягкий неон
      accent: '#D4AF37',
      accentSoft: '#80FFD3',

      text: '#F9FAFB',
      textMuted: '#9CA3AF',

      danger: '#EF4444',
      success: '#22C55E',

      inputBg: '#111827',
      chipBg: '#1F2933',
    },
    spacing: (n: number) => 8 * n,
    shadow: { elevated: shadowBase },
  };
}
