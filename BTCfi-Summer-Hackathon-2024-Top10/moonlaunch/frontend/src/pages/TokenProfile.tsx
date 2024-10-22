import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import Tablerow from "../components/Tablerow";
import BuyModal from "../components/BuyModal";
import SellModal from "../components/SellModal";
import SlippageModal from "../components/SlippageModal";
import { useToken } from "../hooks/useToken";
import { usePoolAndMigrationThreshold } from "../hooks/usePoolAndMigrationThreshold";
import { Address, formatEther, parseEther } from "viem";
import {
  useAccount,
  useBlock,
  useClient,
  useConfig,
  useWriteContract,
} from "wagmi";
import { useTrades } from "../hooks/useTrades";
import { formatDate, getCurveConfig, truncate } from "../utils/helper";
import { tokenConfig } from "../constants/data";
import {
  getBalance,
  readContract,
  waitForTransactionReceipt,
} from "viem/actions";
import Notfound from "../components/NotFound";
import { motion } from "framer-motion";

const DefaultModalText = {
  mainText: "Token Swap Successful",
  subText: "Congratulations! Your token has been successfully swapped.",
  subText2: "View transaction",
  link: "",
  myTokens: false,
};

const Pageanime = {
  initial: {
    x: 800,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: "easeInOut",
    },
  },
  exit: {
    x: 300,
    opacity: 0,
    transition: {
      duration: 0.75,
      ease: "easeInOut",
    },
  },
};

const TokenProfile = () => {
  const { id: tokenId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [tradeAction, setTradeAction] = useState("buy");
  const [showSlippage, setShowSlippage] = useState(false);
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [ethAmountIn, setEthAmountIn] = useState("0");
  const [ethAmountOut, setEthAmountOut] = useState("0");
  const [tokenAmountIn, setTokenAmountIn] = useState("0");
  const [tokenAmountOut, setTokenAmountOut] = useState("0");
  const [slippage, setSlippage] = useState("2");
  const [modalText, setModalText] = useState(DefaultModalText);
  const [copied, setCopied] = useState(false);

  const client = useClient();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const { address } = useAccount();
  const { refetch: refetchBlock } = useBlock();

  const {
    isLoading: isTokenLoading,
    data: token,
    refetch: refetchToken,
    error: tokenError,
  } = useToken(tokenId || "");
  const {
    data: pool,
    isLoading: isPoolLoading,
    refetch: refetchPoolInfo,
  } = usePoolAndMigrationThreshold(token?.address as Address, config);
  const {
    data: trades,
    isLoading: isTradesLoading,
    refetch: refreshTrades,
  } = useTrades(tokenId || "", "timestamp", 10);
  const curveConfig = getCurveConfig(client?.chain.id);

  const handleChangeTokenAmountIn = async (amountIn: string) => {
    if (!token || amountIn == "0") {
      return;
    }
    if (!amountIn) {
      setTokenAmountIn("0");
      return;
    }
    if (parseInt(amountIn) < 0) {
      setTokenAmountIn("0");
      return;
    }
    setTokenAmountIn(amountIn);
    // @ts-expect-error it works
    const amountOut = await readContract(client, {
      ...curveConfig,
      functionName: "calcAmountOutFromToken",
      args: [token.address, parseEther(amountIn)],
    });
    setEthAmountOut(formatEther(amountOut));
  };

  const handleChangeEthAmountIn = async (amountIn: string) => {
    if (!token || amountIn == "0") {
      return;
    }
    if (!amountIn) {
      setEthAmountIn("0");
      return;
    }
    if (parseInt(amountIn) < 0) {
      setEthAmountIn("0");
      return;
    }
    // @ts-expect-error it works
    const amountOut = await readContract(client, {
      ...curveConfig,
      functionName: "calcAmountOutFromEth",
      args: [token.address, parseEther(amountIn)],
    });
    setEthAmountIn(amountIn);
    setTokenAmountOut(formatEther(amountOut));
  };

  //Table pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleError = (error: unknown) => {
    console.log(error);
    setShowLoader(false);
    toast.error("An error occured while creating a new token", {
      // @ts-expect-error it works
      description: error,
    });
  };

  const handleSuccess = async (hash: Address) => {
    try {
      // @ts-expect-error it works
      await waitForTransactionReceipt(client, {
        hash,
      });
      await refetchToken();
      await refreshTrades();
      await refetchPoolInfo();
      setShowLoader(false);
      setModalText({
        ...DefaultModalText,
        link: `${client?.chain.blockExplorers?.default.url}/tx/${hash}`,
      });
      setShowModal(true);
      setEthAmountIn("0");
      setTokenAmountIn("0");
      setEthAmountOut("0");
      setTokenAmountOut("0");
    } catch (e) {
      // @ts-expect-error it works
      handleError(e.message);
    }
  };

  const handleApprovalSuccess = async (hash: Address) => {
    // @ts-expect-error it works
    await waitForTransactionReceipt(client, {
      hash,
    });
    const amountOutMin =
      parseEther(ethAmountOut) -
      (parseEther(ethAmountOut) * BigInt(slippage)) / BigInt("100");
    const { data } = await refetchBlock();
    // sell tokens
    await writeContractAsync(
      {
        ...curveConfig,
        functionName: "swapTokensForEth",
        args: [
          token!.address,
          parseEther(tokenAmountIn),
          amountOutMin,
          data!.timestamp + BigInt(1 * 60),
        ],
      },
      {
        onSuccess: async (hash) => {
          await handleSuccess(hash);
        },
        onError: (e) => {
          handleError(e.message);
        },
      }
    );
  };

  const handleBuy = async () => {
    if (!token) {
      return;
    }
    if (ethAmountIn != "0" && tokenAmountOut != "0") {
      setShowLoader(true);
      const { data, error } = await refetchBlock();
      if (!data) {
        handleError(error);
        return;
      }
      const amountOutMin =
        parseEther(tokenAmountOut) -
        (parseEther(tokenAmountOut) * BigInt(slippage)) / BigInt("100");
      await writeContractAsync(
        {
          ...curveConfig,
          functionName: "swapEthForTokens",
          args: [
            token.address,
            parseEther(ethAmountIn),
            amountOutMin,
            data.timestamp + BigInt(1 * 60),
          ],
          value: parseEther(ethAmountIn),
        },
        {
          onSuccess: async (data) => {
            await handleSuccess(data);
          },
          onError: (error) => {
            handleError(error.message);
          },
        }
      );
    }
  };

  const handleSell = async () => {
    if (!token) {
      return;
    }
    if (ethAmountOut != "0" && tokenAmountIn != "0") {
      setShowLoader(true);
      const { data, error } = await refetchBlock();
      if (!data) {
        handleError(error);
        return;
      }
      // Approve curve to send tokens
      await writeContractAsync(
        {
          ...tokenConfig,
          functionName: "approve",
          address: token.address,
          args: [curveConfig.address, parseEther(tokenAmountIn)],
        },
        {
          onSuccess: async (hash) => {
            await handleApprovalSuccess(hash);
          },
          onError: (error) => {
            handleError(error.message);
          },
        }
      );
    }
  };

  const handleCopyTokenAddress = async () => {
    setCopied(false);
    if (token?.address) {
      try {
        await navigator.clipboard.writeText(token.address);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      } catch (err) {
        console.error("Failed to copy content: ", err);
        setCopied(false);
      }
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (address && token) {
        // @ts-expect-error it works
        const ethBalance = await getBalance(client, {
          address: address,
        });
        // @ts-expect-error it works
        const tokenBalance = await readContract(client, {
          ...tokenConfig,
          address: token.address,
          functionName: "balanceOf",
          args: [address],
        });
        setEthBalance(formatEther(ethBalance));
        setTokenBalance(formatEther(tokenBalance));
      }
    };
    if (address) {
      fetchBalances();
      //setDisableBtn(false);
    } else {
      setEthBalance("0");
      setTokenBalance("0");
    }
  }, [address, client, token]);

  return (
    <motion.div
      variants={Pageanime}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-[#191A1A] px-5 pt-[80px] flex justify-center"
    >
      {isPoolLoading || isTokenLoading || isTradesLoading ? (
        <Loader text="Fetching token and trades ..." />
      ) : (
        <div className="max-w-[1200px] pt-10 w-full flex flex-col gap-10 ">
          {(tokenError || !token) && <Notfound></Notfound>}
          {token && (
            <div className="flex flex-col md:flex-row gap-7 justify-between">
              <div className="bg-[#1C4141] text-white flex flex-col gap-5 p-5 md:max-w-[50%] w-full rounded-2xl">
                <div className="flex gap-3 items-center ">
                  <img
                    src={
                      token.logoUrl.slice(0, 5) == "https"
                        ? token.logoUrl
                        : "../images/memeland.png"
                    }
                    alt=""
                    width="120"
                    style={{ borderRadius: "30px" }}
                  />
                  <div className="flex flex-col items-start gap-1 ">
                    <h1 className="uppercase text-2xl font-semibold ">
                      {token?.name}
                    </h1>
                    <p className="uppercase text-xl font-semibold ">
                      ${token?.symbol}
                    </p>
                    <p className="text-[#A7A7A7] text-sm  ">
                      {formatDate(token?.timestamp || "")}
                    </p>
                  </div>
                </div>
                <p className="text-sm w-full leading-7 tracking-wider  ">
                  {token?.description}
                </p>
                <div className="flex mt-4 md:m-0 flex-col md:flex-row justify-between gap-3 w-full md:items-center">
                  <div className="flex items-center gap-2">
                    <img src="../images/user.png" alt="" />
                    <p className="text-sm">
                      Created by:{" "}
                      <span className="ml-[2px] text-[#8BF0B7]">
                        {truncate(token?.creator)}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={handleCopyTokenAddress}
                    className="text-white relative bg-[#182323] px-3 py-[6px] flex items-center w-max gap-1 rounded-md"
                  >
                    <img src="../images/copy2.png" alt="" />{" "}
                    {truncate(token?.address)}
                    {copied && (
                      <p className="text-white absolute bottom-[-30px] left-0 bg-[#182323] px-3 py-[6px]  text-[10px] w-full text-center gap-1 rounded-md">
                        Address Copied
                      </p>
                    )}
                  </button>
                </div>
              </div>
              <div className="md:max-w-[50%] w-full">
                <div className=" bg-[#191A1A] text-[12px] py-4 px-7 flex flex-col gap-4 w-full rounded-2xl border border-[#0f1c1d] uploadShdw ">
                  <div>
                    <div className="bg-[#00ECFF05] tokenInfoShdw w-max rounded-lg flex gap-3 py-2 px-3 ">
                      <button
                        onClick={() => setTradeAction("buy")}
                        className={
                          tradeAction === "buy"
                            ? "rounded-lg px-6 py-2 bg-[#000000] "
                            : "rounded-lg px-6 py-2 bg-transparent "
                        }
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => setTradeAction("sell")}
                        className={
                          tradeAction === "sell"
                            ? "rounded-lg px-6 py-2 bg-[#000000] "
                            : "rounded-lg px-6 py-2 bg-transparent "
                        }
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-2 items-end ">
                    {tradeAction === "buy" ? (
                      <BuyModal
                        coreBalance={ethBalance}
                        tokenSymbol={token?.symbol || ""}
                        ethAmountIn={ethAmountIn}
                        tokenAmountOut={tokenAmountOut}
                        handleChangeEthAmountIn={handleChangeEthAmountIn}
                      />
                    ) : (
                      <SellModal
                        tokenBalance={tokenBalance}
                        tokenName={token?.symbol || ""}
                        handleChangeTokenAmountIn={handleChangeTokenAmountIn}
                        ethAmountOut={ethAmountOut}
                        tokenAmountIn={tokenAmountIn}
                      />
                    )}

                    <p
                      onClick={() => setShowSlippage(true)}
                      className="w-full flex gap-1 justify-end items-center cursor-pointer "
                    >
                      <img src="../images/settings.png" alt="" /> Set max
                      slippage
                    </p>
                  </div>
                  <button
                    onClick={tradeAction === "buy" ? handleBuy : handleSell}
                    className="w-full border border-white text-center h-[55px] flex justify-center items-center bg-[#00ECFF05] rounded-lg "
                  >
                    Place trade
                  </button>
                  <div className="w-full flex flex-col gap-2 items-center ">
                    <p className="w-full">
                      Bonding Curve Progress: {pool?.bondingPercentage}%
                    </p>
                    <div className="h-3 bg-[#1C4141] rounded-full w-full ">
                      <div
                        className="h-full bg-[#00ECFF] rounded-full"
                        style={{
                          width: `${pool?.bondingPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {token && (
            <div className="border border-white p-3 greenShdw w-full rounded-xl ">
              <h1>Price Chart</h1>
            </div>
          )}
          {token && trades && (
            <div className="border border-white p-6 flex flex-col gap-5 greenShdw w-full rounded-xl ">
              <div className="flex md:flex-row flex-col gap-5 w-full justify-between  ">
                <div className="flex gap-5 items-center w-full ">
                  <h1 className="font-semibold text-[20px] ">Trades</h1>{" "}
                  <div className="border border-white rounded-lg flex justify-between items-center p-3 max-w-[110px] w-full h-[37px] ">
                    <p>All</p>
                    <img src="../images/dropdown.png" alt="" />
                  </div>
                </div>
                <div className="flex gap-2 items-center mr-14">
                  <img
                    onClick={handlePreviousPage}
                    className={
                      currentPage === 1
                        ? "rotate-180 opacity-[0.4] "
                        : "rotate-180 "
                    }
                    src="../images/nextarrow.png"
                    alt=""
                  />{" "}
                  <span>{currentPage}</span>
                  <img
                    onClick={handleNextPage}
                    src="../images/nextarrow.png"
                    alt=""
                    className={
                      currentPage === totalPages ? "opacity-[0.4] " : " "
                    }
                  />
                </div>
              </div>
              <div className="w-full overflow-x-auto ">
                <table className="w-full border-separate border-spacing-x-0 border-spacing-y-6 ">
                  <tr className=" bg-[#00ECFF05] rounded-2xl text-start ">
                    <th className=" rounded-l-2xl pl-10 px-3 py-4 text-start ">
                      Type
                    </th>
                    <th className="px-3 py-4 text-start">Account</th>
                    <th className="px-3 py-4 text-start">$CORE</th>
                    <th className="px-3 py-4 text-start">${token?.symbol}</th>
                    <th className="px-3 py-4 text-start">Fee</th>
                    <th className=" rounded-r-2xl px-3 py-4 text-start ">
                      Date
                    </th>
                  </tr>
                  {trades?.map((trade, index) => (
                    <Tablerow
                      item={trade}
                      key={index}
                      explorerUrl={
                        client?.chain.blockExplorers?.default.url || ""
                      }
                    />
                  ))}
                </table>
              </div>
            </div>
          )}
          <Footer />
        </div>
      )}
      {showModal && <Modal data={modalText} setShowModal={setShowModal} />}
      {showLoader && <Loader text="Swapping Token..." />}
      {showSlippage && (
        <SlippageModal
          setShowSlippage={setShowSlippage}
          slippageValue={slippage}
          setSlippageValue={setSlippage}
        />
      )}
    </motion.div>
  );
};

export default TokenProfile;
