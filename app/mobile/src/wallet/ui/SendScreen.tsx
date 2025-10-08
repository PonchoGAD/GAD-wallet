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
      const pk = await derivePrivKey(0);
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

      const tokenMeta = TOKENS[tokenSymbol];
      const decimals = tokenSymbol === 'BNB' ? 18 : tokenMeta.decimals;
      const tokenAddr = tokenMeta.address as Address;
      const wei = toWei(String(v), decimals);

      if (tokenSymbol === 'BNB') {
        const txHash = await sendNative(
          privKey as `0x${string}`,
          recipient as Address,
          wei.toString()
        );
        Alert.alert('Success', `Sent ${amount} ${tokenSymbol}\nTx: ${txHash}`);
      } else {
        const txHash = await sendERC20(
          privKey as `0x${string}`,
          tokenAddr,
          recipient as Address,
          wei
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

  // -------------------- UI --------------------
  const cardStyle = {
    backgroundColor: '#1C1E26',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37', // Royal Gold обводка
  } as const;

  const labelStyle = { color: '#EAEAF0', fontWeight: '700', marginTop: 10, marginBottom: 6 } as const;
  const inputStyle = {
    backgroundColor: '#2A2E37',
    color: '#F7F8FA',
    padding: 12,
    borderRadius: 12,
  } as const;

  const chipBase = {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
  } as const;

  const chipActive = { ...chipBase, backgroundColor: '#0A84FF' } as const; // Sky Pulse
  const chipIdle = { ...chipBase, backgroundColor: '#2A2E37' } as const;

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0C10', padding: 16 }}>
      <Text style={{ color: '#F7F8FA', fontSize: 22, fontWeight: '800', marginBottom: 12 }}>
        Send Tokens
      </Text>

      <View style={cardStyle}>
        <Text style={{ color: '#80FFD3', fontWeight: '700' }}>Token</Text>
        <Text style={{ color: '#C9CDD6', marginBottom: 8 }}>(BNB / GAD / USDT)</Text>

        {/* Чипы выбора токена — без новых импортов */}
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View
            style={tokenSymbol === 'BNB' ? chipActive : chipIdle}
          >
            <Text
              onPress={() => setTokenSymbol('BNB')}
              style={{ color: '#fff', fontWeight: '800' }}
            >
              BNB
            </Text>
          </View>
          <View style={tokenSymbol === 'GAD' ? chipActive : chipIdle}>
            <Text
              onPress={() => setTokenSymbol('GAD')}
              style={{ color: '#fff', fontWeight: '800' }}
            >
              GAD
            </Text>
          </View>
          <View style={tokenSymbol === 'USDT' ? chipActive : chipIdle}>
            <Text
              onPress={() => setTokenSymbol('USDT')}
              style={{ color: '#fff', fontWeight: '800' }}
            >
              USDT
            </Text>
          </View>
        </View>

        <Text style={labelStyle}>Recipient</Text>
        <TextInput
          value={recipient}
          onChangeText={setRecipient}
          placeholder="0x..."
          placeholderTextColor="#9AA0A6"
          autoCapitalize="none"
          style={inputStyle}
        />

        <Text style={labelStyle}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="0.0"
          placeholderTextColor="#9AA0A6"
          keyboardType="decimal-pad"
          style={inputStyle}
        />

        <View style={{ height: 12 }} />

        <View
          style={{
            overflow: 'hidden',
            borderRadius: 14,
          }}
        >
          <Button title="Send" color="#0A84FF" onPress={handleSend} />
        </View>
      </View>
    </View>
  );
}
