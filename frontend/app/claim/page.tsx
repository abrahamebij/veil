"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import {
  FiDownload,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiShield,
  FiArrowRight,
  FiClock,
  FiCpu,
} from "react-icons/fi";

export default function ClaimPaymentPage() {
  const [isRevealed, setIsRevealed] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedSuccess, setClaimedSuccess] = useState(false);

  const claimableBalance = 14250.48;

  const handleClaimAll = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setClaimedSuccess(true);
      setTimeout(() => setClaimedSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
          {/* Header */}
          <header className="border-b border-[#27272A] pb-6 space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-jetbrains">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <span>/</span>
              <span>Claim Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>Recipient Claim Portal</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-jetbrains bg-[#8B5CF6]/20 text-[#D0BCFF] border border-[#8B5CF6]/40">
                ZK Shielded
              </span>
            </h1>
            <p className="text-xs text-[#958EA0]">
              Instantly withdraw unlocked streaming payroll into your wallet with zero public transaction history links.
            </p>
          </header>

          {/* Success Banner */}
          {claimedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-jetbrains">
              <FiCheckCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Claim Transaction Confirmed!</p>
                <p className="text-emerald-400/80 text-[11px]">
                  14,250.48 USDC successfully withdrawn to destination wallet via zero-knowledge proof.
                </p>
              </div>
            </div>
          )}

          {/* Claim Summary Card */}
          <article className="p-8 rounded-2xl bg-gradient-to-br from-[#131316] via-[#1B1B1E] to-[#131316] border border-[#8B5CF6]/30 relative overflow-hidden shadow-2xl space-y-6">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <FiShield className="w-48 h-48 text-[#8B5CF6]" />
            </div>

            <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
              <div className="flex items-center gap-2">
                <FiLock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-jetbrains uppercase tracking-wider text-[#958EA0]">
                  Confidential Claimable Balance
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRevealed(!isRevealed)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1F1F22] hover:bg-[#2A2A2D] border border-[#27272A] text-xs font-jetbrains text-[#CBC3D7] transition-colors"
              >
                {isRevealed ? (
                  <>
                    <FiEyeOff className="w-3.5 h-3.5 text-[#958EA0]" />
                    <span>Hide Balance</span>
                  </>
                ) : (
                  <>
                    <FiEye className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Reveal Balance</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-jetbrains text-[#958EA0]">Total Unlocked Yield</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-bold font-jetbrains text-white tracking-tight">
                  {isRevealed ? `$${claimableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••••••"}
                </span>
                <span className="text-lg font-jetbrains text-[#D0BCFF]">USDC</span>
              </div>
              <p className="text-xs text-emerald-400 font-jetbrains flex items-center gap-1">
                <FiClock className="w-3.5 h-3.5" />
                Streaming Live (+0.00482 USDC/sec)
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={handleClaimAll}
                disabled={isClaiming}
                className="w-full sm:flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#8B5CF6]/30 disabled:opacity-50"
              >
                {isClaiming ? (
                  <>
                    <FiCpu className="w-4 h-4 animate-spin" />
                    <span>Generating Withdrawal ZK Proof...</span>
                  </>
                ) : (
                  <>
                    <FiDownload className="w-4 h-4" />
                    <span>Claim Entire Unlocked Yield</span>
                  </>
                )}
              </button>
            </div>
          </article>

          {/* Active Streams Breakdown */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Active Incoming Streams</h2>

            <div className="space-y-3">
              {[
                {
                  id: "stream-01",
                  title: "VP of Engineering Salary Stream",
                  org: "Nox Confidential Payroll Org",
                  rate: "0.00482 USDC/s",
                  unlocked: "14,250.48 USDC",
                },
                {
                  id: "stream-02",
                  title: "Q3 Performance Bonus Allocation",
                  org: "Nox Treasury Vault",
                  rate: "0.00110 USDC/s",
                  unlocked: "3,120.00 USDC",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-[#131316] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FiLock className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-xs text-[#958EA0] font-jetbrains">{item.org}</p>
                    <p className="text-[11px] text-[#D0BCFF] font-jetbrains">Rate: {item.rate}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-[#958EA0] font-jetbrains">Unlocked</p>
                      <p className="text-base font-bold font-jetbrains text-white">{item.unlocked}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClaimAll}
                      className="px-3.5 py-2 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2D] text-white border border-[#27272A] text-xs font-medium transition-colors"
                    >
                      Claim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
