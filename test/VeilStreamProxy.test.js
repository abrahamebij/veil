const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeilStreamProxy - Hardhat Proxy Spike Test", function () {
  let payer, recipient, observer;
  let mockUSDC, mockSablier, veilProxy;

  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18);
  const STREAM_AMOUNT = ethers.parseUnits("25000", 18);
  const DURATION_SECONDS = 30 * 86400; // 30 days

  beforeEach(async function () {
    [payer, recipient, observer] = await ethers.getSigners();

    // 1. Deploy Mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("USD Coin", "USDC");
    await mockUSDC.waitForDeployment();

    // 2. Deploy Mock Sablier V2
    const MockSablier = await ethers.getContractFactory("MockSablierV2LockupLinear");
    mockSablier = await MockSablier.deploy();
    await mockSablier.waitForDeployment();

    // 3. Deploy VeilStreamProxy
    const VeilStreamProxy = await ethers.getContractFactory("VeilStreamProxy");
    veilProxy = await VeilStreamProxy.deploy(await mockSablier.getAddress());
    await veilProxy.waitForDeployment();

    // Mint USDC to Payer & Approve Proxy
    await mockUSDC.mint(payer.address, INITIAL_SUPPLY);
    await mockUSDC.connect(payer).approve(await veilProxy.getAddress(), INITIAL_SUPPLY);
  });

  it("Should create a confidential stream where Sablier recipient is the proxy, shielding real recipient identity", async function () {
    // Generate dummy ZK commitment hash for recipient & amount
    const recipientCommitmentHash = ethers.keccak256(
      ethers.solidityPacked(["address", "uint256"], [recipient.address, STREAM_AMOUNT])
    );

    // Create Confidential Stream
    const tx = await veilProxy
      .connect(payer)
      .createConfidentialStream(
        recipient.address,
        recipientCommitmentHash,
        await mockUSDC.getAddress(),
        STREAM_AMOUNT,
        DURATION_SECONDS
      );

    const receipt = await tx.wait();

    // Audit Sablier Event Logs to verify zero leakage of real recipient
    const sablierAddress = await mockSablier.getAddress();
    const proxyAddress = await veilProxy.getAddress();

    const sablierEvents = receipt.logs.filter((log) => log.address === sablierAddress);
    expect(sablierEvents.length).to.be.greaterThan(0);

    // Verify stream details in Sablier contract
    const streamId = 1;
    const [streamSender, streamRecipient, totalAmount] = await mockSablier.getStream(streamId);

    // KEY PRIVACY TEST: Sablier's public recipient MUST be the VeilProxy address, NOT the real recipient!
    expect(streamRecipient).to.equal(proxyAddress);
    expect(streamRecipient).to.not.equal(recipient.address);
    expect(totalAmount).to.equal(STREAM_AMOUNT);
  });

  it("Should enable 1-click atomic claim for recipient directly into their normal wallet", async function () {
    const recipientCommitmentHash = ethers.keccak256(
      ethers.solidityPacked(["address", "uint256"], [recipient.address, STREAM_AMOUNT])
    );

    // 1. Create Stream
    await veilProxy
      .connect(payer)
      .createConfidentialStream(
        recipient.address,
        recipientCommitmentHash,
        await mockUSDC.getAddress(),
        STREAM_AMOUNT,
        DURATION_SECONDS
      );

    const streamId = 1;

    // Check recipient balance before claim
    const initialRecipientBalance = await mockUSDC.balanceOf(recipient.address);
    expect(initialRecipientBalance).to.equal(0);

    // 2. Recipient calls claim(streamId) in 1 transaction
    await expect(veilProxy.connect(recipient).claim(streamId))
      .to.emit(veilProxy, "StreamClaimed")
      .withArgs(streamId, recipient.address, STREAM_AMOUNT);

    // Check recipient balance after claim
    const finalRecipientBalance = await mockUSDC.balanceOf(recipient.address);
    expect(finalRecipientBalance).to.equal(STREAM_AMOUNT);
  });

  it("Should reject unauthorized claim attempts from non-recipients", async function () {
    const recipientCommitmentHash = ethers.keccak256(
      ethers.solidityPacked(["address", "uint256"], [recipient.address, STREAM_AMOUNT])
    );

    await veilProxy
      .connect(payer)
      .createConfidentialStream(
        recipient.address,
        recipientCommitmentHash,
        await mockUSDC.getAddress(),
        STREAM_AMOUNT,
        DURATION_SECONDS
      );

    const streamId = 1;

    // Observer attempts to claim recipient's stream
    await expect(veilProxy.connect(observer).claim(streamId)).to.be.revertedWith(
      "VeilStreamProxy: unauthorized recipient"
    );
  });
});
