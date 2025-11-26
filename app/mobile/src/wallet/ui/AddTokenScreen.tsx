// app/mobile/src/wallet/ui/AddTokenScreen.tsx
// ---------------------------------------------
// Экран добавления кастомного токена:
// - валидация адреса
// - подтягивание symbol/decimals с сети
// - сохранение в tokensStore
// ---------------------------------------------

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { useTokensStore } from '../state/tokensStore';
import { isAddressLike, toTokenInfo } from '../services/tokenlist';
import { cleanAddress } from '../services/viemHelpers';
import { erc20Symbol, erc20Decimals } from '../services/erc20';

import { useTheme } from './theme';
import { Card, GButton } from './components/UI';
import WalletFooterNav from './components/WalletFooterNav';

export default function AddTokenScreen() {
  const G = useTheme();
  const { addToken } = useTokensStore();

  const [symbol, setSymbol] = useState('');
  const [address, setAddress] = useState('');
  const [decimals, setDecimals] = useState<number | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(false);

  async function handleFetchMeta() {
    try {
      const raw = address.trim();
      if (!raw) {
        return Alert.alert('Error', 'Enter token address first');
      }

      if (!isAddressLike(raw)) {
        return Alert.alert('Error', 'Invalid token address format');
      }

      const cleaned = cleanAddress(raw);
      setAddress(cleaned);

      setLoadingMeta(true);
      const [sym, dec] = await Promise.all([
        erc20Symbol(cleaned),
        erc20Decimals(cleaned),
      ]);

      if (!sym) {
        Alert.alert('Error', 'Cannot read token symbol');
      } else {
        setSymbol(sym.toUpperCase());
      }
      setDecimals(dec ?? 18);
    } catch (e: any) {
      console.error('[AddTokenScreen] fetch meta error:', e);
      Alert.alert('Error', e?.message ?? 'Failed to fetch token metadata');
    } finally {
      setLoadingMeta(false);
    }
  }

  function handleAdd() {
    const sym = symbol.trim().toUpperCase();
    const rawAddr = address.trim();

    if (!sym || !rawAddr) {
      return Alert.alert('Error', 'Please fill in all fields');
    }

    if (!isAddressLike(rawAddr)) {
      return Alert.alert('Error', 'Invalid token address format');
    }

    const cleaned = cleanAddress(rawAddr);

    const meta = toTokenInfo({
      address: cleaned,
      symbol: sym,
      decimals: decimals ?? 18,
    });

    if (!meta) {
      return Alert.alert('Error', 'Failed to parse token metadata');
    }

    // Храним в Zustand как symbol -> address (для селектора токенов)
    addToken(sym, cleaned);

    Alert.alert('Success', `Token ${sym} added successfully`);
    setSymbol('');
    setAddress('');
    setDecimals(null);
  }

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
          <Card
            title="Add Token"
            subtitle="Manually add a custom BEP-20 token"
            style={{ width: '100%' }}
          >
            <Text style={[styles.label, { color: G.colors.text }]}>
              Token Address
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="0x..."
              placeholderTextColor={G.colors.textMuted}
              autoCapitalize="none"
              style={[
                styles.input,
                {
                  backgroundColor: G.colors.inputBg,
                  color: G.colors.text,
                  borderColor: G.colors.border,
                },
              ]}
            />

            <View style={styles.inline}>
              <GButton
                title={loadingMeta ? 'Loading…' : 'Fetch metadata'}
                onPress={loadingMeta ? undefined : handleFetchMeta}
                // 🔹 фикс: один объект вместо массива стилей
                style={{
                  flex: 1,
                  ...(loadingMeta ? { opacity: 0.7 } : {}),
                }}
              />
              {loadingMeta && (
                <ActivityIndicator
                  style={{ marginLeft: 8 }}
                  color={G.colors.accent}
                />
              )}
            </View>

            <Text style={[styles.label, { color: G.colors.text }]}>
              Token Symbol
            </Text>
            <TextInput
              value={symbol}
              onChangeText={setSymbol}
              placeholder="e.g. GAD"
              placeholderTextColor={G.colors.textMuted}
              autoCapitalize="characters"
              style={[
                styles.input,
                {
                  backgroundColor: G.colors.inputBg,
                  color: G.colors.text,
                  borderColor: G.colors.border,
                },
              ]}
            />

            <Text style={[styles.label, { color: G.colors.text }]}>
              Decimals
            </Text>
            <TextInput
              value={decimals != null ? String(decimals) : ''}
              onChangeText={(v) => {
                const n = Number(v);
                setDecimals(Number.isFinite(n) ? n : null);
              }}
              placeholder="18"
              placeholderTextColor={G.colors.textMuted}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  backgroundColor: G.colors.inputBg,
                  color: G.colors.text,
                  borderColor: G.colors.border,
                },
              ]}
            />

            <View style={{ height: 18 }} />
            <GButton title="Add Token" onPress={handleAdd} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      <WalletFooterNav active="Wallet" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
});
