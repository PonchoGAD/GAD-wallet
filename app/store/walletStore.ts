import { create } from 'zustand';

interface WalletState {
  mnemonic: string | null;
  address: string | null;
  setMnemonic: (mnemonic: string) => void;
  setAddress: (address: string) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  mnemonic: null,
  address: null,
  setMnemonic: (mnemonic) => set({ mnemonic }),
  setAddress: (address) => set({ address }),
}));
