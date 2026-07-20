"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StreamProgressChart } from "@/components/StreamProgressChart";
import {
  FiEye,
  FiLock,
  FiShield,
  FiPause,
  FiPlay,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiCopy,
  FiClock,
  FiCode,
} from "react-icons/fi";

export default function StreamDetailsPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
          {/* Breadcrumbs & Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-jetbrains">
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-[#958EA0]">Streams</span>
                <span>/</span>
                <span>stream-01</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <span>Executive Payroll Stream</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-jetbrains bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {isPaused ? "Paused" : "Streaming Live"}
                </span>
              </h1>
              <p className="text-xs text-[#958EA0] font-jetbrains">
                Stream ID: 0x84920491823901a • Recipient: 0x94...21a8
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors border ${
                  isPaused
                    ? "bg-emerald-600 text-white hover:bg-emerald-500 border-emerald-500"
                    : "bg-[#1F1F22] text-white hover:bg-[#2A2A2D] border-[#27272A]"
                }`}
              >
                {isPaused ? (
                  <>
                    <FiPlay className="w-3.5 h-3.5" />
                    <span>Resume Stream</span>
                  </>
                ) : (
                  <>
                    <FiPause className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pause Stream</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-sm"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Top Up Vault</span>
              </button>

              <button
                type="button"
                className="p-2 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                title="Cancel Stream"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Live Progress Visualizer Component */}
          <section>
            <StreamProgressChart
              initialAmount={14250.48}
              totalAmount={25000.0}
              ratePerSec={0.00482}
              tokenSymbol="USDC"
              streamName="VP of Engineering - Executive Payroll"
            />
          </section>

          {/* Details & Encrypted State Inspector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 & 2: Specifications */}
            <section className="md:col-span-2 p-6 rounded-xl bg-[#131316] border border-[#27272A] space-y-6">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <FiShield className="w-4 h-4 text-[#8B5CF6]" />
                <span>Stream Protocol Parameters</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-jetbrains">
                <div className="p-3.5 rounded-lg bg-[#1B1B1E] border border-[#27272A] space-y-1">
                  <p className="text-[#958EA0]">Streaming Rate</p>
                  <p className="text-sm font-bold text-white">0.00482 USDC/sec</p>
                  <p className="text-[10px] text-[#958EA0]">$416.44 USDC / 24 Hours</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#1B1B1E] border border-[#27272A] space-y-1">
                  <p className="text-[#958EA0]">Total Streamed / Cap</p>
                  <p className="text-sm font-bold text-white">14,250.48 / 25,000 USDC</p>
                  <p className="text-[10px] text-emerald-400">57% Completed</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#1B1B1E] border border-[#27272A] space-y-1">
                  <p className="text-[#958EA0]">Start Timestamp</p>
                  <p className="text-sm font-bold text-white">2026-07-01 00:00 UTC</p>
                  <p className="text-[10px] text-[#958EA0]">Continuous Unlocking</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#1B1B1E] border border-[#27272A] space-y-1">
                  <p className="text-[#958EA0]">Estimated End Date</p>
                  <p className="text-sm font-bold text-white">2026-08-30 00:00 UTC</p>
                  <p className="text-[10px] text-[#958EA0]">40 Days Remaining</p>
                </div>
              </div>

              {/* Stream Audit History */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-jetbrains uppercase tracking-wider text-[#958EA0]">
                  Recent Stream Events
                </h3>
                <div className="space-y-2">
                  {[
                    { title: "Continuous Yield Unlocked", time: "Just now", desc: "+0.00482 USDC synced to ZK state" },
                    { title: "Recipient Partial Withdrawal", time: "2 hours ago", desc: "Claimed 1,200.00 USDC via Shielded Note" },
                    { title: "Stream Top Up", time: "3 days ago", desc: "Added +10,000 USDC to vault balance" },
                  ].map((event, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#1B1B1E] border border-[#27272A] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-white font-medium">{event.title}</p>
                          <p className="text-[#958EA0] text-[11px] font-jetbrains">{event.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-jetbrains text-[#958EA0]">{event.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Column 3: ZK Inspector */}
            <section className="p-6 rounded-xl bg-[#131316] border border-[#27272A] space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <FiCode className="w-4 h-4 text-emerald-400" />
                  <span>ZK Payload Inspector</span>
                </h2>

                <div className="p-3.5 rounded-lg bg-[#1B1B1E] border border-[#27272A] space-y-2 text-xs font-jetbrains">
                  <div className="flex justify-between items-center">
                    <span className="text-[#958EA0]">Commitment Hash:</span>
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      className="text-[#8B5CF6] hover:underline text-[10px]"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-white font-mono break-all text-[11px]">
                    0x7f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#1B1B1E] border border-[#27272A] space-y-1 text-xs">
                  <p className="text-[#958EA0] font-jetbrains">Verification Proof Standard</p>
                  <p className="text-white font-semibold">Groth16 / PLONK Zero-Knowledge</p>
                  <p className="text-[11px] text-emerald-400 font-jetbrains">Valid Proof Verified by Solana Onchain Program</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#27272A] text-center">
                <Link
                  href="/claim"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#1F1F22] hover:bg-[#2A2A2D] text-white border border-[#27272A] py-2.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <FiLock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Recipient Claim Portal</span>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
