import Header from "../components/Header"
import { Outlet, Navigate } from 'react-router-dom'
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

const VerifyLayout = () => {
    const { address, isConnected } = useWeb3ModalAccount()
   
    return  (
    <div>
        <Header />
        <Outlet />
    </div>
  )
}

export default VerifyLayout