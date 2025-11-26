// app/mobile/src/wallet/ui/ReceiveScreen.tsx
// ---------------------------------------------
// Экран приёма: адрес + QR, ScrollView + FooterNav
// ---------------------------------------------

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import type { Address } from 'viem';

import { ensureWalletCore } from '../state/walletStore';
import { useTheme } from './theme';
import { Card, GButton } from './components/UI';
import WalletFooterNav from './components/WalletFooterNav';

export default function ReceiveScreen() {
  const G = useTheme();
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const wallet = await ensureWalletCore();
        setAddress(wallet.address as Address);
      } catch (e) {
        console.warn('[ReceiveScreen] wallet init error:', e);
        Alert.alert('Error', 'Failed to initialize wallet');
      }
    })();
  }, []);

  const copy = async () => {
    if (!address) return;
    await Clipboard.setStringAsync(address);
    Alert.alert('Copied', 'Address copied to clipboard');
  };

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
            title="Receive Tokens"
            subtitle="Your BNB Chain address"
            style={{ width: '100%', alignItems: 'center' }}
          >
            <Text
              style={[
                styles.subtitleTop,
                { color: G.colors.accentSoft },
              ]}
            >
              Share this address to receive GAD, BNB, USDT and more
            </Text>

            {address && (
              <>
                <View
                  style={[
                    styles.addressBox,
                    {
                      backgroundColor: G.colors.inputBg,
                      borderColor: G.colors.border,
                    },
                  ]}
                >
                  <Text
                    selectable
                    style={[
                      styles.address,
                      { color: G.colors.text },
                    ]}
                  >
                    {address}
                  </Text>
                </View>

                <View
                  style={[
                    styles.qrContainer,
                    { backgroundColor: G.colors.cardAlt },
                  ]}
                >
                  <QRCode
                    value={address}
                    size={200}
                    backgroundColor="transparent"
                    color={G.colors.text}
                  />
                </View>
              </>
            )}

            <GButton
              title="Copy address"
              onPress={copy}
              style={{ marginTop: 8, alignSelf: 'stretch' }}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      <WalletFooterNav active="Receive" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    flexGrow: 1,
  },
  subtitleTop: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  addressBox: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  address: {
    fontSize: 14,
    textAlign: 'center',
  },
  qrContainer: {
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
  },
});
