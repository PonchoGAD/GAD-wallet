import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { Address } from 'viem';

import { TOKENS, NATIVE_SENTINEL } from '../services/constants';
import { quoteExactIn } from '../services/quote';
import { swapExactIn } from '../services/swap';
import { derivePrivKeyFromMnemonic, ensureMnemonic } from '../services/seed';

type Sym = keyof typeof TOKENS; // 'BNB' | 'WBNB' | 'USDT' | 'GAD'

const box = {
  borderWidth: 1,
  borderColor: '#E6E8EC',
  padding: 12,
  borderRadius: 12,
  marginVertical: 8,
};

export default function SwapScreen() {
  const [fromToken, setFromToken] = useState<Sym>('BNB');
  const [toToken, setToToken] = useState<Sym>('GAD');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastQuote, setLastQuote] = useState<string>('');

  const resolve = (sym: Sym): Address => TOKENS[sym].address as Address;

  const canSwap = useMemo(() => {
    const v = Number(amount);
    return !!v && v > 0 && fromToken !== toToken && !loading;
  }, [amount, fromToken, toToken, loading]);

  const onQuote = async () => {
    const v = Number(amount);
    if (!v || v <= 0) return Alert.alert('Ошибка', 'Введите корректную сумму');

    setLoading(true);
    try {
      const { amountOut } = await quoteExactIn(
        resolve(fromToken),
        resolve(toToken),
        BigInt(Math.floor(v * 1e18))
      );
      const human =
        typeof amountOut === 'bigint' ? Number(amountOut) / 1e18 : Number(amountOut);
      const text = `${human.toFixed(4)} ${toToken}`;
      setLastQuote(text);
      Alert.alert('Квота', text);
    } catch (e: any) {
      Alert.alert('Ошибка квоты', e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  const onSwap = async () => {
    if (!canSwap) return;

    setLoading(true);
    try {
      // приватник из seed
      const mnemonic = await ensureMnemonic();
      const privKey = await derivePrivKeyFromMnemonic(mnemonic, 0);

      const receipt = await swapExactIn({
        privKey,
        tokenIn: resolve(fromToken),
        tokenOut: resolve(toToken),
        amountInHuman: amount, // строка в human-единицах
        slippageBps: 100,      // 1%
        to: (await SecureStore.getItemAsync('lastRecipient')) as Address | undefined
          ?? (NATIVE_SENTINEL as unknown as Address), // fallback — свой адрес/сентинел (не важно, роутер перезапишет)
      });

      Alert.alert(
        'Успех',
        `tx: ${receipt.txHash.slice(0, 10)}…\nПолучите минимум: ${Number(receipt.minOut) / 1e18}`
      );
    } catch (e: any) {
      Alert.alert('Ошибка свопа', e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Swap</Text>

      <View style={box}>
        <Text style={{ marginBottom: 6, color: '#8E94A3' }}>From</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
          {(['BNB', 'GAD', 'USDT', 'WBNB'] as Sym[]).map((s) => (
            <Button
              key={s}
              title={s}
              onPress={() => setFromToken(s)}
              color={fromToken === s ? '#111827' : undefined}
            />
          ))}
        </View>

        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={{
            backgroundColor: '#FFF',
            borderWidth: 1,
            borderColor: '#E6E8EC',
            borderRadius: 10,
            padding: 10,
          }}
        />
      </View>

      <View style={box}>
        <Text style={{ marginBottom: 6, color: '#8E94A3' }}>To</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {(['BNB', 'GAD', 'USDT', 'WBNB'] as Sym[]).map((s) => (
            <Button
              key={s}
              title={s}
              onPress={() => setToToken(s)}
              color={toToken === s ? '#111827' : undefined}
            />
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="Get Quote" onPress={onQuote} disabled={loading} />
        <Button title="Swap" onPress={onSwap} disabled={!canSwap} />
      </View>

      {!!lastQuote && (
        <Text style={{ marginTop: 8, color: '#111827' }}>Last quote: {lastQuote}</Text>
      )}
    </View>
  );
}
