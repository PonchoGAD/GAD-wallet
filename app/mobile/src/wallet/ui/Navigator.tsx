// app/mobile/src/wallet/ui/Navigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalletHome from './WalletHome';
import SendScreen from './SendScreen';
import ReceiveScreen from './ReceiveScreen';
import SwapScreen from './SwapScreen';
import NftScreen from './NftScreen';
import AddTokenScreen from './AddTokenScreen';

export type RootStackParamList = {
  WalletHome: undefined;
  Send: undefined;
  Receive: undefined;
  Swap: undefined;
  NFT: undefined;
  AddToken: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Workaround for a typing quirk with React 19 & @react-navigation v7
const StackNavigator = Stack.Navigator as unknown as React.ComponentType<any>;
const StackScreen = Stack.Screen as unknown as React.ComponentType<any>;

export default function Navigator() {
  return (
    <StackNavigator /* id is intentionally omitted; types demand `id: undefined` */ initialRouteName="WalletHome">
      <StackScreen name="WalletHome" component={WalletHome} options={{ title: 'Wallet' }} />
      <StackScreen name="Send" component={SendScreen} />
      <StackScreen name="Receive" component={ReceiveScreen} />
      <StackScreen name="Swap" component={SwapScreen} />
      <StackScreen name="NFT" component={NftScreen} />
      <StackScreen name="AddToken" component={AddTokenScreen} />
    </StackNavigator>
  );
}
