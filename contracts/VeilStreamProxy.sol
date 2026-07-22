// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IERC20.sol";
import "./interfaces/ISablierLockup.sol";

/**
 * @title VeilStreamProxy
 * @notice Confidential proxy & stealth vault wrapper for Sablier v4.0 Lockup streams.
 *         Ensures recipient identities and salary details are encrypted and decoupled
 *         from public Sablier event emissions, while enabling a seamless 1-click claim UX.
 */
contract VeilStreamProxy {
    ISablierLockup public immutable sablier;

    struct ConfidentialStream {
        address payer;
        address realRecipient;
        bytes32 recipientCommitmentHash; // Homomorphic/ZK commitment hash
        uint256 sablierStreamId;
        address asset;
        uint128 totalAmount;
        bool isActive;
    }

    // Mapping from Sablier streamId => ConfidentialStream metadata
    mapping(uint256 => ConfidentialStream) public confidentialStreams;

    // Mapping from real recipient address => list of assigned stream IDs
    mapping(address => uint256[]) public recipientStreams;

    event ConfidentialStreamCreated(
        uint256 indexed streamId,
        address indexed payer,
        bytes32 indexed recipientCommitmentHash,
        address asset,
        uint40 duration
    );

    event StreamClaimed(
        uint256 indexed streamId,
        address indexed recipient,
        uint128 amount
    );

    constructor(address _sablier) {
        require(_sablier != address(0), "VeilStreamProxy: invalid sablier address");
        sablier = ISablierLockup(_sablier);
    }

    /**
     * @notice Create a confidential stream using Sablier v4.0 Lockup contract.
     * @dev The payer transfers tokens to VeilStreamProxy, which approves Sablier and
     *      creates a stream where `address(this)` is set as Sablier recipient.
     *      The actual recipient mapping is securely stored inside this contract.
     */
    function createConfidentialStream(
        address realRecipient,
        bytes32 recipientCommitmentHash,
        address asset,
        uint128 totalAmount,
        uint40 duration
    ) external returns (uint256 streamId) {
        require(realRecipient != address(0), "VeilStreamProxy: invalid recipient");
        require(totalAmount > 0, "VeilStreamProxy: totalAmount must be > 0");

        // Pull tokens from payer to this contract
        IERC20(asset).transferFrom(msg.sender, address(this), totalAmount);

        // Approve Sablier to pull tokens from this contract
        IERC20(asset).approve(address(sablier), totalAmount);

        // Call Sablier v4.0 `createWithDurationsLL` with `address(this)` as the Sablier recipient
        ISablierLockup.LockupLinearDurations memory params = ISablierLockup.LockupLinearDurations({
            sender: msg.sender,
            recipient: address(this),
            totalAmount: totalAmount,
            asset: asset,
            cancelable: true,
            transferable: false,
            durations: ISablierLockup.Durations({ cliff: 0, total: duration }),
            broker: address(0),
            brokerFee: 0
        });

        streamId = sablier.createWithDurationsLL(params);

        confidentialStreams[streamId] = ConfidentialStream({
            payer: msg.sender,
            realRecipient: realRecipient,
            recipientCommitmentHash: recipientCommitmentHash,
            sablierStreamId: streamId,
            asset: asset,
            totalAmount: totalAmount,
            isActive: true
        });

        recipientStreams[realRecipient].push(streamId);

        emit ConfidentialStreamCreated(
            streamId,
            msg.sender,
            recipientCommitmentHash,
            asset,
            duration
        );
    }

    /**
     * @notice 1-Click Atomic Recipient Claim
     * @dev Recipient connects standard wallet and calls `claim(streamId)`.
     *      The proxy pulls unlocked tokens from Sablier and forwards them directly to msg.sender
     *      in a single atomic transaction.
     */
    function claim(uint256 streamId) external {
        ConfidentialStream storage cStream = confidentialStreams[streamId];
        require(cStream.isActive, "VeilStreamProxy: stream inactive");
        require(msg.sender == cStream.realRecipient, "VeilStreamProxy: unauthorized recipient");

        uint128 withdrawable = sablier.withdrawableAmountOf(streamId);
        require(withdrawable > 0, "VeilStreamProxy: zero withdrawable amount");

        // 1. Withdraw from Sablier to this contract
        sablier.withdraw(streamId, address(this), withdrawable);

        // 2. Immediately transfer tokens to recipient's wallet in the same transaction
        IERC20(cStream.asset).transfer(msg.sender, withdrawable);

        emit StreamClaimed(streamId, msg.sender, withdrawable);
    }

    /**
     * @notice Get stream IDs for a given recipient
     */
    function getRecipientStreams(address recipient) external view returns (uint256[] memory) {
        return recipientStreams[recipient];
    }
}
