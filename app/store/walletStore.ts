// app/store/walletStore.ts
import { create } from 'zustand';

interface WalletState {
  /** 12-словная мнемоника (копия для UI/отладки, основной сторедж — SecureStore) */
  mnemonic: string | null;
  /** Активный EOA-адрес */
  address: string | null;
  /** Приватный ключ текущего аккаунта */
  privKey: string | null;

  /** Флаг, что кошелёк инициализирован */
  isReady: boolean;

  setMnemonic: (mnemonic: string | null) => void;
  setAddress: (address: string | null) => void;
  setPrivKey: (privKey: string | null) => void;

  setWallet: (data: Partial<Pick<WalletState, 'mnemonic' | 'address' | 'privKey' | 'isReady'>>) => void;

  reset: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  mnemonic: null,
  address: null,
  privKey: null,
  isReady: false,

  setMnemonic: (mnemonic) => set((state) => ({ ...state, mnemonic })),
  setAddress: (address) => set((state) => ({ ...state, address })),
  setPrivKey: (privKey) => set((state) => ({ ...state, privKey })),

  setWallet: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  reset: () =>
    set({
      mnemonic: null,
      address: null,
      privKey: null,
      isReady: false,
    }),
}));
