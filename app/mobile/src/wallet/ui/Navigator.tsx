// app/mobile/src/wallet/ui/Navigator.tsx
// ---------------------------------------------
// Стек навигации кошелька GAD Wallet
// ---------------------------------------------

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WalletHome from './WalletHome';
import SendScreen from './SendScreen';
import ReceiveScreen from './ReceiveScreen';
import SwapScreen from './SwapScreen';
import NftScreen from './NftScreen';
import AddTokenScreen from './AddTokenScreen';
import AiMintWebView from './AiMintWebView';
import SettingsScreen from './SettingsScreen';

// Все внутренние экраны кошелька
export type RootStackParamList = {
  Wallet: undefined;
  Send: undefined;
  Receive: undefined;
  Swap: undefined;
  NFT: undefined;
  AddToken: undefined;
  AiMintWeb: undefined;
  Settings: undefined; // экран настроек кошелька
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function WalletNavigator() {
  return (
    <Stack.Navigator
      id={undefined} // гасим TS-ошибку про обязательный id в последней версии типов
      initialRouteName="Wallet"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#0B0C10' },
        headerTintColor: '#F7F8FA',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Wallet"
        component={WalletHome}
        options={{ title: 'Wallet' }}
      />

      <Stack.Screen
        name="Send"
        component={SendScreen}
        options={{ title: 'Send' }}
      />

      <Stack.Screen
        name="Receive"
        component={ReceiveScreen}
        options={{ title: 'Receive' }}
      />

      <Stack.Screen
        name="Swap"
        component={SwapScreen}
        options={{ title: 'Swap' }}
      />

      <Stack.Screen
        name="NFT"
        component={NftScreen}
        options={{ title: 'NFT Marketplace' }}
      />

      <Stack.Screen
        name="AddToken"
        component={AddTokenScreen}
        options={{ title: 'Add Token' }}
      />

      <Stack.Screen
        name="AiMintWeb"
        component={AiMintWebView}
        options={{ title: 'AI Mint' }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}
