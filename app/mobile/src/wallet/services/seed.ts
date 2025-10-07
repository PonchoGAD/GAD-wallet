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
export async function derivePrivKey(index = 0): Promise<`0x${string}`> {
  const mnemonic = await ensureMnemonic();
  return derivePrivKeyFromMnemonic(mnemonic, index);
}
