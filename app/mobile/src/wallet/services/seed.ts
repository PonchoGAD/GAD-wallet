// app/mobile/src/wallet/services/seed.ts
// Хранилище сид-фразы и базовые хелперы для mobile-кошелька.
// Для web будет своя реализация (другой сторедж), а интерфейс можно оставить общий.

import * as SecureStore from 'expo-secure-store';
import { generateMnemonic, getWalletFromMnemonic } from '../utils/crypto';

const MNEMONIC_KEY = 'mnemonic';

/** Ensure mnemonic exists in SecureStore, otherwise create & save it */
export async function ensureMnemonic(): Promise<string> {
  let mnemonic = await SecureStore.getItemAsync(MNEMONIC_KEY);
  if (!mnemonic) {
    mnemonic = generateMnemonic();
    await SecureStore.setItemAsync(MNEMONIC_KEY, mnemonic);
  }
  return mnemonic;
}

/** Derive private key from given mnemonic (pure helper, no storage) */
export function derivePrivKeyFromMnemonic(
  mnemonic: string,
  index = 0,
): `0x${string}` {
  const { privateKey } = getWalletFromMnemonic(mnemonic, index);
  return privateKey as `0x${string}`;
}

/** Derive address from given mnemonic (pure helper, no storage) */
export function deriveAddressFromMnemonic(
  mnemonic: string,
  index = 0,
): `0x${string}` {
  const { address } = getWalletFromMnemonic(mnemonic, index);
  return address as `0x${string}`;
}

/** Derive private key using mnemonic stored in SecureStore */
export async function derivePrivKey(
  index = 0,
): Promise<`0x${string}`> {
  const mnemonic = await ensureMnemonic();
  return derivePrivKeyFromMnemonic(mnemonic, index);
}

/** 🔥 Единая точка инициализации кошелька для mobile-core
 *  Возвращает сид, address, privateKey (index 0).
 *  UI-экраны (Send/Receive/NFT и т.п.) могут брать данные отсюда
 *  и дальше класть в zustand/useWalletStore.
 */
export async function ensureWalletCore(index = 0): Promise<{
  mnemonic: string;
  address: `0x${string}`;
  privateKey: `0x${string}`;
}> {
  const mnemonic = await ensureMnemonic();
  const { address, privateKey } = getWalletFromMnemonic(mnemonic, index);
  return {
    mnemonic,
    address,
    privateKey,
  };
}
