import React, { useEffect } from "react";
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  useProver,
} from "@anon-aadhaar/react";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";

type HomeProps = {
  setUseTestAadhaar: (state: boolean) => void;
  useTestAadhaar: boolean;
};

const Home: React.FC<HomeProps> = ({ setUseTestAadhaar, useTestAadhaar }) => {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      console.log(anonAadhaar.status);
    }
  }, [anonAadhaar]);

  const switchAadhaar = () => {
    setUseTestAadhaar(!useTestAadhaar);
  };

  return (
    <>
      <div className="min-h-screen p-10">
        <h1 className="font-bold text-8xl text-center text-black">
          Start Your KYC
        </h1>
        <main className="flex flex-col items-center gap-5 rounded-2xl max-w-screen-sm mx-auto h-[24rem] md:h-[20rem] p-5 ">
          <p className="text-2xl">Connect to your wallet to continue.</p>
          <ConnectButton client={client} />
          <div className=" flex flex-col p-8 items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8isolate aspect-video w-96 bg-white/20 shadow-lg ring-1 ring-black/5">
            <p className="text-xl text-center">
              Prove your Identity anonymously using the QR code provided in your
              Aadhaar card.
            </p>
            <LogInWithAnonAadhaar nullifierSeed={123} useTestAadhaar={true} />
            {useTestAadhaar ? (
              <p>
                You&apos;re using the <strong>test</strong> Aadhaar mode
              </p>
            ) : (
              <p>
                You&apos;re using the <strong>real</strong> Aadhaar mode
              </p>
            )}
            <button
              onClick={switchAadhaar}
              type="button"
              className="border-solid border-2 border-black-500 rounded-xl bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Switch to {useTestAadhaar ? "real" : "test"} Aadhaar mode
            </button>
          </div><div className="text-2xl flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
          {anonAadhaar.status === "logged-in" && (
            <>
              <p>✅ Proof is valid</p>
              <p>Got your Aadhaar Identity Proof</p>
              <p>Welcome anon!</p>
              {latestProof && (
                <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
              )}
            </>
          )}
        </div>
        </main>
        
      </div>
    </>
  );
};

export default Home;
