"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthGuard } from "@/components/AuthGuard";
import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import {
  connectWallet,
  VEIL_PROXY_SEPOLIA_ADDRESS,
  VEIL_PROXY_ABI,
  SABLIER_LOCKUP_SEPOLIA_ADDRESS,
  SABLIER_LOCKUP_ABI,
  getReadOnlyProvider,
} from "@/lib/contracts";
import {
  FiDownload,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiShield,
  FiClock,
  FiCpu,
  FiAlertCircle,
  FiInbox,
} from "react-icons/fi";

export default function ClaimPaymentPage() {
  const { account } = useWallet();
  const [isRevealed, setIsRevealed] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedSuccess, setClaimedSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recipientStreams, setRecipientStreams] = useState<any[]>([]);
  const [totalWithdrawable, setTotalWithdrawable] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadRecipientYield() {
      if (!account) {
        setIsLoading(false);
        return;
      }

      if (
        !VEIL_PROXY_SEPOLIA_ADDRESS ||
        VEIL_PROXY_SEPOLIA_ADDRESS === "0x0000000000000000000000000000000000000000" ||
        !ethers.isAddress(VEIL_PROXY_SEPOLIA_ADDRESS)
      ) {
        setRecipientStreams([]);
        setTotalWithdrawable("0.00");
        setIsLoading(false);
        return;
      }

      try {
        const provider = getReadOnlyProvider();

        const code = await provider.getCode(VEIL_PROXY_SEPOLIA_ADDRESS);
        if (code === "0x" || code === "0x0") {
          setRecipientStreams([]);
          setTotalWithdrawable("0.00");
          setIsLoading(false);
          return;
        }

        const veilProxy = new ethers.Contract(VEIL_PROXY_SEPOLIA_ADDRESS, VEIL_PROXY_ABI, provider);
        const sablier = new ethers.Contract(SABLIER_LOCKUP_SEPOLIA_ADDRESS, SABLIER_LOCKUP_ABI, provider);

        const streamIds: bigint[] = await veilProxy.getRecipientStreams(account);
        const fetched: any[] = [];
        let runningTotal = 0n;

        for (const id of streamIds) {
          const streamData = await veilProxy.confidentialStreams(id);
          if (streamData && streamData.isActive) {
            const withdrawable: bigint = await sablier.withdrawableAmountOf(id);
            runningTotal += withdrawable;

            fetched.push({
              id: Number(id),
              payer: streamData.payer,
              totalCap: ethers.formatUnits(streamData.totalAmount, 18),
              withdrawable: ethers.formatUnits(withdrawable, 18),
              asset: streamData.asset,
            });
          }
        }

        setRecipientStreams(fetched);
        setTotalWithdrawable(ethers.formatUnits(runningTotal, 18));
      } catch (err) {
        console.warn("Recipient yield query caught:", err);
        setRecipientStreams([]);
        setTotalWithdrawable("0.00");
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipientYield();
  }, [account]);

  const handleClaimStream = async (streamId: number) => {
    setIsClaiming(true);
    setErrorMessage("");
    try {
      setStatusMessage("Connecting Wallet...");
      const { signer } = await connectWallet();

      setStatusMessage(`Claiming Stream #${streamId} on Sepolia...`);
      const veilProxy = new ethers.Contract(VEIL_PROXY_SEPOLIA_ADDRESS, VEIL_PROXY_ABI, signer);

      const tx = await veilProxy.claim(streamId);
      await tx.wait();

      setIsClaiming(false);
      setClaimedSuccess(true);
      setStatusMessage("");
      setTimeout(() => setClaimedSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.reason || err?.message || "Claim transaction failed. Ensure recipient wallet is connected.");
      setIsClaiming(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
          <AuthGuard>
            {/* Header */}
            <header className="border-b border-[#27272A] pb-6 space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-jetbrains">
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <span>/</span>
                <span>Claim Portal</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] tracking-tight flex items-center gap-3">
                <span>Recipient Claim Portal</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-jetbrains bg-[#8B5CF6]/20 text-[#D0BCFF] border border-[#8B5CF6]/40">
                  ZK Shielded
                </span>
              </h1>
              <p className="text-xs text-[#958EA0]">
                Instantly withdraw unlocked streaming payroll into your wallet with zero public transaction history links.
              </p>
            </header>

            {/* Success Banner */}
            {claimedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-jetbrains">
                <FiCheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold">Claim Transaction Confirmed!</p>
                  <p className="text-emerald-400/80 text-[11px]">
                    Funds successfully withdrawn from Sablier to recipient wallet in 1 atomic transaction.
                  </p>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300 font-jetbrains">
                <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Claim Summary Card */}
            <article className="p-8 rounded-2xl bg-gradient-to-br from-[#131316] via-[#1B1B1E] to-[#131316] border border-[#8B5CF6]/30 relative overflow-hidden shadow-2xl space-y-6">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <FiShield className="w-48 h-48 text-[#8B5CF6]" />
              </div>

              <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
                <div className="flex items-center gap-2">
                  <FiLock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-jetbrains uppercase tracking-wider text-[#958EA0]">
                    Confidential Claimable Balance
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRevealed(!isRevealed)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1F1F22] hover:bg-[#2A2A2D] border border-[#27272A] text-xs font-jetbrains text-[#CBC3D7] transition-colors"
                >
                  {isRevealed ? (
                    <>
                      <FiEyeOff className="w-3.5 h-3.5 text-[#958EA0]" />
                      <span>Hide Balance</span>
                    </>
                  ) : (
                    <>
                      <FiEye className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>Reveal Balance</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-jetbrains text-[#958EA0]">Total Unlocked Yield</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-bold font-jetbrains text-white tracking-tight">
                    {isRevealed ? `$${Number(totalWithdrawable).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••••••"}
                  </span>
                  <span className="text-lg font-jetbrains text-[#D0BCFF]">USDC</span>
                </div>
                <p className="text-xs text-emerald-400 font-jetbrains flex items-center gap-1">
                  <FiClock className="w-3.5 h-3.5" />
                  On-Chain Verified (Sablier v4.0)
                </p>
              </div>

              {statusMessage && (
                <p className="text-xs font-jetbrains text-[#8B5CF6] animate-pulse">
                  {statusMessage}
                </p>
              )}
            </article>

            {/* Active Streams Breakdown */}
            <section className="space-y-4">
              <h2 className="text-base font-semibold text-white">Active Incoming Streams</h2>

              <div className="space-y-3">
                {isLoading ? (
                  <div className="p-8 rounded-xl bg-[#131316] border border-[#27272A] text-center text-xs text-[#958EA0]">
                    Loading stream balances from Sepolia...
                  </div>
                ) : recipientStreams.length > 0 ? (
                  recipientStreams.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-xl bg-[#131316] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FiLock className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-sm font-semibold text-white">Confidential Stream #{item.id}</h3>
                        </div>
                        <p className="text-xs text-[#958EA0] font-jetbrains">
                          Payer: {item.payer.slice(0, 6)}...{item.payer.slice(-4)}
                        </p>
                        <p className="text-[11px] text-[#D0BCFF] font-jetbrains">Total Deposit: {item.totalCap}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-[#958EA0] font-jetbrains">Unlocked</p>
                          <p className="text-base font-bold font-jetbrains text-white">{item.withdrawable}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClaimStream(item.id)}
                          disabled={isClaiming || Number(item.withdrawable) <= 0}
                          className="px-3.5 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border border-[#8B5CF6]/40 text-xs font-semibold transition-all disabled:opacity-40"
                        >
                          Claim
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 rounded-xl bg-[#131316] border border-[#27272A] text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#1F1F22] text-[#958EA0] flex items-center justify-center mx-auto mb-2">
                      <FiInbox className="w-5 h-5" />
                    </div>
                    <p className="text-white font-medium text-xs">No Incoming Streams Available</p>
                    <p className="text-[11px] text-[#958EA0]">Your connected wallet address does not have active incoming streams to claim.</p>
                  </div>
                )}
              </div>
            </section>
          </AuthGuard>
        </main>
      </div>
    </div>
  );
}
