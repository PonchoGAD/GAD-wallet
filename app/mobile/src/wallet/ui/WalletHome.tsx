import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import type { Address } from 'viem';

import { ensureMnemonic, deriveAddressFromMnemonic } from '../services/seed';
import { getKnownBalances } from '../services/discovery';
import { TOKENS } from '../services/constants';

export default function WalletHome({ navigation }: any) {
  const [address, setAddress] = useState<Address | null>(null);
  const [balances, setBalances] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      // адрес из сид-фразы
      const mnemonic = await ensureMnemonic();
      const addr = await deriveAddressFromMnemonic(mnemonic, 0);
      setAddress(addr as Address);

      // балансы для фикс-набора (BNB, GAD, USDT, WBNB)
      const map = await getKnownBalances(addr as `0x${string}`);
      setBalances(map);
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>GAD Wallet</Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: '#E6E8EC',
          borderRadius: 12,
          padding: 12,
          backgroundColor: '#FFF',
        }}
      >
        <Text style={{ color: '#8E94A3', marginBottom: 6 }}>Your address</Text>
        <Text selectable style={{ fontWeight: '500' }}>
          {address ?? '…'}
        </Text>
      </View>

      {address && (
        <View
          style={{
            alignSelf: 'center',
            padding: 12,
            borderRadius: 12,
            backgroundColor: '#FFF',
            borderWidth: 1,
            borderColor: '#E6E8EC',
          }}
        >
          <QRCode value={address} size={140} />
        </View>
      )}

      <View
        style={{
          borderWidth: 1,
          borderColor: '#E6E8EC',
          borderRadius: 12,
          padding: 12,
          backgroundColor: '#FFF',
          flex: 1,
        }}
      >
        <Text style={{ color: '#8E94A3', marginBottom: 6 }}>Balances</Text>
        <FlatList
          data={Object.keys(balances)}
          keyExtractor={(k) => k}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 6,
                borderBottomWidth: 0.5,
                borderBottomColor: '#F1F2F4',
              }}
            >
              <Text style={{ fontWeight: '500' }}>{item}</Text>
              <Text>{balances[item]?.toFixed(6)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>Loading…</Text>}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <Button title="Send" onPress={() => navigation.navigate('Send')} />
        <Button title="Receive" onPress={() => navigation.navigate('Receive')} />
        <Button title="Swap" onPress={() => navigation.navigate('Swap')} />
        <Button title="NFT" onPress={() => navigation.navigate('NFT')} />
      </View>
    </View>
  );
}
