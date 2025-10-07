// app/mobile/src/wallet/ui/components/UI.tsx
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';

// Небольшой helper под отступы/радиусы — не ломает твою тему
const G = {
  colors: {
    card: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(212,175,55,0.6)',
    text: '#F7F8FA',
    sub: 'rgba(247,248,250,0.7)',
    btn: '#0A84FF',
    btnText: '#ffffff',
  },
  radius: 16,
  spacing: (n: number) => 8 * n,
  shadow: {
    elevated: {
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    } as ViewStyle,
  },
};

type CardProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  style,
}) => {
  return (
    <View style={[styles.card, G.shadow.elevated, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
};

type GButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const GButton: React.FC<GButtonProps> = ({ title, onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.btnPressed,
        style,
      ]}
      android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
    >
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: G.colors.card,
    borderRadius: G.radius,
    borderWidth: 1,
    borderColor: G.colors.cardBorder,
    padding: G.spacing(2),
  },
  title: {
    color: G.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: G.colors.sub,
    fontSize: 13,
    marginBottom: G.spacing(1.5),
  },
  btn: {
    backgroundColor: G.colors.btn,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.9,
  },
  btnText: {
    color: G.colors.btnText,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
