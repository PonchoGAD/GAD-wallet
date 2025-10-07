// app/mobile/src/polyfills.ts
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
  // ignore
}
