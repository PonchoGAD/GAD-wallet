export const isHexAddress = (v?: string | null): boolean =>
  !!v && /^0x[a-fA-F0-9]{40}$/.test(v);

export const isPositiveNumber = (v?: string | number): boolean => {
  const n = typeof v === 'string' ? Number(v) : v ?? 0;
  return Number.isFinite(n) && n > 0;
};
