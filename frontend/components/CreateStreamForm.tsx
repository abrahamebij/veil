"use client";

import React from "react";
import { FiLock, FiShield, FiSend, FiArrowRight } from "react-icons/fi";

const DURATION_PRESETS = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
  { label: "180 Days", days: 180 },
  { label: "1 Year", days: 365 },
];

interface CreateStreamFormProps {
  recipient: string;
  setRecipient: (val: string) => void;
  tokenSymbol: string;
  setTokenSymbol: (val: string) => void;
  setTokenAddress: (val: string) => void;
  totalAmount: string;
  setTotalAmount: (val: string) => void;
  durationDays: number;
  setDurationDays: (val: number) => void;
  privacyMode: string;
  setPrivacyMode: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateStreamForm({
  recipient,
  setRecipient,
  tokenSymbol,
  setTokenSymbol,
  setTokenAddress,
  totalAmount,
  setTotalAmount,
  durationDays,
  setDurationDays,
  privacyMode,
  setPrivacyMode,
  onSubmit,
}: CreateStreamFormProps) {
  const numAmount = Number(totalAmount) || 0;
  const totalSeconds = durationDays * 86400;
  const flowRatePerSec = numAmount > 0 ? (numAmount / totalSeconds).toFixed(6) : "0.000000";
  const sliderPercentage = ((durationDays - 1) / (365 - 1)) * 100;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
              <span className="absolute -translate-x-1/2" style={{ left: `${((30 - 1) / 364) * 100}%` }}>
                30 Days
              </span>
              <span className="absolute -translate-x-1/2" style={{ left: `${((90 - 1) / 364) * 100}%` }}>
                90 Days
              </span>
              <span className="absolute -translate-x-1/2" style={{ left: `${((180 - 1) / 364) * 100}%` }}>
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
  );
}
