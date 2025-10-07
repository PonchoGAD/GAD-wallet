// quote.ts
import { publicClient } from './bscClient';
import { FACTORY_ABI, PAIR_ABI } from './abi';
import { PCS_V2_FACTORY, WBNB } from './constants';
import type { Address } from 'viem';

type Addr = Address;

async function getPairAddress(tokenA: Addr, tokenB: Addr): Promise<Addr | null> {
  const pair = (await publicClient.readContract({
    address: PCS_V2_FACTORY as Addr,
    abi: FACTORY_ABI,
    functionName: 'getPair',
    args: [tokenA, tokenB],
    authorizationList: [],
  })) as Addr;

  if (!pair || pair === '0x0000000000000000000000000000000000000000') return null;
  return pair;
}

async function getReserves(pairAddr: Addr): Promise<{
  reserve0: bigint;
  reserve1: bigint;
  token0: Addr;
  token1: Addr;
}> {
  const token0 = (await publicClient.readContract({
    address: pairAddr,
    abi: PAIR_ABI,
    functionName: 'token0',
    authorizationList: [],
  })) as Addr;

  const token1 = (await publicClient.readContract({
    address: pairAddr,
    abi: PAIR_ABI,
    functionName: 'token1',
    authorizationList: [],
  })) as Addr;

  const [r0, r1] = (await publicClient.readContract({
    address: pairAddr,
    abi: PAIR_ABI,
    functionName: 'getReserves',
    authorizationList: [],
  })) as unknown as [bigint, bigint, number];

  return { reserve0: r0, reserve1: r1, token0, token1 };
}

function getAmountOut(amountIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint {
  if (amountIn <= 0n || reserveIn <= 0n || reserveOut <= 0n) return 0n;
  const amountInWithFee = amountIn * 9_975n; // 0.25% fee
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn * 10_000n + amountInWithFee;
  return numerator / denominator;
}

export async function quoteExactIn(
  tokenIn: Addr,
  tokenOut: Addr,
  amountIn: bigint,
): Promise<{ amountOut: bigint; path: Addr[] }> {
  // direct
  const direct = await getPairAddress(tokenIn, tokenOut);
  if (direct) {
    const { reserve0, reserve1, token0 } = await getReserves(direct);
    const [rin, rout] =
      tokenIn.toLowerCase() === token0.toLowerCase() ? [reserve0, reserve1] : [reserve1, reserve0];
    const amountOut = getAmountOut(amountIn, rin, rout);
    return { amountOut, path: [tokenIn, tokenOut] };
  }

  // via WBNB
  const a = await getPairAddress(tokenIn, WBNB as Addr);
  const b = await getPairAddress(WBNB as Addr, tokenOut);

  if (a && b) {
    const R1 = await getReserves(a);
    const [rin1, rout1] =
      tokenIn.toLowerCase() === R1.token0.toLowerCase()
        ? [R1.reserve0, R1.reserve1]
        : [R1.reserve1, R1.reserve0];
    const mid = getAmountOut(amountIn, rin1, rout1);
    if (mid === 0n) return { amountOut: 0n, path: [tokenIn, tokenOut] };

    const R2 = await getReserves(b);
    const [rin2, rout2] =
      (WBNB as string).toLowerCase() === R2.token0.toLowerCase()
        ? [R2.reserve0, R2.reserve1]
        : [R2.reserve1, R2.reserve0];
    const out = getAmountOut(mid, rin2, rout2);
    return { amountOut: out, path: [tokenIn, WBNB as Addr, tokenOut] };
  }

  return { amountOut: 0n, path: [tokenIn, tokenOut] };
}
