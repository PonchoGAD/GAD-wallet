// app/mobile/src/wallet/ui/components/WalletFooterNav.tsx
// ------------------------------------------------------
// Нижняя навигация внутри Wallet-стека
// Кнопки: Wallet, Send, Receive, Swap, NFT, Settings
// ------------------------------------------------------

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../theme';
import type { RootStackParamList } from '../Navigator';

type TabKey = 'Wallet' | 'Send' | 'Receive' | 'Swap' | 'NFT' | 'Settings';

type Props = {
  active?: TabKey;
};

export default function WalletFooterNav({ active }: Props) {
  const G = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const go = (key: TabKey) => {
    if (key === 'Settings') {
      Alert.alert('Settings', 'Wallet settings will be added soon.');
      return;
    }
    if (key === 'NFT') {
      nav.navigate('NFT');
    } else {
      nav.navigate(key as any);
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'Wallet', label: 'Wallet' },
    { key: 'Send', label: 'Send' },
    { key: 'Receive', label: 'Receive' },
    { key: 'Swap', label: 'Swap' },
    { key: 'NFT', label: 'NFT' },
    { key: 'Settings', label: 'Settings' },
  ];

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: G.colors.card,
          borderTopColor: G.colors.border,
        },
      ]}
    >
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => go(t.key)}
            style={({ pressed }) => [
              styles.tab,
              isActive && {
                borderColor: G.colors.accent,
                backgroundColor: G.colors.cardAlt,
              },
              !isActive && { borderColor: 'transparent' },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isActive ? G.colors.accentSoft : G.colors.textMuted,
                },
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 6,
    marginHorizontal: 3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
