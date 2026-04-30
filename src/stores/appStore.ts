import { create } from "zustand";
import type { WalletInfo } from "@/lib/wallet";

interface LeaderboardViewEntry {
  address: string;
  balance: number;
  rank: number;
}

export interface TransactionStatus {
  hash: string;
  status: "pending" | "success" | "failed";
  error?: string;
}

interface AppState {
  wallet: WalletInfo | null;
  isConnected: boolean;
  transactionStatus: TransactionStatus | null;
  leaderboardData: LeaderboardViewEntry[];
  setWallet: (wallet: WalletInfo | null) => void;
  setIsConnected: (connected: boolean) => void;
  setTransactionStatus: (status: TransactionStatus | null) => void;
  setLeaderboardData: (data: LeaderboardViewEntry[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  wallet: null,
  isConnected: false,
  transactionStatus: null,
  leaderboardData: [],
  setWallet: (wallet) => set({ wallet }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setTransactionStatus: (status) => set({ transactionStatus: status }),
  setLeaderboardData: (data) => set({ leaderboardData: data }),
}));
