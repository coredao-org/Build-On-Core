import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletInfo, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useCheckIsVerified } from "../../Hooks/useCheckIsVerified";
import { toast } from 'react-toastify'
import axios from 'axios'
import bgAuth from '../../assets/authBg.jpeg'

import { getProvider } from "../../constants/providers";
import { getProtocolContract } from "../../constants/contract";

const VerifyMail = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState(0);
    const [otpMail, setOtpMail] = useState('');
    const [error, setError] = useState('');
    const { open } = useWeb3Modal()
    const { address, isConnected } = useWeb3ModalAccount()
    const { walletInfo } = useWalletInfo()
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(true)

    const { walletProvider } = useWeb3ModalProvider();

    const user = useCheckIsVerified(address);

    if (user) navigate('/dashboard')

    const headers = {
        'Content-Type': 'application/json',
    };

    const handleAction = async () => {
        if (!email) {
            setError("Email is required.");
            return;
        }
        setShowOtpForm(true)
        setShowEmailForm(false)

        try {
            await sendOtpRequest(email);

        } catch (error) {
            setError('An error occurred, please try again.');
            toast.error('Submission error:', error);
        }
    };

    const sendOtpRequest = async (email) => {
        const toastId = toast.loading('Sending OTP...', { autoClose: false, position: 'top-center' });

        try {
            const res = await axios.post(`${import.meta.env.VITE_EMAIL_SERVICE}/api/v1/sendOtp`, { email }, { headers });

            if (res.status === 201) {
                toast.update(toastId, { render: 'OTP sent successfully.', type: 'success', position: 'top-center', autoClose: 5000, isLoading: false });
                setError('OTP sent successfully.');
            }
        } catch (error) {
            toast.update(toastId, { render: 'Failed to send OTP. Please try again.', type: 'error', position: 'top-center', autoClose: 5000, isLoading: false });
            setError('Failed to send OTP. Please try again.');
            toast.error('Error sending OTP:', error);
        }
    };

    const verifyOtp = async () => {
        // if (!isSupportedChain(chainId)) return console.error("Wrong network");
        // if (!isAddress(address)) return console.error("Invalid address");
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProtocolContract(signer);

        if (!otpCode) {
            setError("OTP is required.");
            return;
        }

        const toastId = toast.loading('Verifying OTP...', { autoClose: false, position: 'top-center' });

        try {
            // Replace this URL with the actual verification endpoint
            const res = await axios.post(`${import.meta.env.VITE_EMAIL_SERVICE}/api/v1/verifyMail`, { email, otp: otpCode }, { headers });


            if (res.status === 200) {
                toast.update(toastId, { render: 'OTP verified successfully.', type: 'success', position: 'top-center', autoClose: 5000, isLoading: false });
                const tx = await contract.updateEmail(address, email, true)
                const receipt = await tx.wait()
                setError('OTP verified successfully.')
            } else {
                toast.update(toastId, { render: res.data?.message, type: 'error', position: 'top-center', autoClose: 5000, isLoading: false });
                throw new Error('Failed to verify OTP. Please try again.');
            }

            console.log(res); // Log the response from the backend (if any

            if (res.status === 200) {
                setError('User verified successfully.');
                toast.update(toastId, { render: 'User verified successfully.', type: 'success', position: 'top-center', autoClose: 5000, isLoading: false });
                navigate('/dashboard');
            } else {
                setError('Failed to verify user. Please try again.');
                throw new Error('Failed to verify user. Please try again.');
            }
        } catch (error) {
            toast.update(toastId, { render: error, type: 'error', position: 'top-center', autoClose: 5000, isLoading: false });
            setError('Failed to verify OTP. Please try again.');
            console.error('Error verifying OTP:', error);
        } finally {
            setError('');
            setOtpCode('');
            setEmail('');
        }
    };

    return (
        <main style={{ backgroundImage: `url(${bgAuth})` }} className="w-[100%] h-[100vh] bg-cover bg-center bg-[#2a2a2a] bg-blend-overlay flex justify-center items-center flex-col">
            <h3 className='lg:text-[30px] md:text-[30px] text-[20px] font-playfair font-[700] mb-10 text-[#E0BB83]'>Verify Your Email</h3>
            {showEmailForm && (<div className="lg:w-[40%] md:w-[40%] w-[90%] mx-auto p-8 bg-[#2a2a2a]/40 rounded-2xl border border-[#E0BB83]/40">
                <input
                    type="text"
                    placeholder='email'
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-[100%] p-4 bg-[#ffffff]/10 backdrop-blur-lg mb-4 outline-none rounded-md"
                />
                <button
                    className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[100%] mx-auto text-center lg:text-[18px] md:text-[18px] text-[16px] font-bold rounded-lg"
                    onClick={handleAction}
                >
                    Verify &rarr;
                </button>
            </div>)}
            {(showOtpForm && <div>
                <input
                    type="text"
                    placeholder='Email'
                    value={otpMail}
                    onChange={(e) => setOtpMail(e.target.value)}
                    className="w-[100%] p-4 bg-[#ffffff]/10 backdrop-blur-lg mb-4 outline-none rounded-md"

                />
                <input
                    type="text"
                    placeholder='OTP'
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-[100%] p-4 bg-[#ffffff]/10 backdrop-blur-lg mb-4 outline-none rounded-md"

                />
                <button
                    className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[100%] mx-auto text-center lg:text-[18px] md:text-[18px] text-[16px] font-bold rounded-lg"
                    onClick={verifyOtp}
                >
                    Verify OTP
                </button>
            </div>)}
        </main>
    )
}

export default VerifyMail