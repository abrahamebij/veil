import { ethers } from "ethers";

// Sablier v4.0 Unified Lockup Contract on Sepolia Testnet
export const SABLIER_LOCKUP_SEPOLIA_ADDRESS =
  process.env.NEXT_PUBLIC_SABLIER_ADDRESS || "0xe61cb9153356419bdaD0A8767c059f92d221a3C4";

// Live Deployed VeilStreamProxy contract address on ETH Sepolia Testnet
export const VEIL_PROXY_SEPOLIA_ADDRESS =
  process.env.NEXT_PUBLIC_VEIL_PROXY_ADDRESS || "0xF0A04E4a28C9f60302f4629520CeF850B0A880fa";

export const SEPOLIA_RPC_URL =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org";

/**
 * Returns a read-only Sepolia RPC provider for querying contract state
 * without triggering browser wallet extension popups or permission prompts.
 */
export function getReadOnlyProvider() {
  return new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
}

// Minimal ERC20 ABI
export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
];

// VeilStreamProxy Contract ABI
export const VEIL_PROXY_ABI = [
  "function createConfidentialStream(address realRecipient, bytes32 recipientCommitmentHash, address asset, uint128 totalAmount, uint40 duration) external returns (uint256 streamId)",
  "function claim(uint256 streamId) external",
  "function getRecipientStreams(address recipient) external view returns (uint256[])",
  "function confidentialStreams(uint256 streamId) external view returns (address payer, address realRecipient, bytes32 recipientCommitmentHash, uint256 sablierStreamId, address asset, uint128 totalAmount, bool isActive)",
  "event ConfidentialStreamCreated(uint256 indexed streamId, address indexed payer, bytes32 indexed recipientCommitmentHash, address asset, uint40 duration)",
  "event StreamClaimed(uint256 indexed streamId, address indexed recipient, uint128 amount)",
];

// Sablier v4.0 Lockup Contract ABI
export const SABLIER_LOCKUP_ABI = [
  "function createWithDurationsLL(tuple(address sender, address recipient, uint128 totalAmount, address asset, bool cancelable, bool transferable, tuple(uint40 cliff, uint40 total) durations, address broker, uint256 brokerFee) params) external returns (uint256 streamId)",
  "function withdraw(uint256 streamId, address to, uint128 amount) external",
  "function withdrawableAmountOf(uint256 streamId) external view returns (uint128 withdrawableAmount)",
];

/**
 * Connects user's browser wallet (MetaMask / Rabby / WalletConnect) for write transactions
 */
export async function connectWallet() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return { provider, signer, address };
  } else {
    throw new Error("No EVM wallet found. Please install MetaMask or Rabby.");
  }
}
