"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthGuard } from "@/components/AuthGuard";
import { ethers } from "ethers";
import {
  connectWallet,
  VEIL_PROXY_SEPOLIA_ADDRESS,
  VEIL_PROXY_ABI,
  ERC20_ABI,
} from "@/lib/contracts";
import {
  FiSend,
  FiLock,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiAlertCircle,
} from "react-icons/fi";

const DURATION_PRESETS = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
  { label: "180 Days", days: 180 },
  { label: "1 Year", days: 365 },
];

export default function CreateSecureStreamPage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [tokenAddress, setTokenAddress] = useState("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"); // USDC on Sepolia
  const [tokenSymbol, setTokenSymbol] = useState("USDC");
  const [totalAmount, setTotalAmount] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [privacyMode, setPrivacyMode] = useState("homomorphic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const numAmount = Number(totalAmount) || 0;
  const totalSeconds = durationDays * 86400;
  const flowRatePerSec = numAmount > 0 ? (numAmount / totalSeconds).toFixed(6) : "0.000000";

  // Calculate track fill percentage accurately
  const sliderPercentage = ((durationDays - 1) / (365 - 1)) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!recipient || !ethers.isAddress(recipient)) {
      setErrorMessage("Please enter a valid recipient EVM wallet address.");
      return;
    }
    if (numAmount <= 0) {
      setErrorMessage("Please enter a deposit amount greater than 0.");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmStream = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      setStatusMessage("1/3: Connecting EVM Wallet...");
      const { signer } = await connectWallet();

      const amountWei = ethers.parseUnits(numAmount.toString(), 18);
      const durationSecs = durationDays * 86400;

      // 1. Approve ERC20 token for VeilStreamProxy
      setStatusMessage(`2/3: Approving ${tokenSymbol} for VeilStreamProxy...`);
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const approveTx = await tokenContract.approve(VEIL_PROXY_SEPOLIA_ADDRESS, amountWei);
      await approveTx.wait();

      // 2. Call VeilStreamProxy createConfidentialStream
      setStatusMessage("3/3: Creating Confidential Stream on Sepolia...");
      const veilProxy = new ethers.Contract(VEIL_PROXY_SEPOLIA_ADDRESS, VEIL_PROXY_ABI, signer);

      // Compute recipient commitment hash
      const commitmentHash = ethers.keccak256(
        ethers.solidityPacked(["address", "uint256"], [recipient, amountWei])
      );

      const tx = await veilProxy.createConfidentialStream(
        recipient,
        commitmentHash,
        tokenAddress,
        amountWei,
        durationSecs
      );

      await tx.wait();

      setStatusMessage("Stream Created Successfully!");
      setTimeout(() => {
        router.push("/dashboard/streams");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.reason || err?.message || "Failed to create confidential stream.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
          <AuthGuard>
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

            {/* Error Banner if any */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300 font-jetbrains">
                <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

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
                    Recipient EVM Wallet Address
                  </label>
                  <div className="relative">
                    <input
                      id="recipient-address"
                      type="text"
                      required
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-lg px-4 py-2.5 text-xs text-white placeholder-[#958EA0] focus:outline-none focus:border-[#8B5CF6] font-jetbrains"
                    />
                    <FiShield className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5CF6]" />
                  </div>
                  <p className="text-[11px] text-[#958EA0]">
                    Recipient wallet identity will be decoupled from Sablier public event logs via Veil Proxy Vault.
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
                      value={tokenSymbol}
                      onChange={(e) => {
                        setTokenSymbol(e.target.value);
                        if (e.target.value === "USDC") setTokenAddress("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238");
                        if (e.target.value === "USDT") setTokenAddress("0x7169D388206773D682E05545649122260170068b");
                      }}
                      className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6] font-jetbrains"
                    >
                      <option value="USDC">USDC (Sepolia Testnet)</option>
                      <option value="USDT">USDT (Sepolia Testnet)</option>
                    </select>
                  </div>

                  {/* Total Cap */}
                  <div className="space-y-2">
                    <label htmlFor="total-deposit-amount" className="block text-xs font-jetbrains text-[#958EA0] uppercase tracking-wider">
                      Total Deposit Cap ({tokenSymbol})
                    </label>
                    <input
                      id="total-deposit-amount"
                      type="number"
                      min="1"
                      step="any"
                      placeholder="e.g. 5000"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-lg px-4 py-2.5 text-xs text-white placeholder-[#958EA0] focus:outline-none focus:border-[#8B5CF6] font-jetbrains"
                    />
                  </div>
                </div>

                {/* Duration Control & Slider */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-jetbrains">
                    <label htmlFor="stream-duration-slider" className="text-[#958EA0] uppercase tracking-wider">
                      Stream Duration
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={durationDays}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(365, Number(e.target.value) || 1));
                          setDurationDays(val);
                        }}
                        className="w-16 bg-[#1B1B1E] border border-[#27272A] rounded px-2 py-1 text-xs text-white text-center font-jetbrains focus:outline-none focus:border-[#8B5CF6]"
                      />
                      <span className="text-white font-medium">Days</span>
                      <span className="text-[#958EA0] text-[11px]">({totalSeconds.toLocaleString()} Seconds)</span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {DURATION_PRESETS.map((preset) => (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => setDurationDays(preset.days)}
                        className={`px-3 py-1 rounded-md text-xs font-jetbrains transition-all border ${
                          durationDays === preset.days
                            ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-sm font-semibold"
                            : "bg-[#1B1B1E] text-[#958EA0] border-[#27272A] hover:text-white hover:border-[#494454]"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Range Slider with Dynamic Fill */}
                  <div className="space-y-2 pt-1">
                    <input
                      id="stream-duration-slider"
                      type="range"
                      min="1"
                      max="365"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      style={{
                        background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${sliderPercentage}%, #27272A ${sliderPercentage}%, #27272A 100%)`,
                      }}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                    />

                    {/* Accurately Positioned Ticks & Labels */}
                    <div className="relative w-full h-5 text-[10px] font-jetbrains text-[#958EA0]">
                      <span className="absolute left-0">1 Day</span>
                      <span
                        className="absolute -translate-x-1/2"
                        style={{ left: `${((30 - 1) / 364) * 100}%` }}
                      >
                        30 Days
                      </span>
                      <span
                        className="absolute -translate-x-1/2"
                        style={{ left: `${((90 - 1) / 364) * 100}%` }}
                      >
                        90 Days
                      </span>
                      <span
                        className="absolute -translate-x-1/2"
                        style={{ left: `${((180 - 1) / 364) * 100}%` }}
                      >
                        180 Days
                      </span>
                      <span className="absolute right-0">1 Year</span>
                    </div>
                  </div>
                </div>

                {/* Calculated Flow Rate Display */}
                <div className="p-4 rounded-lg bg-[#1B1B1E] border border-[#27272A] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-jetbrains text-[#958EA0]">Calculated Flow Rate</p>
                    <p className="text-lg font-bold font-jetbrains text-white mt-0.5">
                      {flowRatePerSec} <span className="text-xs text-[#8B5CF6]">{tokenSymbol}/sec</span>
                    </p>
                  </div>
                  <div className="text-right text-xs font-jetbrains text-[#CBC3D7]">
                    <p>Daily Rate: {numAmount > 0 ? (numAmount / durationDays).toFixed(2) : "0.00"} {tokenSymbol}/day</p>
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
                      title: "Fully Shielded Vault",
                      badge: "Max Privacy",
                      desc: "Generates one-time ephemeral zk-vaults. Completely un-linkable to organization public master address.",
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
                  className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/25 cursor-pointer"
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
                      <span className="text-white">{numAmount} {tokenSymbol}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#27272A] pb-2">
                      <span className="text-[#958EA0]">Rate:</span>
                      <span className="text-emerald-400">{flowRatePerSec} {tokenSymbol}/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#958EA0]">Privacy Mode:</span>
                      <span className="text-[#D0BCFF] uppercase">{privacyMode}</span>
                    </div>
                  </div>

                  {statusMessage && (
                    <p className="text-xs text-center font-jetbrains text-[#8B5CF6] animate-pulse">
                      {statusMessage}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowConfirmation(false)}
                      disabled={isSubmitting}
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
                          <span>Processing...</span>
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
          </AuthGuard>
        </main>
      </div>
    </div>
  );
}
