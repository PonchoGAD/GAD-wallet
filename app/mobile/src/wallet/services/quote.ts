import type { Address, Abi } from 'viem';
import { publicClient } from './bscClient';
import { FACTORY_ABI, PAIR_ABI } from './abi';
import { PCS_V2_FACTORY, WBNB, NATIVE_SENTINEL } from './constants';

type Addr = Address;

const isNative = (addr: string) =>
  addr.toLowerCase() === NATIVE_SENTINEL.toLowerCase();

const lower = (s: string) => s.toLowerCase();
const sortTokens = (a: Addr, b: Addr): [Addr, Addr] =>
  lower(a) < lower(b) ? [a, b] : [b, a];

/** Обёртка над viem.readContract, чтобы не упираться в перегрузки типов. */
async function read<TResult = unknown>(params: any): Promise<TResult> {
  return (publicClient as any).readContract(params) as Promise<TResult>;
}

export async function getPairAddress(tokenA: Addr, tokenB: Addr): Promise<Addr | null> {
  const [a, b] = sortTokens(tokenA, tokenB);

  const pair = await read<Addr>({
    address: PCS_V2_FACTORY as Addr,
    abi: FACTORY_ABI as Abi,         // ⬅ вместо `as const`
    functionName: 'getPair',
    args: [a, b],
  });

  if (lower(pair) === '0x0000000000000000000000000000000000000000') return null;
  return pair;
}

export async function quoteExactIn(
  tokenIn: Addr,
  tokenOut: Addr,
  amountIn: bigint
): Promise<{ amountOut: bigint; path: Addr[] }> {
  const aIn  = isNative(tokenIn)  ? (WBNB as Addr) : tokenIn;
  const aOut = isNative(tokenOut) ? (WBNB as Addr) : tokenOut;

  const [t0, t1] = sortTokens(aIn, aOut);
  const pair = await getPairAddress(t0, t1);
  if (!pair) return { amountOut: 0n, path: [] };

  // getReserves(): [reserve0, reserve1, timestamp]
  const [reserve0, reserve1] = (await read({
    address: pair as Addr,
    abi: PAIR_ABI as Abi,            // ⬅ вместо `as const`
    functionName: 'getReserves',
    args: [],
  }) as unknown) as [bigint, bigint, number];

  const [reserveIn, reserveOut] =
    lower(aIn) === lower(t0) ? [reserve0, reserve1] : [reserve1, reserve0];

  if (reserveIn === 0n || reserveOut === 0n) return { amountOut: 0n, path: [] };

  // комиссия 0.25%
  const amountInWithFee = (amountIn * 9975n) / 10000n;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn + amountInWithFee;
  const amountOut = denominator === 0n ? 0n : numerator / denominator;

  return { amountOut, path: [aIn, aOut] };
}
