import type { Address, Account } from 'viem';
import { walletClientFromPriv as baseWalletClientFromPriv } from './bscClient';

export function walletClientFromPriv(privKey: `0x${string}`): {
  wallet: ReturnType<typeof baseWalletClientFromPriv>['wallet'];
  account: Account;
  address: Address;
} {
  const { wallet, account } = baseWalletClientFromPriv(privKey);
  return { wallet, account, address: account.address as Address };
}
