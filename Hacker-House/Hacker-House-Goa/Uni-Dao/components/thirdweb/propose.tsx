//@ts-nocheck
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import {contract} from "./contract"

export default function ProposalComponent() {
  const { mutate: sendTransaction, isLoading, error } = useSendTransaction();

  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      const transaction = await prepareContractCall({ 
        contract,
        method: "function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) returns (uint256 proposalId)", 
        params: [["0xf9a38EDE9fd7Cb22B5c89Db79c1ef093b1453Cf0"], [0], ["0x"], description] 
        
      });
      sendTransaction(transaction);
      
    } catch (err) {
      console.error("Error preparing transaction:", err);
    }
  };

  return (
    <div className="flex flex-col gap-3 ">
      <h2 className="mx-auto text-white/70">Create a Proposal</h2>
      
      <input
        type="text"
        placeholder="Enter description"
        onChange={(e) => setDescription(e.target.value)}
        className="text-gray-600 px-4 py-2 border border-white/30 bg-transparent w-[80%] focus:border-none "
      />
      <button onClick={handleSubmit} disabled={isLoading} className="bg-white/20 rounded-md">
        {isLoading ? "Submitting..." : "Submit Proposal"}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
