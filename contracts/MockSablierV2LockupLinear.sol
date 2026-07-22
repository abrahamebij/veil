// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/ISablierV2LockupLinear.sol";
import "./interfaces/IERC20.sol";

contract MockSablierV2LockupLinear is ISablierV2LockupLinear {
    uint256 public nextStreamId = 1;

    struct StreamInternal {
        address sender;
        address recipient;
        uint128 totalAmount;
        uint128 withdrawnAmount;
        address asset;
        bool cancelable;
        bool transferable;
        uint40 duration;
    }

    mapping(uint256 => StreamInternal) public streams;

    function createWithDurations(
        LockupLinearDurations calldata params
    ) external override returns (uint256 streamId) {
        streamId = nextStreamId++;

        streams[streamId] = StreamInternal({
            sender: params.sender,
            recipient: params.recipient,
            totalAmount: params.totalAmount,
            withdrawnAmount: 0,
            asset: params.asset,
            cancelable: params.cancelable,
            transferable: params.transferable,
            duration: params.duration
        });

        // Pull tokens from sender
        IERC20(params.asset).transferFrom(msg.sender, address(this), params.totalAmount);

        emit CreateLockupLinearStream(
            streamId,
            msg.sender,
            params.sender,
            params.recipient,
            params.totalAmount,
            params.asset,
            params.cancelable,
            params.transferable,
            params.duration
        );
    }

    function withdraw(uint256 streamId, address to, uint128 amount) external override {
        StreamInternal storage stream = streams[streamId];
        require(msg.sender == stream.recipient || msg.sender == stream.sender, "Sablier: unauthorized withdraw");
        require(amount <= stream.totalAmount - stream.withdrawnAmount, "Sablier: excessive amount");

        stream.withdrawnAmount += amount;
        IERC20(stream.asset).transfer(to, amount);

        emit WithdrawFromLockupStream(streamId, to, amount);
    }

    function getStream(uint256 streamId)
        external
        view
        override
        returns (
            address sender,
            address recipient,
            uint128 totalAmount,
            address asset,
            bool isCancelable,
            bool isTransferable
        )
    {
        StreamInternal memory s = streams[streamId];
        return (s.sender, s.recipient, s.totalAmount, s.asset, s.cancelable, s.transferable);
    }

    function withdrawableAmountOf(uint256 streamId) external view override returns (uint128) {
        StreamInternal memory s = streams[streamId];
        return s.totalAmount - s.withdrawnAmount;
    }
}
