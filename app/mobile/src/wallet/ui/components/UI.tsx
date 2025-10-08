import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

type CardProps = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  children?: ReactNode;
};

export const Card = ({ title, subtitle, style, children }: CardProps) => {
  const G = useTheme();
  return (
    <View style={[styles.card, G.shadow.elevated, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
};

type BtnProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export const GButton = ({ title, onPress, style }: BtnProps) => {
  const G = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        G.shadow.elevated,         // было G.shadow.btn — такого ключа нет
        pressed && { opacity: 0.9 },
        style,
      ]}
    >
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  subtitle: { marginTop: 4, opacity: 0.7, color: '#fff' },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#0A84FF',
  },
  btnText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '700' },
});
