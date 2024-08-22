"use client"
import React, { useState } from 'react';
import { prepareContractCall } from 'thirdweb';
import { useSendTransaction } from 'thirdweb/react';
import {contract} from './contract'

export default function Component() {
  const [newProposalThreshold, setNewProposalThreshold] = useState('');
  const { mutate: sendTransaction } = useSendTransaction();

  const handleChange = (e) => {
    setNewProposalThreshold(e.target.value);
  };

  const onClick = async () => {
    try {
      const transaction = prepareContractCall({
        contract, 
        method: 'setProposalThreshold(uint256)',
        params: [newProposalThreshold]
      });

      await sendTransaction(transaction);
      alert('Transaction sent successfully');
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Failed to send transaction');
    }
  };

  return (
    <div>
      <input
        type="number"
        value={newProposalThreshold}
        onChange={handleChange}
        placeholder="Enter new proposal threshold"
        className='text-black'
      />
      <button onClick={onClick}>Submit</button>
    </div>
  );
}
