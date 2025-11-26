// app/mobile/src/wallet/config/addresses.ts
// ===============================
// 🔗 GAD-WALLET — Network & Tokens Config
// ===============================

import { getEnv } from '../utils/env';

// -------------------------------------------------------------
// 🧩 Chain configuration
// -------------------------------------------------------------
export const BSC_CHAIN_ID = Number(getEnv('EXPO_PUBLIC_CHAIN_ID', '56'));
export const BSC_RPC_URL = getEnv(
  'EXPO_PUBLIC_BSC_RPC_URL',
  'https://bsc-dataseed.binance.org',
);
export const BSC_EXPLORER = getEnv(
  'EXPO_PUBLIC_BLOCK_EXPLORER',
  'https://bscscan.com',
);

// -------------------------------------------------------------
// 🧮 PancakeSwap v2
// -------------------------------------------------------------
export const PCS_V2_ROUTER = getEnv(
  'EXPO_PUBLIC_PCS_V2_ROUTER',
  '0x10ED43C718714eb63d5aA57B78B54704E256024E',
);
export const PCS_V2_FACTORY = getEnv(
  'EXPO_PUBLIC_PCS_V2_FACTORY',
  '0xCA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
);
export const WBNB = getEnv(
  'EXPO_PUBLIC_WBNB',
  '0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
);

// -------------------------------------------------------------
// 💎 Tokens — core list for wallet UI
// -------------------------------------------------------------
export const TOKENS = {
  // 🟡 Нативный BNB (без контракта)
  BNB: {
    address: getEnv(
      'EXPO_PUBLIC_NATIVE_SENTINEL',
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
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
    address: getEnv(
      'EXPO_PUBLIC_GAD_TOKEN',
      '0x858bab88A5b8d7f29a40380C5F2D8d0b8812FE62',
    ),
    symbol: getEnv('EXPO_PUBLIC_GAD_SYMBOL', 'GAD'),
    decimals: Number(getEnv('EXPO_PUBLIC_GAD_DECIMALS', '18')),
    isMain: true,
  },

  // 💵 Стейблкоин для свапов / ликвидности
  USDT: {
    address: getEnv(
      'EXPO_PUBLIC_USDT',
      '0x55d398326f99059fF775485246999027B3197955',
    ),
    symbol: 'USDT',
    decimals: 18,
  },
} as const;

// -------------------------------------------------------------
// 🧱 Deployed Contracts (GAD Ecosystem)
// -------------------------------------------------------------
export const CONTRACTS = {
  // Core token
  GAD_TOKEN: TOKENS.GAD.address,

  // NFTs & marketplace
  VAULT_NFT: getEnv(
    'EXPO_PUBLIC_VAULT_NFT',
    '0x86500D900db7424E9D93DEd334C3165A82C10783',
  ),
  NFT_MARKETPLACE: getEnv(
    'EXPO_PUBLIC_NFT_MARKETPLACE',
    '0x8117b368f5C620BE0D7173F12a0Fa25729A5fEEd',
  ),
  NFT721: getEnv(
    'EXPO_PUBLIC_NFT721',
    '0xa1a72398bCded7D40f26c2679dC35E5A73dA3948',
  ),

  // Staking / farming
  STAKE_GAD: getEnv(
    'EXPO_PUBLIC_STAKE_GAD',
    '0x0271167c2b1b1513434ECe38f024434654781594',
  ), // stake GAD earn GAD
  STAKE_LP: getEnv(
    'EXPO_PUBLIC_STAKE_LP',
    '0x5C5c0b9eE66CC106f90D7b1a3727dc126C4eF188',
  ), // stake LP earn GAD
  GAD_ZAP: getEnv(
    'EXPO_PUBLIC_GAD_ZAP',
    '0x15Acdc7636FB0214aEfa755377CE5ab3a9Cc99BC',
  ),

  // DAO / xGAD
  SINGLE_STAKE_LOCK: getEnv(
    'EXPO_PUBLIC_GAD_SINGLE_STAKE_LOCK',
    '0x2479158bFA2a0F164E7a1B9b7CaF8d3Ea2307ea1',
  ), // GADSingleStakeLock
  VOTING_XGAD: getEnv(
    'EXPO_PUBLIC_GAD_VOTING_XGAD',
    '0x279F375f6CCB85Cc276D38d2b6669736a020Eb7B',
  ),
  GOVERNOR: getEnv(
    'EXPO_PUBLIC_GAD_GOVERNOR',
    '0x6b07d69A2bE398e353f1877b81E116603837D556',
  ),
  DAO_TREASURY: getEnv(
    'EXPO_PUBLIC_DAO_TREASURY',
    '0xbd66442e64D505dDFF6c4749cc9d6C158887A93C',
  ),

  // Locks / vesting / launchpad
  LP_TOKEN_LOCKER: getEnv(
    'EXPO_PUBLIC_LP_TOKEN_LOCKER',
    '0xF40B3dE6822837E0c4d937eF20D67B944aE39163',
  ),
  VESTING_VAULT: getEnv(
    'EXPO_PUBLIC_VESTING_VAULT',
    '0x9653Cb1fc5daD8A384c2dAD18A4223b77eCF4A15',
  ),
  LAUNCHPAD_GAD: getEnv(
    'EXPO_PUBLIC_LAUNCHPAD_GAD',
    '0xcf9f7ce8243eD3e402307f2f07BA950a6CB566EF',
  ),

  // Legacy / misc
  AIRDROP_V1: getEnv(
    'EXPO_PUBLIC_AIRDROP_V1',
    '0x022cE9320Ea1AB7E03F14D8C0dBD14903A940F79',
  ),
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
  return Object.values(TOKENS).find(
    (t) => t.address.toLowerCase() === lower,
  );
}

/** Получить адрес по символу (BNB, GAD, USDT, ...) */
export function getAddressBySymbol(symbol: string): string | null {
  const entry = Object.values(TOKENS).find(
    (t) => t.symbol.toLowerCase() === symbol.toLowerCase(),
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
