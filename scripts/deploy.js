import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  console.log("Deploying VeilStreamProxy to Sepolia using Sablier v4.0 (0xe61cb9153356419bdaD0A8767c059f92d221a3C4)...");

  // Sablier v4.0 Lockup contract address on Sepolia testnet
  const SABLIER_LOCKUP_SEPOLIA = process.env.SABLIER_ADDRESS || "0xe61cb9153356419bdaD0A8767c059f92d221a3C4";

  const VeilStreamProxy = await ethers.getContractFactory("VeilStreamProxy");
  const veilProxy = await VeilStreamProxy.deploy(SABLIER_LOCKUP_SEPOLIA);

  await veilProxy.waitForDeployment();

  const proxyAddress = await veilProxy.getAddress();
  console.log("----------------------------------------------------");
  console.log(`VeilStreamProxy contract deployed to Sepolia at:`);
  console.log(`${proxyAddress}`);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
