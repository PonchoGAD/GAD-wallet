// app/mobile/src/wallet/ui/components/UI.tsx
// ---------------------------------------------
//   Базовые UI-компоненты: Card, GButton
//   Всё завязано на useTheme, без жёстких цветов
// ---------------------------------------------

import React, { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme';

type CardProps = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  children?: ReactNode;
};

/**
 * Карточка с заголовком в фирменном стиле:
 * золотой бордер, тёмный фон, мягкая тень.
 */
export const Card = ({ title, subtitle, style, children }: CardProps) => {
  const G = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: G.colors.card,
          borderColor: G.colors.accent,
        },
        G.shadow.elevated,
        style,
      ]}
    >
      <Text style={[styles.title, { color: G.colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: G.colors.textMuted }]}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  );
};

type BtnVariant = 'primary' | 'secondary' | 'outline';

type BtnProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: BtnVariant;
};

/**
 * Универсальная кнопка GButton.
 * По умолчанию — primary (синий action).
 * Можно использовать secondary / outline при необходимости.
 */
export const GButton = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
}: BtnProps) => {
  const G = useTheme();

  const backgroundColor =
    variant === 'primary'
      ? G.colors.primary
      : variant === 'secondary'
      ? G.colors.cardAlt
      : 'transparent';

  const borderColor =
    variant === 'outline' ? G.colors.accent : 'transparent';

  const textColor =
    variant === 'primary' ? '#FFFFFF' : G.colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor,
          borderColor,
        },
        G.shadow.elevated,
        pressed && { opacity: 0.9 },
        style,
      ]}
    >
      <Text
        style={[
          styles.btnText,
          { color: textColor },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
});
