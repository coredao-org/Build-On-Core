import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const Apikey = () => {
    const [apiKey, setApiKey] = useState('');
    const [isApiKeyGenerated, setIsApiKeyGenerated] = useState(false);

    const generateApiKey = () => {
        const newApiKey =
            Math.random().toString(32).substr(2, 16) +
            Math.random().toString(32).substr(2, 16) +
            Math.random().toString(32).substr(2, 16);
        setApiKey(newApiKey);
        setIsApiKeyGenerated(true);
    };

    return (
        <main>
            <Navbar />
            <div className='flex flex-col items-center bg-bgimg bg-cover bg-fixed bg-center bg-no-repeat h-full w-full'>
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
        </main>
    );
};

export default Apikey;