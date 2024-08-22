//@ts-nocheck
"use client"
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { getWalletInfo } from "thirdweb/wallets";
import React, { useEffect, useState } from 'react';
import { defineChain } from "thirdweb";


const chain = defineChain(1115)

const client = createThirdwebClient({
  clientId: "4f4d7aad88cd12953957137f0f7c0081",
  chains: [chain], // Ensure the custom chain is recognized by the client
});


// const [wallets, setWallets] = useState(null);

// useEffect(() => {
//   const fetchWalletInfo = async () => {
//     const walletData = await getWalletInfo('io.metamask')
//     setWallets(walletData.image_id)
//   }
//   fetchWalletInfo();
//   }, []);


//   console.log(wallets);




export default function Wallet() {
  return (
    <div>
      <ConnectButton client={client} chain={chain} />
    </div>
  );
}
