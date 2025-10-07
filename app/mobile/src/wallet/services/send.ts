import type { Address } from 'viem';
import { publicClient } from './bscClient';
import { walletClientFromPriv } from './signer';
import { ERC20_ABI } from './abi';

// 🔹 Отправка нативного BNB
export async function sendNative(
  privKey: `0x${string}`,
  to: Address,
  amountWei: string,
) {
  const { wallet, account } = walletClientFromPriv(privKey);
  const value = BigInt(amountWei);

  const hash = await wallet.sendTransaction(
    { account, to, value } as any // ← «анти-сыпучая» прокладка типов
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
    } as any
  );

  await publicClient.waitForTransactionReceipt({ hash: txHash });
  return txHash;
}
