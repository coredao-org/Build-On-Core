import logo from '../assets/logo.svg'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react'
import { LuLogIn } from "react-icons/lu";
import { useWalletInfo, useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Sling as Hamburger } from 'hamburger-react'
import WalletConnected from '../utility/WalletConnected'
import { useCheckIsVerified } from '../Hooks/useCheckIsVerified'

const Header = () => {
    const [isOpen, setOpen] = useState(false)
    const { open } = useWeb3Modal()
    const { address, isConnected } = useWeb3ModalAccount()
    const { walletInfo } = useWalletInfo()
    const navigate = useNavigate()
    const user = useCheckIsVerified(address)

    const change = useCallback(async () => {
        console.log(user)
        if (isConnected && !user) {
            navigate("/verifymail");
        } else if (isConnected) {
            navigate("/dashboard");
        } else {
            navigate('/')
        }
    }, [isConnected, navigate]);

    useEffect(() => {
        change();
    }, [change, isConnected]);

    return (
        <header className='py-8 sticky top-0 w-[100%] font-playfair font-[400] lg:text-[18px] md:text-[18px] text-[16px] bg-[#2a2a2a] z-50'>
            <div className='w-[90%] mx-auto hidden lg:flex md:flex items-center justify-between'>
                <p className='text-[18px] flex items-center'><img src={logo} alt="" className='w-[40px] h-[40px] ' />
                    PeerLend</p>
                <div className='flex items-center justify-between'>
                    <NavLink to='#about' className='mr-12'>About Us</NavLink>
                    <NavLink className='mr-12'>Contact</NavLink>
                    <NavLink>Blog</NavLink>
                </div>
                {/* <button className='bg-[#E0BB83] py-2 px-6 rounded-lg text-[#2a2a2a] font-[700] font-playfair'>Connect Wallet</button> */}
                <button onClick={() => open()} className="bg-[#E0BB83] rounded-lg text-[#2a2a2a] font-[700] font-playfair font-barlow px-4 py-2 flex justify-center items-center gap-1 hover:bg-[#121212] hover:text-white">
                    {
                        isConnected ? <WalletConnected address={address} icon={walletInfo?.icon} /> : <>
                            <span>Connect Wallet</span>
                            <LuLogIn className="text-lg hidden md:flex" />
                        </>
                    }
                </button>
            </div>
            <nav className='lg:hidden md:hidden flex justify-between w-[90%] mx-auto'>
                <p className='text-[18px] flex items-center'><img src={logo} alt="" className='w-[40px] h-[40px] ' />
                    PeerLend</p>
                <Hamburger toggled={isOpen} toggle={setOpen} />
                {isOpen && (
                    <div className='flex flex-col absolute bg-[#2a2a2a] w-[90%] text-center top-full mt-2 z-50 px-6 py-10'>
                        <NavLink to='#about' className='mb-8'>About Us</NavLink>
                        <NavLink className='mb-8'>Contact</NavLink>
                        <NavLink className='mb-8'>Blog</NavLink>
                        <button onClick={() => open()} className="bg-[#E0BB83] text-[16px] rounded-lg text-[#2a2a2a] font-[700] font-playfair font-barlow px-4 py-2 flex justify-center items-center gap-1 hover:bg-[#121212] hover:text-white">
                            {
                                isConnected ? <WalletConnected address={address} icon={walletInfo?.icon} /> : <>
                                    <span>Connect Wallet</span>
                                    <LuLogIn className="text-lg hidden md:flex" />
                                </>
                            }
                        </button>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Header