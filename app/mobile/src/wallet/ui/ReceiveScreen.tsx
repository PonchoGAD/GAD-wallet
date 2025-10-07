import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { deriveAddressFromMnemonic } from '../services/seed'; // у тебя уже есть
import type { Address } from 'viem';

export default function ReceiveScreen() {
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    (async () => {
      const mnemonic = await SecureStore.getItemAsync('mnemonic');
      if (!mnemonic) {
        Alert.alert('Error', 'Mnemonic not found. Open wallet tab first.');
        return;
      }
      const addr = deriveAddressFromMnemonic(mnemonic, 0);
      setAddress(addr as Address);
    })();
  }, []);

  const copy = async () => {
    if (!address) return;
    await Clipboard.setStringAsync(address);
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  return (
    <View style={{ padding: 16, alignItems: 'center', gap: 16 }}>
      <Text style={{ fontSize: 16, opacity: 0.7 }}>Your BSC address</Text>
      {address && <Text selectable style={{ fontSize: 14 }}>{address}</Text>}
      {address && <QRCode value={address} size={180} />}
      <Button title="Copy address" onPress={copy} />
    </View>
  );
}
