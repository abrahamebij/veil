"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import {
  FiShield,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
  FiKey,
  FiCpu,
  FiAlertCircle,
} from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const { connectWallet, isConnecting, error, account } = useWallet();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const connectedAcc = await connectWallet();
      if (connectedAcc) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err?.message || "Failed to connect EVM wallet.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <main className="w-full max-w-md bg-[#131316] border border-[#27272A] rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] mx-auto mb-4">
            <FiShield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Kinetic Auth Portal
          </h1>
          <p className="text-xs text-[#958EA0]">
            Authenticate via your Injected EVM Wallet (MetaMask / Rabby / Coinbase)
          </p>
        </header>

        {/* Error Notification */}
        {(loginError || error) && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 font-jetbrains">
            <FiAlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loginError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleConnect} className="space-y-6">
          {/* Provider Card */}
          <div className="p-5 rounded-xl bg-[#1B1B1E] border border-[#8B5CF6]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center border border-[#8B5CF6]/30">
                <FiKey className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Browser EVM Wallet</p>
                <p className="text-xs text-emerald-400 font-jetbrains">ETH Sepolia Network</p>
              </div>
            </div>
            {account ? (
              <FiCheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-jetbrains bg-[#8B5CF6]/20 text-[#D0BCFF] border border-[#8B5CF6]/40">
                Detected
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#8B5CF6]/25 disabled:opacity-50 cursor-pointer"
          >
            {isConnecting ? (
              <>
                <FiCpu className="w-4 h-4 animate-spin text-white" />
                <span>Connecting Wallet...</span>
              </>
            ) : account ? (
              <>
                <span>Enter Confidential Dashboard</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Connect EVM Wallet</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Note */}
        <footer className="pt-4 border-t border-[#27272A] text-center">
          <p className="text-[11px] text-[#958EA0] flex items-center justify-center gap-1.5">
            <FiLock className="w-3 h-3 text-emerald-400" />
            Zero private keys stored. Direct EVM provider signature.
          </p>
          <div className="mt-3">
            <Link href="/" className="text-xs text-[#8B5CF6] hover:underline font-jetbrains">
              ← Return to Main Page
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
