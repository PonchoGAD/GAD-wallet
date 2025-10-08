import React, { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Address } from 'viem';
import { quoteExactIn } from '../services/quote';
import { TOKENS } from '../services/constants';
import { Card, GButton } from './components/UI';

const hero = require('../../assets/gad_darktech_v2_mobile_1080x1920.png');

export default function SwapScreen() {
  const [fromToken, setFromToken] = useState<'BNB'|'GAD'>('BNB');
  const [toToken, setToToken]     = useState<'BNB'|'GAD'>('GAD');
  const [amount, setAmount]       = useState('');

  const resolve = (sym: 'BNB'|'GAD'): Address => TOKENS[sym].address as Address;

  const handleQuote = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) { Alert.alert('Error', 'Enter a valid amount'); return; }
    try {
      const { amountOut } = await quoteExactIn(
        resolve(fromToken),
        resolve(toToken),
        BigInt(Math.floor(amt * 1e18)),
      );
      Alert.alert('Quote', `You’ll get: ${(Number(amountOut)/1e18).toFixed(6)} ${toToken}`);
    } catch (e: any) {
      Alert.alert('Quote error', e?.message ?? String(e));
    }
  };

  return (
    <ImageBackground source={hero} resizeMode="cover" style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card title="Swap" subtitle="Quote & Execute">
          <View style={{ gap: 8 }}>
            <Row label="From" value={fromToken} onToggle={() => setFromToken(fromToken==='BNB' ? 'GAD' : 'BNB')} />
            <Row label="To"   value={toToken}   onToggle={() => setToToken(toToken==='BNB' ? 'GAD' : 'BNB')} />
            <TextInput
              placeholder="Amount"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              placeholderTextColor="#c7cdd4"
            />
            <GButton title="Get Quote" onPress={handleQuote} />
          </View>
        </Card>
      </View>
    </ImageBackground>
  );
}

function Row({ label, value, onToggle }: { label: string; value: string; onToggle: () => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <GButton title={value} onPress={onToggle} style={{ minWidth: 90 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    backgroundColor: '#22262b',
    color: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3a4149',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { color: 'white', fontSize: 16, fontWeight: '700' },
});
