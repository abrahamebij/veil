"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiActivity, FiLock, FiTrendingUp } from "react-icons/fi";

interface StreamProgressProps {
  initialAmount?: number;
  totalAmount?: number;
  ratePerSec?: number;
  tokenSymbol?: string;
  streamName?: string;
}

export function StreamProgressChart({
  initialAmount = 14250.48,
  totalAmount = 25000.0,
  ratePerSec = 0.00482,
  tokenSymbol = "USDC",
  streamName = "Senior Executive Payroll Stream",
}: StreamProgressProps) {
  const [unlocked, setUnlocked] = useState(initialAmount);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Realtime incremental streaming counter simulation
    const interval = setInterval(() => {
      setUnlocked((prev) => prev + ratePerSec);
    }, 100);

    return () => clearInterval(interval);
  }, [ratePerSec]);

  useEffect(() => {
    // GSAP animation for progress bar width
    const percent = Math.min((unlocked / totalAmount) * 100, 100);
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${percent}%`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [unlocked, totalAmount]);

  const percentage = ((unlocked / totalAmount) * 100).toFixed(2);

  return (
    <article className="p-6 rounded-xl bg-[#131316] border border-[#27272A] relative overflow-hidden">
      {/* Background glow ambient */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none"></div>

      <header className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#8B5CF6]/20 text-[#8B5CF6]">
              <FiActivity className="w-4 h-4" />
            </span>
            <h3 className="text-white font-medium text-base">{streamName}</h3>
          </div>
          <p className="text-xs text-[#958EA0] mt-1 flex items-center gap-1.5 font-jetbrains">
            <FiLock className="w-3 h-3 text-emerald-400" />
            ZK-Shielded Payload • 0.00482 {tokenSymbol}/sec
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-jetbrains bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FiTrendingUp className="w-3 h-3" />
            Streaming Live
          </span>
        </div>
      </header>

      {/* Main Streaming Display Metric */}
      <div className="my-6">
        <p className="text-xs font-jetbrains uppercase tracking-wider text-[#958EA0]">
          Real-Time Unlocked Balance
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span
            ref={counterRef}
            className="text-3xl md:text-4xl font-bold font-jetbrains text-white tracking-tight"
          >
            {unlocked.toLocaleString("en-US", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}
          </span>
          <span className="text-sm font-jetbrains text-[#D0BCFF]">
            {tokenSymbol}
          </span>
        </div>
      </div>

      {/* GSAP Animated Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-jetbrains text-[#958EA0]">
          <span>Progress: {percentage}%</span>
          <span>
            {unlocked.toFixed(2)} / {totalAmount.toFixed(2)} {tokenSymbol}
          </span>
        </div>
        <div className="h-3 w-full bg-[#1B1B1E] rounded-full overflow-hidden border border-[#27272A] p-0.5">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#A078FF] to-emerald-400 rounded-full transition-all duration-300"
          ></div>
        </div>
      </div>
    </article>
  );
}
