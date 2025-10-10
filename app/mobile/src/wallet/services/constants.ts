// app/mobile/src/wallet/services/constants.ts
import type { Address } from 'viem';
import { getAddress } from 'viem'; // нормализует в checksum и валидирует

export const NATIVE_SENTINEL = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' as Address;

// Аккуратно чистим всё лишнее: кавычки, пробелы, переносы, дефисы и любые не-hex символы.
function sanitizeEnvAddress(envValue: string | undefined, fallback: string): Address {
  const raw = (envValue ?? fallback)
    .trim()
    .replace(/["']/g, '')      // убрать кавычки
    .replace(/\s+/g, '')       // убрать пробелы/переносы
    .replace(/[^0-9a-fA-Fx]/g, ''); // убрать всё, что не hex/0x (в т.ч. дефисы)

  // NATIVE_SENTINEL пропускаем как есть
  if (raw.toLowerCase() === NATIVE_SENTINEL.toLowerCase()) return NATIVE_SENTINEL;

  // getAddress бросит, если адрес невалидный → берём fallback
  try {
    return getAddress(raw as `0x${string}`);
  } catch {
    return getAddress(fallback as `0x${string}`);
  }
}

export const PCS_V2_ROUTER  = sanitizeEnvAddress(process.env.EXPO_PUBLIC_PCS_V2_ROUTER,  '0x10ED43C718714eb63d5aA57B78B54704E256024E');
export const PCS_V2_FACTORY = sanitizeEnvAddress(process.env.EXPO_PUBLIC_PCS_V2_FACTORY, '0xCA143Ce32Fe78f1f7019d7d551a6402fC5350c73');
export const WBNB           = sanitizeEnvAddress(process.env.EXPO_PUBLIC_WBNB,           '0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
export const USDT           = sanitizeEnvAddress(process.env.EXPO_PUBLIC_USDT,           '0x55d398326f99059fF775485246999027B3197955');
export const GAD            = sanitizeEnvAddress(process.env.EXPO_PUBLIC_GAD_TOKEN,      '0x858bab88A5b8d7f29a40380C5F2D8d0b8812FE62');

export const TOKENS = {
  BNB:  { address: NATIVE_SENTINEL, symbol: 'BNB',  name: 'BNB',          decimals: 18 },
  WBNB: { address: WBNB,            symbol: 'WBNB', name: 'Wrapped BNB',  decimals: 18 },
  USDT: { address: USDT,            symbol: 'USDT', name: 'Tether USD',   decimals: 18 },
  GAD:  { address: GAD,             symbol: 'GAD',  name: 'GAD',          decimals: 18 },
} as const;
