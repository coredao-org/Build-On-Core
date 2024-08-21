import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  useProver
} from "@anon-aadhaar/react";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useChains, useWalletClient } from "wagmi";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { encodeFunctionData } from "viem";
import { CONSTANT_ADDRESSES, LEGACY_ABI } from "@/data/addresses-data";
import { toast } from "sonner";
import { SupportChainId } from "@/hooks/use-query-commemes";
import { TransactionToast } from "./ui/transaction-toast";

export default function Anon() {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();
  const nullifierSeedString = "19566981402436238301701121519446139147227";
  const nullifierBigInt = BigInt(nullifierSeedString);

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

  const chains = useChains();
  const [selectedChain, setSelectedChain] = useState(1116);
  const chainsIds = chains.map((chain) => chain.id);
  const { data: wallet } = useWalletClient();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <Label className="text-2xl font-semibold text-gray-800 mb-4">
            UBI for Indian Citizens Powered by Commeme
          </Label>
          <p className="text-gray-600">
            Login with Aadhaar to receive UBI (Universal Basic Income)
          </p>
        </div>
        <div className="mt-6">
          <LogInWithAnonAadhaar nullifierSeed={nullifierBigInt} />
        </div>

        {anonAadhaar?.status === "logged-in" && latestProof && (
          <div className="mt-6 space-y-4">
            <p className="text-green-600 font-medium">✅ Proof is valid</p>

            <div className="space-y-2">
              <Label className="font-medium text-gray-700">
                Select Blockchain (It's gasless to receive)
              </Label>
              <RadioGroup
                className="space-y-2"
                defaultValue={selectedChain.toString()}
                onValueChange={(e) => setSelectedChain(parseFloat(e))}
              >
                <div className="flex items-center">
                  <RadioGroupItem value={`${chainsIds[0]}`} id="option-one" />
                  <Label
                    htmlFor="option-one"
                    className="ml-2 text-gray-700 font-medium"
                  >
                    CoreDao
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value={`${chainsIds[1]}`} id="option-two" />
                  <Label
                    htmlFor="option-two"
                    className="ml-2 text-gray-700 font-medium"
                  >
                    Polygon Mainnet
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
              onClick={async () => {
                if (!wallet) {
                  toast.error("Please connect your wallet");
                  throw new Error("Please connect your wallet");
                }
                const rawData = encodeFunctionData({
                  abi: LEGACY_ABI,
                  functionName: "getBack",
                  args: [wallet.account.address],
                });
                const addresses = CONSTANT_ADDRESSES[
                  selectedChain as SupportChainId
                ];
                console.log(rawData, "raw data");
                console.log(`${import.meta.env.VITE_RELAY}/transaction`);
                const res = await fetch(
                  `${import.meta.env.VITE_RELAY}/transaction`,
                  {
                    body: JSON.stringify({
                      to: addresses.legacyAddress,
                      data: rawData,
                      value: 0,
                      chainId: selectedChain,
                    }),
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                console.log({ res });
                const responseJson = (await res.json()) as unknown as {
                  hash: string;
                };
                toast.success(
                  <TransactionToast
                    hash={responseJson.hash}
                    title="UBI Received"
                    scanner={`${addresses.scanner}/tx/`}
                  />
                );
              }}
            >
              Receive
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
