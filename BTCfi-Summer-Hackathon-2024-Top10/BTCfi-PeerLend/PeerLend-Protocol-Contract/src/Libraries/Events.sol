// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Event {
    enum Status {
        PENDING,
        ACTIVE,
        SUCCEEDED,
        EXPIRED,
        EXECUTED,
        DEFEATED
    }

    /// @notice Event for VotingPowerAdded
    /// @dev this event is emitted for everytime the `addVotingPower` function is fired when the user's voting power is added
    event VotingPowerAdded(
        address indexed msgSender,
        address indexed contractAddress,
        uint256 indexed amount
    );

    event VoteDelegated(
        address indexed from,
        address indexed delegate,
        uint256 proposalId,
        uint96 numberOfVotes
    );

    /// @notice Event for creating of proposal
    /// @dev this event is emitted for everytime the `createProposal` function is fired when a new proposal is created.
    event CreatedProposal(
        address indexed msgSender,
        uint256 indexed proposalId,
        uint256 indexed deadline
    );

    /// @notice Event for voting
    /// @dev this event is emitted when a proposal if voted on. function is fired when a proposal is voted on.
    event Voted(
        address indexed msgSender,
        uint256 indexed id,
        uint256 indexed options
    );

    /// @notice Event for reduced voting power
    /// @dev this event is emitted whenever the `reduceVotingPower` function is fired whenever the voting power of the user is reduced
    event VotingPowerReduced(
        address indexed msgSender,
        address indexed contractAddress,
        uint256 indexed amount
    );

    /// @notice Event for Proposal Update
    /// @dev this event is emitted when the `ProposalUpdated` function is fired by whenver the status of the proposal is updated
    event ProposalUpdated(
        uint256 indexed proposalId,
        uint8 status,
        uint256 deadline
    );
}
