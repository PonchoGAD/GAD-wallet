// app/mobile/src/wallet/services/discovery.ts
// ---------------------------------------------
//   Балансы & метаданные токенов для WalletHome
//   - базовые токены из CORE_TOKENS
//   - пользовательские токены из tokensStore
// ---------------------------------------------

import type { Address } from 'viem';
import { publicClient } from './bscClient';
import { ERC20_ABI } from './abi';
import {
  NATIVE_SENTINEL,
  CORE_TOKENS,
  CORE_TOKENS_BY_SYMBOL,
} from './constants';
import { useTokensStore } from '../state/tokensStore';

export type TokenMeta = {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
};

export function isNative(addrLike?: string | null): boolean {
  return (
    !!addrLike &&
    addrLike.toLowerCase() === NATIVE_SENTINEL.toLowerCase()
  );
}

// ---------------------------------------------
//   Helpers
// ---------------------------------------------

export async function getNativeBalance(user: `0x${string}`): Promise<number> {
  const wei = await publicClient.getBalance({ address: user });
  return Number(wei) / 1e18;
}

export async function getErc20Balance(
  token: Address,
  user: `0x${string}`,
  decimals = 18
): Promise<number> {
  try {
    const bal = (await publicClient.readContract({
      address: token,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [user],
    } as any)) as bigint;

    return Number(bal) / 10 ** decimals;
  } catch (e) {
    console.warn('erc20BalanceOf error (%s):', token, e);
    return 0;
  }
}

export async function getErc20Meta(address: Address): Promise<TokenMeta> {
  const [symbol, name, decimals] = await Promise.all([
    publicClient.readContract({
      address,
      abi: ERC20_ABI,
      functionName: 'symbol',
    } as any) as Promise<string>,
    publicClient.readContract({
      address,
      abi: ERC20_ABI,
      functionName: 'name',
    } as any) as Promise<string>,
    publicClient.readContract({
      address,
      abi: ERC20_ABI,
      functionName: 'decimals',
    } as any) as Promise<number>,
  ]);

  return {
    address,
    symbol: String(symbol),
    name: String(name),
    decimals: Number(decimals),
  };
}

// ---------------------------------------------
//   Основная функция: getKnownBalances
// ---------------------------------------------
//
// 1) Считает BNB как native.
// 2) Для CORE_TOKENS (GAD, USDT, WBNB и т.п.) — точные балансы.
// 3) Плюс кастомные токены из tokensStore (symbol -> address).
//    Пока берём decimals=18 как дефолт — дальше можно
//    расширить и хранить decimals в сторе.
//
// Возврат: Record<symbol, number> для WalletHome & UI.
//

export async function getKnownBalances(user: `0x${string}`) {
  const out: Record<string, number> = {};

  // 1) Native BNB
  out.BNB = await getNativeBalance(user);

  // 2) Базовые токены из CORE_TOKENS (кроме BNB, который уже посчитан)
  for (const t of CORE_TOKENS) {
    if (t.symbol === 'BNB' && isNative(t.address)) continue;
    try {
      const val = await getErc20Balance(t.address, user, t.decimals);
      out[t.symbol] = val;
    } catch (e) {
      console.warn('[discovery] balance error for', t.symbol, e);
    }
  }

  // 3) Кастомные токены пользователя из tokensStore
  //    tokens: Record<symbol, address>
  const customTokens = useTokensStore.getState().tokens;

  for (const [symbol, addrStr] of Object.entries(customTokens)) {
    // если символ уже есть в out (GAD, USDT, WBNB и т.п.) — не трогаем
    if (out[symbol] !== undefined) continue;
    if (!addrStr || isNative(addrStr)) continue;

    // простая очистка адреса
    const cleaned = addrStr.trim();
    if (!cleaned.startsWith('0x') || cleaned.length !== 42) continue;

    try {
      const val = await getErc20Balance(cleaned as Address, user, 18);
      out[symbol] = val;
    } catch (e) {
      console.warn('[discovery] custom token balance error', symbol, addrStr, e);
    }
  }

  return out;
}

// Опционально: экспортируем удобный список токенов для селекторов UI
export function getAllTokenMetasForUI(): TokenMeta[] {
  const base: TokenMeta[] = CORE_TOKENS.map((t) => ({
    address: t.address,
    symbol: t.symbol,
    name: t.name,
    decimals: t.decimals,
  }));

  const customTokens = useTokensStore.getState().tokens;
  for (const [symbol, addrStr] of Object.entries(customTokens)) {
    if (CORE_TOKENS_BY_SYMBOL[symbol]) continue;
    const cleaned = addrStr.trim();
    if (!cleaned.startsWith('0x') || cleaned.length !== 42) continue;

    base.push({
      address: cleaned as Address,
      symbol,
      name: symbol,
      decimals: 18,
    });
  }

  return base;
}
