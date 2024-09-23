/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import styles from "../styles";
import AmountIn from "./AmountIn";
import AmountOut from "./AmountOut";
import Balance from "./Balance";
import protocolAbi from "../../../contracts/protocol.json";
import coreAbi from "../../../contracts/core_usd.json";
import { toast, ToastContainer } from "react-toastify";
import {
  getBalance,
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "../../../lib/utils";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";

const protocol_address = "0x1Ea2e5647DBdE465d31c4a2092c10Db97c9a0C84";
const coreUSD_address = "0xc6CbA17D6Ea2eb68092e2D63a387303f0c8e7666";

const Content = () => {
  const [canApprove, setCanApprove] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  const [fromValue, setFromValue] = useState("0");
  const [calToken, setCalToken] = useState("");
  const [token1_Balance, setToken1_Balance] = useState(0);
  const [token2_Balance, setToken2_Balance] = useState(0);
  const { address } = useAccount();

  const value = async () => {
    const from_to_Value = await readContract(config, {
      abi: protocolAbi,
      address: protocol_address,
      functionName: "usdToCore",
      args: [parseEther(fromValue)],
    });

    const formattedvalue = parseFloat(formatEther(from_to_Value)).toFixed(2);

    setCalToken(formattedvalue);
  };

  const fetchBalance = async () => {
    const coreusdBalance = await readContract(config, {
      abi: coreAbi,
      address: coreUSD_address,
      functionName: "balanceOf",
      args: [address],
    });

    const formatCUSD = parseFloat(formatEther(coreusdBalance));

    setToken1_Balance(formatCUSD);

    const result = await getBalance(config, {
      address,
    });

    const depositValue = parseFloat(result?.formatted);

    setToken2_Balance(depositValue);
  };

  useEffect(() => {
    fetchBalance();
  });

  useEffect(() => {
    value();
  }, [fromValue]);

  const handleApprove = async () => {
    try {
      setCanApprove(!canApprove);
      setIsApproving(!isApproving);
      const approve = await writeContract(config, {
        abi: coreAbi,
        address: "0xc6CbA17D6Ea2eb68092e2D63a387303f0c8e7666",
        functionName: "approve",
        args: [
          "0x1Ea2e5647DBdE465d31c4a2092c10Db97c9a0C84",
          parseEther(fromValue),
        ],
      });

      await waitForTransactionReceipt(config, {
        hash: approve,
        confirmations: 2,
      });
      await writeContract(config, {
        abi: protocolAbi,
        address: protocol_address,
        functionName: "swap",
        args: [parseEther(fromValue)],
      });
      toast.success("Swap was Successfull!!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setCanApprove(!canApprove);
      setIsApproving(!isApproving);
    } catch (error) {
      console.error(error);
      toast.success("Swap Failed!!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="h-full flex flex-col w-full items-center">
      <ToastContainer />
      <div className="mb-8 w-[100%]">
        <div className={styles.amountContainer}>
          <input
            placeholder="0.0"
            type="number"
            onChange={(e) => setFromValue(e.target.value)}
            className={styles.amountInput}
          />
          <div className="relative">
            <button className={styles.currencyButton}>CUSD</button>
          </div>
        </div>
        <Balance
          tokenBalance={token1_Balance ? token1_Balance.toFixed(2) : "0.00"}
        />
      </div>
      <div className="mb-8 w-[100%]">
        <div className={styles.amountContainer}>
          <input
            placeholder="0.0"
            type="number"
            value={calToken}
            onChange={(e) => setCalToken(e.target.value)}
            className={styles.amountInput}
          />
          <div className="relative">
            <button className={styles.currencyButton}>Core</button>
          </div>
        </div>
        <Balance
          tokenBalance={token2_Balance ? token2_Balance.toFixed(2) : "0.00"}
        />
      </div>
      <button
        disabled={false}
        onClick={handleApprove}
        className={`${
          canApprove ? "bg-site-pink text-white" : "bg-site-dim2 text-site-dim2"
        } ${styles.actionButton}`}
      >
        {isApproving ? "Approving..." : "Approve"}
      </button>
    </div>
  );
};

export default Content;
