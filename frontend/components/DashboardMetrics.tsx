"use client";

import React from "react";
import { FiActivity, FiCheckCircle, FiClock, FiShield } from "react-icons/fi";

interface DashboardMetricsProps {
  streamCount: number;
  activeCount: number;
}

export function DashboardMetrics({ streamCount, activeCount }: DashboardMetricsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <article className="p-5 rounded-xl bg-[#131316] border border-[#27272A] space-y-3">
        <div className="flex items-center justify-between text-[#958EA0]">
          <span className="text-xs font-jetbrains uppercase tracking-wider">
            Total Streams
          </span>
          <span className="p-1.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <FiActivity className="w-4 h-4" />
          </span>
        </div>
        <div>
          <p className="text-2xl font-bold text-white font-jetbrains">
            {streamCount}
          </p>
          <p className="text-[11px] text-[#958EA0] mt-1">
            On-Chain Verified
          </p>
        </div>
      </article>

      <article className="p-5 rounded-xl bg-[#131316] border border-[#27272A] space-y-3">
        <div className="flex items-center justify-between text-[#958EA0]">
          <span className="text-xs font-jetbrains uppercase tracking-wider">
            Active Status
          </span>
          <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
            <FiCheckCircle className="w-4 h-4" />
          </span>
        </div>
        <div>
          <p className="text-2xl font-bold text-white font-jetbrains">
            {activeCount} Active
          </p>
          <p className="text-[11px] text-emerald-400 mt-1">
            Sablier v4.0 Stream
          </p>
        </div>
      </article>

      <article className="p-5 rounded-xl bg-[#131316] border border-[#27272A] space-y-3">
        <div className="flex items-center justify-between text-[#958EA0]">
          <span className="text-xs font-jetbrains uppercase tracking-wider">
            Target Network
          </span>
          <span className="p-1.5 rounded bg-amber-500/10 text-amber-400">
            <FiClock className="w-4 h-4" />
          </span>
        </div>
        <div>
          <p className="text-2xl font-bold text-white font-jetbrains">
            ETH Sepolia
          </p>
          <p className="text-[11px] text-[#958EA0] mt-1">
            0xe61c...3C4
          </p>
        </div>
      </article>

      <article className="p-5 rounded-xl bg-[#131316] border border-[#27272A] space-y-3">
        <div className="flex items-center justify-between text-[#958EA0]">
          <span className="text-xs font-jetbrains uppercase tracking-wider">
            Privacy Layer
          </span>
          <span className="p-1.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <FiShield className="w-4 h-4" />
          </span>
        </div>
        <div>
          <p className="text-2xl font-bold text-white font-jetbrains">
            Veil Vault Proxy
          </p>
          <p className="text-[11px] text-emerald-400 mt-1">
            Decoupled Recipient
          </p>
        </div>
      </article>
    </section>
  );
}
