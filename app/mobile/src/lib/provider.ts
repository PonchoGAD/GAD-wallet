// src/lib/provider.ts
import { ethers } from "ethers";
import { RPC_URL } from "../config/env";

export const provider = new ethers.JsonRpcProvider(RPC_URL);
