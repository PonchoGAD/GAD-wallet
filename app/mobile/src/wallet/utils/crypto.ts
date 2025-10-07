import { HDNodeWallet } from 'ethers';

/** Generate 12-word mnemonic (ethers v6) */
export function generateMnemonic(): string {
  const wallet = HDNodeWallet.createRandom();
  return wallet.mnemonic?.phrase ?? '';
}

/**
 * Derive wallet (address + privateKey) from mnemonic & index.
 * Возвращаем строго типизированные `0x${string}` – это уберёт ошибки.
 */
export function getWalletFromMnemonic(
  mnemonic: string,
  index = 0,
  derivationPath = `m/44'/60'/0'/0/${index}`,
): { address: `0x${string}`; privateKey: `0x${string}` } {
  const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, derivationPath);
  return {
    address: wallet.address as `0x${string}`,
    privateKey: wallet.privateKey as `0x${string}`,
  };
}
