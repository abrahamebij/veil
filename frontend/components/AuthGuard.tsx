"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, isConnecting, isRestoring } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // Only trigger redirect AFTER localStorage restoration has completed
    if (!isRestoring && !isConnecting && !isConnected) {
      router.replace("/login");
    }
  }, [isConnected, isConnecting, isRestoring, router]);

  // While restoring session from localStorage or actively connecting, display loader
  if (isRestoring || isConnecting) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-6 text-[#958EA0] text-xs font-jetbrains">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping"></span>
          <span>Verifying wallet session...</span>
        </div>
      </div>
    );
  }

  // If restoration finished and user is not connected, prevent rendering content while router redirects
  if (!isConnected) {
    return null;
  }

  return <>{children}</>;
}
