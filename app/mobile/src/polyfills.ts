// app/mobile/src/polyfills.ts
// Глобальные полифиллы, чтобы web3/viem/ethers нормально работали в React Native.

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Some libs expect TextEncoder/TextDecoder
try {
  if (typeof (globalThis as any).TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (globalThis as any).TextEncoder = require('text-encoding').TextEncoder;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (globalThis as any).TextDecoder = require('text-encoding').TextDecoder;
  }
} catch {
  // ignore — на всякий случай не роняем приложение
}
