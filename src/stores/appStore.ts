import { create } from "zustand";
import type { WalletInfo } from "@/lib/wallet";
import type { LeaderboardEntry } from "@/lib/horizon";

export interface TransactionStatus {
  hash: string;
  status: "pending" | "success" | "failed";
  error?: string;
}

interface AppState {
  wallet: WalletInfo | null;
  isConnected: boolean;
  transactionStatus: TransactionStatus | null;
  leaderboardData: LeaderboardEntry[];
  setWallet: (wallet: WalletInfo | null) => void;
  setIsConnected: (connected: boolean) => void;
  setTransactionStatus: (status: TransactionStatus | null) => void;
  setLeaderboardData: (data: LeaderboardEntry[]) => void;
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
