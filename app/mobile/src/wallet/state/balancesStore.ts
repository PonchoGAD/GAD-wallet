// app/mobile/src/wallet/state/balancesStore.ts
// ---------------------------------------------
//   Хранилище балансов токенов для GAD Wallet
// ---------------------------------------------

import { create } from 'zustand';

interface BalancesState {
  /**
   * Карта: ключ токена -> баланс (в человекочитаемом виде, уже поделённый на decimals).
   *
   * Ключом может быть:
   *  - символ (BNB / GAD / USDT / WBNB),
   *  - адрес токена (0x...),
   *  - специальный маркер (например, NATIVE_SENTINEL).
   *
   * Для WalletHome мы используем символы:
   *   balances["BNB"], balances["GAD"], balances["USDT"], balances["WBNB"].
   */
  balances: Record<string, number>;

  /** Установить баланс для одного токена */
  setBalance: (tokenKey: string, amount: number) => void;

  /** Массовое обновление балансов (например, из getKnownBalances) */
  setMany: (entries: Array<[string, number]>) => void;

  /** Полный сброс */
  reset: () => void;
}

export const useBalancesStore = create<BalancesState>((set) => ({
  balances: {},

  setBalance: (tokenKey, amount) =>
    set((state) => ({
      balances: { ...state.balances, [tokenKey]: amount },
    })),

  setMany: (entries) =>
    set((state) => {
      const next = { ...state.balances };
      for (const [k, v] of entries) {
        next[k] = v;
      }
      return { balances: next };
    }),

  reset: () => set({ balances: {} }),
}));
