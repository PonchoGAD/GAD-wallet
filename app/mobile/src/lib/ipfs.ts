// src/lib/ipfs.ts
import { IPFS_GATEWAY } from "../config/env";

export function toGatewayUrl(uri: string) {
  // ipfs://Qm... -> https://gateway/.../Qm...
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    const cid = uri.replace("ipfs://", "");
    return `${IPFS_GATEWAY}${cid}`;
  }
  return uri;
}
