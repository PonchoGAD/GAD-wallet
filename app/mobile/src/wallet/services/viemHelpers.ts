import type { Abi, Address } from 'viem';
import { publicClient } from './bscClient';
import { getAddress } from 'viem';

type ReadArgs = {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
};

export function cleanAddress(a: string): `0x${string}` {
  const hex = a.trim().replace(/[^0-9a-fA-Fx]/g, '').replace(/^0x/i, '');
  return getAddress(`0x${hex}` as `0x${string}`);
}

export async function readC<T>(args: ReadArgs): Promise<T> {
  // каст один раз внутри — в остальном код остаётся чистым
  return publicClient.readContract(args as any) as Promise<T>;
}
