import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import QRCode from "react-qr-code";

const PaymentPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyGenerated, setIsApiKeyGenerated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setWalletAddress(inputValue);
    setModalOpen(true);
  };

  const generateApiKey = () => {
    const newApiKey = Math.random().toString(32).substr(2, 16)+Math.random().toString(32).substr(2, 16)+Math.random().toString(32).substr(2, 16);
    setApiKey(newApiKey);
    setIsApiKeyGenerated(true);
  };

  return (
    <main>
      <Navbar />
      <div className="bg-bgimg bg-cover bg-fixed bg-center bg-no-repeat h-full w-full">
        <div className='flex flex-col justify-center items-center min-h-screen'>
          <h1 className='text-4xl font-semibold text-black p-5'>Follow the steps to test the payment on CORE</h1>
            <div className='text-'>
              <li>Type the wallet address</li>
              <li>Scan the QR from your Metamask wallet</li>
              <li>Pay using tCORE</li>
            </div>
          
          <form onSubmit={handleSubmit} className='p-10 mb-4'>
            <input
              type='text'
              placeholder='Enter wallet address'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className='h-14 w-80 px-4 py-2 border text-black border-gray-300 rounded-lg text-xl'
            />
            <button
              type='submit'
              className='h-14 w-40 bg-black text-white text-xl rounded-lg ml-4'
            >
              Pay Now
            </button>
          </form>
          <a href="https://scan.test.btcs.network/faucet" target='_blank'>Click to get tCORE faucet</a>
          
          
          <div className='mt-10 flex flex-col items-center'>
            <h2 className='text-xl font-bold text-black mb-4'>Generate API Key for Corosuke SDK</h2>
            <button
              onClick={generateApiKey}
              className='h-14 w-60 bg-black text-white text-xl rounded-lg'
              disabled={isApiKeyGenerated}
            >
              {isApiKeyGenerated ? 'API Key Generated' : 'Generate API Key'}
            </button>
            {isApiKeyGenerated && (
              <div className='mt-4'>
                <p className='text-black'>Your API Key:</p>
                <p className='text-black font-mono break-all'>{apiKey}</p>
              </div>
            )}
          </div>

          {/* Modal */}
          {modalOpen && (
            <div className='fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50'>
              <div className='bg-white p-8 rounded-lg relative'>
                <button
                  className='absolute top-2 right-2 text-xl font-bold'
                  onClick={() => setModalOpen(false)}
                >
                  &times;
                </button>
                <h2 className='text-xl text-black font-bold mb-4'>Scan QR from Metamask</h2>
                <QRCode value={walletAddress} size={256} />
                <p className='text-black mt-4 text-center'>{walletAddress}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
