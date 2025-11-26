// app/mobile/src/wallet/services/send.ts
// Чистый core-слой: никакого React/Expo, только viem-клиенты.

import type { Address } from 'viem';
import { publicClient } from './bscClient';
import { walletClientFromPriv } from './signer';
import { ERC20_ABI } from './abi';

// 🔹 Отправка нативного BNB
export async function sendNative(
  privKey: `0x${string}`,
  to: Address,
  amountWei: string | bigint,
) {
  const { wallet, account } = walletClientFromPriv(privKey);
  const value = typeof amountWei === 'string' ? BigInt(amountWei) : amountWei;

  const hash = await wallet.sendTransaction(
    { account, to, value } as any, // «анти-сыпучий» каст типов viem
  );

  await publicClient.waitForTransactionReceipt({ hash });
  return hash;
}

// 🔹 Отправка токенов ERC20 (GAD, USDT и др.)
export async function sendERC20(
  privKey: `0x${string}`,
  token: Address,
  to: Address,
  amountWei: bigint,
) {
  const { wallet, account } = walletClientFromPriv(privKey);

  const txHash = await wallet.writeContract(
    {
      address: token,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to, amountWei],
      account,
    } as any,
  );

  await publicClient.waitForTransactionReceipt({ hash: txHash });
  return txHash;
}
