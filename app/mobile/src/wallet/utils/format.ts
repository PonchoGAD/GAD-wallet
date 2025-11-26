// app/mobile/src/wallet/utils/format.ts

/** Простейший перевод human → wei через float (достаточно для UI) */
export function toWei(amount: string, decimals = 18): bigint {
  const v = parseFloat((amount || '0').replace(',', '.'));
  if (!isFinite(v) || v <= 0) return 0n;
  const factor = 10 ** decimals;
  return BigInt(Math.floor(v * factor));
}

/** Форматирование bigint в human с фиксированным количеством знаков */
export function formatUnitsSimple(
  value: bigint,
  decimals = 18,
  dp = 4,
): string {
  if (value === 0n) return '0'.padEnd(dp > 0 ? 2 + dp : 1, dp > 0 ? '0' : '');
  const num = Number(value) / 10 ** decimals;
  return num.toFixed(dp);
}
