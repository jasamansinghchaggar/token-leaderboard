import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
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
  hasHydrated: boolean;
  transactionStatus: TransactionStatus | null;
  leaderboardData: LeaderboardViewEntry[];
  setConnection: (wallet: WalletInfo | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
  setTransactionStatus: (status: TransactionStatus | null) => void;
  setLeaderboardData: (data: LeaderboardViewEntry[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      wallet: null,
      isConnected: false,
      hasHydrated: false,
      transactionStatus: null,
      leaderboardData: [],
      setConnection: (wallet) =>
        set({
          wallet,
          isConnected: wallet !== null,
        }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      setTransactionStatus: (status) => set({ transactionStatus: status }),
      setLeaderboardData: (data) => set({ leaderboardData: data }),
    }),
    {
      name: "wallet-connection-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        wallet: state.wallet,
        isConnected: state.isConnected,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
