// app/mobile/src/wallet/ui/Navigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WalletHome from './WalletHome';
import SendScreen from './SendScreen';
import ReceiveScreen from './ReceiveScreen';
import SwapScreen from './SwapScreen';
import NftScreen from './NftScreen';
import AddTokenScreen from './AddTokenScreen';

// 👇 NEW: in-app WebView для AI Mint
import AiMintWebView from './AiMintWebView';

export type RootStackParamList = {
  Wallet: undefined;
  Send: undefined;
  Receive: undefined;
  Swap: undefined;
  NFT: undefined;
  AddToken: undefined;
  // 👇 NEW
  AiMintWeb: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  return (
    <Stack.Navigator
      id={undefined} // исправляем типовую проверку (как у тебя было)
      initialRouteName="Wallet"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#0B0C10' },
        headerTintColor: '#F7F8FA',
      }}
    >
      <Stack.Screen name="Wallet" component={WalletHome} options={{ title: 'Wallet' }} />
      <Stack.Screen name="Send" component={SendScreen} options={{ title: 'Send' }} />
      <Stack.Screen name="Receive" component={ReceiveScreen} options={{ title: 'Receive' }} />
      <Stack.Screen name="Swap" component={SwapScreen} options={{ title: 'Swap' }} />
      <Stack.Screen name="NFT" component={NftScreen} options={{ title: 'NFT Marketplace' }} />
      <Stack.Screen name="AddToken" component={AddTokenScreen} options={{ title: 'Add Token' }} />

      {/* 👇 NEW: экран встроенного WebView для AI Mint */}
      <Stack.Screen name="AiMintWeb" component={AiMintWebView} options={{ title: 'AI Mint' }} />
    </Stack.Navigator>
  );
}
