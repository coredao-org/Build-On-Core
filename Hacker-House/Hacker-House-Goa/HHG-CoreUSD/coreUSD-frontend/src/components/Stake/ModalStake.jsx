import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAccount } from "wagmi";
import { LoadingButton } from "../ui/LoadingButton";
import { ReloadIcon } from "@radix-ui/react-icons";
import vaultAbi from "../../contracts/vault.json";
import coreAbi from "../../contracts/core_usd.json";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "../../lib/utils";
import { formatEther, parseEther } from "viem";

const stCore_address = "0x5c1aFF8f2b3CAFdBbE26D4Bb488B15957d691dc2";
const stCore_Vault_address = "0xb2658e03FDF4107B5c409b8fac53d1ae779cB0b2";
const lstBTC_address = "0x3d26be19045c4ebf7f874c7f8057f8d0fd283a8a";
const lstBTC_Vault_address = "0xc4f2fa6eacf655a20f9cdc74063d2ee96fe6ea8b";

const ModalStake = ({ isOpen, onClose, id }) => {
  const [activeTab, setActiveTab] = useState("stake");
  const [amount, setAmount] = useState(0);
  const [depositBalance, setDepositBalance] = useState(0);
  const [withdrawBalance, setWithdrawBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const fetchBalance = async () => {
    if (id === 1) {
      const dBalance = await readContract(config, {
        abi: coreAbi,
        address: lstBTC_address,
        functionName: "balanceOf",
        args: [address],
      });

      const formattedDepositBalance = parseFloat(formatEther(dBalance));
      setDepositBalance(formattedDepositBalance);

      const wBalance = await readContract(config, {
        abi: vaultAbi,
        address: lstBTC_Vault_address,
        functionName: "balanceOf",
        args: [address],
      });

      const formattedWithdrawBalance = parseFloat(formatEther(wBalance));
      setWithdrawBalance(formattedWithdrawBalance);
    } else {
      const dBalance = await readContract(config, {
        abi: coreAbi,
        address: stCore_address,
        functionName: "balanceOf",
        args: [address],
      });

      const formattedDepositBalance = parseFloat(formatEther(dBalance));
      setDepositBalance(formattedDepositBalance);

      const wBalance = await readContract(config, {
        abi: vaultAbi,
        address: stCore_Vault_address,
        functionName: "balanceOf",
        args: [address],
      });

      const formattedWithdrawBalance = parseFloat(formatEther(wBalance));
      setWithdrawBalance(formattedWithdrawBalance);
    }
  };

  useEffect(() => {
    fetchBalance();
  });

  const handleDeposit = async () => {
    if (id === 1) {
      try {
        setIsLoading(true);
        const approve = await writeContract(config, {
          abi: coreAbi,
          address: lstBTC_address,
          functionName: "approve",
          args: [lstBTC_Vault_address, parseEther(amount)],
        });

        await waitForTransactionReceipt(config, {
          hash: approve,
          confirmations: 2,
        });

        toast.success(`Approve was successfull!`, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        await writeContract(config, {
          abi: vaultAbi,
          address: lstBTC_Vault_address,
          functionName: "deposit",
          args: [parseEther(amount)],
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
    } else {
      try {
        setIsLoading(true);
        const approve = await writeContract(config, {
          abi: coreAbi,
          address: stCore_address,
          functionName: "approve",
          args: [stCore_Vault_address, parseEther(amount)],
        });

        await waitForTransactionReceipt(config, {
          hash: approve,
          confirmations: 2,
        });

        toast.success(`Approve was successfull!`, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        await writeContract(config, {
          abi: vaultAbi,
          address: stCore_Vault_address,
          functionName: "deposit",
          args: [parseEther(amount)],
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
    }
  };

  const handleWithdraw = async () => {
    if (id === 1) {
      try {
        setIsLoading(true);
        await writeContract(config, {
          abi: vaultAbi,
          address: lstBTC_Vault_address,
          functionName: "withdraw",
          args: [parseEther(amount)],
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        await writeContract(config, {
          abi: vaultAbi,
          address: stCore_Vault_address,
          functionName: "withdraw",
          args: [parseEther(amount)],
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-full w-full fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
      <ToastContainer />
      <div className="bg-site-black rounded-lg w-[30%]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            {id === 1 ? "lstBTC Restaking" : "stCORE Restaking"}
          </h2>
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

export default ModalStake;
