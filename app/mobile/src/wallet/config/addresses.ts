// ===============================
// 🔗 GAD-WALLET — Network & Tokens Config
// ===============================

import { getEnv } from '../utils/env'; // добавим простую утилиту для чтения .env

// -------------------------------------------------------------
// 🧩 Chain configuration
// -------------------------------------------------------------
export const BSC_CHAIN_ID = Number(getEnv('EXPO_PUBLIC_CHAIN_ID', '56'));
export const BSC_RPC_URL = getEnv('EXPO_PUBLIC_BSC_RPC_URL', 'https://bsc-dataseed.binance.org');
export const BSC_EXPLORER = getEnv('EXPO_PUBLIC_BLOCK_EXPLORER', 'https://bscscan.com');

// -------------------------------------------------------------
// 🧮 PancakeSwap v2
// -------------------------------------------------------------
export const PCS_V2_ROUTER = getEnv(
  'EXPO_PUBLIC_PCS_V2_ROUTER',
  '0x10ED43C718714eb63d5aA57B78B54704E256024E'
);
export const PCS_V2_FACTORY = getEnv(
  'EXPO_PUBLIC_PCS_V2_FACTORY',
  '0xCA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
);
export const WBNB = getEnv('EXPO_PUBLIC_WBNB', '0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');

// -------------------------------------------------------------
// 💎 Tokens — core list for wallet UI
// -------------------------------------------------------------
export const TOKENS = {
  // 🟡 Нативный BNB (без контракта)
  BNB: {
    address: getEnv(
      'EXPO_PUBLIC_NATIVE_SENTINEL',
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    ),
    symbol: 'BNB',
    decimals: 18,
    isNative: true,
  },

  // 🟢 Wrapped BNB
  WBNB: {
    address: WBNB,
    symbol: 'WBNB',
    decimals: 18,
    isWrapped: true,
  },

  // 🪙 Главный токен проекта
  GAD: {
    address: getEnv('EXPO_PUBLIC_GAD_TOKEN', '0x858bab88A5b8d7f29a40380C5F2D8d0b8812FE62'),
    symbol: getEnv('EXPO_PUBLIC_GAD_SYMBOL', 'GAD'),
    decimals: Number(getEnv('EXPO_PUBLIC_GAD_DECIMALS', '18')),
    isMain: true,
  },

  // 💵 Стейблкоин для свапов / ликвидности
  USDT: {
    address: getEnv('EXPO_PUBLIC_USDT', '0x55d398326f99059fF775485246999027B3197955'),
    symbol: 'USDT',
    decimals: 18,
  },
} as const;

// -------------------------------------------------------------
// ⚙️ Helper functions
// -------------------------------------------------------------

/** Проверить, является ли адрес нативным (BNB) */
export function isNative(address: string): boolean {
  return address.toLowerCase() === TOKENS.BNB.address.toLowerCase();
}

/** Проверить, является ли адрес токеном GAD */
export function isGAD(address: string): boolean {
  return address.toLowerCase() === TOKENS.GAD.address.toLowerCase();
}

/** Получить метаданные токена по адресу */
export function getTokenByAddress(addr: string) {
  const lower = addr.toLowerCase();
  return Object.values(TOKENS).find((t) => t.address.toLowerCase() === lower);
}

/** Получить адрес по символу (BNB, GAD, USDT, ...) */
export function getAddressBySymbol(symbol: string): string | null {
  const entry = Object.values(TOKENS).find(
    (t) => t.symbol.toLowerCase() === symbol.toLowerCase()
  );
  return entry ? entry.address : null;
}

/** Получить список токенов для UI (с приоритетом GAD) */
export const TOKEN_LIST_UI = [
  TOKENS.GAD,
  TOKENS.BNB,
  TOKENS.USDT,
  TOKENS.WBNB,
];
