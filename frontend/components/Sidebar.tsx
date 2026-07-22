"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiSend,
  FiEye,
  FiDownload,
  FiShield,
  FiSettings,
  FiLogOut,
  FiActivity,
} from "react-icons/fi";

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: FiGrid },
  { name: "All Streams", href: "/dashboard/streams", icon: FiActivity },
  { name: "Create Stream", href: "/dashboard/streams/create", icon: FiSend },
  { name: "Claim Portal", href: "/claim", icon: FiDownload },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-[#131316] border-r border-[#27272A] flex flex-col justify-between h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#27272A]">
          <div className="w-8 h-8 rounded-md bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
            <FiShield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white tracking-tight text-base block leading-none">
              VEIL
            </span>
            <span className="text-[10px] font-jetbrains uppercase tracking-widest text-[#958EA0]">
              CONFIDENTIAL
            </span>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mx-4 my-4 p-3 rounded-lg bg-[#1B1B1E] border border-[#27272A] flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="text-xs">
            <p className="text-white font-medium">ZK-Privacy Active</p>
            <p className="text-[#958EA0] text-[11px]">Shielded Transfers</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-2">
          <p className="px-3 mb-2 text-[11px] font-jetbrains uppercase text-[#958EA0] tracking-wider">
            Navigation
          </p>
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                      isActive
                        ? "bg-[#1F1F22] text-white border-l-2 border-[#8B5CF6]"
                        : "text-[#C8C6C5] hover:text-white hover:bg-[#1B1B1E]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-[#8B5CF6]" : "text-[#958EA0]"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-[#27272A] space-y-2">
        <div className="px-3 py-2 rounded-md bg-[#1B1B1E] flex items-center justify-between border border-[#27272A]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-[#8B5CF6]/30 text-[#D0BCFF] flex items-center justify-center text-xs font-mono font-bold">
              0x
            </div>
            <div className="truncate text-xs">
              <p className="text-white font-mono truncate">0x84...3a9f</p>
              <p className="text-[#958EA0] text-[10px]">Institutional Org</p>
            </div>
          </div>
          <Link
            href="/login"
            title="Disconnect Wallet"
            className="text-[#958EA0] hover:text-rose-400 p-1.5 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
