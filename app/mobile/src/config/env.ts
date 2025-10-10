// src/config/env.ts
export const MINT_URL = process.env.EXPO_PUBLIC_MINT_URL
  || process.env.MINT_URL
  || "https://gad-family.com/nft/ai-mint"; // <- поменяй на твой сайт
export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/"; // можно заменить
export const RPC_URL = process.env.EXPO_PUBLIC_RPC_URL
  || process.env.RPC_URL
  || "https://bsc-dataseed1.binance.org";
export const NFT_CONTRACT = process.env.EXPO_PUBLIC_NFT_CONTRACT
  || process.env.NFT_CONTRACT
  || "0xa1a72398bCded7D40f26c2679dC35E5A73dA3948"; // твой контракт NFT721
