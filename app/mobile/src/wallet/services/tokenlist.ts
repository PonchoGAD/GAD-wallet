// tokenlist.ts

import type { Address } from 'viem';
import { TOKENS, NATIVE_SENTINEL, WBNB } from './constants';


/** Basic token model for UI/services */
export type TokenInfo = {
  address: Address | typeof NATIVE_SENTINEL;
  symbol: string;
  decimals: number;
  name?: string;
  logoURI?: string;
  listed?: boolean;
};

/** Address validator (allows native sentinel) */
export function isAddressLike(v?: string | null): v is Address | typeof NATIVE_SENTINEL {
  if (!v) return false;
  const s = v.toLowerCase();
  if (s === NATIVE_SENTINEL.toLowerCase()) return true;
  return /^0x[a-f0-9]{40}$/.test(s);
}

export const normalizeAddress = (v: string) => v.trim().toLowerCase();

export function uniqueByAddress<T extends { address: string }>(list: T[]): T[] {
  const seen = new Set<string>();
  const res: T[] = [];
  for (const t of list) {
    const key = normalizeAddress(t.address);
    if (seen.has(key)) continue;
    seen.add(key);
    res.push(t);
  }
  return res;
}

/** Default pinned tokens (GAD first) */
export const DEFAULT_TOKENS: TokenInfo[] = [
  {
    address: TOKENS.GAD.address as Address,
    symbol: TOKENS.GAD.symbol,
    decimals: TOKENS.GAD.decimals,
    name: 'GAD Token',
    listed: true,
  },
  {
    address: TOKENS.BNB.address as Address,
    symbol: TOKENS.BNB.symbol,
    decimals: TOKENS.BNB.decimals,
    name: 'BNB (Native)',
    listed: true,
  },
  {
    address: TOKENS.USDT.address as Address,
    symbol: TOKENS.USDT.symbol,
    decimals: TOKENS.USDT.decimals,
    name: 'Tether USD (BSC)',
    listed: true,
  },
  {
    address: TOKENS.WBNB.address as Address,
    symbol: TOKENS.WBNB.symbol,
    decimals: TOKENS.WBNB.decimals,
    name: 'Wrapped BNB',
    listed: true,
  },
];

/** Priority map for sorting (GAD first) */
const PIN_ORDER: Record<string, number> = {
  [normalizeAddress(TOKENS.GAD.address)]: 0,
  [normalizeAddress(TOKENS.BNB.address)]: 1,
  [normalizeAddress(WBNB)]: 2,
  [normalizeAddress(TOKENS.USDT.address)]: 3,
};

export function sortTokens(a: TokenInfo, b: TokenInfo): number {
  const ka = PIN_ORDER[normalizeAddress(a.address as string)];
  const kb = PIN_ORDER[normalizeAddress(b.address as string)];
  if (ka !== undefined && kb !== undefined) return ka - kb;
  if (ka !== undefined) return -1;
  if (kb !== undefined) return 1;
  return a.symbol.localeCompare(b.symbol);
}

export function sanitizeTokens(list: TokenInfo[]): TokenInfo[] {
  const valid = list.filter(
    (t) => isAddressLike(t.address) && t.decimals >= 0 && t.decimals <= 36,
  );
  return uniqueByAddress(valid).sort(sortTokens);
}

export const findByAddress = (list: TokenInfo[], address: string) => {
  const key = normalizeAddress(address);
  return list.find((t) => normalizeAddress(t.address as string) === key);
};

export const findBySymbol = (list: TokenInfo[], symbol: string) => {
  const s = symbol.trim().toLowerCase();
  return list.find((t) => t.symbol.toLowerCase() === s);
};

export function upsertToken(list: TokenInfo[], token: TokenInfo): TokenInfo[] {
  if (!isAddressLike(token.address)) return list;
  const key = normalizeAddress(token.address as string);
  const idx = list.findIndex((t) => normalizeAddress(t.address as string) === key);
  const next = [...list];
  if (idx >= 0) next[idx] = { ...next[idx], ...token };
  else next.push(token);
  return sanitizeTokens(next);
}

export const mergeCustomTokens = (custom: TokenInfo[] = []) =>
  sanitizeTokens([...DEFAULT_TOKENS, ...custom]);

export const getDefaultTokenList = () => sanitizeTokens(DEFAULT_TOKENS);

export function toTokenInfo(params: {
  address: string;
  symbol: string;
  decimals: number;
  name?: string;
  logoURI?: string;
  listed?: boolean;
}): TokenInfo | null {
  if (!isAddressLike(params.address)) return null;
  return {
    address: params.address as Address,
    symbol: params.symbol,
    decimals: params.decimals,
    name: params.name,
    logoURI: params.logoURI,
    listed: params.listed,
  };
}
