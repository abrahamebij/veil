import { network } from "hardhat";

// Load .env variables natively
try {
  process.loadEnvFile();
} catch (e) {}

async function main() {
  console.log("Deploying VeilStreamProxy to Sepolia using Sablier v4.0 (0xe61cb9153356419bdaD0A8767c059f92d221a3C4)...");

  // Connect to target network environment
  const { ethers } = await network.connect();

  // Get configured deployer signer from network
  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No deployer signer found! Please verify PRIVATE_KEY is set in your root .env file.");
  }

  const deployer = signers[0];
  console.log(`Deploying from account: ${deployer.address}`);

  // Sablier v4.0 Lockup contract address on Sepolia testnet
  const SABLIER_LOCKUP_SEPOLIA = process.env.SABLIER_ADDRESS || "0xe61cb9153356419bdaD0A8767c059f92d221a3C4";

  // Pass deployer signer to ContractFactory so it can sign and broadcast transactions
  const VeilStreamProxy = await ethers.getContractFactory("VeilStreamProxy", deployer);
  const veilProxy = await VeilStreamProxy.deploy(SABLIER_LOCKUP_SEPOLIA);

  await veilProxy.waitForDeployment();

  const proxyAddress = await veilProxy.getAddress();
  console.log("----------------------------------------------------");
  console.log(`VeilStreamProxy contract deployed successfully to Sepolia at:`);
  console.log(`${proxyAddress}`);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
