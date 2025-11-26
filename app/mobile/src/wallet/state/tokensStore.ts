// app/mobile/src/wallet/state/tokensStore.ts
// ---------------------------------------------
//   Стор пользовательских токенов GAD Wallet
//   Базовый список (GAD / BNB / USDT / WBNB) живёт в CORE_TOKENS.
//   Здесь храним только "добавленные вручную" токены.
// ---------------------------------------------

import { create } from 'zustand';

interface TokensState {
  /**
   * Простая карта: символ -> адрес (строка; может быть 0xeeee... для нативного).
   * Примеры:
   *  - "CAKE" -> "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
   *  - "BUSD" -> "0xe9e7cea3dedca5984780bafc599bd69add087d56"
   */
  tokens: Record<string, string>;

  /** Добавить/обновить токен в локальном списке */
  addToken: (symbol: string, address: string) => void;

  /** Удалить токен по символу */
  removeToken: (symbol: string) => void;

  /** Полный сброс всех пользовательских токенов */
  reset: () => void;
}

export const useTokensStore = create<TokensState>((set) => ({
  tokens: {},

  addToken: (symbol, address) =>
    set((state) => ({
      tokens: {
        ...state.tokens,
        [symbol]: address,
      },
    })),

  removeToken: (symbol) =>
    set((state) => {
      const next = { ...state.tokens };
      delete next[symbol];
      return { tokens: next };
    }),

  reset: () => set({ tokens: {} }),
}));
