"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import {
  FiSend,
  FiLock,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiHelpCircle,
  FiCpu,
} from "react-icons/fi";

export default function CreateSecureStreamPage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("0x8492a401b8923091f89312903120194a");
  const [token, setToken] = useState("USDC");
  const [totalAmount, setTotalAmount] = useState(10000);
  const [durationDays, setDurationDays] = useState(30);
  const [privacyMode, setPrivacyMode] = useState("homomorphic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Flow rate calculation: total / (days * 86400)
  const totalSeconds = durationDays * 86400;
  const flowRatePerSec = (totalAmount / totalSeconds).toFixed(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmStream = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/dashboard/streams/1");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
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
              <span>Create Stream</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Create Confidential Stream
            </h1>
            <p className="text-xs text-[#958EA0]">
              Configure zero-knowledge streaming payroll parameters and recipient privacy layer.
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Card */}
            <fieldset className="p-6 rounded-xl bg-[#131316] border border-[#27272A] space-y-4">
              <legend className="px-2 text-sm font-semibold text-white flex items-center gap-2">
                <FiLock className="w-4 h-4 text-emerald-400" />
                <span>1. Recipient Specification</span>
              </legend>

              <div className="space-y-2">
                <label htmlFor="recipient-address" className="block text-xs font-jetbrains text-[#958EA0] uppercase tracking-wider">
                  Recipient Wallet or Encrypted Public Key
                </label>
                <div className="relative">
                  <input
                    id="recipient-address"
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x... or zk:solana:..."
                    className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-lg px-4 py-2.5 text-xs text-white placeholder-[#958EA0] focus:outline-none focus:border-[#8B5CF6] font-jetbrains"
                  />
                  <FiShield className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5CF6]" />
                </div>
                <p className="text-[11px] text-[#958EA0]">
                  Recipient wallet balance will be protected via Homomorphic Encryption.
                </p>
              </div>
            </fieldset>

            {/* Token & Flow Parameters Card */}
            <fieldset className="p-6 rounded-xl bg-[#131316] border border-[#27272A] space-y-6">
              <legend className="px-2 text-sm font-semibold text-white flex items-center gap-2">
                <FiSend className="w-4 h-4 text-[#8B5CF6]" />
                <span>2. Streaming Parameters</span>
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Asset Select */}
                <div className="space-y-2">
                  <label htmlFor="select-asset" className="block text-xs font-jetbrains text-[#958EA0] uppercase tracking-wider">
                    Select Token Asset
                  </label>
                  <select
                    id="select-asset"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6] font-jetbrains"
                  >
                    <option value="USDC">USDC (Circle USD)</option>
                    <option value="USDT">USDT (Tether USD)</option>
                    <option value="SOL">SOL (Solana Native)</option>
                    <option value="zkUSDC">zkUSDC (Shielded Token)</option>
                  </select>
                </div>

                {/* Total Cap */}
                <div className="space-y-2">
                  <label htmlFor="total-deposit-amount" className="block text-xs font-jetbrains text-[#958EA0] uppercase tracking-wider">
                    Total Deposit Cap ({token})
                  </label>
                  <input
                    id="total-deposit-amount"
                    type="number"
                    min="1"
                    step="any"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6] font-jetbrains"
                  />
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs font-jetbrains">
                  <label htmlFor="stream-duration-slider" className="text-[#958EA0] uppercase tracking-wider">Stream Duration</label>
                  <span className="text-white font-medium">{durationDays} Days ({totalSeconds.toLocaleString()} Seconds)</span>
                </div>
                <input
                  id="stream-duration-slider"
                  type="range"
                  min="1"
                  max="365"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full accent-[#8B5CF6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-jetbrains text-[#958EA0]">
                  <span>1 Day</span>
                  <span>30 Days</span>
                  <span>90 Days</span>
                  <span>1 Year</span>
                </div>
              </div>

              {/* Calculated Flow Rate Display */}
              <div className="p-4 rounded-lg bg-[#1B1B1E] border border-[#27272A] flex items-center justify-between">
                <div>
                  <p className="text-xs font-jetbrains text-[#958EA0]">Calculated Flow Rate</p>
                  <p className="text-lg font-bold font-jetbrains text-white mt-0.5">
                    {flowRatePerSec} <span className="text-xs text-[#8B5CF6]">{token}/sec</span>
                  </p>
                </div>
                <div className="text-right text-xs font-jetbrains text-[#CBC3D7]">
                  <p>Daily Rate: {((totalAmount / durationDays)).toFixed(2)} {token}/day</p>
                </div>
              </div>
            </fieldset>

            {/* Privacy Level Options */}
            <fieldset className="p-6 rounded-xl bg-[#131316] border border-[#27272A] space-y-4">
              <legend className="px-2 text-sm font-semibold text-white flex items-center gap-2">
                <FiShield className="w-4 h-4 text-[#D0BCFF]" />
                <span>3. Confidentiality Protocol</span>
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: "homomorphic",
                    title: "Homomorphic ZK Proofs",
                    badge: "Recommended",
                    desc: "Hides flow rates and total amounts. Recipient balance verified onchain via Zero-Knowledge state transitions.",
                  },
                  {
                    id: "anonymous",
                    title: "Fully Shielded Note",
                    badge: "Max Privacy",
                    desc: "Generates one-time ephemeral zk-addresses. Completely un-linkable to organization public master address.",
                  },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPrivacyMode(mode.id)}
                    className={`p-4 rounded-lg border text-left space-y-2 transition-all ${
                      privacyMode === mode.id
                        ? "bg-[#1F1F22] border-[#8B5CF6] text-white"
                        : "bg-[#1B1B1E] border-[#27272A] text-[#CBC3D7] hover:border-[#494454]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{mode.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-jetbrains bg-[#8B5CF6]/20 text-[#D0BCFF]">
                        {mode.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#958EA0] leading-relaxed">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/25"
              >
                <span>Review & Initialize Stream</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl max-w-md w-full p-6 space-y-6">
                <header className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center mx-auto">
                    <FiShield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Confirm Stream Creation</h3>
                  <p className="text-xs text-[#958EA0]">
                    Verify confidential parameters before broadcasting ZK payload
                  </p>
                </header>

                <div className="bg-[#1B1B1E] border border-[#27272A] rounded-lg p-4 space-y-3 text-xs font-jetbrains">
                  <div className="flex justify-between border-b border-[#27272A] pb-2">
                    <span className="text-[#958EA0]">Recipient:</span>
                    <span className="text-white truncate max-w-[180px]">{recipient}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#27272A] pb-2">
                    <span className="text-[#958EA0]">Total Cap:</span>
                    <span className="text-white">{totalAmount} {token}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#27272A] pb-2">
                    <span className="text-[#958EA0]">Rate:</span>
                    <span className="text-emerald-400">{flowRatePerSec} {token}/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#958EA0]">Privacy Mode:</span>
                    <span className="text-[#D0BCFF] uppercase">{privacyMode}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 bg-[#1B1B1E] hover:bg-[#27272A] text-white py-2.5 rounded-lg text-xs font-medium border border-[#27272A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmStream}
                    disabled={isSubmitting}
                    className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#8B5CF6]/30"
                  >
                    {isSubmitting ? (
                      <>
                        <FiCpu className="w-4 h-4 animate-spin" />
                        <span>Broadcasting...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Broadcast</span>
                        <FiCheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
