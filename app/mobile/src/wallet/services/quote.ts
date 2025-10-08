import type { Address } from 'viem';
import { publicClient } from './bscClient';
import { FACTORY_ABI, PAIR_ABI } from './abi';
import { PCS_V2_FACTORY, WBNB, NATIVE_SENTINEL } from './constants';

type Addr = Address;

const isNative = (addr: string) => addr.toLowerCase() === NATIVE_SENTINEL.toLowerCase();
const sortTokens = (a: Addr, b: Addr): [Addr, Addr] =>
  (a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a]) as [Addr, Addr];

export async function getPairAddress(tokenA: Addr, tokenB: Addr): Promise<Addr | null> {
  const pair = await publicClient.readContract({
    address: PCS_V2_FACTORY as Addr,
    abi: FACTORY_ABI,
    functionName: 'getPair',
    args: [tokenA, tokenB] as [Addr, Addr],
    authorizationList: [],                 // <-- требуется viem типами
  }) as Addr;

  if (pair.toLowerCase() === '0x0000000000000000000000000000000000000000') return null;
  return pair;
}

export async function quoteExactIn(
  tokenIn: Addr,
  tokenOut: Addr,
  amountIn: bigint,
): Promise<{ amountOut: bigint; path: Addr[] }> {
  const aIn  = isNative(tokenIn)  ? (WBNB as Addr) : tokenIn;
  const aOut = isNative(tokenOut) ? (WBNB as Addr) : tokenOut;

  const [t0, t1] = sortTokens(aIn, aOut);
  const pair = await getPairAddress(t0, t1);
  if (!pair) return { amountOut: 0n, path: [] };

  // getReserves() => [reserve0, reserve1, blockTimestampLast]
  const [reserve0, reserve1] = await publicClient.readContract({
    address: pair as Addr,
    abi: PAIR_ABI,
    functionName: 'getReserves',
    args: [],
    authorizationList: [],                 // <-- тоже сюда
  }) as unknown as [bigint, bigint, number];

  const [reserveIn, reserveOut] = aIn.toLowerCase() === t0.toLowerCase()
    ? [reserve0, reserve1]
    : [reserve1, reserve0];

  if (reserveIn === 0n || reserveOut === 0n) return { amountOut: 0n, path: [] };

  // 0.25% fee (9975 / 10000)
  const amountInWithFee = (amountIn * 9975n) / 10000n;
  const numerator   = amountInWithFee * reserveOut;
  const denominator = reserveIn + amountInWithFee;
  const out = denominator === 0n ? 0n : numerator / denominator;

  return { amountOut: out, path: [aIn, aOut] };
}
