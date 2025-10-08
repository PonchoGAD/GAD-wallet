import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function AssetRow({
  symbol,
  balance,
  onPress,
}: { symbol: string; balance: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.icon} />
      <Text style={styles.symbol}>{symbol}</Text>
      <View style={{ flex: 1 }} />
      <Text style={styles.balance}>{balance}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1E26',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  pressed: {
    backgroundColor: '#2A2E37',
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2A2E37',
    borderWidth: 1,
    borderColor: '#80FFD3',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F7F8FA',
    marginLeft: 8,
  },
  balance: {
    fontSize: 16,
    color: '#80FFD3',
    fontWeight: '600',
  },
});
