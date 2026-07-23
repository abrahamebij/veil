"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthGuard } from "@/components/AuthGuard";
import { CreateStreamForm } from "@/components/CreateStreamForm";
import { CreateStreamModal } from "@/components/CreateStreamModal";
import { ethers } from "ethers";
import {
  connectWallet,
  VEIL_PROXY_SEPOLIA_ADDRESS,
  VEIL_PROXY_ABI,
  ERC20_ABI,
} from "@/lib/contracts";
import { FiAlertCircle } from "react-icons/fi";

export default function CreateSecureStreamPage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [tokenAddress, setTokenAddress] = useState("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238");
  const [tokenSymbol, setTokenSymbol] = useState("USDC");
  const [totalAmount, setTotalAmount] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [privacyMode, setPrivacyMode] = useState("homomorphic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const numAmount = Number(totalAmount) || 0;
  const totalSeconds = durationDays * 86400;
  const flowRatePerSec = numAmount > 0 ? (numAmount / totalSeconds).toFixed(6) : "0.000000";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!recipient || !ethers.isAddress(recipient)) {
      setErrorMessage("Please enter a valid recipient EVM wallet address.");
      return;
    }
    if (numAmount <= 0) {
      setErrorMessage("Please enter a deposit amount greater than 0.");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmStream = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      setStatusMessage("1/3: Connecting EVM Wallet...");
      const { signer } = await connectWallet();

      const amountWei = ethers.parseUnits(numAmount.toString(), 18);
      const durationSecs = durationDays * 86400;

      // 1. Approve ERC20 token for VeilStreamProxy
      setStatusMessage(`2/3: Approving ${tokenSymbol} for VeilStreamProxy...`);
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const approveTx = await tokenContract.approve(VEIL_PROXY_SEPOLIA_ADDRESS, amountWei);
      await approveTx.wait();

      // 2. Call VeilStreamProxy createConfidentialStream
      setStatusMessage("3/3: Creating Confidential Stream on Sepolia...");
      const veilProxy = new ethers.Contract(VEIL_PROXY_SEPOLIA_ADDRESS, VEIL_PROXY_ABI, signer);

      const commitmentHash = ethers.keccak256(
        ethers.solidityPacked(["address", "uint256"], [recipient, amountWei])
      );

      const tx = await veilProxy.createConfidentialStream(
        recipient,
        commitmentHash,
        tokenAddress,
        amountWei,
        durationSecs
      );

      await tx.wait();

      setStatusMessage("Stream Created Successfully!");
      setTimeout(() => {
        router.push("/dashboard/streams");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.reason || err?.message || "Failed to create confidential stream.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E1E5] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
          <AuthGuard>
            <header className="border-b border-[#27272A] pb-6 space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-jetbrains">
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <span>/</span>
                <span>Create Stream</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Create Confidential Stream
              </h1>
              <p className="text-xs text-[#958EA0]">
                Configure zero-knowledge streaming payroll parameters and recipient privacy layer.
              </p>
            </header>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300 font-jetbrains">
                <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <CreateStreamForm
              recipient={recipient}
              setRecipient={setRecipient}
              tokenSymbol={tokenSymbol}
              setTokenSymbol={setTokenSymbol}
              setTokenAddress={setTokenAddress}
              totalAmount={totalAmount}
              setTotalAmount={setTotalAmount}
              durationDays={durationDays}
              setDurationDays={setDurationDays}
              privacyMode={privacyMode}
              setPrivacyMode={setPrivacyMode}
              onSubmit={handleSubmit}
            />

            {showConfirmation && (
              <CreateStreamModal
                recipient={recipient}
                numAmount={numAmount}
                tokenSymbol={tokenSymbol}
                flowRatePerSec={flowRatePerSec}
                privacyMode={privacyMode}
                statusMessage={statusMessage}
                isSubmitting={isSubmitting}
                onCancel={() => setShowConfirmation(false)}
                onConfirm={handleConfirmStream}
              />
            )}
          </AuthGuard>
        </main>
      </div>
    </div>
  );
}
