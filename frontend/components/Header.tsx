"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { VEIL_PROXY_SEPOLIA_ADDRESS } from "@/lib/contracts";
import {
  FiSearch,
  FiBell,
  FiLock,
  FiPlus,
  FiCheckCircle,
  FiKey,
  FiX,
  FiExternalLink,
  FiShield,
  FiActivity,
  FiCheck,
} from "react-icons/fi";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "system" | "contract" | "privacy";
  read: boolean;
}

export function Header() {
  const router = useRouter();
  const { account, isConnected, connectWallet } = useWallet();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Dynamic Notification state (starts completely empty - zero mock data)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  // Dynamically record live connection event when account changes
  useEffect(() => {
    if (account) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: "EVM Wallet Connected",
        desc: `Active account: ${account.slice(0, 6)}...${account.slice(-4)} on Sepolia`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "system",
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
    } else {
      setNotifications([]);
    }
  }, [account]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/dashboard/streams?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifs = () => {
    setNotifications([]);
  };

  const quickLinks = [
    { label: "All Payment Streams", href: "/dashboard/streams", category: "Navigation" },
    { label: "Create Confidential Stream", href: "/dashboard/streams/create", category: "Action" },
    { label: "Recipient Claim Portal", href: "/claim", category: "Action" },
    {
      label: "VeilProxy Contract on Etherscan",
      href: `https://sepolia.etherscan.io/address/${VEIL_PROXY_SEPOLIA_ADDRESS}`,
      category: "Sepolia Explorer",
      external: true,
    },
  ].filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header className="h-16 border-b border-[#27272A] bg-[#131316]/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between gap-4">
      {/* Interactive Global Search Bar */}
      <form
        ref={searchRef}
        className="relative flex-1 max-w-md"
        onSubmit={handleSearchSubmit}
      >
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#958EA0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search streams, addresses, or transactions..."
            className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-md pl-9 pr-8 py-1.5 text-xs text-white placeholder-[#958EA0] focus:outline-none focus:border-[#8B5CF6] font-jetbrains transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#958EA0] hover:text-white"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown Overlay */}
        {isSearchFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#131316] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden z-50 text-xs">
            <div className="p-3 border-b border-[#27272A] flex justify-between items-center text-[11px] text-[#958EA0] font-jetbrains">
              <span>{searchQuery ? `Results matching "${searchQuery}"` : "Quick Navigation"}</span>
              <span className="text-[10px]">Press Enter to search</span>
            </div>

            <div className="py-2 max-h-60 overflow-y-auto divide-y divide-[#27272A]/50">
              {quickLinks.length > 0 ? (
                quickLinks.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    target={item.external ? "_blank" : "_self"}
                    onClick={() => setIsSearchFocused(false)}
                    className="p-3 flex items-center justify-between hover:bg-[#1F1F22] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FiActivity className="w-4 h-4 text-[#8B5CF6]" />
                      <span className="text-white font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#958EA0] font-jetbrains">
                      <span>{item.category}</span>
                      {item.external && <FiExternalLink className="w-3 h-3" />}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-[#958EA0] text-xs font-jetbrains">
                  No quick actions matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
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
            className="flex items-center gap-2 bg-[#8B5CF6]/20 border border-[#8B5CF6] hover:bg-[#8B5CF6] text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm cursor-pointer"
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

        {/* Notification Icon & Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Notifications"
            className="p-2 text-[#958EA0] hover:text-white hover:bg-[#1F1F22] rounded-md transition-colors relative cursor-pointer"
          >
            <FiBell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown Overlay */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#131316] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden z-50 text-xs">
              <header className="p-4 border-b border-[#27272A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-jetbrains bg-[#8B5CF6]/20 text-[#D0BCFF] border border-[#8B5CF6]/40">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-jetbrains">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[#8B5CF6] hover:underline flex items-center gap-1"
                    >
                      <FiCheck className="w-3 h-3" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifs}
                      className="text-[#958EA0] hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </header>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#27272A]">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 transition-colors flex items-start gap-3 ${
                        item.read ? "bg-[#131316] opacity-75" : "bg-[#1B1B1E]"
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] shrink-0 mt-0.5">
                        {item.type === "privacy" ? (
                          <FiShield className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <FiActivity className="w-4 h-4" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-white">{item.title}</p>
                          <span className="text-[10px] font-jetbrains text-[#958EA0]">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-[#958EA0] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[#958EA0] text-xs font-jetbrains space-y-1">
                    <p className="text-white font-medium">No Notifications</p>
                    <p className="text-[11px]">No active protocol events recorded.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
