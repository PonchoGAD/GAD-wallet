import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  formatUnits,
} from 'viem';
import type { Address, Account } from 'viem';
import { bsc } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { BSC_RPC_URL } from '../config/addresses';

const RPC = BSC_RPC_URL;

export const publicClient = createPublicClient({
  chain: bsc,
  transport: http(RPC),
});

export function makeWalletClient(account: Account) {
  return createWalletClient({
    chain: bsc,
    account,
    transport: http(RPC),
  });
}

export function walletClientFromPriv(privKey: `0x${string}`) {
  const account = privateKeyToAccount(privKey);
  const wallet = makeWalletClient(account);
  return { wallet, account };
}

export const toWei = (v: string, decimals = 18) =>
  parseUnits((v ?? '0').trim() || '0', decimals);

export const fromWei = (v: bigint, decimals = 18) =>
  Number(formatUnits(v ?? 0n, decimals));

export const asAddr = (v: string) => v as Address;
