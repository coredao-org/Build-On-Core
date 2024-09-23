/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import { LoadingButton } from "../ui/LoadingButton";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAccount } from "wagmi";
import protocolAbi from "../../contracts/protocol.json";
import coreAbi from "../../contracts/core_usd.json";
import oracleAbi from "../../contracts/oracle.json";
import { config } from "../../lib/utils";
import { formatEther, parseEther } from "viem";
import {
  getTransactionReceipt,
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";

const coreUSD_address = "0xc6CbA17D6Ea2eb68092e2D63a387303f0c8e7666";
const protocol_address = "0x1Ea2e5647DBdE465d31c4a2092c10Db97c9a0C84";
const oracle_address = "0x8d2620d9F8801D61317069D10A0a5Cd0Eb47dE9c";

const COP = () => {
  const [manage, setManage] = useState(false);
  const [manageAmount, setManageAmount] = useState("0");
  const [borrowBalance, setBorrowBalance] = useState(0);
  const [collateralBalance, setCollateralBalance] = useState(0);
  const [susdBalance, setsusdBalance] = useState(0);
  const [text, setText] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [borrowCapacity, setBorrowCapacity] = useState(0);
  const [collateralValue, setCollateralValue] = useState(0);
  const [cUSD, setCUSD] = useState(0);
  const [ltv, setLtv] = useState(0);
  const [data, setData] = useState({});

  const { isConnected, address } = useAccount();

  const user_balance = async () => {
    try {
      const result = await readContract(config, {
        abi: protocolAbi,
        address: protocol_address,
        functionName: "totalDebt",
        args: [address],
      });

      const intValue = parseFloat(formatEther(result));
      setBorrowBalance(intValue);
      console.log("Contract call result:", result);
    } catch (error) {
      console.error("Error executing totalDebt:", error);
    }

    const result2 = await readContract(config, {
      abi: protocolAbi,
      address: protocol_address,
      functionName: "collateralDeposited",
      args: [address],
    });

    const collateralValuehere = parseFloat(formatEther(result2));

    setCollateralBalance(collateralValuehere);

    const borrowCapacityhere = await readContract(config, {
      abi: protocolAbi,
      address: protocol_address,
      functionName: "maxBorrow",
      args: [address],
    });

    const formatBorrowCapacity = parseFloat(formatEther(borrowCapacityhere));

    setBorrowCapacity(formatBorrowCapacity);

    const collateralBalance = await readContract(config, {
      abi: oracleAbi,
      address: oracle_address,
      functionName: "getPrice",
      args: [],
    });

    const formatCollateralValue = parseFloat(
      collateralValuehere * formatEther(collateralBalance)
    );

    setCollateralValue(formatCollateralValue);

    const LTV_value = (borrowBalance / formatCollateralValue) * 100;

    setLtv(LTV_value);

    const coreusdBalance = await readContract(config, {
      abi: coreAbi,
      address: coreUSD_address,
      functionName: "balanceOf",
      args: [address],
    });

    const formatCUSD = parseFloat(formatEther(coreusdBalance));

    setCUSD(formatCUSD);
  };

  useEffect(() => {
    user_balance();
  }, [isLoading, manage, text, borrowBalance, isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleManageBorrow = () => {
    if (text === 0) {
      setManage(!manage);
    } else {
      setManage(true);
    }
    setText(0);
  };

  const handleManageRepay = () => {
    if (text === 1) {
      setManage(!manage);
    } else {
      setManage(true);
    }
    setText(1);
  };

  const handleBorrow = async () => {
    try {
      setIsLoading(true);

      const tx = await writeContract(config, {
        abi: protocolAbi,
        address: protocol_address,
        functionName: "borrowTokens",
        args: [parseEther(manageAmount)],
      });

      toast.success(`Borrow was successfull!`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      console.log(tx);
      setIsLoading(false);
    } catch (error) {
      console.error("Error executing borrowTokens:", error);
      toast.error(`Borrow failed: ${error.message}`, {
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

  const handleRepay = async () => {
    try {
      setIsLoading(true);
      const approve = await writeContract(config, {
        abi: coreAbi,
        address: "0xc6CbA17D6Ea2eb68092e2D63a387303f0c8e7666",
        functionName: "approve",
        args: [
          "0x1Ea2e5647DBdE465d31c4a2092c10Db97c9a0C84",
          parseEther(manageAmount),
        ],
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
        abi: protocolAbi,
        address: "0x1Ea2e5647DBdE465d31c4a2092c10Db97c9a0C84",
        functionName: "repay",
        args: [parseEther(manageAmount)],
      });

      toast.success(`Repay was successfull!`, {
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
      toast.error(`Repay failed: ${error.message}`, {
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

  return (
    <div className="h-screen w-screen flex flex-col items-center p-10 text-white">
      <ToastContainer />
      <div className="flex justify-evenly w-full h-screen">
        <div className="flex h-full w-[20%]">
          <div>
            <h1 className="text-purple-500 font-semibold text-lg">Balance</h1>
            <p className="text-4xl font-bold">$ {borrowBalance.toFixed(3)}</p>
          </div>
        </div>
        {!isConnected ? (
          <div className="text-xl font-bold">
            Connect Your Wallet to Continue
          </div>
        ) : (
          <div className="flex justify-center items-center text-lg ">
            <div className="flex">
              <button
                className="flex justify-between items-center px-4 bg-site-black h-14 w-44 rounded-full mr-[20px]"
                onClick={handleManageBorrow}
              >
                <span className="text-base text-gray-500 font-semibold">
                  Borrow cUSD
                </span>
              </button>
              <button
                className="flex justify-between items-center px-4 bg-site-black h-14 w-48 tracking-wider rounded-full mr-[20px]"
                onClick={handleManageRepay}
              >
                <span className="text-base text-gray-500 font-semibold">
                  Repay cUSD
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-x-12 p-10 mt-10 h-screen">
        <div className="h-[510px] w-[550px] bg-site-black bg-opacity-30 rounded-lg pb-10 border-2 border-gray-500">
          <div className="flex justify-between mt-[20px] mx-[20px]">
            <h1 className="w-full text-gray-400 text-sm">Collateral Asset</h1>
            <h1 className="w-full text-gray-400 text-sm">Protocol Balance</h1>
          </div>

          <div className="mx-[20px] flex flex-row justify-between mt-10">
            <div className="h-[50px] flex flex-col justify-center gap-y-[10px]">
              <div className="flex-col">
                <div className="flex gap-3">
                  <img
                    src="https://icons.llamao.fi/icons/chains/rsz_core.jpg"
                    className="w-8"
                  />
                  <h1 className="text-xl font-semibold text-center">Core</h1>
                </div>
                <span className="text-sm font-medium text-gray-400">
                  {collateralBalance.toFixed(5)}
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-x-[15px] h-[50px] justify-between items-center">
              <button
                onClick={openModal}
                className="h-14 w-60 px-5 bg-site-black rounded-full text-sm flex justify-center items-center"
              >
                Manage Collateral
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-[20px]">
          <div className=" h-full w-[450px] bg-site-black bg-opacity-30 rounded-lg p-10 border-2 border-gray-500">
            <div className="flex flex-col gap-5">
              <h1 className="text-gray-400 font-bold">
                {manage ? "Manage Borrow & Repay" : "cUSD Wallet Balance"}
              </h1>
              {manage ? (
                <div className="flex w-full justify-between">
                  <input
                    type="number"
                    placeholder="0.000"
                    className={`flex h-9 w-44 border-site-black rounded-md border-2 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50`}
                    onChange={(e) => {
                      setManageAmount(e.target.value);
                    }}
                    disabled={isLoading}
                  />
                  {text === 0 ? (
                    <div>
                      {isLoading ? (
                        <LoadingButton disabled>
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </LoadingButton>
                      ) : (
                        <button
                          className="flex bg-gray-800 h-10 w-36 justify-center items-center rounded-lg font-semibold cursor-pointer"
                          onClick={handleBorrow}
                        >
                          Borrow
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {isLoading ? (
                        <LoadingButton disabled>
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </LoadingButton>
                      ) : (
                        <button
                          className="flex bg-gray-800 h-10 w-36 justify-center items-center rounded-lg font-semibold cursor-pointer"
                          onClick={handleRepay}
                        >
                          Repay
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 font-semibold text-lg">
                  $ <span className="text-white">{cUSD.toFixed(3)}</span>
                </p>
              )}
              <hr className="border-gray-500 border-opacity-30" />
            </div>
          </div>

          <div className=" h-full w-[450px] bg-site-black bg-opacity-30 rounded-lg p-10 border-2 border-gray-500">
            <h1 className="text-gray-400 font-medium text-sm">
              Position Summary
            </h1>
            <div className="flex flex-row mx-[20px] justify-between mt-[20px]">
              <p>Collateral Value</p>
              <h3>${collateralValue.toFixed(3)}</h3>
            </div>
            <div className="flex flex-row mx-[20px] justify-between mt-[20px]">
              <p>Liquidation price</p>
              <h3>
                $ {((1.29 * borrowBalance) / collateralBalance).toFixed(3)}
              </h3>
            </div>
            <div className="flex flex-row mx-[20px] justify-between mt-[20px]">
              <p>Borrow Capacity</p>
              <h3>${borrowCapacity.toFixed(3)}</h3>
            </div>
            <div className="flex flex-row mx-[20px] justify-between mt-[20px]">
              <p>LTV</p>
              <h3>{ltv.toFixed(3)}%</h3>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default COP;
