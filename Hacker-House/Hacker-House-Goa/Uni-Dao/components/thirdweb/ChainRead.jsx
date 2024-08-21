import { useState, useEffect } from "react";
import { readContract } from "thirdweb";

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const data = await readContract({ 
          contract, 
          method: "function getAllProposals() view returns ((uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)[] allProposals)", 
          params: [] 
        });

        setProposals(data);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, []); // Empty dependency array means this effect runs once after initial render

  if (loading) {
    return <p>Loading proposals...</p>;
  }

  return (
    <div>
      <h1>Proposals</h1>
      {proposals.length > 0 ? (
        proposals.map((proposal, index) => (
          <div key={index}>
            <h2>Proposal {index + 1}</h2>
            <p><strong>Proposal ID:</strong> {proposal.poposalId}</p>
            <p><strong>Proposer:</strong> {proposal.proposer}</p>
            <p><strong>Description:</strong> {proposal.description}</p>
            <p><strong>Start Block:</strong> {proposal.startBlock}</p>
            <p><strong>End Block:</strong> {proposal.endBlock}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>No proposals found.</p>
      )}
    </div>
  );
}
