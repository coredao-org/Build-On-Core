//@ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { getWalletInfo } from "thirdweb/wallets";
import { Button } from "../ui/button";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import Wallet from "../thirdweb/Wallet";

export function AnimatedModalDemo() {
  const [wallets, setWallets] = useState(null);
  // const router = useRouter(); // Initialize the useRouter hook

  useEffect(() => {
    const fetchWalletInfo = async () => {
      const walletData = await getWalletInfo("io.metamask");
      setWallets(walletData.image_id);
    };

    fetchWalletInfo();
  }, []);

  // useEffect(() => {
  //   if (wallets != null) {
  //     router.push("/cuims");
  //      // Redirect to /dashboard when wallets is not null
  //      console.log(wallets)
  //   }
  // }, [wallets, router]);

  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="pt-8 flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Enroll now!
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            ✈️
          </div>
        </ModalTrigger>
        <ModalBody className="w-full flex item-center items-center bg-red-400">
          <ModalContent className="space-y-5 mt-20">
            <p className="text-3xl font-semibold">Connect Your Wallet</p>
            <Wallet />
            <div className="w-full flex justify-center gap-4" >
               <Button><Link href={"./cuims"}>Uims</Link></Button> 
               <Button><Link href={"./lms/vrLms"}>Lms</Link></Button> 
            </div>

          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  );
}
