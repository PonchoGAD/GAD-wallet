// app/mobile/src/wallet/state/walletStore.ts
// ---------------------------------------------
//   Ядро инициализации кошелька (mnemonic / address / privKey)
//   + мост к общему Zustand-store в app/store/walletStore.ts
// ---------------------------------------------

import {
  ensureMnemonic,
  derivePrivKeyFromMnemonic,
  deriveAddressFromMnemonic,
} from '../services/seed';
import { useWalletStore } from '../../../../store/walletStore';

/**
 * Тип для ядра кошелька: то, что будем переиспользовать и в мобилке, и в web-обёртках.
 */
export type WalletCore = {
  mnemonic: string;
  address: `0x${string}`;
  privKey: `0x${string}`;
};

/**
 * Реэкспорт сторы, чтобы UI-слой импортировал её из одного места:
 *
 *   import { useWalletStore } from '../state/walletStore';
 */
export { useWalletStore } from '../../../../store/walletStore';

/**
 * ensureWalletCore
 *  - проверяет, инициализирован ли кошелёк в Zustand-store;
 *  - если да — возвращает значения из store;
 *  - если нет — создаёт/читает mnemonic в SecureStore, считает privKey+address
 *    и сохраняет всё в store.
 *
 * В итоге:
 *   const { address, privKey } = await ensureWalletCore();
 *   // address/privKey используются в send / swap / nft и т.п.
 */
export async function ensureWalletCore(index = 0): Promise<WalletCore> {
  const store = useWalletStore.getState();

  // Если уже инициализировано — просто возвращаем из store
  if (store.isReady && store.address && store.privKey && store.mnemonic) {
    return {
      mnemonic: store.mnemonic,
      address: store.address as `0x${string}`,
      privKey: store.privKey as `0x${string}`,
    };
  }

  // Иначе — создаём / поднимаем сид и считаем ключи
  const mnemonic = await ensureMnemonic();
  const privKey = derivePrivKeyFromMnemonic(mnemonic, index);
  const address = deriveAddressFromMnemonic(mnemonic, index);

  store.setWallet({
    mnemonic,
    privKey,
    address,
    isReady: true,
  });

  return { mnemonic, privKey, address };
}
