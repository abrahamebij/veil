"use client";

import React from "react";
import { FiShield, FiCpu, FiCheckCircle } from "react-icons/fi";

interface CreateStreamModalProps {
  recipient: string;
  numAmount: number;
  tokenSymbol: string;
  flowRatePerSec: string;
  privacyMode: string;
  statusMessage: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CreateStreamModal({
  recipient,
  numAmount,
  tokenSymbol,
  flowRatePerSec,
  privacyMode,
  statusMessage,
  isSubmitting,
  onCancel,
  onConfirm,
}: CreateStreamModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131316] border border-[#27272A] rounded-2xl max-w-md w-full p-6 space-y-6">
        <header className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center mx-auto">
            <FiShield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Confirm Stream Creation</h3>
          <p className="text-xs text-[#958EA0]">
            Verify confidential parameters before broadcasting ZK payload
          </p>
        </header>

        <div className="bg-[#1B1B1E] border border-[#27272A] rounded-lg p-4 space-y-3 text-xs font-jetbrains">
          <div className="flex justify-between border-b border-[#27272A] pb-2">
            <span className="text-[#958EA0]">Recipient:</span>
            <span className="text-white truncate max-w-[180px]">{recipient}</span>
          </div>
          <div className="flex justify-between border-b border-[#27272A] pb-2">
            <span className="text-[#958EA0]">Total Cap:</span>
            <span className="text-white">{numAmount} {tokenSymbol}</span>
          </div>
          <div className="flex justify-between border-b border-[#27272A] pb-2">
            <span className="text-[#958EA0]">Rate:</span>
            <span className="text-emerald-400">{flowRatePerSec} {tokenSymbol}/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#958EA0]">Privacy Mode:</span>
            <span className="text-[#D0BCFF] uppercase">{privacyMode}</span>
          </div>
        </div>

        {statusMessage && (
          <p className="text-xs text-center font-jetbrains text-[#8B5CF6] animate-pulse">
            {statusMessage}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-[#1B1B1E] hover:bg-[#27272A] text-white py-2.5 rounded-lg text-xs font-medium border border-[#27272A]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#8B5CF6]/30"
          >
            {isSubmitting ? (
              <>
                <FiCpu className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Confirm & Broadcast</span>
                <FiCheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
