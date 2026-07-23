"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthGuard } from "@/components/AuthGuard";
import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import {
  VEIL_PROXY_SEPOLIA_ADDRESS,
  VEIL_PROXY_ABI,
} from "@/lib/contracts";
import {
  FiEye,
  FiLock,
  FiPlus,
  FiSearch,
  FiCheckCircle,
  FiInbox,
} from "react-icons/fi";

export default function AllStreamsPage() {
  const { account } = useWallet();
  const [streams, setStreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        setStreams([]);
        setIsLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const code = await provider.getCode(VEIL_PROXY_SEPOLIA_ADDRESS);
        if (code === "0x" || code === "0x0") {
          setStreams([]);
          setIsLoading(false);
          return;
        }

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
        console.warn("On-chain stream query caught:", err);
        setStreams([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadOnChainStreams();
  }, [account]);

  const filteredStreams = streams.filter((stream) => {
    return (
      stream.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.realRecipient.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <AuthGuard>
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                  <span>Confidential Payment Streams</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-jetbrains bg-[#8B5CF6]/20 text-[#D0BCFF] border border-[#8B5CF6]/40">
                    {filteredStreams.length} Total Streams
                  </span>
                </h1>
                <p className="text-xs text-[#958EA0] mt-1 font-jetbrains">
                  Manage all encrypted recurring payroll and contractor streams across your organization.
                </p>
              </div>

              <Link
                href="/dashboard/streams/create"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition-colors shadow-md shadow-[#8B5CF6]/20 self-start md:self-auto"
              >
                <FiPlus className="w-4 h-4" />
                <span>Create New Stream</span>
              </Link>
            </header>

            {/* Search Bar */}
            <section className="p-4 rounded-xl bg-[#131316] border border-[#27272A] flex items-center justify-between">
              <div className="relative w-full md:w-96">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#958EA0]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search streams by address or ID..."
                  className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#958EA0] focus:outline-none focus:border-[#8B5CF6] font-jetbrains"
                />
              </div>
            </section>

            {/* Streams Table */}
            <section className="bg-[#131316] border border-[#27272A] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#CBC3D7]">
                  <thead className="bg-[#1B1B1E] text-[#958EA0] font-jetbrains uppercase text-[11px] border-b border-[#27272A]">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">Stream ID</th>
                      <th scope="col" className="px-6 py-3.5">Payer Address</th>
                      <th scope="col" className="px-6 py-3.5">Total Cap</th>
                      <th scope="col" className="px-6 py-3.5">Status</th>
                      <th scope="col" className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272A]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-xs text-[#958EA0]">
                          Loading streams from Sepolia...
                        </td>
                      </tr>
                    ) : filteredStreams.length > 0 ? (
                      filteredStreams.map((stream) => (
                        <tr
                          key={stream.id}
                          className="hover:bg-[#1F1F22] transition-colors"
                        >
                          <td className="px-6 py-4 font-jetbrains font-medium text-white">
                            #{stream.id}
                          </td>

                          <td className="px-6 py-4 font-jetbrains flex items-center gap-2">
                            <FiLock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="text-white font-medium">
                              {stream.payer.slice(0, 6)}...{stream.payer.slice(-4)}
                            </span>
                          </td>

                          <td className="px-6 py-4 font-jetbrains text-white font-medium">
                            {stream.totalAmount}
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-jetbrains bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Active
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/dashboard/streams/${stream.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#1B1B1E] hover:bg-[#2A2A2D] text-[#8B5CF6] border border-[#27272A] text-xs font-medium transition-colors"
                            >
                              <FiEye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-xs text-[#958EA0] space-y-2">
                          <p className="text-white font-medium">No On-Chain Streams Found</p>
                          <p className="text-[11px] text-[#958EA0]">No active streams match your connected wallet on Sepolia.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </AuthGuard>
        </main>
      </div>
    </div>
  );
}
