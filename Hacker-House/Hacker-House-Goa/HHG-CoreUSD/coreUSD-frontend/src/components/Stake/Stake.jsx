/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card } from "./CardPool";
import { config, PoolDeatils } from "../../lib/utils";
import { dollar, locked } from "../../assets";
import vaultAbi from "../../contracts/vault.json";
import coreAbi from "../../contracts/core_usd.json";
import { useAccount } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { formatEther, parseEther } from "viem";
import ModalStake from "./ModalStake";

const stCore_address = "0x5c1aFF8f2b3CAFdBbE26D4Bb488B15957d691dc2";
const stCore_Vault_address = "0xb2658e03FDF4107B5c409b8fac53d1ae779cB0b2";
const lstBTC_address = "0x3d26be19045c4ebf7f874c7f8057f8d0fd283a8a";
const lstBTC_Vault_address = "0xc4f2fa6eacf655a20f9cdc74063d2ee96fe6ea8b";

const Stake = () => {
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poolDetails, setPoolDetails] = useState(PoolDeatils);
  const [lstBalance, setLSTBalance] = useState(0);
  const [stBalance, setSTBalance] = useState(0);
  const [id, setId] = useState(1);

  const fetchBalance = async () => {
    const lstBalance = await readContract(config, {
      abi: vaultAbi,
      address: lstBTC_Vault_address,
      functionName: "balanceOf",
      args: [address],
    });

    const formattedLSTBalance = parseFloat(formatEther(lstBalance));
    setLSTBalance(formattedLSTBalance);

    const stBalance = await readContract(config, {
      abi: vaultAbi,
      address: stCore_Vault_address,
      functionName: "balanceOf",
      args: [address],
    });

    const formattedSTBalance = parseFloat(formatEther(stBalance));
    setSTBalance(formattedSTBalance);

    const updatedPoolDetails = poolDetails.map((pool) => {
      if (pool.token === "lstBTC") {
        return { ...pool, balance: formattedLSTBalance.toFixed(2) };
      }
      if (pool.token === "stCORE") {
        return { ...pool, balance: formattedSTBalance.toFixed(2) };
      }
      return pool;
    });

    setPoolDetails(updatedPoolDetails);
    console.log(poolDetails);
  };

  useEffect(() => {
    fetchBalance();
  }, [id, isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCardClick = async (id) => {
    if (id === "1") {
      openModal();
      setId(1);
    } else {
      openModal();
      setId(2);
    }
  };
  return (
    <div className="flex flex-col h-full w-full overflow-auto no-scrollbar bg-black">
      <div className="pink_gradient" />
      <div className="flex-grow">
        <div className="flex flex-col p-10 px-15 w-[70%] mx-auto justify-center">
          <h1 className="text-white font-bold text-5xl tracking-wide mb-5">
            Restaking Vaults
          </h1>
          <p className="text-dim-white font-poppins font-medium mt-3 text-base">
            Restake your liquid staking derivatives to enhance the security of
            the protocol. By restaking assets like STCORE and LSTBTC, you can
            earn a stable and passive yield on your tokens while contributing to
            the network&apos;s resilience.
          </p>
        </div>
        <div className="flex mt-10 bg-site-black w-[50%] mx-auto justify-center items-center h-32 rounded-lg">
          <div className="flex flex-col w-[50%] mx-2 my-2">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm m-3">
                Available to stake
              </span>
              <img src={dollar} className="w-5 m-2" alt="dollar" />
            </div>
            <div className="text-[#50BEAF] text-xl ml-3 my-2">$1500</div>
          </div>
          <div className="bg-gray-600 w-[1px] h-[80%] mt-2" />
          <div className="flex flex-col w-[50%] mx-2 my-2 justify-center">
            <div className="flex flex-col w-[100%] mx-2 my-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm m-3">Staked</span>
                <img src={locked} className="w-3.5 m-3" alt="locked" />
              </div>
              <div className="text-[#50BEAF] text-xl ml-3 my-2">$0</div>
            </div>
          </div>
        </div>
        <div className="flex text-gray-400 justify-center mt-10 mx-auto hover:underline hover:text-white cursor-pointer">
          Available Pools
        </div>
        <div className="p-10 h-full">
          <div className="flex flex-wrap justify-evenly w-full mx-auto mt-10 h-full">
            {poolDetails.map((card) => (
              <Card
                key={card.id}
                token={card.token}
                liquidity={card.liquidity}
                balance={card.balance}
                volume={card.yield}
                img={card.img}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <ModalStake isOpen={isModalOpen} onClose={closeModal} id={id} />
      <div className="blue_gradient" />
    </div>
  );
};

export default Stake;
