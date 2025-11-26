import './app/mobile/src/polyfills';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './app/mobile/src/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
