// app/mobile/src/wallet/ui/SwapScreen.tsx
// ---------------------------------------------
// Экран свапа: выбор from/to токенов через TokenSelector,
// котировка через quoteExactIn
// ---------------------------------------------

import React, { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { Address } from 'viem';

import { quoteExactIn } from '../services/quote';
import { Card, GButton } from './components/UI';
import { useTheme } from './theme';
import WalletFooterNav from './components/WalletFooterNav';
import { TokenSelector, type TokenInfoLite } from './components/TokenSelector';

import { getDefaultTokenList, type TokenInfo } from '../services/tokenlist';
import { useTokensStore } from '../state/tokensStore';

const hero = require('../../assets/gad_darktech_v2_mobile_1080x1920.png');

const toBigIntAmount = (amountStr: string, decimals = 18) => {
  const num = Number(String(amountStr).replace(',', '.'));
  if (!num || num <= 0) return 0n;
  const factor = 10 ** decimals;
  return BigInt(Math.floor(num * factor));
};

export default function SwapScreen() {
  const G = useTheme();
  const { tokens: customTokens } = useTokensStore();

  const baseTokens: TokenInfo[] = useMemo(() => getDefaultTokenList(), []);

  const tokenList: TokenInfo[] = useMemo(() => {
    const mapByAddr = new Map<string, TokenInfo>();

    // Базовые токены
    for (const t of baseTokens) {
      mapByAddr.set(t.address.toLowerCase(), t);
    }

    // Кастомные токены (symbol -> address)
    for (const [symbol, address] of Object.entries(customTokens)) {
      const low = address.toLowerCase();
      if (!mapByAddr.has(low)) {
        mapByAddr.set(low, {
          address: address as `0x${string}`, // 🔹 фикс типов здесь
          symbol,
          name: symbol,
          decimals: 18,
        });
      }
    }

    return Array.from(mapByAddr.values());
  }, [baseTokens, customTokens]);

  const [fromSymbol, setFromSymbol] = useState<string>('BNB');
  const [toSymbol, setToSymbol] = useState<string>('GAD');
  const [amount, setAmount] = useState('');

  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorSide, setSelectorSide] = useState<'from' | 'to' | null>(null);

  function findToken(symbol: string): TokenInfo | undefined {
    return tokenList.find(
      (t) => t.symbol.toLowerCase() === symbol.toLowerCase(),
    );
  }

  const fromToken: TokenInfo | undefined =
    findToken(fromSymbol) || tokenList[0];
  const toToken: TokenInfo | undefined =
    findToken(toSymbol) ||
    tokenList.find((t) => t.symbol.toLowerCase() === 'gad') ||
    tokenList[1];

  const tokenOptionsLite: TokenInfoLite[] = tokenList.map((t) => ({
    address: t.address,
    symbol: t.symbol,
    name: t.name,
    decimals: t.decimals,
  }));

  const handleQuote = async () => {
    if (!fromToken || !toToken) {
      Alert.alert('Error', 'Token not found in list');
      return;
    }

    if (fromToken.address === toToken.address) {
      Alert.alert('Error', 'Select different tokens for swap');
      return;
    }

    const decimals = fromToken.decimals ?? 18;
    const amountIn = toBigIntAmount(amount, decimals);
    if (amountIn === 0n) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }

    try {
      const { amountOut } = await quoteExactIn(
        fromToken.address as Address,
        toToken.address as Address,
        amountIn,
      );
      const outDecimals = toToken.decimals ?? 18;
      const humanOut = Number(amountOut) / 10 ** outDecimals;
      Alert.alert(
        'Quote',
        `You’ll get: ${humanOut.toFixed(6)} ${toToken.symbol}`,
      );
    } catch (e: any) {
      console.error('[SwapScreen] quote error:', e);
      Alert.alert('Quote error', e?.message ?? String(e));
    }
  };

  const openSelector = (side: 'from' | 'to') => {
    setSelectorSide(side);
    setSelectorVisible(true);
  };

  const onSelectToken = (t: TokenInfoLite) => {
    if (!selectorSide) return;

    if (selectorSide === 'from') {
      setFromSymbol(t.symbol);

      if (t.symbol === toSymbol) {
        const next =
          tokenList.find(
            (x) => x.symbol.toLowerCase() !== t.symbol.toLowerCase(),
          ) || tokenList[0];
        setToSymbol(next.symbol);
      }
    } else {
      setToSymbol(t.symbol);

      if (t.symbol === fromSymbol) {
        const next =
          tokenList.find(
            (x) => x.symbol.toLowerCase() !== t.symbol.toLowerCase(),
          ) || tokenList[0];
        setFromSymbol(next.symbol);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: G.colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ImageBackground source={hero} resizeMode="cover" style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Card
              title="Swap"
              subtitle="Quote & execute token swaps"
              style={{ width: '100%' }}
            >
              {/* FROM */}
              <View style={styles.row}>
                <View>
                  <Text
                    style={[
                      styles.rowLabel,
                      { color: G.colors.textMuted },
                    ]}
                  >
                    From
                  </Text>
                  <Text
                    style={[
                      styles.tokenSymbol,
                      { color: G.colors.text },
                    ]}
                  >
                    {fromToken?.symbol ?? '—'}
                  </Text>
                  {fromToken?.name ? (
                    <Text
                      style={[
                        styles.tokenName,
                        { color: G.colors.textMuted },
                      ]}
                    >
                      {fromToken.name}
                    </Text>
                  ) : null}
                </View>
                <GButton
                  title="Change"
                  variant="secondary"
                  onPress={() => openSelector('from')}
                  style={{ minWidth: 90 }}
                  textStyle={{ fontSize: 13 }}
                />
              </View>

              {/* TO */}
              <View style={styles.row}>
                <View>
                  <Text
                    style={[
                      styles.rowLabel,
                      { color: G.colors.textMuted },
                    ]}
                  >
                    To
                  </Text>
                  <Text
                    style={[
                      styles.tokenSymbol,
                      { color: G.colors.text },
                    ]}
                  >
                    {toToken?.symbol ?? '—'}
                  </Text>
                  {toToken?.name ? (
                    <Text
                      style={[
                        styles.tokenName,
                        { color: G.colors.textMuted },
                      ]}
                    >
                      {toToken.name}
                    </Text>
                  ) : null}
                </View>
                <GButton
                  title="Change"
                  variant="secondary"
                  onPress={() => openSelector('to')}
                  style={{ minWidth: 90 }}
                  textStyle={{ fontSize: 13 }}
                />
              </View>

              {/* Amount */}
              <Text
                style={[
                  styles.amountLabel,
                  { color: G.colors.text },
                ]}
              >
                Amount
              </Text>
              <TextInput
                placeholder="0.0"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                style={[
                  styles.input,
                  {
                    backgroundColor: G.colors.inputBg,
                    color: G.colors.text,
                    borderColor: G.colors.border,
                  },
                ]}
                placeholderTextColor={G.colors.textMuted}
              />

              <View style={{ height: 16 }} />
              <GButton title="Get Quote" onPress={handleQuote} />
            </Card>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>

      <WalletFooterNav active="Swap" />

      {/* Bottom-sheet выбора токена */}
      <TokenSelector
        visible={selectorVisible}
        onClose={() => {
          setSelectorVisible(false);
          setSelectorSide(null);
        }}
        tokens={tokenOptionsLite}
        selectedKey={selectorSide === 'to' ? toToken?.symbol : fromToken?.symbol}
        onSelect={onSelectToken}
        title={
          selectorSide === 'to'
            ? 'Select token to receive'
            : 'Select token to swap from'
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowLabel: {
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
  amountLabel: {
    marginTop: 8,
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
});
