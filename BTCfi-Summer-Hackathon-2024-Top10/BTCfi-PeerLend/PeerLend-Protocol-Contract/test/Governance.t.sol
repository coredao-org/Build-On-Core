// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "forge-std/Test.sol";
// import {console} from "forge-std/console.sol";

// import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// import {Governance} from "../src/Governance.sol";
// import "../src/Protocol.sol";
// import "../src/PeerToken.sol";

// import {Event} from "../src/Libraries/Events.sol";
// import "../src/Libraries/Errors.sol";
// // import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

// contract GovernanceTest is Test {
//     Protocol protocol;
//     PeerToken peerToken;
//     ERC1967Proxy proxy;
//     Governance governance;

//     address owner;
//     string[] public optionArray;

//     address[] _tokenAddresses;
//     bytes32[] _priceFeedAddresses;

//     address A = address(0xa);
//     address B = address(0xb);
//     address C = address(0xc);
//     address D = address(0xd);

//     function setUp() public {
//         // Define the owner address
//         owner = vm.addr(1);

//         switchSigner(owner);

//         // Deploy the token implementation
//         peerToken = new PeerToken(owner);

//         governance = new Governance(address(peerToken));

//         Protocol implementation = new Protocol();
//         // Deploy the proxy and initialize the contract through the proxy
//         proxy = new ERC1967Proxy(
//             address(implementation),
//             abi.encodeCall(
//                 implementation.initialize,
//                 (
//                     owner,
//                     _tokenAddresses,
//                     _priceFeedAddresses,
//                     address(peerToken),
//             0xA2aa501b19aff244D90cc15a4Cf739D2725B5729
//                 )
//             )
//         );
//         // Attach the MyToken interface to the deployed proxy
//         protocol = Protocol(address(proxy));
//         // Emit the owner address for debugging purposes
//         // emit log_address(owner);

//         A = mkaddr("A");
//         B = mkaddr("B");
//         C = mkaddr("C");
//         D = mkaddr("D");

//         peerToken.mint(owner, 10000e18);
//         peerToken.mint(A, 10000e18);
//         peerToken.mint(B, 10000e18);
//         peerToken.mint(C, 10000e18);
//     }

//     // Test the basic ERC20 functionality of the MyToken contract
//     function test_stakeForVotingPower() public {
//         switchSigner(owner);
//         stakeForVotingPower(1000e18);

//         uint256 votingPower = governance.getVotingPower(owner);
//         assertEq(votingPower, 1);
//     }

//     function test_stakeForVotingPowerFailsWithoutAllowance() public {
//         switchSigner(owner);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__NotEnoughAllowance.selector)
//         );
//         governance.stakeForVotingPower();
//     }

//     function test_stakeForVotingPowerFailsWhenUserBalanceIsLessThanBaseFee()
//         public
//     {
//         switchSigner(D);
//         peerToken.approve(address(governance), 1000e18);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__NotEnoughTokenBalance.selector)
//         );
//         governance.stakeForVotingPower();
//     }

//     function test_stakeForVotingPowerCannotBeUsedWhenUserIsStaked() public {
//         switchSigner(owner);
//         stakeForVotingPower(2000e18);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__AlreadyStaked.selector)
//         );
//         governance.stakeForVotingPower();
//     }

//     function test_stakeForVotingPowerEmitEvent() public {
//         switchSigner(owner);
//         peerToken.approve(address(governance), 1000e18);
//         vm.expectEmit(true, true, true, true);
//         emit Event.VotingPowerAdded(owner, address(governance), 1000e18);
//         governance.stakeForVotingPower();
//     }

//     function test_withdrawAndRevokeVotingPower() public {
//         switchSigner(owner);
//         stakeForVotingPower(1000e19);

//         governance.withdrawAndRevokeVotingPower();
//         assertEq(governance.getVotingPower(owner), 0);
//     }

//     function test_withdrawAndRevokeVotingPowerFailsWhenUserIsNotStaked()
//         public
//     {
//         switchSigner(owner);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__NoStakedToken.selector)
//         );
//         governance.withdrawAndRevokeVotingPower();
//     }

//     function test_withdrawAndRevokeVotingPowerEmitEvent() public {
//         switchSigner(owner);
//         stakeForVotingPower(1000e18);
//         vm.expectEmit(true, true, true, true);
//         emit Event.VotingPowerReduced(owner, address(governance), 1000e18);
//         governance.withdrawAndRevokeVotingPower();
//     }

//     // testing the create proposal
//     function test_createProposal() public {
//         createProposal("VOTING FOR BILL", Governance.Status.ACTIVE, 60);

//         Governance.Proposal memory _proposal = governance.getProposal(0);
//         assertEq(_proposal.initiator, owner);
//         assertEq(_proposal.deadline, block.timestamp + 60);
//         assertEq(_proposal.options.length, 3);
//         assertEq(uint8(_proposal.status), uint8(1));
//         assertEq(_proposal.options[0], "opt1");
//         assertEq(_proposal.options[1], "opt2");
//         assertEq(_proposal.options[2], "opt3");
//     }

//     function test_createProposalFailIfNotCreatedByOwner() public {
//         switchSigner(A);
//         string[] memory _options = new string[](3);
//         _options[0] = "opt1";
//         _options[1] = "opt2";
//         _options[2] = "opt3";
//         vm.expectRevert(
//             abi.encodeWithSelector(
//                 OwnableUpgradeable.OwnableUnauthorizedAccount.selector,
//                 A
//             )
//         );
//         governance.createProposal(
//             "VOTING FOR BILL",
//             _options,
//             Governance.Status.ACTIVE,
//             60
//         );
//     }

//     function test_createProposalEmitEvent() public {
//         vm.warp(200_000);
//         switchSigner(owner);
//         string[] memory _options = new string[](3);
//         _options[0] = "opt1";
//         _options[1] = "opt2";
//         _options[2] = "opt3";
//         vm.expectEmit(true, true, true, true);
//         emit Event.CreatedProposal(owner, 0, block.timestamp + 60);
//         governance.createProposal(
//             "VOTING FOR BILL",
//             _options,
//             Governance.Status.ACTIVE,
//             60
//         );
//     }

//     function test_Vote() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 2", Governance.Status.ACTIVE, 400_000);
//         stakeForVotingPower(1000e18);

//         governance.vote(0, 0);
//         governance.vote(1, 2);

//         switchSigner(A);
//         stakeForVotingPower(1000e18);

//         governance.vote(0, 0);
//         governance.vote(1, 1);

//         switchSigner(B);
//         stakeForVotingPower(1000e18);

//         governance.vote(0, 1);
//         governance.vote(1, 1);

//         switchSigner(C);
//         stakeForVotingPower(1000e18);

//         governance.vote(0, 2);
//         governance.vote(1, 1);

//         Governance.Proposal memory _proposalOne = governance.getProposal(0);
//         Governance.Proposal memory _proposalTwo = governance.getProposal(1);

//         assertEq(_proposalOne.vote_count[0], 2);
//         assertEq(_proposalOne.vote_count[1], 1);
//         assertEq(_proposalOne.vote_count[2], 1);
//         assertEq(_proposalTwo.vote_count[0], 0);
//         assertEq(_proposalTwo.vote_count[1], 3);
//         assertEq(_proposalTwo.vote_count[2], 1);
//     }

//     function test_voteFailIfProposalDoesNotExist() public {
//         switchSigner(owner);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalDoesNotExist.selector)
//         );
//         governance.vote(0, 0);
//     }

//     function test_voteFailIfOptionDoesNotExist() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         switchSigner(owner);
//         stakeForVotingPower(1000e18);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__OptionDoesNotExist.selector)
//         );
//         governance.vote(0, 3);
//     }

//     function test_voteFailsIfUserHasNoVotingPower() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         switchSigner(owner);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__NotEnoughVotingPower.selector)
//         );
//         governance.vote(0, 0);
//     }

//     function test_voteFailsUserAlreadyVoted() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         switchSigner(owner);
//         stakeForVotingPower(1000e18);
//         governance.vote(0, 0);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__AlreadyVoted.selector)
//         );
//         governance.vote(0, 0);
//     }

//     function test_voteFailsIfProposalDeadlineHasPassed() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         switchSigner(owner);
//         stakeForVotingPower(1000e18);
//         vm.warp(500_000);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalExpired.selector)
//         );
//         governance.vote(0, 0);
//     }

//     function test_voteFailsIfProposalStatusIsNotActive() public {
//         createProposal("Proposal 1", Governance.Status.EXPIRED, 400_000);
//         createProposal("Proposal 2", Governance.Status.PENDING, 100_000);
//         createProposal("Proposal 3", Governance.Status.SUCCEEDED, 500_000);
//         createProposal("Proposal 4", Governance.Status.DEFEATED, 200_000);
//         createProposal("Proposal 5", Governance.Status.SUCCEEDED, 600_000);
//         switchSigner(owner);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalInactive.selector)
//         );
//         governance.vote(0, 0);

//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalInactive.selector)
//         );
//         governance.vote(1, 0);

//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalInactive.selector)
//         );
//         governance.vote(2, 0);

//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalInactive.selector)
//         );
//         governance.vote(3, 0);

//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalInactive.selector)
//         );
//         governance.vote(4, 0);
//     }

//     function test_voteEmitEvent() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         switchSigner(owner);
//         stakeForVotingPower(1000e18);
//         vm.expectEmit(true, true, true, true);
//         emit Event.Voted(owner, 0, 0);
//         governance.vote(0, 0);
//     }

//     function test_delegateVote() public {
//         stakeForVotingPower(A);
//         stakeForVotingPower(B);
//         stakeForVotingPower(C);

//         switchSigner(owner);
//         stakeForVotingPower(1000e18);
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);

//         governance.delegateVote(A, 0);

//         switchSigner(B);
//         governance.delegateVote(A, 0);

//         switchSigner(C);
//         governance.delegateVote(A, 0);

//         assertEq(governance.getVotingPower(owner), 1);
//         assertEq(governance.getDelegatedVotes(owner, 0), 0);
//         assertEq(governance.getVotingPower(A), 1);
//         assertEq(governance.getDelegatedVotes(A, 0), 3);
//     }

//     function test_delegateVoteFailsForProposalNotCreated() public {
//         switchSigner(owner);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalDoesNotExist.selector)
//         );
//         governance.delegateVote(A, 0);
//     }

//     function test_delegateVoteFailsIfDelegateIsMsgSender() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         stakeForVotingPower(1000e18);
//         vm.expectRevert("Cannot delegate to self");
//         governance.delegateVote(owner, 0);
//     }

//     function test_delegateVoteFailsIfUserHasNoVotingPower() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__NotEnoughVotingPower.selector)
//         );
//         governance.delegateVote(A, 0);
//     }

//     function test_delegateVoteFailsIfUserhasVotedForProposal() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         stakeForVotingPower(1000e18);
//         governance.vote(0, 0);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__AlreadyVoted.selector)
//         );
//         governance.delegateVote(A, 0);
//     }

//     function test_delegateVoteFailsIfDelegateDoesNotHaveTokenStaked() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         stakeForVotingPower(1000e18);
//         vm.expectRevert("Cannot delegate to non members");
//         governance.delegateVote(A, 0);
//     }

//     function test_delegateVoteFailsIfDelegateHasAlreadyVotedForProposal()
//         public
//     {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         stakeForVotingPower(1000e18);
//         stakeForVotingPower(A);
//         governance.vote(0, 1);

//         switchSigner(owner);
//         vm.expectRevert("Delegate has voted");
//         governance.delegateVote(A, 0);
//     }

//     function test_delegateVoteEmitEvent() public {
//         stakeForVotingPower(A);
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         stakeForVotingPower(1000e18);
//         vm.expectEmit(true, true, true, true);
//         emit Event.VoteDelegated(owner, A, 0, 1);
//         governance.delegateVote(A, 0);
//     }

//     function test_delegatedVotesCountsAsUserVote() public {
//         stakeForVotingPower(A);
//         stakeForVotingPower(B);
//         stakeForVotingPower(C);

//         switchSigner(owner);
//         stakeForVotingPower(1000e18);
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);

//         governance.delegateVote(A, 0);

//         switchSigner(B);
//         governance.delegateVote(A, 0);

//         switchSigner(C);
//         governance.delegateVote(A, 0);

//         switchSigner(A);
//         governance.vote(0, 0);

//         Governance.Proposal memory _proposal = governance.getProposal(0);
//         assertEq(_proposal.vote_count[0], 4);
//     }

//     function test_delegatedVotesIsAddedToNewDelegatedUser() public {
//         stakeForVotingPower(A);
//         stakeForVotingPower(B);
//         stakeForVotingPower(C);

//         switchSigner(owner);
//         stakeForVotingPower(1000e18);
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);

//         governance.delegateVote(A, 0);

//         switchSigner(B);
//         governance.delegateVote(A, 0);

//         switchSigner(A);
//         governance.delegateVote(C, 0);

//         assertEq(governance.getDelegatedVotes(C, 0), 3);
//     }

//     function test_updateProposalStatus() public {
//         // createProposal already switches the signer to owner
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         governance.updateProposalStatus(0, Governance.Status.SUCCEEDED);
//         Governance.Status _status = governance.getProposalStatus(0);
//         assertEq(uint8(_status), uint8(2));
//     }

//     function test_updateProposalStatusFailsIfCalledByNotOwner() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         switchSigner(A);
//         vm.expectRevert(
//             abi.encodeWithSelector(
//                 OwnableUpgradeable.OwnableUnauthorizedAccount.selector,
//                 A
//             )
//         );
//         governance.updateProposalStatus(0, Governance.Status.SUCCEEDED);
//     }

//     function test_updateProposalStatusFailsIfProposalDoesNotExist() public {
//         switchSigner(owner);
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalDoesNotExist.selector)
//         );
//         governance.updateProposalStatus(0, Governance.Status.SUCCEEDED);
//     }

//     function test_getTotalProposals() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 2", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 3", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 4", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 5", Governance.Status.ACTIVE, 400_000);
//         assertEq(governance.getTotalProposals(), 5);
//     }

//     function test_getAllProposals() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 2", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 3", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 4", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 5", Governance.Status.ACTIVE, 400_000);

//         Governance.Proposal[] memory _proposals = governance.getAllProposals();
//         assertEq(_proposals.length, 5);
//         assertEq(_proposals[0].title, "Proposal 1");
//         assertEq(_proposals[1].title, "Proposal 2");
//         assertEq(_proposals[2].title, "Proposal 3");
//         assertEq(_proposals[3].title, "Proposal 4");
//         assertEq(_proposals[4].title, "Proposal 5");
//     }

//     function test_getProposal() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         Governance.Proposal memory _proposal = governance.getProposal(0);
//         assertEq(_proposal.title, "Proposal 1");
//     }

//     function test_getProposalFailsIfProposalDoesNotExist() public {
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalDoesNotExist.selector)
//         );
//         governance.getProposal(0);
//     }

//     function test_getVotingPower() public {
//         stakeForVotingPower(1000e18);
//         assertEq(governance.getVotingPower(owner), 1);
//         assertEq(governance.getVotingPower(A), 0);
//     }

//     function test_getProposalLimit() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 2", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 3", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 4", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 5", Governance.Status.ACTIVE, 400_000);

//         Governance.Proposal[] memory _proposals = governance.getProposalLimit(
//             1,
//             3
//         );
//         assertEq(_proposals.length, 3);
//         assertEq(_proposals[0].title, "Proposal 2");
//         assertEq(_proposals[1].title, "Proposal 3");
//         assertEq(_proposals[2].title, "Proposal 4");
//     }

//     function test_getProposalLimitFailsIfIndexOutOfBounds() public {
//         createProposal("Proposal 1", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 2", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 3", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 4", Governance.Status.ACTIVE, 400_000);
//         createProposal("Proposal 5", Governance.Status.ACTIVE, 400_000);

//         vm.expectRevert("Index out of bounds");
//         governance.getProposalLimit(3, 3);
//     }

//     function test_getProposalStatusFailsIfProposalDoesNotExist() public {
//         vm.expectRevert(
//             abi.encodeWithSelector(Governance__ProposalDoesNotExist.selector)
//         );
//         governance.getProposalStatus(0);
//     }

//     // Test the upgradeability of the MyToken contract
//     // function testUpgradeability() public {
//     //     // Upgrade the proxy to a new version; MyTokenV2
//     //     Upgrades.upgradeProxy(address(proxy), "MyTokenV2.sol:MyTokenV2", "", owner);
//     // }

//     function stakeForVotingPower(uint256 _amount) public {
//         peerToken.approve(address(governance), _amount);
//         governance.stakeForVotingPower();
//     }

//     function stakeForVotingPower(address _user) public {
//         switchSigner(_user);
//         stakeForVotingPower(1000e18);
//     }

//     function createProposal(
//         string memory _title,
//         Governance.Status _status,
//         uint256 _deadline
//     ) public {
//         switchSigner(owner);
//         string[] memory _options = new string[](3);
//         _options[0] = "opt1";
//         _options[1] = "opt2";
//         _options[2] = "opt3";
//         governance.createProposal(_title, _options, _status, _deadline);
//     }

//     function switchSigner(address _newSigner) public {
//         address foundrySigner = 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38;
//         if (msg.sender == foundrySigner) {
//             vm.startPrank(_newSigner);
//         } else {
//             vm.stopPrank();
//             vm.startPrank(_newSigner);
//         }
//     }

//     function mkaddr(string memory name) public returns (address) {
//         address addr = address(
//             uint160(uint256(keccak256(abi.encodePacked(name))))
//         );
//         vm.label(addr, name);
//         return addr;
//     }
// }
