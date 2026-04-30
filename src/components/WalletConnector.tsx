"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { walletManager, type WalletOption } from "@/lib/wallet";
import { parseError, displayError } from "@/lib/errorHandler";
import { useAppStore } from "@/stores/appStore";

export function WalletConnector() {
  const { wallet, setWallet, setIsConnected } = useAppStore();
  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const availableWallets = await walletManager.getAvailableWallets();
        setWallets(availableWallets.filter((wallet) => wallet.isAvailable));
      } catch (err) {
        setError(displayError(parseError(err)));
      }
    };

    void loadWallets();
  }, []);

  const hasWallets = useMemo(() => wallets.length > 0, [wallets]);

  const handleConnect = async () => {
    if (!selectedWallet) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const walletInfo = await walletManager.connectWallet(selectedWallet);
      setWallet(walletInfo);
      setIsConnected(true);
    } catch (err) {
      const appError = parseError(err);
      setError(displayError(appError));
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setWallet(null);
    setIsConnected(false);
  };

  if (wallet) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {wallet.name}:{" "}
          <span className="font-mono">
            {wallet.publicKey.slice(0, 10)}...{wallet.publicKey.slice(-8)}
          </span>
        </p>
        <Button variant="outline" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Select value={selectedWallet} onValueChange={(value) => setSelectedWallet(value ?? "")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={hasWallets ? "Select a wallet" : "No wallet detected"} />
        </SelectTrigger>
        <SelectContent>
          {wallets.map((walletOption) => (
            <SelectItem key={walletOption.id} value={walletOption.id}>
              {walletOption.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleConnect} disabled={!selectedWallet || loading || !hasWallets}>
        {loading ? "Connecting..." : "Connect Wallet"}
      </Button>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
