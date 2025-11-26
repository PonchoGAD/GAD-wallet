// app/mobile/src/wallet/WalletRootScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import WalletNavigator from './ui/Navigator';

export default function WalletRootScreen() {
  return (
    <View style={styles.container}>
      <WalletNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
