// app/mobile/src/wallet/ui/AiMintWebView.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { MINT_URL } from '../../config/env';

export default function AiMintWebView() {
  return (
    <View style={styles.root}>
      <WebView
        source={{ uri: MINT_URL }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color="#F7F8FA" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0C10' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
