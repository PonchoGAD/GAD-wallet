export function toWei(amount: string, decimals = 18): bigint {
  const v = parseFloat(amount || '0');
  if (!isFinite(v) || v <= 0) return 0n;
  const factor = 10 ** decimals;
  return BigInt(Math.floor(v * factor));
}

export function formatUnitsSimple(value: bigint, decimals = 18, dp = 4): string {
  const num = Number(value) / 10 ** decimals;
  return num.toFixed(dp);
}
