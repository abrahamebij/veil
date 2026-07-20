"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiShield,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
  FiKey,
  FiGlobe,
  FiCpu,
} from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [selectedWallet, setSelectedWallet] = useState<string>("phantom");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
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
            Authenticate via Zero-Knowledge Wallet Proof
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-jetbrains text-[#958EA0] uppercase tracking-wider">
              Select Institutional Wallet
            </label>
            <div className="space-y-2">
              {[
                { id: "phantom", name: "Phantom Wallet", desc: "Solana ZK-Proof Supported" },
                { id: "solflare", name: "Solflare Institutional", desc: "Multi-Sig Security" },
                { id: "backpack", name: "Backpack Encrypted", desc: "Hardware Key Enclave" },
              ].map((wallet) => (
                <button
                  key={wallet.id}
                  type="button"
                  onClick={() => setSelectedWallet(wallet.id)}
                  className={`w-full p-3.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    selectedWallet === wallet.id
                      ? "bg-[#1F1F22] border-[#8B5CF6] text-white"
                      : "bg-[#1B1B1E] border-[#27272A] text-[#CBC3D7] hover:border-[#494454]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                      <FiKey className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{wallet.name}</p>
                      <p className="text-[11px] text-[#958EA0]">{wallet.desc}</p>
                    </div>
                  </div>
                  {selectedWallet === wallet.id && (
                    <FiCheckCircle className="w-4 h-4 text-[#8B5CF6]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label htmlFor="organization-key" className="block text-xs font-jetbrains text-[#958EA0] uppercase tracking-wider">
              Organization Passkey (Optional)
            </label>
            <div className="relative">
              <input
                id="organization-key"
                type="password"
                placeholder="vk_live_84920491823901"
                className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#958EA0] focus:outline-none focus:border-[#8B5CF6] font-jetbrains"
              />
              <FiLock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#958EA0]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className="w-full mt-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/20 disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <FiCpu className="w-4 h-4 animate-spin text-white" />
                <span>Verifying ZK Proof...</span>
              </>
            ) : (
              <>
                <span>Connect & Authorize Session</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Note */}
        <footer className="pt-4 border-t border-[#27272A] text-center">
          <p className="text-[11px] text-[#958EA0] flex items-center justify-center gap-1.5">
            <FiLock className="w-3 h-3 text-emerald-400" />
            Zero private keys are stored. Homomorphic session token.
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
