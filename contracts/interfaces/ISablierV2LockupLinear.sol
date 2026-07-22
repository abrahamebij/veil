// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISablierV2LockupLinear {
    struct LockupLinearDurations {
        address sender;
        address recipient;
        uint128 totalAmount;
        address asset;
        bool cancelable;
        bool transferable;
        uint40 duration;
        address broker;
        uint256 brokerFee;
    }

    event CreateLockupLinearStream(
        uint256 streamId,
        address indexed funder,
        address indexed sender,
        address indexed recipient,
        uint128 totalAmount,
        address asset,
        bool cancelable,
        bool transferable,
        uint40 duration
    );

    event WithdrawFromLockupStream(
        uint256 indexed streamId,
        address indexed to,
        uint128 amount
    );

    function createWithDurations(
        LockupLinearDurations calldata params
    ) external returns (uint256 streamId);

    function withdraw(uint256 streamId, address to, uint128 amount) external;

    function getStream(uint256 streamId)
        external
        view
        returns (
            address sender,
            address recipient,
            uint128 totalAmount,
            address asset,
            bool isCancelable,
            bool isTransferable
        );

    function withdrawableAmountOf(uint256 streamId) external view returns (uint128);
}
