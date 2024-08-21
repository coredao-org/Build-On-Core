//@ts-nocheck
"use client"
import React, { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import Wallet from '@/components/thirdweb/Wallet'

// import Purpose from '@/components/thirdweb/propose'
import GetPurpose from "@/components/thirdweb/getProposal"

export default function PurposeList() {
  const [wallets, setWallets] = useState(null);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      const walletData = await getWalletInfo("io.metamask");
      setWallets(walletData.image_id)
    };

    fetchWalletInfo();
  }, []);

  const address = useActiveAccount();

  console.log("so it is not what I am expecting still my hopes are up since I got no hoes", address?.address);


  return (
    <div>
      <GetPurpose wallets={wallets} />
      <Wallet/>
    </div>
  );
}

