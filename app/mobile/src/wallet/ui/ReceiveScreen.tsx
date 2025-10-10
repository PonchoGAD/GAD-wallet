import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Receive Tokens</Text>
        <Text style={styles.subtitle}>Your BSC Address</Text>

        {address && (
          <>
            <View style={styles.addressBox}>
              <Text selectable style={styles.address}>
                {address}
              </Text>
            </View>

            <View style={styles.qrContainer}>
              <QRCode value={address} size={200} backgroundColor="transparent" color="#F7F8FA" />
            </View>
          </>
        )}

        <View style={styles.btnWrap}>
          <Button title="Copy address" color="#0A84FF" onPress={copy} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#1C1E26',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
  },
  title: {
    color: '#F7F8FA',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#80FFD3',
    fontSize: 16,
    marginBottom: 16,
  },
  addressBox: {
    backgroundColor: '#2A2E37',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  address: {
    color: '#F7F8FA',
    fontSize: 14,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#0B0C10',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
  },
  btnWrap: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 14,
  },
});