import React, { useEffect, useState } from 'react';
import { ImageBackground, View, Text, StyleSheet, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { G } from './theme';
import { Card, GButton } from './components/UI';

import { TOKENS } from '../services/constants';
import { getErc20Balance, getNativeBalance } from '../services/discovery';
import { ensureMnemonic, deriveAddressFromMnemonic } from '../services/seed';
import { useBalancesStore } from '../state/balancesStore';

const hero = require('../../../../assets/gad_darktech_v2_mobile_1080x1920.png'); // добавь картинку в assets
const logo = require('../../../../assets/gad_darktech_v2_card.png');              // и эту тоже

export default function WalletHome({ navigation }: any) {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const { balances, setBalance } = useBalancesStore();

  useEffect(() => {
    (async () => {
      const mnemonic = await ensureMnemonic();
      const addr = await deriveAddressFromMnemonic(mnemonic, 0);
      setAddress(addr);

      // balances
      if (!addr) return;
      const bnb = await getNativeBalance(addr);
      setBalance('BNB', bnb);

      const gad = await getErc20Balance(TOKENS.GAD.address as any, addr, TOKENS.GAD.decimals);
      const usdt = await getErc20Balance(TOKENS.USDT.address as any, addr, TOKENS.USDT.decimals);
      const wbnb = await getErc20Balance(TOKENS.WBNB.address as any, addr, TOKENS.WBNB.decimals);
      setBalance('GAD', gad);
      setBalance('USDT', usdt);
      setBalance('WBNB', wbnb);
    })();
  }, []);

  return (
    <ImageBackground source={hero} resizeMode="cover" style={{ flex: 1, backgroundColor: G.colors.bg }}>
      <SafeAreaView style={{ flex: 1, padding: G.spacing(2) }}>
        <View style={{ alignItems: 'center', marginTop: G.spacing(2), marginBottom: G.spacing(2) }}>
          <Card style={{ width: '100%' }} title="GAD Wallet · Family" subtitle="Total Balance">
            <View style={{ flexDirection: 'row', gap: G.spacing(2) }}>
              <View style={styles.logoBox}>
                <ImageBackground source={logo} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              </View>

              <View style={{ flex: 1 }}>
                <Text selectable style={styles.addr}>{address ?? '—'}</Text>

                <FlatList
                  style={{ marginTop: G.spacing(1) }}
                  data={Object.keys(balances)}
                  keyExtractor={(k) => k}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      <Text style={styles.rowKey}>{item}</Text>
                      <Text style={styles.rowVal}>{Number(balances[item]).toFixed(6)}</Text>
                    </View>
                  )}
                />

                <View style={styles.actions}>
                  <GButton title="Send" onPress={() => navigation.navigate('Send')} />
                  <GButton title="Receive" onPress={() => navigation.navigate('Receive')} />
                  <GButton title="Stake" onPress={() => navigation.navigate('Stake')} />
                  <GButton title="Swap" onPress={() => navigation.navigate('Swap')} />
                </View>
              </View>
            </View>
          </Card>

          {address && (
            <View style={{ marginTop: G.spacing(2) }}>
              <QRCode value={address} size={140} backgroundColor="transparent" color={G.colors.text} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  logoBox: {
    width: 110, height: 110,
    borderRadius: G.radius.md,
    overflow: 'hidden',
  },
  addr: { color: G.colors.sub, fontSize: 12, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowKey: { color: G.colors.text, fontWeight: '600' },
  rowVal: { color: G.colors.text },
  actions: { flexDirection: 'row', gap: 10, marginTop: G.spacing(2), flexWrap: 'wrap' },
});
