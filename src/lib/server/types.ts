export interface UserPayload {
  publicKey: string;
  walletName: string;
}

export interface LeaderboardEntry {
  publicKey: string;
  balance: number;
  rank: number;
  lastFetched?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface HorizonBalance {
  balance: string;
  asset_type: string;
}

export interface HorizonAccount {
  balances: HorizonBalance[];
}
