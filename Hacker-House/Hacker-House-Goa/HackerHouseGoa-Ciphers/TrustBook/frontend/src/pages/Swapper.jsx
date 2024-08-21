import React, { useState, useEffect } from "react";
import { useMetaMaskStore, useGarden, useSignStore } from "../lib/store";
import { Assets } from "@gardenfi/orderbook";

const Swapper = () => {
  const [amount, setAmount] = useState({
    btcAmount: "",
    wbtcAmount: "",
  });
  const [btcAddress, setBtcAddress] = useState("");

  const { garden, bitcoin } = useGarden();
  const { metaMaskIsConnected, connectMetaMask } = useMetaMaskStore();
  const { isSigned } = useSignStore();

  useEffect(() => {
    const getAddress = async () => {
      if (bitcoin && isSigned) {
        const address = await bitcoin.getAddress();
        setBtcAddress(address);
      }
    };
    getAddress();
  }, [bitcoin, isSigned]);

  const handleAmountChange = (type, value) => {
    setAmount((prev) => ({
      ...prev,
      [type]: value,
      [type === "btcAmount" ? "wbtcAmount" : "btcAmount"]: (
        Number(value) * (type === "btcAmount" ? 1.003 : 0.997)
      ).toFixed(8),
    }));
  };

  const handleSwap = async () => {
    console.log("Swap initiated. Garden object:", garden);

    if (!garden) {
      console.error(
        "Garden object is not available. Make sure it's properly initialized."
      );
      return;
    }

    if (!amount.wbtcAmount || !amount.btcAmount) {
      console.error("Amount values are missing.");
      return;
    }

    const sendAmount = Number(amount.wbtcAmount) * 1e8;
    const receiveAmount = Number(amount.btcAmount) * 1e8;

    try {
      console.log("Attempting swap with amounts:", {
        sendAmount,
        receiveAmount,
      });
      await garden.swap(
        Assets.ethereum_sepolia.WBTC,
        Assets.bitcoin_testnet.BTC,
        sendAmount,
        receiveAmount
      );
      console.log("Swap successful");
      setAmount({ btcAmount: "", wbtcAmount: "" });
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#14162E] w-screen ml-[15vw] flex justify-center items-center p-14">
      <div className="bg-[#1A1C34] rounded-lg p-8 w-[40vw] max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Swap BTC to WBTC</h1>

        <div className="mb-6">
          <label htmlFor="wbtc-amount" className="block text-white mb-2">
            WBTC Amount
          </label>
          <input
            id="wbtc-amount"
            type="number"
            placeholder="Enter WBTC amount"
            value={amount.wbtcAmount}
            onChange={(e) => handleAmountChange("wbtcAmount", e.target.value)}
            className="w-full p-3 rounded bg-[#14162E] text-white border border-gray-700"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="btc-amount" className="block text-white mb-2">
            BTC Amount (Estimated)
          </label>
          <input
            id="btc-amount"
            type="number"
            placeholder="Estimated BTC amount"
            value={amount.btcAmount}
            onChange={(e) => handleAmountChange("btcAmount", e.target.value)}
            className="w-full p-3 rounded bg-[#14162E] text-white border border-gray-700"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="receive-address" className="block text-white mb-2">
            Receive Address
          </label>
          <input
            id="receive-address"
            placeholder="Enter BTC Address"
            value={btcAddress}
            onChange={(e) => setBtcAddress(e.target.value)}
            className="w-full p-3 rounded bg-[#14162E] text-white border border-gray-700"
          />
        </div>

        {!metaMaskIsConnected ? (
          <button
            onClick={connectMetaMask}
            className="w-full p-3 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-300"
          >
            Connect MetaMask
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={!amount.wbtcAmount || !amount.btcAmount}
            className="w-full p-3 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Swap
          </button>
        )}
      </div>
    </div>
  );
};

export default Swapper;
