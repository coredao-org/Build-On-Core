import { useState } from "react";
import axios from "axios";
import { isSupportedChain } from "../utility";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
// import { getProvider } from "../constants/providers";
import { CircularProgress, Container, Typography, Button } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import { getProvider } from "../constants/providers";
// import { getProtocolContract } from "../constants/contract";
import useLocalStorage from "../Hooks/useLocalStorage";

const GitCoinVerification = () => {
  const { chainId, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [storedValue, setValue] = useLocalStorage("passportScore", "");


  const headers = import.meta.env.VITE_PUBLIC_GC_API
    ? {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_PUBLIC_GC_API,
    }
    : undefined;

  const handleAction = async () => {
    // if (!isSupportedChain(chainId)) {
    //   setError("Unsupported network");
    //   return;
    // }

    try {
      await submitStampAndCheckPassport(address);
    } catch (error) {
      setError('An error occurred, please try again.');
      console.error('Submission error:', error);
    }
    setLoading(false);
  };

  const submitStampAndCheckPassport = async () => {
    if (walletProvider) {
      setError("wallet provider not initialized");
      setLoading(false)
    }
    const { message, nonce } = await getSigningMessage();

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const signature = await signer.signMessage(message);

    await axios.post(import.meta.env.VITE_SUBMIT_PASSPORT_URI, {
      address,
      scorer_id: import.meta.env.VITE_PUBLIC_GC_SCORER_ID,
      signature,
      nonce,
    }, { headers });

    // const contract = await getProtocolContract(signer);
    //   contract.//todo call the function and pass score tp

    console.log(import.meta.env.VITE_SUBMIT_PASSPORT_URI); // Ensure this logs a valid URL

    await checkPassport(address);
  };


  const getSigningMessage = async () => {
    const response = await axios.get(import.meta.env.VITE_SIGNING_MESSAGE_URI, { headers });
    console.log(import.meta.env.VITE_SIGNING_MESSAGE_URI); // Ensure this logs a valid URL

    return response.data;
  };


  const checkPassport = async () => {
    if (walletProvider) {
      setError("wallet provider not initialized");
      setLoading(false)
    }
    const response = await axios.get(`https://api.scorer.gitcoin.co/registry/score/${import.meta.env.VITE_PUBLIC_GC_SCORER_ID}/${address}`, { headers });
    console.log(response)
    const passportData = response.data;
    setScore(passportData.score ? Math.round(passportData.score * 100) / 100 : '');
    setValue(Math.round(passportData.score * 100) / 100);
  };

  return (
    <div>
      <button className="border border-bg-ash/50 text-white py-2 px-4 rounded-lg my-2 text-[16px]my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold  w-[60%] mx-auto text-center" onClick={handleAction} disabled={loading}>
        {loading ? 'Processing...' : 'Verify Score'}
      </button>
      {loading && <CircularProgress />}
      <p>Passport score: <span className="font-black text-[20px]">{score}</span></p>
    </div>
  );
};

export default GitCoinVerification;