// app/mobile/src/wallet/services/erc20.ts
import type { Address } from 'viem';
import { ERC20_ABI } from './abi';
import { readC } from './viemHelpers';

/** raw balanceOf → bigint (без деления на decimals) */
export async function erc20BalanceOf(
  token: Address,
  owner: Address,
): Promise<bigint> {
  try {
    return await readC<bigint>({
      address: token,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [owner],
    });
  } catch (e) {
    console.warn(`erc20BalanceOf error (${token}):`, e);
    return 0n;
  }
}

export async function erc20Decimals(token: Address): Promise<number> {
  try {
    const d = await readC<bigint>({
      address: token,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });
    return Number(d);
  } catch (e) {
    console.warn(`erc20Decimals error (${token}):`, e);
    return 18;
  }
}

export async function erc20Symbol(token: Address): Promise<string> {
  try {
    const s = await readC<string>({
      address: token,
      abi: ERC20_ABI,
      functionName: 'symbol',
    });
    return String(s);
  } catch (e) {
    console.warn(`erc20Symbol error (${token}):`, e);
    return 'UNKNOWN';
  }
}

export async function erc20Name(token: Address): Promise<string> {
  try {
    const s = await readC<string>({
      address: token,
      abi: ERC20_ABI,
      functionName: 'name',
    });
    return String(s);
  } catch (e) {
    console.warn(`erc20Name error (${token}):`, e);
    return 'Unknown Token';
  }
}

export async function erc20Allowance(
  token: Address,
  owner: Address,
  spender: Address,
): Promise<bigint> {
  try {
    return await readC<bigint>({
      address: token,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [owner, spender],
    });
  } catch (e) {
    console.warn(`erc20Allowance error (${token}):`, e);
    return 0n;
  }
}
