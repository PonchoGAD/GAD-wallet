// src/screens/AiMintWebView.tsx
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { MINT_URL } from "../../config/env";

export default function AiMintWebView() {
  return (
    <View style={styles.root}>
      <WebView
        source={{ uri: MINT_URL }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});
