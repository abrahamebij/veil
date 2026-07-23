"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthGuard } from "@/components/AuthGuard";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import {
  VEIL_PROXY_SEPOLIA_ADDRESS,
  VEIL_PROXY_ABI,
} from "@/lib/contracts";
import {
  FiDownload,
  FiPlus,
  FiLock,
  FiInbox,
  FiEye,
  FiAlertTriangle,
} from "react-icons/fi";

export default function DashboardOverviewPage() {
  const { account } = useWallet();
  const [streams, setStreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isContractDeployed, setIsContractDeployed] = useState<boolean>(true);

  useEffect(() => {
    async function loadOnChainStreams() {
      if (!account || typeof window === "undefined" || !(window as any).ethereum) {
        setIsLoading(false);
        return;
      }

      if (
        !VEIL_PROXY_SEPOLIA_ADDRESS ||
        VEIL_PROXY_SEPOLIA_ADDRESS === "0x0000000000000000000000000000000000000000" ||
        !ethers.isAddress(VEIL_PROXY_SEPOLIA_ADDRESS)
      ) {
        setIsContractDeployed(false);
        setStreams([]);
        setIsLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);

        const code = await provider.getCode(VEIL_PROXY_SEPOLIA_ADDRESS);
        if (code === "0x" || code === "0x0") {
          setIsContractDeployed(false);
          setStreams([]);
          setIsLoading(false);
          return;
        }

        setIsContractDeployed(true);
        const veilProxy = new ethers.Contract(VEIL_PROXY_SEPOLIA_ADDRESS, VEIL_PROXY_ABI, provider);

        const streamIds: bigint[] = await veilProxy.getRecipientStreams(account);
        const fetched: any[] = [];

        for (const id of streamIds) {
          const streamData = await veilProxy.confidentialStreams(id);
          if (streamData && streamData.isActive) {
            fetched.push({
              id: id.toString(),
              payer: streamData.payer,
              realRecipient: streamData.realRecipient,
              totalAmount: ethers.formatUnits(streamData.totalAmount, 18),
              asset: streamData.asset,
              isActive: streamData.isActive,
            });
          }
        }
        setStreams(fetched);
      } catch (err) {
        console.warn("On-chain stream query gracefully caught:", err);
        setStreams([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadOnChainStreams();
  }, [account]);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <AuthGuard>
            {!isContractDeployed && (
              <aside className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-jetbrains text-amber-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FiAlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-200">VeilStreamProxy Contract Not Deployed on Sepolia</p>
                    <p className="text-[11px] text-amber-300/80">
                      Run <code className="bg-[#1B1B1E] px-1.5 py-0.5 rounded text-white font-mono">npm run deploy</code> in your terminal and update <code className="bg-[#1B1B1E] px-1.5 py-0.5 rounded text-white font-mono">VEIL_PROXY_SEPOLIA_ADDRESS</code> in <code className="bg-[#1B1B1E] px-1.5 py-0.5 rounded text-white font-mono">frontend/lib/contracts.ts</code>.
                    </p>
                  </div>
                </div>
              </aside>
            )}

            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Confidential Payroll Dashboard
                </h1>
                <p className="text-xs text-[#958EA0] mt-1 font-jetbrains">
                  Connected Account: <span className="text-white font-mono">{account}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/claim"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#1F1F22] hover:bg-[#2A2A2D] text-white border border-[#27272A] text-xs font-medium transition-colors"
                >
                  <FiDownload className="w-4 h-4 text-emerald-400" />
                  <span>Claim Portal</span>
                </Link>
                <Link
                  href="/dashboard/streams/create"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-md shadow-[#8B5CF6]/20"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Create New Stream</span>
                </Link>
              </div>
            </section>

            <DashboardMetrics
              streamCount={streams.length}
              activeCount={streams.filter((s) => s.isActive).length}
            />

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                  On-Chain Confidential Streams
                </h2>
                <Link
                  href="/dashboard/streams/create"
                  className="text-xs text-[#8B5CF6] hover:underline font-jetbrains flex items-center gap-1"
                >
                  + Create New Stream
                </Link>
              </div>

              <div className="bg-[#131316] border border-[#27272A] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#CBC3D7]">
                    <thead className="bg-[#1B1B1E] text-[#958EA0] font-jetbrains uppercase text-[11px] border-b border-[#27272A]">
                      <tr>
                        <th scope="col" className="px-6 py-3.5">Stream ID</th>
                        <th scope="col" className="px-6 py-3.5">Payer Address</th>
                        <th scope="col" className="px-6 py-3.5">Deposit Amount</th>
                        <th scope="col" className="px-6 py-3.5">Status</th>
                        <th scope="col" className="px-6 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A]">
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-xs text-[#958EA0]">
                            Loading on-chain streams from Sepolia...
                          </td>
                        </tr>
                      ) : streams.length > 0 ? (
                        streams.map((stream) => (
                          <tr key={stream.id} className="hover:bg-[#1F1F22] transition-colors">
                            <td className="px-6 py-4 font-jetbrains font-medium text-white">
                              #{stream.id}
                            </td>
                            <td className="px-6 py-4 font-jetbrains flex items-center gap-2">
                              <FiLock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{stream.payer.slice(0, 6)}...{stream.payer.slice(-4)}</span>
                            </td>
                            <td className="px-6 py-4 font-jetbrains text-white font-medium">
                              {stream.totalAmount}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-jetbrains bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href={`/dashboard/streams/${stream.id}`}
                                className="inline-flex items-center gap-1 text-[#8B5CF6] hover:text-[#A078FF] font-medium transition-colors"
                              >
                                <FiEye className="w-3.5 h-3.5" />
                                <span>Details</span>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center text-xs text-[#958EA0] space-y-3">
                            <div className="w-10 h-10 rounded-full bg-[#1F1F22] text-[#958EA0] flex items-center justify-center mx-auto mb-2">
                              <FiInbox className="w-5 h-5" />
                            </div>
                            <p className="text-white font-medium">No On-Chain Streams Found</p>
                            <p className="text-[11px] text-[#958EA0]">You have not created or received any confidential streams on Sepolia yet.</p>
                            <div className="pt-2">
                              <Link
                                href="/dashboard/streams/create"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-md shadow-[#8B5CF6]/20 transition-all"
                              >
                                <FiPlus className="w-4 h-4" />
                                <span>Create Your First Stream</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </AuthGuard>
        </main>
      </div>
    </div>
  );
}
