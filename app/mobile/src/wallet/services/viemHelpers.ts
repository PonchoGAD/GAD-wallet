import type { Abi, Address } from 'viem';
import { publicClient } from './bscClient';

type ReadArgs = {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
};

export async function readC<T>(args: ReadArgs): Promise<T> {
  // каст один раз внутри — в остальном код остаётся чистым
  return publicClient.readContract(args as any) as Promise<T>;
}
