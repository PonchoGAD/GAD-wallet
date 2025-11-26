// app/mobile/src/wallet/services/quote.ts
// ---------------------------------------------
//   Расчёт котировок для Swap (PancakeSwap v2)
// ---------------------------------------------

import type { Address, Abi } from 'viem';
import { publicClient } from './bscClient';
import { FACTORY_ABI, PAIR_ABI } from './abi';
import { NATIVE_SENTINEL, PCS_V2_FACTORY, WBNB } from './constants';
import { cleanAddress } from './viemHelpers';

type Addr = Address;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const isNative = (addr: string) =>
  addr.toLowerCase() === NATIVE_SENTINEL.toLowerCase();

const lower = (s: string) => s.toLowerCase();

const sortTokens = (a: Addr, b: Addr): [Addr, Addr] =>
  lower(a) < lower(b) ? [a, b] : [b, a];

// Обёртка над readContract, чтобы не упираться в дженерики viem
async function read<TResult = unknown>(params: any): Promise<TResult> {
  return (publicClient as any).readContract(params) as Promise<TResult>;
}

/**
 * Безопасно получаем адрес пары tokenA-tokenB из Factory.
 * Все адреса предварительно очищаются через cleanAddress,
 * чтобы не было проблем с кавычками/пробелами.
 */
export async function getPairAddress(
  tokenA: Addr,
  tokenB: Addr
): Promise<Addr | null> {
  try {
    // очищаем всё, включая PCS_V2_FACTORY (на случай мусора из ENV)
    const factory = cleanAddress(PCS_V2_FACTORY as unknown as string) as Addr;
    const aClean = cleanAddress(tokenA as unknown as string) as Addr;
    const bClean = cleanAddress(tokenB as unknown as string) as Addr;

    const [a, b] = sortTokens(aClean, bClean);

    const pair = await read<Addr>({
      address: factory,
      abi: FACTORY_ABI as Abi,
      functionName: 'getPair',
      args: [a, b],
    });

    if (lower(pair) === ZERO_ADDRESS.toLowerCase()) return null;
    return pair;
  } catch (e) {
    console.warn('[quote] getPairAddress error:', e);
    // Короткое сообщение, чтобы в Alert не вываливать огромный стек
    throw new Error('Cannot fetch DEX pair for selected tokens.');
  }
}

/**
 * Расчёт количества tokenOut для amountIn с учётом комиссии 0.25%.
 * Возвращает ожидаемый amountOut и реальный путь свапа (через WBNB для нативных).
 */
export async function quoteExactIn(
  tokenIn: Addr,
  tokenOut: Addr,
  amountIn: bigint
): Promise<{ amountOut: bigint; path: Addr[] }> {
  try {
    const aIn = isNative(tokenIn) ? (WBNB as Addr) : tokenIn;
    const aOut = isNative(tokenOut) ? (WBNB as Addr) : tokenOut;

    const [t0, t1] = sortTokens(aIn, aOut);
    const pair = await getPairAddress(t0, t1);
    if (!pair) {
      return { amountOut: 0n, path: [] };
    }

    const [reserve0, reserve1] = (await read({
      address: pair as Addr,
      abi: PAIR_ABI as Abi,
      functionName: 'getReserves',
      args: [],
    })) as unknown as [bigint, bigint, number];

    const [reserveIn, reserveOut] =
      lower(aIn) === lower(t0) ? [reserve0, reserve1] : [reserve1, reserve0];

    if (reserveIn === 0n || reserveOut === 0n) {
      return { amountOut: 0n, path: [] };
    }

    // комиссия 0.25%
    const amountInWithFee = (amountIn * 9975n) / 10000n;
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn + amountInWithFee;
    const amountOut = denominator === 0n ? 0n : numerator / denominator;

    return { amountOut, path: [aIn, aOut] };
  } catch (e) {
    console.warn('[quote] quoteExactIn error:', e);
    // UI может отобразить это как краткий Alert "Quote error"
    throw new Error('Cannot fetch swap quote. Please try again.');
  }
}
