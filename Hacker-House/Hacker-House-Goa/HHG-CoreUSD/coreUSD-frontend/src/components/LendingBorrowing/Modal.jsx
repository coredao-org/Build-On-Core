/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { LoadingButton } from "../ui/LoadingButton";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAccount } from "wagmi";
import { config } from "../../lib/utils";
import { getBalance, readContract, writeContract } from "@wagmi/core";
import protocolAbi from "../../contracts/protocol.json";
import { formatEther, parseEther } from "viem";

const protocol_address = "0x1Ea2e5647DBdE465d31c4a2092c10Db97c9a0C84";

const Modal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("stake");
  const [amount, setAmount] = useState(0);
  const [depositBalance, setDepositBalance] = useState(0);
  const [withdrawBalance, setWithdrawBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const core_balance = async () => {
    const result = await getBalance(config, {
      address,
    });

    const depositValue = parseFloat(result?.formatted);

    setDepositBalance(depositValue);

    const result2 = await readContract(config, {
      abi: protocolAbi,
      address: protocol_address,
      functionName: "collateralDeposited",
      args: [address],
    });

    const withdrawValue = parseFloat(formatEther(result2));

    setWithdrawBalance(withdrawValue);
  };

  useEffect(() => {
    core_balance();
  }, [isLoading, isOpen, activeTab]);

  const handleDeposit = async () => {
    try {
      setIsLoading(true);
      await writeContract(config, {
        abi: protocolAbi,
        address: protocol_address,
        functionName: "deposiCollateral",
        args: [],
        value: parseEther(amount),
      });
      toast.success(`Deposit was successfull!`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(`Deposit failed: ${error.message}`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      await writeContract(config, {
        abi: protocolAbi,
        address: protocol_address,
        functionName: "redeemCollateral",
        args: [parseEther(amount)],
      });
      toast.success(`Withdraw was successfull!`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(`Withdraw failed: ${error.message}`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-full w-full fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
      <ToastContainer />
      <div className="bg-site-black rounded-lg w-[30%]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Manage Collateral</h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-around mb-4 w-full h-full">
            <button
              onClick={() => setActiveTab("stake")}
              className={`px-4 py-2 rounded w-full ${
                activeTab === "stake"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-white"
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab("unstake")}
              className={`px-4 py-2 rounded w-full ${
                activeTab === "unstake"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-white"
              }`}
            >
              Withdraw
            </button>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="number"
              placeholder="Amount"
              className="w-full px-4 py-2 border rounded bg-transparent"
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="ml-2 px-4 py-2 bg-purple-600 rounded">
              Max
            </button>
          </div>
          <div className="flex justify-between mb-4">
            <p>
              {activeTab === "stake"
                ? `Balance: ${depositBalance.toFixed(3) || "0.00"}`
                : `Balance: ${withdrawBalance.toFixed(3) || "0.00"}`}
            </p>
          </div>
        </div>
        <div className="flex justify-center p-4">
          {isLoading ? (
            <LoadingButton disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </LoadingButton>
          ) : activeTab === "stake" ? (
            <button
              className="px-4 py-2 w-36 h-10 font-semibold bg-purple-600 text-white rounded-lg"
              onClick={handleDeposit}
            >
              Deposit
            </button>
          ) : activeTab === "unstake" ? (
            <button
              className="px-4 py-2 w-36 h-10 font-semibold bg-purple-600 text-white rounded-lg"
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Modal;
