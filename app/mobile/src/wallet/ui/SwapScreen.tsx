import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Address } from 'viem';

import { TOKENS } from '../services/constants';
import { quoteExactIn } from '../services/quote';
import { swapExactIn } from '../services/swap';

import { G } from './theme';
import { Card, GButton } from './components/UI';

const hero = require('../../../../assets/gad_darktech_v2_mobile_1080x1920.png');

export default function SwapScreen() {
  const [fromToken, setFromToken] = useState<'BNB' | 'GAD'>('BNB');
  const [toToken, setToToken] = useState<'BNB' | 'GAD'>('GAD');
  const [amount, setAmount] = useState('');
  const [quoteOut, setQuoteOut] = useState<string | null>(null);

  const resolve = (sym: 'BNB' | 'GAD'): Address => TOKENS[sym].address as Address;

  const handleQuote = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return Alert.alert('Error', 'Enter a valid amount');

    try {
      const { amountOut } = await quoteExactIn(resolve(fromToken), resolve(toToken), BigInt(Math.floor(amt * 1e18)));
      setQuoteOut((Number(amountOut) / 1e18).toFixed(6));
    } catch (e: any) {
      Alert.alert('Quote error', e?.message ?? String(e));
    }
  };

  const handleSwap = async () => {
    try {
      // здесь предполагается, что privKey и to известны твоей логикой/экранами
      Alert.alert('Swap', 'Вызови swapExactIn из твоего контекста, когда будет готов привкей и адрес получателя.');
    } catch (e: any) {
      Alert.alert('Swap error', e?.message ?? String(e));
    }
  };

  return (
    <ImageBackground source={hero} resizeMode="cover" style={{ flex: 1, backgroundColor: G.colors.bg }}>
      <SafeAreaView style={{ flex: 1, padding: G.spacing(2) }}>
        <Card title="Swap" subtitle="Quote & Execute">
          <View style={{ gap: G.spacing(1) }}>
            <Text style={styles.label}>From</Text>
            <View style={styles.tokenRow}>
              <GButton title={fromToken} onPress={() => setFromToken(fromToken === 'BNB' ? 'GAD' : 'BNB')} />
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor={G.colors.sub}
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>To</Text>
            <View style={styles.tokenRow}>
              <GButton title={toToken} onPress={() => setToToken(toToken === 'BNB' ? 'GAD' : 'BNB')} />
              <View style={[styles.input, { justifyContent: 'center' }]}>
                <Text style={{ color: G.colors.text }}>{quoteOut ?? '—'}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: G.spacing(1) }}>
              <GButton title="Get Quote" onPress={handleQuote} />
              <GButton title="Swap" onPress={handleSwap} />
            </View>
          </View>
        </Card>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  label: { color: G.colors.sub, fontSize: 13 },
  tokenRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    flex: 1,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: G.colors.surface,
    borderWidth: 1,
    borderColor: G.colors.borderGold,
    color: G.colors.text,
  },
});
