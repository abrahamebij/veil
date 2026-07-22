"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import {
  FiEye,
  FiLock,
  FiPlus,
  FiSearch,
  FiFilter,
  FiShield,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiPauseCircle,
} from "react-icons/fi";

const allStreams = [
  {
    id: "stream-01",
    name: "Executive Payroll - VP of Engineering",
    recipient: "0x9491...21a8",
    rate: "0.00482 USDC/s",
    totalCap: "25,000.00 USDC",
    streamed: "14,250.48 USDC",
    progress: 57,
    status: "Active",
    type: "Outgoing",
    encryption: "Homomorphic ZK",
  },
  {
    id: "stream-02",
    name: "Lead Product Designer Compensation",
    recipient: "0x3b82...77f1",
    rate: "0.00215 USDC/s",
    totalCap: "12,500.00 USDC",
    streamed: "8,120.10 USDC",
    progress: 65,
    status: "Active",
    type: "Outgoing",
    encryption: "Shielded Note",
  },
  {
    id: "stream-03",
    name: "Smart Contract Audit Retainer",
    recipient: "0xfa10...44e9",
    rate: "0.00890 USDC/s",
    totalCap: "40,000.00 USDC",
    streamed: "39,890.00 USDC",
    progress: 99,
    status: "Ending Soon",
    type: "Outgoing",
    encryption: "ZK Proof",
  },
  {
    id: "stream-04",
    name: "Frontend Lead Payroll",
    recipient: "0x1290...90c4",
    rate: "0.00195 USDC/s",
    totalCap: "10,000.00 USDC",
    streamed: "4,210.55 USDC",
    progress: 42,
    status: "Active",
    type: "Outgoing",
    encryption: "Homomorphic ZK",
  },
  {
    id: "stream-05",
    name: "Q3 Research Grant Stream",
    recipient: "0x88f2...00b3",
    rate: "0.00500 USDC/s",
    totalCap: "30,000.00 USDC",
    streamed: "30,000.00 USDC",
    progress: 100,
    status: "Completed",
    type: "Outgoing",
    encryption: "Homomorphic ZK",
  },
  {
    id: "stream-06",
    name: "Nox Protocol Treasury Contributor Stream",
    recipient: "0x8492...3a9f (Your Wallet)",
    rate: "0.00350 USDC/s",
    totalCap: "15,000.00 USDC",
    streamed: "9,450.00 USDC",
    progress: 63,
    status: "Active",
    type: "Incoming",
    encryption: "ZK Shielded",
  },
];

export default function AllStreamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredStreams = allStreams.filter((stream) => {
    const matchesSearch =
      stream.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || stream.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === "all" || stream.type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
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

          {/* Search & Filter Bar */}
          <section className="p-4 rounded-xl bg-[#131316] border border-[#27272A] flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#958EA0]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search streams by name, recipient, or ID..."
                className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#958EA0] focus:outline-none focus:border-[#8B5CF6] font-jetbrains"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs font-jetbrains">
                <FiFilter className="w-3.5 h-3.5 text-[#958EA0]" />
                <span className="text-[#958EA0]">Filter:</span>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1B1B1E] border border-[#27272A] rounded-lg px-3 py-1.5 text-xs text-white font-jetbrains focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="ending soon">Ending Soon</option>
                <option value="completed">Completed</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[#1B1B1E] border border-[#27272A] rounded-lg px-3 py-1.5 text-xs text-white font-jetbrains focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="all">All Types</option>
                <option value="outgoing">Outgoing (Payroll)</option>
                <option value="incoming">Incoming (Recipient)</option>
              </select>
            </div>
          </section>

          {/* Streams Table */}
          <section className="bg-[#131316] border border-[#27272A] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#CBC3D7]">
                <thead className="bg-[#1B1B1E] text-[#958EA0] font-jetbrains uppercase text-[11px] border-b border-[#27272A]">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Stream Name & ID</th>
                    <th scope="col" className="px-6 py-3.5">Recipient Address</th>
                    <th scope="col" className="px-6 py-3.5">Flow Rate</th>
                    <th scope="col" className="px-6 py-3.5">Unlocked / Total</th>
                    <th scope="col" className="px-6 py-3.5">Progress</th>
                    <th scope="col" className="px-6 py-3.5">Status</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {filteredStreams.length > 0 ? (
                    filteredStreams.map((stream) => (
                      <tr
                        key={stream.id}
                        className="hover:bg-[#1F1F22] transition-colors"
                      >
                        <td className="px-6 py-4 space-y-0.5">
                          <p className="font-semibold text-white">{stream.name}</p>
                          <p className="text-[10px] font-jetbrains text-[#958EA0]">{stream.id} • {stream.type}</p>
                        </td>

                        <td className="px-6 py-4 font-jetbrains flex items-center gap-2">
                          <FiLock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-white font-medium">{stream.recipient}</span>
                        </td>

                        <td className="px-6 py-4 font-jetbrains">{stream.rate}</td>

                        <td className="px-6 py-4 font-jetbrains">
                          <p className="text-white font-medium">{stream.streamed}</p>
                          <p className="text-[10px] text-[#958EA0]">Cap: {stream.totalCap}</p>
                        </td>

                        <td className="px-6 py-4 w-36">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-jetbrains text-[#958EA0]">
                              <span>{stream.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#1B1B1E] rounded-full overflow-hidden border border-[#27272A]">
                              <div
                                className="h-full bg-gradient-to-r from-[#8B5CF6] to-emerald-400 rounded-full"
                                style={{ width: `${stream.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-jetbrains border ${
                              stream.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : stream.status === "Ending Soon"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-[#1F1F22] text-[#958EA0] border-[#27272A]"
                            }`}
                          >
                            {stream.status === "Active" && <FiTrendingUp className="w-3 h-3" />}
                            {stream.status === "Ending Soon" && <FiClock className="w-3 h-3" />}
                            {stream.status === "Completed" && <FiCheckCircle className="w-3 h-3" />}
                            {stream.status}
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
                      <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#958EA0]">
                        No streams matching your search or filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
