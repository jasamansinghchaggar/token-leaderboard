import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit/sdk";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";

export interface WalletInfo {
  publicKey: string;
  name: string;
}

export interface WalletOption {
  id: string;
  name: string;
  isAvailable: boolean;
}

let kitInitialized = false;

function ensureKitInitialized() {
  if (kitInitialized || typeof window === "undefined") {
    return;
  }

  StellarWalletsKit.init({
    modules: defaultModules(),
    network: Networks.TESTNET,
  });
  kitInitialized = true;
}

function isWalletRejected(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes("rejected") || message.includes("declined");
}

export class WalletManager {
  async getAvailableWallets(): Promise<WalletOption[]> {
    ensureKitInitialized();

    const wallets = await StellarWalletsKit.refreshSupportedWallets();
    return wallets.map((wallet) => ({
      id: wallet.id,
      name: wallet.name,
      isAvailable: wallet.isAvailable,
    }));
  }

  async connectWallet(walletId: string): Promise<WalletInfo> {
    ensureKitInitialized();

    const wallets = await this.getAvailableWallets();
    const wallet = wallets.find((item) => item.id === walletId && item.isAvailable);

    if (!wallet) {
      throw new Error("WALLET_NOT_FOUND");
    }

    try {
      StellarWalletsKit.setWallet(walletId);
      const { address } = await StellarWalletsKit.fetchAddress();

      return {
        publicKey: address,
        name: wallet.name,
      };
    } catch (error) {
      if (isWalletRejected(error)) {
        throw new Error("WALLET_REJECTED");
      }

      throw error;
    }
  }

  async signTransaction(xdr: string, walletId: string): Promise<string> {
    ensureKitInitialized();

    StellarWalletsKit.setWallet(walletId);

    const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
      networkPassphrase:
        process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ?? Networks.TESTNET,
    });

    if (!signedTxXdr) {
      throw new Error("WALLET_SIGN_FAILED");
    }

    return signedTxXdr;
  }
}

export const walletManager = new WalletManager();
