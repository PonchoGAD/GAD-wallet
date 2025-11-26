// app/mobile/src/wallet/ui/SettingsScreen.tsx
// ---------------------------------------------
// Экран настроек кошелька (v1):
// - переключатель темы (заглушка под будущий light)
// - reset wallet store (без трогания SecureStore)
// - место под выбор сети/языка/безопасности
// ---------------------------------------------

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useTheme } from './theme';
import { Card, GButton } from './components/UI';
import WalletFooterNav from './components/WalletFooterNav';
import { useWalletStore } from '../../../../store/walletStore';

export default function SettingsScreen() {
  const G = useTheme();
  const resetWalletStore = useWalletStore((s) => s.reset);
  const [darkMode, setDarkMode] = useState(true);

  const onToggleTheme = (val: boolean) => {
    // Пока просто локальный стейт; в будущем вынесем в отдельный theme-store
    setDarkMode(val);
    Alert.alert(
      'Theme',
      'Theme switching will be available in a future update.',
    );
  };

  const onResetWalletStore = () => {
    resetWalletStore();
    Alert.alert(
      'Wallet reset',
      'In-memory wallet store has been reset. Secure seed in device storage is not touched.',
    );
  };

  const onChangeNetwork = () => {
    Alert.alert(
      'Networks',
      'Network switching (BSC / GAD chain) will be available later.',
    );
  };

  const onChangeLanguage = () => {
    Alert.alert(
      'Language',
      'Language selection will be added in future releases.',
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: G.colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: G.colors.text }]}>
            Wallet Settings
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: G.colors.textMuted },
            ]}
          >
            Configure appearance, network and security for your GAD
            Wallet.
          </Text>

          {/* Appearance */}
          <Card
            title="Appearance"
            subtitle="Theme and visual settings"
            style={{ width: '100%' }}
          >
            <View style={styles.row}>
              <View>
                <Text
                  style={[
                    styles.rowTitle,
                    { color: G.colors.text },
                  ]}
                >
                  Dark mode
                </Text>
                <Text
                  style={[
                    styles.rowDesc,
                    { color: G.colors.textMuted },
                  ]}
                >
                  Light theme will be available later.
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={onToggleTheme}
                trackColor={{ true: G.colors.accentSoft, false: '#4b5563' }}
                thumbColor={darkMode ? G.colors.accent : '#9ca3af'}
              />
            </View>
          </Card>

          {/* Network */}
          <Card
            title="Network"
            subtitle="BSC / GAD chain"
            style={{ width: '100%' }}
          >
            <View style={styles.row}>
              <View>
                <Text
                  style={[
                    styles.rowTitle,
                    { color: G.colors.text },
                  ]}
                >
                  Active network
                </Text>
                <Text
                  style={[
                    styles.rowDesc,
                    { color: G.colors.textMuted },
                  ]}
                >
                  Currently: BNB Smart Chain (BSC)
                </Text>
              </View>
              <GButton
                title="Change"
                variant="secondary"
                onPress={onChangeNetwork}
                style={{ minWidth: 100 }}
                textStyle={{ fontSize: 13 }}
              />
            </View>
          </Card>

          {/* Language & region */}
          <Card
            title="Language"
            subtitle="Interface language"
            style={{ width: '100%' }}
          >
            <View style={styles.row}>
              <View>
                <Text
                  style={[
                    styles.rowTitle,
                    { color: G.colors.text },
                  ]}
                >
                  Current language
                </Text>
                <Text
                  style={[
                    styles.rowDesc,
                    { color: G.colors.textMuted },
                  ]}
                >
                  English (more languages coming soon)
                </Text>
              </View>
              <GButton
                title="Change"
                variant="secondary"
                onPress={onChangeLanguage}
                style={{ minWidth: 100 }}
                textStyle={{ fontSize: 13 }}
              />
            </View>
          </Card>

          {/* Security */}
          <Card
            title="Security"
            subtitle="Wallet data and reset"
            style={{ width: '100%' }}
          >
            <Text
              style={[
                styles.securityText,
                { color: G.colors.textMuted },
              ]}
            >
              You can reset the in-memory wallet store (Zustand) without
              deleting the mnemonic saved in your device&apos;s secure
              storage. This is useful for debugging.
            </Text>
            <GButton
              title="Reset wallet store"
              variant="secondary"
              onPress={onResetWalletStore}
              style={{ marginTop: 12 }}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      <WalletFooterNav active="Settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  securityText: {
    fontSize: 12,
    lineHeight: 17,
  },
});
