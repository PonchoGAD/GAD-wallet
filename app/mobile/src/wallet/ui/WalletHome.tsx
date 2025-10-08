import React, { useEffect } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, GButton } from './components/UI';
import { useBalancesStore } from '../state/balancesStore';
import { TOKENS } from '../services/constants';
import { RootStackParamList } from './Navigator';

const hero = require('../../assets/gad_darktech_v2_mobile_1080x1920.png');
const logo = require('../../assets/gad_darktech_v2_card.png');

export default function WalletHome() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { balances } = useBalancesStore();

  useEffect(() => {
    // тут можешь дернуть обновление балансов, если нужно
  }, []);

  return (
    <ImageBackground source={hero} resizeMode="cover" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card title="GAD Wallet · Family" subtitle="Total Balance" style={{ width: '100%' }}>
          <View style={styles.cardRow}>
            <Image source={logo} style={{ width: 140, height: 140, borderRadius: 16 }} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              {(['BNB','GAD','USDT','WBNB'] as const).map(sym => (
                <Row key={sym} label={sym} value={(balances[sym] ?? 0).toFixed(6)} />
              ))}
            </View>
          </View>

          {/* Первая строка действий */}
          <View style={styles.actions}>
            <GButton title="Send"    onPress={() => nav.navigate('Send')} />
            <GButton title="Receive" onPress={() => nav.navigate('Receive')} />
            <GButton title="Swap"    onPress={() => nav.navigate('Swap')} />
          </View>

          {/* Вторая строка действий */}
          <View style={styles.actions}>
            <GButton title="NFT"        onPress={() => nav.navigate('NFT')} />
            <GButton title="Add Token"  onPress={() => nav.navigate('AddToken')} />
          </View>
        </Card>
      </ScrollView>
    </ImageBackground>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowVal}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: 'white', fontSize: 16, fontWeight: '700' },
  rowVal: { color: 'white', fontVariant: ['tabular-nums'], fontSize: 16 },
});
