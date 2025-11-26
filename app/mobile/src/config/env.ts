// app/mobile/src/config/env.ts
// Единая точка чтения env-конфигов для mobile (NFT, RPC и т.п.)

// URL AI Mint (web-страница с генерацией NFT)
export const MINT_URL =
  process.env.EXPO_PUBLIC_MINT_URL ||
  process.env.MINT_URL ||
  'https://gad-family.com/nft/ai-mint';

// IPFS-шлюз (используется в lib/ipfs.ts для конвертации ipfs:// → https://...)
export const IPFS_GATEWAY =
  process.env.EXPO_PUBLIC_IPFS_GATEWAY ||
  process.env.IPFS_GATEWAY ||
  'https://gateway.pinata.cloud/ipfs/';

// RPC для сети по умолчанию (сейчас BSC mainnet)
export const RPC_URL =
  process.env.EXPO_PUBLIC_RPC_URL ||
  process.env.RPC_URL ||
  'https://bsc-dataseed1.binance.org';

// NFT721 контракт (тот, что ты указал в списке)
export const NFT_CONTRACT =
  process.env.EXPO_PUBLIC_NFT_CONTRACT ||
  process.env.NFT_CONTRACT ||
  '0xa1a72398bCded7D40f26c2679dC35E5A73dA3948';
