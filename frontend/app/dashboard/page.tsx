"use client";

import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StreamProgressChart } from "@/components/StreamProgressChart";
import {
  FiDollarSign,
  FiActivity,
  FiShield,
  FiTrendingUp,
  FiSend,
  FiEye,
  FiDownload,
  FiPlus,
  FiLock,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const activeStreams = [
  {
    id: "stream-01",
    recipient: "0x94...21a8 (VP of Engineering)",
    rate: "0.00482 USDC/s",
    total: "25,000.00 USDC",
    streamed: "14,250.48 USDC",
    status: "Active",
    privacy: "Homomorphic ZK",
  },
  {
    id: "stream-02",
    recipient: "0x3b...77f1 (Lead Designer)",
    rate: "0.00215 USDC/s",
    total: "12,500.00 USDC",
    streamed: "8,120.10 USDC",
    status: "Active",
    privacy: "Shielded Note",
  },
  {
    id: "stream-03",
    recipient: "0xfa...44e9 (Smart Contract Auditor)",
    rate: "0.00890 USDC/s",
    total: "40,000.00 USDC",
    streamed: "39,890.00 USDC",
    status: "Ending Soon",
    privacy: "ZK Proof",
  },
  {
    id: "stream-04",
    recipient: "0x12...90c4 (Frontend Lead)",
    rate: "0.00195 USDC/s",
    total: "10,000.00 USDC",
    streamed: "4,210.55 USDC",
    status: "Active",
    privacy: "Homomorphic ZK",
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Top Welcome & Summary Header */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Confidential Payroll Dashboard
              </h1>
              <p className="text-xs text-[#958EA0] mt-1 font-jetbrains">
                Institutional Privacy Protocol • Organization #VEIL-8492
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

          {/* Bento Metric Cards Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric 1 */}
            <article className="p-5 rounded-xl bg-[#131316] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between text-[#958EA0]">
                <span className="text-xs font-jetbrains uppercase tracking-wider">
                  Total Streamed
                </span>
                <span className="p-1.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <FiDollarSign className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-jetbrains">
                  $1,842,500
                </p>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3" />
                  +14.2% this month
                </p>
              </div>
            </article>

            {/* Metric 2 */}
            <article className="p-5 rounded-xl bg-[#131316] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between text-[#958EA0]">
                <span className="text-xs font-jetbrains uppercase tracking-wider">
                  Active Streams
                </span>
                <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                  <FiActivity className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-jetbrains">
                  18 Streams
                </p>
                <p className="text-[11px] text-[#958EA0] mt-1">
                  100% On-time Unlocking
                </p>
              </div>
            </article>

            {/* Metric 3 */}
            <article className="p-5 rounded-xl bg-[#131316] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between text-[#958EA0]">
                <span className="text-xs font-jetbrains uppercase tracking-wider">
                  Unclaimed Yield
                </span>
                <span className="p-1.5 rounded bg-amber-500/10 text-amber-400">
                  <FiClock className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-jetbrains">
                  $84,210.45
                </p>
                <p className="text-[11px] text-[#958EA0] mt-1">
                  Ready for instant withdrawal
                </p>
              </div>
            </article>

            {/* Metric 4 */}
            <article className="p-5 rounded-xl bg-[#131316] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between text-[#958EA0]">
                <span className="text-xs font-jetbrains uppercase tracking-wider">
                  ZK Privacy Index
                </span>
                <span className="p-1.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <FiShield className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-jetbrains">
                  99.8% Shielded
                </p>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <FiCheckCircle className="w-3 h-3" />
                  Homomorphic Verified
                </p>
              </div>
            </article>
          </section>

          {/* Featured Live Stream Visualizer */}
          <section className="space-y-3">
            <h2 className="text-sm font-jetbrains uppercase tracking-wider text-[#958EA0]">
              Featured Stream Activity
            </h2>
            <StreamProgressChart />
          </section>

          {/* Active Encrypted Streams Table */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Active Encrypted Streams
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
                      <th scope="col" className="px-6 py-3.5">Recipient Address</th>
                      <th scope="col" className="px-6 py-3.5">Flow Rate</th>
                      <th scope="col" className="px-6 py-3.5">Total Cap</th>
                      <th scope="col" className="px-6 py-3.5">Streamed Amount</th>
                      <th scope="col" className="px-6 py-3.5">Encryption Level</th>
                      <th scope="col" className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272A]">
                    {activeStreams.map((stream) => (
                      <tr
                        key={stream.id}
                        className="hover:bg-[#1F1F22] transition-colors"
                      >
                        <td className="px-6 py-4 font-jetbrains font-medium text-white flex items-center gap-2">
                          <FiLock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{stream.recipient}</span>
                        </td>
                        <td className="px-6 py-4 font-jetbrains">{stream.rate}</td>
                        <td className="px-6 py-4 font-jetbrains">{stream.total}</td>
                        <td className="px-6 py-4 font-jetbrains text-white font-medium">
                          {stream.streamed}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-jetbrains bg-[#8B5CF6]/10 text-[#D0BCFF] border border-[#8B5CF6]/30">
                            {stream.privacy}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
