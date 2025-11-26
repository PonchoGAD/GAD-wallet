// app/mobile/src/AppNavigator.tsx
// ---------------------------------------------
// Корневой навигатор приложения:
//  - Main (основное приложение)
//  - Wallet (вход в стек GAD Wallet)
// ---------------------------------------------

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

import WalletNavigator from './wallet/ui/Navigator';
import { GButton } from './wallet/ui/components/UI';

function MainScreen({ navigation }: any) {
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.mainTitle}>GAD Family App</Text>
      <Text style={styles.mainSubtitle}>
        Main application area (dashboard / app modules).
      </Text>

      <GButton
        title="Open Wallet"
        onPress={() => navigation.navigate('Wallet')}
        style={{ marginTop: 30, width: 180 }}
      />

      <Text style={styles.mainHint}>
        Wallet is available as a separate screen: "Wallet".
      </Text>
    </View>
  );
}

type RootAppStackParamList = {
  Main: undefined;
  Wallet: undefined; // вложенный стек кошелька
};

const RootStack = createNativeStackNavigator<RootAppStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        id={undefined} // фикс для TS-типов (как в WalletNavigator)
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Основная часть приложения */}
        <RootStack.Screen name="Main" component={MainScreen} />

        {/* Кошелёк: весь стек WalletNavigator внутри одного роута */}
        <RootStack.Screen
          name="Wallet"
          component={WalletNavigator}
          options={{
            headerShown: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#050816',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mainTitle: {
    color: '#F9FAFB',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  mainSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  mainHint: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
  },
});
