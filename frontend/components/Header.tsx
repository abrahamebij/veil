"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { FiSearch, FiBell, FiLock, FiPlus, FiCheckCircle, FiKey } from "react-icons/fi";

export function Header() {
  const { account, isConnected, connectWallet } = useWallet();

  return (
    <header className="h-16 border-b border-[#27272A] bg-[#131316]/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Search Bar */}
      <form className="relative flex-1 max-w-md" onSubmit={(e) => e.preventDefault()}>
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#958EA0]" />
        <input
          type="text"
          placeholder="Search confidential streams, addresses, or transactions..."
          className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-md pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#958EA0] focus:outline-none focus:border-[#8B5CF6] font-jetbrains transition-colors"
        />
      </form>

      {/* Action Buttons & Status */}
      <div className="flex items-center gap-3">
        {/* Network status badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1F22] border border-[#27272A] text-xs text-[#CBC3D7]">
          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-jetbrains">ETH Sepolia Testnet</span>
        </div>

        {/* Wallet Connect Button */}
        {isConnected && account ? (
          <div className="flex items-center gap-2 bg-[#1B1B1E] border border-[#8B5CF6]/40 px-3 py-1.5 rounded-md text-xs font-mono text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
        ) : (
          <button
            onClick={() => connectWallet().catch(console.error)}
            className="flex items-center gap-2 bg-[#8B5CF6]/20 border border-[#8B5CF6] hover:bg-[#8B5CF6] text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm"
          >
            <FiKey className="w-3.5 h-3.5" />
            <span>Connect Wallet</span>
          </button>
        )}

        {/* Quick Action Button */}
        <Link
          href="/dashboard/streams/create"
          className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          <span>New Stream</span>
        </Link>

        {/* Notification Icon */}
        <button
          type="button"
          aria-label="Notifications"
          className="p-2 text-[#958EA0] hover:text-white hover:bg-[#1F1F22] rounded-md transition-colors relative"
        >
          <FiBell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
        </button>

        {/* Security Shield Indicator */}
        <div
          title="Encrypted Environment"
          className="p-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md"
        >
          <FiLock className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
