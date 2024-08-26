// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// import "./PeerToken.sol";

import {Event} from "./Libraries/Events.sol";
import "./Libraries/Errors.sol";

/// @title Governance Contract for the platform
/// @author Benjamin Faruna, Jeremiah Samuel, Emmanuel Chukwuma
/// @notice This contract that implements PeerLend DAO

contract Governance is Ownable {
    uint256 internal participationStake = 1000e18;

    uint256 internal proposalId;

    IERC20 peerToken;

    /// @notice This shows the possible status of the proposals
    /// @dev At every instance, a proposal has one of the status: PENDING, ACTIVE, SUCCEEDED, EXPIRED, EXECUTED, or DEFEATED which is presented in the enum
    enum Status {
        PENDING,
        ACTIVE,
        SUCCEEDED,
        EXPIRED,
        EXECUTED,
        DEFEATED
    }

    struct Proposal {
        uint256 id;
        address initiator;
        string title;
        string[] options;
        uint96[] vote_count;
        Status status;
        uint256 deadline;
    }

    Proposal[] internal proposals;

    mapping(address => uint96) votingPower;
    mapping(address => uint256) amountStaked;
    mapping(address => mapping(uint256 => bool)) voted;
    mapping(address => mapping(uint256 => uint96)) delegatedVote;

    constructor(address _tokenAddress) Ownable(msg.sender) {
        peerToken = IERC20(_tokenAddress);
    }

    function getTotalProposals() public view returns (uint256) {
        return proposalId;
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function getProposal(
        uint256 _id
    ) public view returns (Proposal memory proposal_) {
        if (_id >= proposalId) {
            revert Governance__ProposalDoesNotExist();
        }
        proposal_ = proposals[_id];
    }

    function getVotingPower(address _voter) public view returns (uint256) {
        return votingPower[_voter];
    }

    function getProposalLimit(
        uint256 start,
        uint256 limit
    ) public view returns (Proposal[] memory) {
        require(start + limit <= proposalId, "Index out of bounds");
        Proposal[] memory _proposals = new Proposal[](limit);

        for (uint256 i = 0; i < limit; i++) {
            _proposals[i] = proposals[start + i];
        }

        return _proposals;
    }

    function stakeForVotingPower() public {
        if (peerToken.balanceOf(msg.sender) < participationStake) {
            revert Governance__NotEnoughTokenBalance();
        }
        if (
            peerToken.allowance(msg.sender, address(this)) < participationStake
        ) {
            revert Governance__NotEnoughAllowance();
        }
        if (amountStaked[msg.sender] == participationStake) {
            revert Governance__AlreadyStaked();
        }

        peerToken.transferFrom(msg.sender, address(this), participationStake);
        amountStaked[msg.sender] = participationStake;
        votingPower[msg.sender] = 1;

        emit Event.VotingPowerAdded(
            msg.sender,
            address(this),
            participationStake
        );
    }

    function withdrawAndRevokeVotingPower() public {
        if (amountStaked[msg.sender] != participationStake) {
            revert Governance__NoStakedToken();
        }

        votingPower[msg.sender] = 0;
        amountStaked[msg.sender] = 0;
        peerToken.transfer(msg.sender, participationStake);

        emit Event.VotingPowerReduced(
            msg.sender,
            address(this),
            participationStake
        );
    }

    function createProposal(
        string memory _title,
        string[] memory _options,
        Status _status,
        uint256 _deadline
    ) public onlyOwner {
        _deadline = block.timestamp + _deadline;
        Proposal memory _newProposal;

        _newProposal.id = proposalId;
        _newProposal.initiator = msg.sender;
        _newProposal.options = _options;
        _newProposal.title = _title;
        _newProposal.status = _status;
        _newProposal.deadline = _deadline;

        _newProposal.vote_count = new uint96[](_options.length);

        proposals.push(_newProposal);

        proposalId = proposalId + 1;

        emit Event.CreatedProposal(msg.sender, _newProposal.id, _deadline);
    }

    function vote(uint256 _id, uint256 _option) public {
        // checks if contract is active
        if (_id >= proposalId) {
            revert Governance__ProposalDoesNotExist();
        }
        Proposal storage _proposal = proposals[_id];
        uint96 _userVotingPower = votingPower[msg.sender];
        uint96 _delegatedVote = delegatedVote[msg.sender][_id];

        _userVotingPower = _userVotingPower + _delegatedVote;

        // checks if contract is active
        if (_proposal.status != Status.ACTIVE) {
            revert Governance__ProposalInactive();
        }
        if (_userVotingPower == 0) {
            revert Governance__NotEnoughVotingPower();
        }
        if (voted[msg.sender][_id]) {
            revert Governance__AlreadyVoted();
        }

        if (block.timestamp > _proposal.deadline) {
            revert Governance__ProposalExpired();
        }

        if (_option >= _proposal.options.length) {
            revert Governance__OptionDoesNotExist();
        }

        voted[msg.sender][_id] = true;

        _proposal.vote_count[_option] =
            _proposal.vote_count[_option] +
            _userVotingPower;

        emit Event.Voted(msg.sender, _id, _option);
    }

    function delegateVote(address _delegate, uint256 _proposalId) public {
        if (_proposalId >= proposalId) {
            revert Governance__ProposalDoesNotExist();
        }
        require(_delegate != msg.sender, "Cannot delegate to self");
        if (votingPower[msg.sender] == 0) {
            revert Governance__NotEnoughVotingPower();
        }
        if (voted[msg.sender][_proposalId]) {
            revert Governance__AlreadyVoted();
        }
        require(votingPower[_delegate] == 1, "Cannot delegate to non members");
        require(!voted[_delegate][_proposalId], "Delegate has voted");
        voted[msg.sender][_proposalId] = true;
        uint96 _userDelegatedVotes = delegatedVote[msg.sender][_proposalId] + 1;

        delegatedVote[_delegate][_proposalId] =
            delegatedVote[_delegate][_proposalId] +
            _userDelegatedVotes;

        emit Event.VoteDelegated(
            msg.sender,
            _delegate,
            _proposalId,
            _userDelegatedVotes
        );
    }

    function getDelegatedVotes(
        address _voter,
        uint256 _proposalId
    ) public view returns (uint96) {
        return delegatedVote[_voter][_proposalId];
    }

    /// notice This returns the status of a proposal
    function getProposalStatus(
        uint256 _proposalId
    ) public view returns (Status) {
        if (_proposalId >= proposalId) {
            revert Governance__ProposalDoesNotExist();
        }
        Proposal memory _proposal = proposals[_proposalId];
        return _proposal.status;
    }

    function updateProposalStatus(
        uint256 _proposalId,
        Status _status
    ) public onlyOwner {
        _updateProposalStatus(_proposalId, _status);
    }

    function _updateProposalStatus(
        uint256 _proposalId,
        Status _status
    ) internal {
        if (_proposalId >= proposalId) {
            revert Governance__ProposalDoesNotExist();
        }
        Proposal storage _proposal = proposals[_proposalId];
        _proposal.status = _status;

        emit Event.ProposalUpdated(
            _proposalId,
            uint8(_status),
            _proposal.deadline
        );
    }
}
