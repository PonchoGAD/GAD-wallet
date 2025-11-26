// app/mobile/src/wallet/services/constants.ts
// ---------------------------------------------
//   LOW-LEVEL CONSTANTS + базовый список токенов
//   Адреса берём из ENV, но жёстко санитарим,
//   чтобы не ловить мусор вроде пробелов/дефисов.
// ---------------------------------------------

import type { Address } from 'viem';
import { getAddress } from 'viem';

// 🔹 Универсальный sentinel для нативной монеты (BNB)
//   Он же дефолт для EXPO_PUBLIC_NATIVE_SENTINEL в config/addresses.ts
export const NATIVE_SENTINEL =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' as Address;

// 🔹 Аккуратное очищение ENV-адресов
export function sanitizeEnvAddress(
  envValue: string | undefined,
  fallback: string
): Address {
  const raw = (envValue ?? fallback)
    .trim()
    .replace(/["']/g, '') // убрать кавычки
    .replace(/\s+/g, '') // убрать пробелы/переносы
    .replace(/[^0-9a-fA-Fx]/g, ''); // убрать всё, что не hex/0x (в т.ч. дефисы)

  // NATIVE_SENTINEL пропускаем как есть
  if (raw.toLowerCase() === NATIVE_SENTINEL.toLowerCase()) {
    return NATIVE_SENTINEL;
  }

  try {
    return getAddress(raw as `0x${string}`);
  } catch {
    // fallback всегда корректный checksum-адрес
    return getAddress(fallback as `0x${string}`);
  }
}

// ---------------------------------------------
//   PancakeSwap v2 + базовые токены
//   (все адреса проходят через sanitizeEnvAddress)
// ---------------------------------------------

export const PCS_V2_ROUTER: Address = sanitizeEnvAddress(
  process.env.EXPO_PUBLIC_PCS_V2_ROUTER,
  // PancakeSwap V2 Router (BSC mainnet)
  '0x10ED43C718714eb63d5aA57B78B54704E256024E'
);

export const PCS_V2_FACTORY: Address = sanitizeEnvAddress(
  process.env.EXPO_PUBLIC_PCS_V2_FACTORY,
  // ✅ Исправленный адрес Factory без мусора
  '0xCA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
);

export const WBNB: Address = sanitizeEnvAddress(
  process.env.EXPO_PUBLIC_WBNB,
  // Wrapped BNB
  '0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
);

export const USDT: Address = sanitizeEnvAddress(
  process.env.EXPO_PUBLIC_USDT,
  // USDT (BSC)
  '0x55d398326f99059fF775485246999027B3197955'
);

export const GAD: Address = sanitizeEnvAddress(
  process.env.EXPO_PUBLIC_GAD_TOKEN,
  // GAD main token
  '0x858bab88A5b8d7f29a40380C5F2D8d0b8812FE62'
);

// ---------------------------------------------
//   TokenInfo + базовый список токенов кошелька
// ---------------------------------------------

export type TokenInfo = {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  isNative?: boolean;
  isWrapped?: boolean;
  isMain?: boolean;
};

// 🔹 Базовое ядро токенов, на котором строятся:
//    - WalletHome (балансы)
//    - Send / Swap селекторы
//    - Discovery-поиск
export const CORE_TOKENS: readonly TokenInfo[] = [
  {
    address: NATIVE_SENTINEL,
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    isNative: true,
  },
  {
    address: WBNB,
    symbol: 'WBNB',
    name: 'Wrapped BNB',
    decimals: 18,
    isWrapped: true,
  },
  {
    address: GAD,
    symbol: 'GAD',
    name: 'GAD',
    decimals: 18,
    isMain: true,
  },
  {
    address: USDT,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
  },
] as const;

// Удобный индекс для быстрого доступа по символу
export const CORE_TOKENS_BY_SYMBOL: Record<string, TokenInfo> =
  CORE_TOKENS.reduce((acc, t) => {
    acc[t.symbol] = t;
    return acc;
  }, {} as Record<string, TokenInfo>);
