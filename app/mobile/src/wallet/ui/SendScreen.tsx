// app/mobile/src/wallet/ui/SendScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { Address } from 'viem';

import { toWei } from '../services/bscClient';
import { sendNative, sendERC20 } from '../services/send';
import { TOKENS } from '../services/constants';
import { derivePrivKey } from '../services/seed'; // как вы и просили: seed.ts

export default function SendScreen() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState<'BNB' | 'GAD' | 'USDT'>('BNB');
  const [privKey, setPrivKey] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    (async () => {
      // Если у вас уже хранится mnemonic — ок. Здесь сразу берём приватный ключ из seed.ts
      const pk = await derivePrivKey(0);              // <- возвращает `0x...` строку
      setPrivKey(pk as `0x${string}`);
    })();
  }, []);

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
      const v = Number(amount);
      if (!v || v <= 0) {
        Alert.alert('Error', 'Enter a valid amount');
        return;
      }

      // определяем decimals и адрес токена
      const tokenMeta = TOKENS[tokenSymbol];
      const decimals = tokenSymbol === 'BNB' ? 18 : tokenMeta.decimals;
      const tokenAddr = tokenMeta.address as Address;

      // переводим в wei
      const wei = toWei(String(v), decimals);

      if (tokenSymbol === 'BNB') {
        // 🔹 ВОТ ТУТ НУЖНЫЙ ВЫЗОВ:
        const txHash = await sendNative(
          privKey as `0x${string}`,
          recipient as Address,
          wei.toString()              // sendNative ждёт string | bigint -> мы передаём строку
        );
        Alert.alert('Success', `Sent ${amount} ${tokenSymbol}\nTx: ${txHash}`);
      } else {
        // ERC-20
        const txHash = await sendERC20(
          privKey as `0x${string}`,
          tokenAddr,
          recipient as Address,
          wei                            // здесь передаём bigint
        );
        Alert.alert('Success', `Sent ${amount} ${tokenSymbol}\nTx: ${txHash}`);
      }

      setAmount('');
      setRecipient('');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e?.message ?? 'Failed to send');
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 10 }}>
      <Text style={{ fontWeight: '600', fontSize: 18 }}>Send Tokens</Text>

      <Text>Token (BNB / GAD / USDT):</Text>
      <TextInput
        value={tokenSymbol}
        onChangeText={(t) => {
          const up = t.toUpperCase() as 'BNB' | 'GAD' | 'USDT';
          if (up === 'BNB' || up === 'GAD' || up === 'USDT') setTokenSymbol(up);
        }}
        placeholder="BNB"
        autoCapitalize="characters"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10 }}
      />

      <Text>Recipient:</Text>
      <TextInput
        value={recipient}
        onChangeText={setRecipient}
        placeholder="0x..."
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10 }}
      />

      <Text>Amount:</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="0.0"
        keyboardType="decimal-pad"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10 }}
      />

      <Button title="Send" onPress={handleSend} />
    </View>
  );
}
