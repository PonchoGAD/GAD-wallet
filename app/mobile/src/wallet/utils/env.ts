// app/mobile/src/wallet/utils/env.ts

/** Безопасное чтение env-переменных с фолбэком */
export function getEnv(key: string, fallback = ''): string {
  const value = process.env[key];
  if (!value || value === 'undefined' || value === 'null') return fallback;
  return value;
}
