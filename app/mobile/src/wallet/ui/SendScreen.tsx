// app/mobile/src/wallet/ui/SendScreen.tsx
// ---------------------------------------------
// Экран отправки: выбор токена через TokenSelector,
// использование ensureWalletCore и sendNative/sendERC20
// ---------------------------------------------

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { Address } from 'viem';

import { useTheme } from './theme';
import { Card, GButton } from './components/UI';
import WalletFooterNav from './components/WalletFooterNav';
import { TokenSelector, type TokenInfoLite } from './components/TokenSelector';

import { toWei } from '../utils/format';
import { sendNative, sendERC20 } from '../services/send';
import { NATIVE_SENTINEL } from '../services/constants';
import { getDefaultTokenList, type TokenInfo } from '../services/tokenlist';
import { ensureWalletCore } from '../state/walletStore';
import { useTokensStore } from '../state/tokensStore';

export default function SendScreen() {
  const G = useTheme();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BNB');
  const [privKey, setPrivKey] = useState<`0x${string}` | null>(null);

  const [selectorVisible, setSelectorVisible] = useState(false);

  const { tokens: customTokens } = useTokensStore();

  // Базовый список токенов (GAD, BNB, USDT, WBNB)
  const baseTokens: TokenInfo[] = useMemo(() => getDefaultTokenList(), []);

  // Объединяем базовые токены + пользовательские (из tokensStore)
  const tokenList: TokenInfo[] = useMemo(() => {
    const mapByAddr = new Map<string, TokenInfo>();

    // Базовые токены
    for (const t of baseTokens) {
      mapByAddr.set(t.address.toLowerCase(), t);
    }

    // Кастомные токены из Zustand (symbol -> address)
    for (const [symbol, address] of Object.entries(customTokens)) {
      const low = address.toLowerCase();
      if (!mapByAddr.has(low)) {
        mapByAddr.set(low, {
          address: address as `0x${string}`, // 🔹 приводим к ожидаемому типу
          symbol,
          name: symbol,
          decimals: 18,
        });
      }
    }

    return Array.from(mapByAddr.values());
  }, [baseTokens, customTokens]);

  // Инициализация кошелька
  useEffect(() => {
    (async () => {
      try {
        const wallet = await ensureWalletCore();
        if (!wallet?.privKey) {
          Alert.alert('Error', 'Wallet is not initialized');
          return;
        }
        setPrivKey(wallet.privKey);
      } catch (e: any) {
        console.error('[SendScreen] init error:', e);
        Alert.alert('Error', e?.message ?? 'Failed to init wallet');
      }
    })();
  }, []);

  function findTokenBySymbol(symbol: string): TokenInfo | undefined {
    return tokenList.find(
      (t) => t.symbol.toLowerCase() === symbol.toLowerCase(),
    );
  }

  const currentToken: TokenInfo | undefined =
    findTokenBySymbol(selectedSymbol) || tokenList[0];

  async function handleSend() {
    try {
      if (!privKey) {
        Alert.alert('Error', 'Wallet is not ready yet');
        return;
      }
      if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
        Alert.alert('Error', 'Enter a valid recipient address');
        return;
      }

      const v = Number(String(amount).replace(',', '.'));
      if (!v || v <= 0) {
        Alert.alert('Error', 'Enter a valid amount');
        return;
      }

      if (!currentToken) {
        Alert.alert('Error', 'Token not found in list');
        return;
      }

      const decimals = currentToken.decimals ?? 18;
      const wei = toWei(String(v), decimals);

      const isNative =
        currentToken.address.toLowerCase() === NATIVE_SENTINEL.toLowerCase();

      if (isNative) {
        const txHash = await sendNative(
          privKey as `0x${string}`,
          recipient as Address,
          wei.toString(),
        );
        Alert.alert(
          'Success',
          `Sent ${amount} ${currentToken.symbol}\nTx: ${txHash}`,
        );
      } else {
        const tokenAddr = currentToken.address as Address;
        const txHash = await sendERC20(
          privKey as `0x${string}`,
          tokenAddr,
          recipient as Address,
          wei,
        );
        Alert.alert(
          'Success',
          `Sent ${amount} ${currentToken.symbol}\nTx: ${txHash}`,
        );
      }

      setAmount('');
      setRecipient('');
    } catch (e: any) {
      console.error('[SendScreen] error:', e);
      Alert.alert('Error', e?.message ?? 'Failed to send');
    }
  }

  const tokenOptionsLite: TokenInfoLite[] = tokenList.map((t) => ({
    address: t.address,
    symbol: t.symbol,
    name: t.name,
    decimals: t.decimals,
  }));

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
            Send Tokens
          </Text>

          <Card
            title="Token"
            subtitle="Select asset and enter recipient"
            style={{ width: '100%' }}
          >
            {/* Текущий выбранный токен */}
            <View style={styles.tokenRow}>
              <View>
                <Text
                  style={[
                    styles.tokenLabel,
                    { color: G.colors.textMuted },
                  ]}
                >
                  Selected token
                </Text>
                <Text
                  style={[
                    styles.tokenSymbol,
                    { color: G.colors.text },
                  ]}
                >
                  {currentToken?.symbol ?? '—'}
                </Text>
                {currentToken?.name ? (
                  <Text
                    style={[
                      styles.tokenName,
                      { color: G.colors.textMuted },
                    ]}
                  >
                    {currentToken.name}
                  </Text>
                ) : null}
              </View>

              <GButton
                title="Change"
                variant="secondary"
                onPress={() => setSelectorVisible(true)}
                style={{ minWidth: 100 }}
              />
            </View>

            {/* Быстрые кнопки по первым токенам */}
            <View style={styles.quickRow}>
              {tokenList.slice(0, 4).map((t) => {
                const active =
                  currentToken &&
                  t.symbol.toLowerCase() ===
                    currentToken.symbol.toLowerCase();
                return (
                  <GButton
                    key={t.symbol}
                    title={t.symbol}
                    variant={active ? 'primary' : 'secondary'}
                    onPress={() => setSelectedSymbol(t.symbol)}
                    style={{ flex: 1 }}
                    textStyle={{ fontSize: 13 }}
                  />
                );
              })}
            </View>

            {/* Recipient */}
            <Text
              style={[
                styles.label,
                { color: G.colors.text },
              ]}
            >
              Recipient
            </Text>
            <TextInput
              value={recipient}
              onChangeText={setRecipient}
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

            {/* Amount */}
            <Text
              style={[
                styles.label,
                { color: G.colors.text },
              ]}
            >
              Amount
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.0"
              placeholderTextColor={G.colors.textMuted}
              keyboardType="decimal-pad"
              style={[
                styles.input,
                {
                  backgroundColor: G.colors.inputBg,
                  color: G.colors.text,
                  borderColor: G.colors.border,
                },
              ]}
            />

            <View style={{ height: 16 }} />

            <GButton title="Send" onPress={handleSend} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Нижняя навигация */}
      <WalletFooterNav active="Send" />

      {/* Bottom-sheet выбора токена */}
      <TokenSelector
        visible={selectorVisible}
        onClose={() => setSelectorVisible(false)}
        tokens={tokenOptionsLite}
        selectedKey={currentToken?.symbol}
        onSelect={(t) => setSelectedSymbol(t.symbol)}
        title="Select token to send"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tokenLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tokenSymbol: {
    fontSize: 20,
    fontWeight: '800',
  },
  tokenName: {
    fontSize: 13,
    marginTop: 2,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
});
