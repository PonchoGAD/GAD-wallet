// app/mobile/src/wallet/utils/checks.ts

/** Примитивная проверка EVM-адреса в 0x + 40 hex */
export const isHexAddress = (v?: string | null): boolean =>
  !!v && /^0x[a-fA-F0-9]{40}$/.test(v);

/** Положительное число (строка или число) */
export const isPositiveNumber = (v?: string | number): boolean => {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : v ?? 0;
  return Number.isFinite(n) && n > 0;
};

/** Непустая строка (после trim) */
export const isNonEmptyString = (v?: string | null): boolean =>
  typeof v === 'string' && v.trim().length > 0;
