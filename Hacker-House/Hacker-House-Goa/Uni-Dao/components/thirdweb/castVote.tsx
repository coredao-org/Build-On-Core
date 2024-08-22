// //@ts-nocheck
// "use client"
// // import { useState } from 'react';
// // import { prepareContractCall, sendTransaction } from 'thirdweb';

// // const VoteComponent = ({ contract, account }) => {
// //   const [proposalId, setProposalId] = useState('');
// //   const [support, setSupport] = useState(0); // 0 for against, 1 for for
// //   const [transactionHash, setTransactionHash] = useState(null);
// //   const [error, setError] = useState(null);

// //   const handleVote = async () => {
// //     try {
// //       const transaction = await prepareContractCall({
// //         contract,
// //         method: 'castVote',
// //         params: [parseInt(proposalId), support]
// //       });

// //       const { transactionHash } = await sendTransaction({
// //         transaction,
// //         account
// //       });

// //       setTransactionHash(transactionHash);
// //     } catch (err) {
// //       setError(err.message);
// //     }
// //   };

// //   return (
// //     <div className='text-black'>
// //       <h1>Cast Your Vote</h1>
// //       <input
// //         type="number"
// //         value={proposalId}
// //         onChange={(e) => setProposalId(e.target.value)}
// //         placeholder="Proposal ID"
// //       />
// //       <select value={support} onChange={(e) => setSupport(parseInt(e.target.value))}>
// //         <option value={0}>Against</option>
// //         <option value={1}>For</option>
// //       </select>
// //       <button className='bg-white' onClick={handleVote}>Submit Vote</button>
// //       {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
// //       {error && <p style={{ color: 'red' }}>Error: {error}</p>}
// //     </div>
// //   );
// // };

// // export default VoteComponent;

// import React, { useEffect } from "react";
// import { prepareContractCall } from "thirdweb"
// import { useSendTransaction } from "thirdweb/react";

// export default function Component() {
//   const { mutate: sendTransaction } = useSendTransaction();
//   const 

//   const onClick = () => {
//     const transaction = prepareContractCall({ 
//       contract, 
//       method: "function castVote(uint256 proposalId, uint8 support) returns (uint256)", 
//       params: ["426996757164316312483168757757880806022871369550470148065209894669458142719n", support] 
//     });
//     sendTransaction(transaction);
//   }

//   onClick();

//   useEffect(() => {

//   })

//   return (
//     <div>
        
//     </div>
//   )
  
// }



import React from 'react'

export default function castVote() {
  return (
    <div>castVote</div>
  )
}
