"use client"
import { useReadContract } from "thirdweb/react";
import { useState, useEffect } from 'react';
import {contract} from "./contract"

export default function Component() {
  const { data: proposalsData, isLoading } = useReadContract({
    contract,
    method: "function getAllProposals() view returns ((uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)[] allProposals)",
    params: [],
  });

  const [proposals, setProposals] = useState([]);

  useEffect(() =>  {
    if (proposalsData) {
      setProposals(proposalsData);
    }
  }, [proposalsData]);

  console.log(proposals)
  // Assuming you want to display the proposals:
  return (
    <div>
      {isLoading ? (
        <p>Loading proposals...</p>
      ) : (
        <ul>
          {proposals.map((proposal, index) => (
            <li key={index}>
              {/* Display proposal details here */}
              <p>Proposal ID: {proposal.description}</p>
              {/* ...other proposal details */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
