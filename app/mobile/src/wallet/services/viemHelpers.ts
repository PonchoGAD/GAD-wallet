// app/mobile/src/wallet/services/viemHelpers.ts
import type { Abi, Address } from 'viem';
import { publicClient } from './bscClient';
import { getAddress } from 'viem';

type ReadArgs = {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
};

/** Аккуратная нормализация адреса (чистим мусор и приводим к checksum) */
export function cleanAddress(a: string): `0x${string}` {
  const hex = a.trim().replace(/[^0-9a-fA-Fx]/g, '').replace(/^0x/i, '');
  return getAddress(`0x${hex}` as `0x${string}`);
}

/** Обёртка над publicClient.readContract — один каст внутри, чистые типы снаружи */
export async function readC<T>(args: ReadArgs): Promise<T> {
  return publicClient.readContract(args as any) as Promise<T>;
}
