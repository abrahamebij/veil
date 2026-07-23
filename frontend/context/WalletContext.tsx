"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isRestoring: boolean;
  error: string | null;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  isConnected: false,
  isConnecting: false,
  isRestoring: true,
  error: null,
  connectWallet: async () => null,
  disconnectWallet: () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restore stored account from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAccount = localStorage.getItem("veil_connected_account");
      if (storedAccount) {
        setAccount(storedAccount);
      }

      // Listen for window.ethereum account changes
      if ((window as any).ethereum) {
        (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            localStorage.setItem("veil_connected_account", accounts[0]);
          } else {
            setAccount(null);
            localStorage.clear();
            sessionStorage.clear();
          }
        });
      }
      setIsRestoring(false);
    } else {
      setIsRestoring(false);
    }
  }, []);

  const connectWallet = async (): Promise<string | null> => {
    setIsConnecting(true);
    setError(null);
    try {
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("No EVM wallet found. Please install MetaMask or Rabby.");
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts && accounts.length > 0) {
        const userAccount = accounts[0];
        setAccount(userAccount);
        localStorage.setItem("veil_connected_account", userAccount);
        setIsConnecting(false);
        return userAccount;
      }
      setIsConnecting(false);
      return null;
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      const msg = err?.message || "Failed to connect wallet.";
      setError(msg);
      setIsConnecting(false);
      throw err;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected: !!account,
        isConnecting,
        isRestoring,
        error,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
