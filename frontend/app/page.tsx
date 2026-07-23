"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import {
  FiShield,
  FiLock,
  FiZap,
  FiArrowRight,
  FiEyeOff,
  FiKey,
} from "react-icons/fi";
import { StreamProgressChart } from "@/components/StreamProgressChart";

export default function LandingPage() {
  const { account, isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex flex-col justify-between selection:bg-[#8B5CF6]/30">
      {/* Top Navbar */}
      <header className="h-20 border-b border-[#27272A] bg-[#131316]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/10">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-xl block leading-none">
                VEIL
              </span>
              <span className="text-[10px] font-jetbrains uppercase tracking-widest text-[#958EA0]">
                CONFIDENTIAL PAYROLL
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#CBC3D7]">
            <a href="#features" className="hover:text-white transition-colors">
              Security Protocol
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              ZK Architecture
            </a>
            <a href="#demo" className="hover:text-white transition-colors">
              Stream Simulator
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {isConnected && account ? (
              <div className="flex items-center gap-2 bg-[#1B1B1E] border border-[#8B5CF6]/40 px-3.5 py-1.5 rounded-lg text-xs font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-[#CBC3D7] hover:text-white transition-colors"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md shadow-[#8B5CF6]/20 hover:shadow-[#8B5CF6]/40"
            >
              <span>Launch App</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#8B5CF6]/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="text-center max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F1F22] border border-[#27272A] text-xs font-jetbrains text-[#D0BCFF]">
              <FiLock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Knowledge Confidential Onchain Streaming</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Institutional Payroll. <br />
              <span className="bg-gradient-to-r from-[#D0BCFF] via-[#8B5CF6] to-emerald-400 bg-clip-text text-transparent">
                Completely Encrypted.
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#CBC3D7] leading-relaxed">
              Stream salaries, contractor compensation, and executive bonuses per second onchain with absolute privacy. Amounts, recipient balances, and flow rates remain 100% confidential.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/streams/create"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3.5 rounded-lg text-base font-semibold transition-all shadow-lg shadow-[#8B5CF6]/25"
              >
                <span>Create Confidential Stream</span>
                <FiZap className="w-5 h-5" />
              </Link>
              <Link
                href="/claim"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1F1F22] hover:bg-[#2A2A2D] text-white border border-[#27272A] px-6 py-3.5 rounded-lg text-base font-medium transition-colors"
              >
                <span>Claim Payment Portal</span>
                <FiLock className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </div>

          {/* Live Simulator Preview */}
          <div id="demo" className="mt-16 max-w-2xl mx-auto">
            <StreamProgressChart />
          </div>
        </section>

        {/* Feature Bento Grid Section */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#27272A]">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Built for High-Stakes Onchain Operations
            </h2>
            <p className="text-sm text-[#958EA0]">
              Protect executive compensation, employee privacy, and corporate liquidity from public block explorer inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <article className="p-6 rounded-xl bg-[#131316] border border-[#27272A] space-y-4 hover:border-[#8B5CF6]/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                <FiEyeOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Encrypted Flow Rates
              </h3>
              <p className="text-sm text-[#958EA0] leading-relaxed">
                Stream amounts and token balances are encrypted using ElGamal homomorphic encryption and zero-knowledge validity proofs.
              </p>
            </article>

            {/* Bento Card 2 */}
            <article className="p-6 rounded-xl bg-[#131316] border border-[#27272A] space-y-4 hover:border-[#8B5CF6]/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FiZap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Per-Second Unlocking
              </h3>
              <p className="text-sm text-[#958EA0] leading-relaxed">
                Employees can withdraw earned funds continuous every second without waiting for bi-weekly payroll processing cycles.
              </p>
            </article>

            {/* Bento Card 3 */}
            <article className="p-6 rounded-xl bg-[#131316] border border-[#27272A] space-y-4 hover:border-[#8B5CF6]/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FiKey className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Institutional Auditing
              </h3>
              <p className="text-sm text-[#958EA0] leading-relaxed">
                Generate zero-knowledge tax & regulatory compliance proofs without revealing individual recipient salaries to the public.
              </p>
            </article>
          </div>
        </section>

        {/* Call to Action Bar */}
        <section className="py-16 px-6 max-w-5xl mx-auto my-12 bg-gradient-to-r from-[#131316] via-[#1F1F22] to-[#131316] rounded-2xl border border-[#27272A] text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to Transition to Confidential Streaming Payroll?
          </h2>
          <p className="text-sm text-[#958EA0] max-w-xl mx-auto">
            Connect your organizational wallet to manage employee streams, claim rewards, and configure privacy security levels.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#8B5CF6]/20"
            >
              <span>Enter Veil Workspace</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272A] py-8 bg-[#0A0A0C]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#958EA0]">
          <div className="flex items-center gap-2">
            <FiShield className="w-4 h-4 text-[#8B5CF6]" />
            <span className="font-semibold text-white">VEIL Protocol</span>
            <span>© 2026 Veil Confidential Payroll</span>
          </div>

          <div className="flex items-center gap-6 font-jetbrains">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/claim" className="hover:text-white transition-colors">
              Claim Portal
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Auth System
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
