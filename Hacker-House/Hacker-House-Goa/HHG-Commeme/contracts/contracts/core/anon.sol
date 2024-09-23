// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";
import "@anon-aadhaar/contracts/interfaces/IAnonAadhaarGroth16Verifier.sol";

contract AnonAadhaarReward {
    address public verifier;
    uint256 public rewardAmount; 
    uint256 public immutable storedPublicKeyHash;
    address[] public totalUsers;
    mapping(address => bool) public isUserVerified;

    event ProofVerified(address user, bool result);

    constructor(address _verifierAddr, uint256 _rewardAmount, uint256 _pubkeyHash) {
        verifier = _verifierAddr;
        storedPublicKeyHash = _pubkeyHash;
        rewardAmount = _rewardAmount;
    }

    /// @dev Register a user's verification and transfer a reward.
    /// @param nullifierSeed: Nullifier Seed used while generating the proof.
    /// @param nullifier: Nullifier for the user's Aadhaar data.
    /// @param timestamp: Timestamp of when the QR code was signed.
    /// @param signal: Signal used while generating the proof, should be equal to msg.sender.
    /// @param revealArray: Array of the values used as input for the proof generation.
    /// @param groth16Proof: SNARK Groth16 proof.
    function verifyAnonAadhaarProof(
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] calldata revealArray,
        uint[8] calldata groth16Proof,
        address sender
    ) public returns (bool) {
        if(isUserVerified[sender]) revert("UAE"); // UAE - User Already Exists
        uint signalHash = _hash(signal);
        bool result = IAnonAadhaarGroth16Verifier(verifier).verifyProof(
                [groth16Proof[0], groth16Proof[1]],
                [
                    [groth16Proof[2], groth16Proof[3]],
                    [groth16Proof[4], groth16Proof[5]]
                ],
                [groth16Proof[6], groth16Proof[7]],
                [
                    storedPublicKeyHash,
                    nullifier,
                    timestamp,
                    // revealAgeAbove18
                    revealArray[0],
                    // revealGender
                    revealArray[1],
                    // revealPincode
                    revealArray[2],
                    // revealState
                    revealArray[3],
                    nullifierSeed,
                    signalHash
                ]
            );
        if(!result) revert("PNV,VNS"); // PNV,VNS - Proof Not Valid, Verification Not Successful
        totalUsers.push(sender);
        isUserVerified[sender] = true;
        return result;
    }

    function _hash(uint256 message) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(message))) >> 3;
    }

    function retrieveUsers() view public returns(address[] memory) {
        return totalUsers;
    }
}
