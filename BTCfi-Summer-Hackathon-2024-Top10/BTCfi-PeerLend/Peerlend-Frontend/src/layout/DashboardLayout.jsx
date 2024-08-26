import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet, Navigate } from "react-router-dom"
import { LuLogIn } from "react-icons/lu";
import { useWalletInfo, useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import WalletConnected from '../utility/WalletConnected';

const DashboardLayout = () => {
    const { open } = useWeb3Modal()
    const { address, isConnected } = useWeb3ModalAccount()
    const { walletInfo } = useWalletInfo();


    // if (user === undefined) {
    //     return <div>Loading...</div>; // Add a loading spinner or component here if desired
    // }

    // if (!isConnected || !user) {
    //     return <Navigate to="/verifymail" />;
    // }

    return (
        <div>
            <div className="flex justify-between lg:items-center md:items-center">
                <Sidebar />
                <div className="w-[100%] lg:w-[79%] md:w-[79%] h-[100vh] overflow-y-scroll p-8 flex flex-col">
                    <button onClick={() => open()} className="bg-[#E0BB83] rounded-lg text-[#2a2a2a] font-[700] font-playfair font-barlow px-4 py-2 flex justify-center items-center gap-1 hover:bg-[#121212] hover:text-white ml-auto">
                        {
                            isConnected ? <WalletConnected address={address} icon={walletInfo?.icon} /> : <>
                                <span>Connect Wallet</span>
                                <LuLogIn className="text-lg hidden md:flex" />
                            </>
                        }
                    </button>
                    <Outlet />
                </div>
            </div>
        </div>)
    //   )}
}

export default DashboardLayout