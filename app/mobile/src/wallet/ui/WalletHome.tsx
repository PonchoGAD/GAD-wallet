// app/mobile/src/wallet/ui/WalletHome.tsx
// ---------------------------------------------
// Главный экран кошелька: балансы, быстрые действия,
// нижняя навигация WalletFooterNav
// ---------------------------------------------

import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card, GButton } from './components/UI';
import { useTheme } from './theme';
import WalletFooterNav from './components/WalletFooterNav';

import { useBalancesStore } from '../state/balancesStore';
import type { RootStackParamList } from './Navigator';
import { ensureWalletCore } from '../state/walletStore';
import { getKnownBalances } from '../services/discovery';

const hero = require('../../assets/gad_darktech_v2_mobile_1080x1920.png');
const logo = require('../../assets/gad_darktech_v2_card.png');

const SYMBOLS: Array<'BNB' | 'GAD' | 'USDT' | 'WBNB'> = [
  'BNB',
  'GAD',
  'USDT',
  'WBNB',
];

export default function WalletHome() {
  const G = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { balances, setMany } = useBalancesStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadBalances() {
    try {
      setRefreshing(true);
      const wallet = await ensureWalletCore();
      if (!wallet?.address) {
        setMany([]);
        return;
      }

      const known = await getKnownBalances(wallet.address);
      const entries: Array<[string, number]> = [
        ['BNB', known.BNB ?? 0],
        ['GAD', known.GAD ?? 0],
        ['USDT', known.USDT ?? 0],
        ['WBNB', known.WBNB ?? 0],
      ];
      setMany(entries);
    } catch (e) {
      console.warn('[WalletHome] loadBalances error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBalances().catch(console.error);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: G.colors.bg }}>
      <ImageBackground source={hero} resizeMode="cover" style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadBalances}
              tintColor={G.colors.text}
            />
          }
        >
          <Card
            title="GAD Wallet · Family"
            subtitle="Multi-token balance on BNB Chain"
            style={{ width: '100%' }}
          >
            <View style={styles.cardRow}>
              <Image
                source={logo}
                style={{ width: 140, height: 140, borderRadius: 16 }}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                {loading ? (
                  <View
                    style={{
                      paddingVertical: 16,
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator color={G.colors.text} />
                    <Text
                      style={{
                        color: G.colors.textMuted,
                        marginTop: 8,
                        fontSize: 12,
                      }}
                    >
                      Loading on-chain balances…
                    </Text>
                  </View>
                ) : (
                  SYMBOLS.map((sym) => (
                    <Row
                      key={sym}
                      label={sym}
                      value={(balances[sym] ?? 0).toFixed(6)}
                    />
                  ))
                )}
              </View>
            </View>

            {/* Первая строка действий */}
            <View style={styles.actions}>
              <GButton
                title="Send"
                onPress={() => nav.navigate('Send')}
                style={{ flex: 1 }}
              />
              <GButton
                title="Receive"
                onPress={() => nav.navigate('Receive')}
                style={{ flex: 1 }}
              />
              <GButton
                title="Swap"
                onPress={() => nav.navigate('Swap')}
                style={{ flex: 1 }}
              />
            </View>

            {/* Вторая строка действий */}
            <View style={styles.actions}>
              <GButton
                title="NFT"
                onPress={() => nav.navigate('NFT')}
                style={{ flex: 1 }}
              />
              <GButton
                title="Add Token"
                onPress={() => nav.navigate('AddToken')}
                style={{ flex: 1 }}
                variant="secondary"
              />
            </View>
          </Card>
        </ScrollView>
      </ImageBackground>

      {/* Нижняя навигация кошелька */}
      <WalletFooterNav active="Wallet" />
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const G = useTheme();
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.rowLabel,
          { color: G.colors.text },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.rowVal,
          { color: G.colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: { fontSize: 16, fontWeight: '700' },
  rowVal: { fontVariant: ['tabular-nums'], fontSize: 16 },
});
