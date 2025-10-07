import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function AssetRow({
  symbol,
  balance,
  onPress,
}: { symbol: string; balance: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 }}>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee' }} />
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{symbol}</Text>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 16 }}>{balance}</Text>
      </View>
    </Pressable>
  );
}
