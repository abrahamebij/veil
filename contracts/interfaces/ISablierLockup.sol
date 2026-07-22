// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ISablierLockup
 * @notice Interface for Sablier v4.0 unified SablierLockup contract deployed at 0xe61cb9153356419bdaD0A8767c059f92d221a3C4 on Sepolia.
 */
interface ISablierLockup {
    struct Durations {
        uint40 cliff;
        uint40 total;
    }

    struct LockupLinearDurations {
        address sender;
        address recipient;
        uint128 totalAmount;
        address asset;
        bool cancelable;
        bool transferable;
        Durations durations;
        address broker;
        uint256 brokerFee;
    }

    function createWithDurationsLL(LockupLinearDurations memory params) external returns (uint256 streamId);

    function withdraw(uint256 streamId, address to, uint128 amount) external;

    function withdrawMax(uint256 streamId, address to) external;

    function withdrawableAmountOf(uint256 streamId) external view returns (uint128 withdrawableAmount);
}
