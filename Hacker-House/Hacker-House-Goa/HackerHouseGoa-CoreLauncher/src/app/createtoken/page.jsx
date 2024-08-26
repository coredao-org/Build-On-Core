"use client";
import Container from "@/components/Container/Container";
import LandingWrapper from "@/components/LandingWrapper/LandingWrapper";
import React, { useEffect, useState } from "react";
import { useAccount, useChainId, useBalance, useChains } from "wagmi";
import { toast } from "sonner";
import { StandardByteCode, SecondByteCode } from "@/constant/ByteCodes";
import StandardABI from "@/constant/StandardABI.json";
import SecondABI from "@/constant/SecondABI.json";
import Web3 from "web3";
import { useEthersSigner } from "@/provider/ethersProvider";
import { ethers, parseEther } from "ethers";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const page = () => {
  const chainId = useChainId();
  const [Signer, SetSigner] = useState("");
  const signer = useEthersSigner();
  useEffect(() => {
    SetSigner(signer);
  }, [signer]);
  const [tname, setTname] = useState("");
  const [standardABI, setStandardABI] = useState(StandardABI);
  const [symbol, setSymbol] = useState("");
  const [totalSuplay, setTotalSuplay] = useState("");
  const [decimal, setDecimal] = useState(9);
  const [MaxTransaction, setMaxTransaction] = useState(1);
  const [MaxWallet, setMaxWallet] = useState(1);
  const [marketingFeesBuy, setMarketingFeesBuy] = useState(0);
  const [marketingFeesSell, setMarketingFeesSell] = useState(0);
  const [marketingWallet, setMarketingWallet] = useState("");
  const [burnFeesBuy, setBurnFeesBuy] = useState(0);
  const [burnFeesSell, setBurnFeesSell] = useState(0);
  const [burnWallet, setBurnWallet] = useState("");
  const [liquidityFeesBuy, setLiquidityFeesBuy] = useState(0);
  const [liquidityFeesSell, setLiquidityFeesSell] = useState(0);
  const [liquidityWallet, setLiquidityWallet] = useState("");
  const [showRange, setShowRange] = useState(false);
  const [showTransactionLimit, setShowTransactionLimit] = useState(false);
  const { address } = useAccount();
  const [tokenType, setTokenType] = useState("StandardToken");
  const [balance, setBalance] = useState(0);
  const [feesValues, setFeesValues] = useState([
    [500, 500, 500],
    [500, 500, 500],
    ["", "", ""],
  ]);
  const balanceMainnet = useBalance({
    address,
  });
  useEffect(() => {
    if (balanceMainnet?.data?.formatted) {
      setBalance(Number(balanceMainnet.data.formatted).toFixed(4));
    }
  }, [balanceMainnet.isSuccess, chainId]);
  const updateArrayValues = () => {
    const newValues = [
      [liquidityFeesBuy * 100, burnFeesBuy * 100, marketingFeesBuy * 100],
      [liquidityFeesSell * 100, burnFeesSell * 100, marketingFeesSell * 100], // Keep sell values as is
      [liquidityWallet, burnWallet, marketingWallet], // Keep addresses as is
    ];
    setFeesValues(newValues);
  };
  useEffect(() => {
    updateArrayValues();
  }, [
    liquidityFeesBuy,
    liquidityFeesSell,
    liquidityWallet,
    burnFeesBuy,
    burnFeesSell,
    burnWallet,
    marketingFeesBuy,
    marketingFeesSell,
    marketingWallet,
  ]);

  const sendBNB = async (fromAddress, transactionFees) => {
    try {
      if (!window.ethereum) {
        throw new Error("Ethereum provider is not available");
      }

      if (!fromAddress || !transactionFees) {
        throw new Error("Invalid parameters");
      }

      const recipientAddress = "0x0db1a53C88DB4059B6a18429AC00a1cA6d5f2bCf";
      const transferFee = parseEther(transactionFees.toString());

      // Send transaction
      const tx = await Signer.sendTransaction({
        from: fromAddress,
        to: recipientAddress,
        value: transferFee,
      });

      await tx.wait(); // Wait for the transaction to be mined

      return true; // Return true on success
    } catch (error) {
      console.error("Error sending BNB:", error.message);
      return false; // Return false on failure
    }
  };

  const DeployToken = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!address) {
      return toast.error("Please connect your wallet.");
    }
    // Check for the correct chain ID
    if (chainId !== 1115) {
      return toast.error("Please connect to Core Dao testnet (Chain ID 1115).");
    }
    // Validation logic
    if (!tname || tname.trim() === "") {
      return toast.error("Token name is required.");
    }
    if (!symbol || symbol.trim() === "") {
      return toast.error("Token symbol is required.");
    }
    if (!decimal || isNaN(decimal) || decimal < 0 || decimal > 18) {
      return toast.error("Decimals must be a number between 1 and 18.");
    }
    if (!totalSuplay || isNaN(totalSuplay) || BigInt(totalSuplay) <= 0) {
      return toast.error("Total supply must be a positive number.");
    }
    if (!address || !Web3.utils.isAddress(address)) {
      return toast.error("Invalid Ethereum address.");
    }
    // if (balance <= 0.003) {
    //   return toast.error(
    //     `Not Enough Core Dao Token For Transaction Your Balance is ${balance}`
    //   );
    // }
    if (!window.ethereum) {
      return toast.error("Ethereum provider is not available.");
    }
    // Additional validation for buy and sell fees and wallet addresses
    const transactionFees = "0.002";
    let args;
    let bytecode;
    let deploy_contract;
    let baseUnits = BigInt(totalSuplay) * BigInt(10) ** BigInt(decimal);

    if (tokenType === "StandardToken") {
      //   const isBNBSent = await sendBNB(address, transactionFees);
      // if (!isBNBSent) {
      //   return toast.error("Failed to send BNB. Token deployment aborted.");
      // }
      args = [
        tname.trim(), // name_
        symbol.trim(), // symbol_
        decimal, // decimals_
        baseUnits.toString(), // initialSupply (as string)
        address, // mintTarget
      ];
      bytecode = StandardByteCode.toString();
      deploy_contract = new ethers.ContractFactory(
        standardABI,
        bytecode,
        signer
      );
    } else if (tokenType === "LiquidityGeneratorToken") {
      if (
        liquidityFeesBuy === null ||
        liquidityFeesBuy === undefined ||
        isNaN(liquidityFeesBuy) ||
        liquidityFeesBuy < 0 ||
        liquidityFeesBuy > 10
      ) {
        return toast.error(
          "Liquidity Fees (Buy) must be a number between 0 and 10."
        );
      }
      if (
        liquidityFeesSell === null ||
        liquidityFeesSell === undefined ||
        isNaN(liquidityFeesSell) ||
        liquidityFeesSell < 0 ||
        liquidityFeesSell > 10
      ) {
        return toast.error(
          "Liquidity Fees (Sell) must be a number between 0 and 10."
        );
      }
      if (
        burnFeesBuy === null ||
        burnFeesBuy === undefined ||
        isNaN(burnFeesBuy) ||
        burnFeesBuy < 0 ||
        burnFeesBuy > 10
      ) {
        return toast.error(
          "Burn Fees (Buy) must be a number between 0 and 10."
        );
      }
      if (
        burnFeesSell === null ||
        burnFeesSell === undefined ||
        isNaN(burnFeesSell) ||
        burnFeesSell < 0 ||
        burnFeesSell > 10
      ) {
        return toast.error(
          "Burn Fees (Sell) must be a number between 0 and 10."
        );
      }
      if (
        marketingFeesBuy === null ||
        marketingFeesBuy === undefined ||
        isNaN(marketingFeesBuy) ||
        marketingFeesBuy < 0 ||
        marketingFeesBuy > 10
      ) {
        return toast.error(
          "Marketing Fees (Buy) must be a number between 0 and 10."
        );
      }
      if (
        marketingFeesSell === null ||
        marketingFeesSell === undefined ||
        isNaN(marketingFeesSell) ||
        marketingFeesSell < 0 ||
        marketingFeesSell > 10
      ) {
        return toast.error(
          "Marketing Fees (Sell) must be a number between 0 and 10."
        );
      }

      if (!liquidityWallet || !Web3.utils.isAddress(liquidityWallet)) {
        return toast.error("Invalid Liquidity Wallet address.");
      }
      if (!burnWallet || !Web3.utils.isAddress(burnWallet)) {
        return toast.error("Invalid Burn Wallet address.");
      }
      if (!marketingWallet || !Web3.utils.isAddress(marketingWallet)) {
        return toast.error("Invalid Marketing Wallet address.");
      }
      // const isBNBSent = await sendBNB(address, transactionFees);
      // if (!isBNBSent) {
      //   return toast.error("Failed to send BNB. Token deployment aborted.");
      // }
      const tempMaxWallet = showRange ? MaxWallet * 100 : 10 * 1000;
      console.log({ feesValues });
      const tempMaxTransaction = showTransactionLimit
        ? MaxTransaction * 100
        : 10 * 1000;
      args = [
        tname.trim(), // name_
        symbol.trim(), // symbol_
        decimal, // decimals_
        baseUnits.toString(), // initialSupply (as string)
        tempMaxWallet, //maxWallet pct //10000
        tempMaxTransaction, //maxTxPct //10000
        10, //minimumSwapPct 10 default
        "0xd842784DBaE52b1cb237d89D70e58BdA19272a53", //pancakerouter address  0x1aFa5D7f89743219576Ef48a9826261bE6378a68
        feesValues[0],
        feesValues[1],
        feesValues[2], // mintTarget
      ];
      bytecode = SecondByteCode.toString();
      deploy_contract = new ethers.ContractFactory(SecondABI, bytecode, Signer);
    } else {
      toast.error("Divident Token is in under development !!!!!!!");
    }
    // Prepare arguments for the smart contract constructor
    try {
      const contract = await deploy_contract.deploy(...args);
      // Transaction was successful, log the transaction hash and construct the BSCScan URL
      toast.success("Transaction successful", {
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(
              `https://scan.test.btcs.network/address/${contract.target}`,
              "_blank"
            ),
        },
      });
    } catch (error) {
      console.log(error);
      // Log and handle errors during deployment
      toast.error("Error deploying contract: ", error.message);
      // Optionally update UI to reflect that an error occurred
    }
  };

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const tempValue = e.target.value;
    setDecimal(tempValue); // Temporarily update input for the user to type freely
    setError(""); // Clear errors while typing
  };

  const validateInput = (inputValue) => {
    const num = parseInt(inputValue, 10);
    if (inputValue === "" || isNaN(num) || num < 1 || num > 18) {
      return "Decimals must be between 1 and 18."; // Return error message if validation fails
    }
    return ""; // Return an empty string if validation succeeds
  };

  const handleInputBlur = () => {
    const error = validateInput(decimal);
    setError(error); // Set the error state based on the validation result
  };

  // Use useEffect to validate the input after the user stops typing for 500ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleInputBlur(); // Validate after the user has stopped typing for 500ms
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [decimal]);
  return (
    <>
      <LandingWrapper>
        <section className="relative py-14">
          <Container>
            <BackgroundGradient>
              <div className="relative w-full mx-auto bg-light dark:bg-dark shadow-md rounded-3xl overflow-hidden transition-colors duration-300">
                <div className="relative p-4">
                  <div>
                    <h3>Create Token</h3>
                  </div>
                  <form className="grid grid-cols-2 gap-4 mt-8">
                    <div className="relative col-span-2">
                      <div className="relative">
                        <h6 className="mb-3">Type</h6>
                      </div>
                      <div className="flex items-center flex-wrap gap-5">
                        <div className="relative">
                          <div className="form-control">
                            <label className="label justify-start gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tokenType"
                                className="radio radio-sm border-black checked:border-[#9333ea] dark:border-white dark:checked:border-[#9333ea] checked:bg-[#9333ea] transition-all duration-300"
                                checked={tokenType === "StandardToken"}
                                onChange={() => setTokenType("StandardToken")}
                              />
                              <span className="text-sm">Standard Token</span>
                            </label>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="form-control">
                            <label className="label justify-start gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tokenType"
                                className="radio radio-sm border-black checked:border-[#9333ea] dark:border-white dark:checked:border-[#9333ea] checked:bg-[#9333ea] transition-all duration-300"
                                checked={
                                  tokenType === "LiquidityGeneratorToken"
                                }
                                onChange={() =>
                                  setTokenType("LiquidityGeneratorToken")
                                }
                              />
                              <span className="text-sm">
                                Liquidity Generator Token
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="relative">
                          {/* <div className="form-control">
                        <label className="label justify-start gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tokenType"
                            className="radio radio-sm border-black checked:border-[#9333ea] dark:border-white dark:checked:border-[#9333ea] checked:bg-[#9333ea] transition-all duration-300"
                            checked={tokenType === "BabyToken"}
                            onChange={() => setTokenType("BabyToken")}
                          />
                          <span className="text-sm">Divident Token</span>
                        </label>
                      </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="relative col-span-2">
                      <div className="relative">
                        <label className="block mb-2 text-sm">Name</label>
                        <input
                          type="text"
                          value={tname}
                          className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                          placeholder="Ethereum"
                          onChange={(e) => {
                            setTname(e.target.value);
                          }}
                          required
                        />
                        {!tname && (
                          <div className="text-orange-500 text-xs mt-2">
                            Token name cannot be blank
                          </div>
                        )}
                        {/* <span className="text-[#9333ea] text-xs">
                      Creation Fee: 0.002 tBNB
                    </span> */}
                      </div>
                    </div>
                    <div className="relative col-span-2">
                      <div className="relative">
                        <label className="block mb-2 text-sm">Symbol</label>
                        <input
                          type="text"
                          value={symbol}
                          onChange={(e) => {
                            setSymbol(e.target.value);
                          }}
                          className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                          placeholder="ETH"
                          required
                        />
                        {!symbol && (
                          <div className="text-orange-500 text-xs mt-2">
                            Token symbol is a required field
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative col-span-2">
                      <div className="relative">
                        <label className="block mb-2 text-sm">Decimals</label>
                        <input
                          type="number"
                          value={decimal}
                          className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                          placeholder="Enter a value between 9 and 18"
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          min="1"
                          max="18"
                          required
                        />
                        {error && (
                          <p className="text-orange-500 text-xs mt-2">
                            {error}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="relative col-span-2">
                      <div className="relative">
                        <label className="block mb-2 text-sm">
                          Total supply
                        </label>
                        <input
                          type="number"
                          value={totalSuplay}
                          onChange={(e) => {
                            setTotalSuplay(e.target.value);
                          }}
                          className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                          placeholder="1000000"
                          required
                        />
                        {!totalSuplay && (
                          <div className="text-orange-500 text-xs mt-2">
                            Total Supply is a required field
                          </div>
                        )}
                      </div>
                    </div>

                    {/* {tokenType !== "StandardToken" && (
                  <div className="relative col-span-2">
                    <div className="relative">
                      <label className="block mb-2 text-sm">Router</label>
                      <select className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-white dark:bg-dark outline-none text-sm">
                        <option value disabled>
                          Select Router Exchange
                        </option>
                        <option value="0x1aFa5D7f89743219576Ef48a9826261bE6378a68">
                          Pancakeswap(0x1aFa5D7f89743219576Ef48a9826261bE6378a68)
                          for Dao Chain
                        </option>
                        <option value="0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3">
                          PinkSwap Testnet (BNB Testnet)
                        </option>
                      </select>
                    </div>
                  </div>
                )} */}

                    {tokenType === "LiquidityGeneratorToken" && (
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <div className="relative col-span-1 max-md:col-span-2">
                          <div className="form-control">
                            <label className="label gap-3 cursor-pointer">
                              <span className="text-black dark:text-white">
                                Enable Max Wallet Limit
                                <span className="block label-text text-xs">
                                  Limits the maximum number of tokens that can
                                  be held by a single wallet.
                                </span>
                              </span>
                              <input
                                type="checkbox"
                                className="toggle"
                                onChange={(e) => setShowRange(e.target.checked)}
                              />
                            </label>
                          </div>
                          {showRange && (
                            <div className="relative mt-4">
                              <label className="block mb-2 text-sm">
                                Max Wallet (Buy)
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min={1}
                                  max={10}
                                  value={MaxWallet}
                                  className="range range-xs range-primary"
                                  onChange={(e) => setMaxWallet(e.target.value)}
                                />
                                <span>{MaxWallet}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="relative col-span-1 max-md:col-span-2">
                          <div className="form-control">
                            <label className="label gap-3 cursor-pointer">
                              <span className="text-black dark:text-white">
                                Enable Max Transaction Limit
                                <span className="block label-text text-xs">
                                  Limits the maximum number of tokens that can
                                  be transferred in a single transaction.
                                </span>
                              </span>
                              <input
                                type="checkbox"
                                className="toggle"
                                checked={showTransactionLimit}
                                onChange={() =>
                                  setShowTransactionLimit(!showTransactionLimit)
                                }
                              />
                            </label>
                          </div>
                          {showTransactionLimit && (
                            <div className="relative mt-4">
                              <label className="block mb-2 text-sm">
                                Max Transaction (Buy)
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min={1}
                                  max={10}
                                  className="range range-xs range-primary"
                                  onChange={(e) =>
                                    setMaxTransaction(e.target.value)
                                  }
                                  value={MaxTransaction}
                                />
                                <span>{MaxTransaction}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="relative col-span-2 max-md:col-span-2">
                          <div className="grid grid-cols-2 gap-4 border-t border-semi-dark py-5">
                            <div className="relative col-span-2 max-md:col-span-2">
                              <h6 className="font-medium">
                                Marketing/Operations Fee
                              </h6>
                              <p className="text-xs">
                                The percentage of the transaction that will be
                                sent to wallet set here. Maximum of 10%.
                              </p>
                            </div>
                            <div className="relative col-span-1 max-md:col-span-2">
                              <div className="relative">
                                <label className="block mb-2 text-sm">
                                  Marketing/Operations Fee (Buy)
                                </label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min={0}
                                    max={10}
                                    value={marketingFeesBuy}
                                    className="range range-xs range-primary"
                                    onChange={(e) =>
                                      setMarketingFeesBuy(e.target.value)
                                    }
                                  />
                                  <span>{marketingFeesBuy}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="relative col-span-1 max-md:col-span-2">
                              <div className="relative">
                                <label className="block mb-2 text-sm">
                                  Marketing/Operations Fee (Sell)
                                </label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min={0}
                                    max={10}
                                    value={marketingFeesSell}
                                    className="range range-xs range-primary"
                                    onChange={(e) =>
                                      setMarketingFeesSell(e.target.value)
                                    }
                                  />
                                  <span>{marketingFeesSell}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="relative col-span-2 max-md:col-span-2">
                              <div className="relative">
                                <label className="block mb-2 text-sm">
                                  Marketing/Operations Wallet
                                </label>
                                <input
                                  type="text"
                                  className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                                  placeholder="0x..."
                                  value={marketingWallet}
                                  onChange={(e) => {
                                    setMarketingWallet(e.target.value);
                                  }}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative col-span-2 max-md:col-span-2">
                          <div className="grid grid-cols-2 gap-4 border-t border-semi-dark py-5">
                            <div className="relative col-span-2 max-md:col-span-2">
                              <h6 className="font-medium">Burn Fee</h6>
                              <p className="text-xs">
                                The percentage of the transaction that will be
                                burned. Maximum of 10%.
                              </p>
                            </div>
                            <div className="relative col-span-1 max-md:col-span-2">
                              <div className="relative">
                                <label className="block mb-2 text-sm">
                                  Burn Fee (Buy)
                                </label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min={0}
                                    max={10}
                                    value={burnFeesBuy}
                                    className="range range-xs range-primary"
                                    onChange={(e) =>
                                      setBurnFeesBuy(e.target.value)
                                    }
                                  />
                                  <span>{burnFeesBuy}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="relative col-span-1 max-md:col-span-2">
                              <div className="relative">
                                <label className="block mb-2 text-sm">
                                  Burn Fee (Sell)
                                </label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min={0}
                                    max={10}
                                    value={burnFeesSell}
                                    className="range range-xs range-primary"
                                    onChange={(e) =>
                                      setBurnFeesSell(e.target.value)
                                    }
                                  />
                                  <span>{burnFeesSell}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="relative col-span-2 max-md:col-span-2">
                              <div className="relative">
                                <label className="block mb-2 text-sm">
                                  Burn Fee Wallet
                                </label>
                                <input
                                  type="text"
                                  className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                                  placeholder="0x..."
                                  value={burnWallet}
                                  onChange={(e) =>
                                    setBurnWallet(e.target.value)
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative col-span-2 max-md:col-span-2">
                          <div className="grid grid-cols-2 gap-4 border-t border-semi-dark py-5">
                            <div className="relative col-span-2 max-md:col-span-2">
                              <h6 className="font-medium">Liquidity Fees</h6>
                              <p className="text-xs">
                                The percentage of the transaction that will be
                                added to the liquidity pool. Maximum of 10%.
                              </p>
                            </div>
                            <div className="relative col-span-1 max-md:col-span-2">
                              <div className="relative">
                                <label className="block mb-2 text-sm">
                                  Liquidity Fee(Buy)
                                </label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min={0}
                                    max={10}
                                    value={liquidityFeesBuy}
                                    className="range range-xs range-primary"
                                    onChange={(e) =>
                                      setLiquidityFeesBuy(e.target.value)
                                    }
                                  />
                                  <span>{liquidityFeesBuy}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="relative col-span-1 max-md:col-span-2">
                              <div className="relative">
                                <label className="block mb-2 text-sm">
                                  Liquidity Fee(Sell)
                                </label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min={0}
                                    max={10}
                                    value={liquidityFeesSell}
                                    className="range range-xs range-primary"
                                    onChange={(e) =>
                                      setLiquidityFeesSell(e.target.value)
                                    }
                                  />
                                  <span>{liquidityFeesSell}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="relative col-span-2 max-md:col-span-2">
                              <div className="relative">
                                <label className="block mb-2 text-sm">
                                  Liquidity Fee Wallet
                                </label>
                                <input
                                  type="text"
                                  className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                                  placeholder="0x..."
                                  value={liquidityWallet}
                                  onChange={(e) =>
                                    setLiquidityWallet(e.target.value)
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {tokenType === "BabyToken" && (
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <div className="relative col-span-1 max-md:col-span-2">
                          <div className="relative">
                            <label className="block mb-2 text-sm">
                              Reward token
                            </label>
                            <input
                              type="text"
                              className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                              placeholder="0x..."
                              required
                            />
                            <div className="text-orange-500 text-xs mt-2">
                              Address is invalid
                            </div>

                            {/* USE THIS IF NEEDED => <span className="text-[#9333ea] text-xs">Fetching Token...</span> */}
                          </div>
                        </div>
                        <div className="relative col-span-1 max-md:col-span-2">
                          <div className="relative">
                            <label className="block mb-2 text-sm">
                              Minimum token balance for dividends
                            </label>
                            <input
                              type="number"
                              className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                              placeholder="1"
                              required
                            />
                            <div className="text-orange-500 text-xs mt-2">
                              Minimum token balance for dividends is a required
                              field
                            </div>
                            <span className="text-[#9333ea] text-xs">
                              Min hold each wallet must be over $50 to receive
                              rewards.
                            </span>
                          </div>
                        </div>
                        <div className="relative col-span-1 max-md:col-span-2">
                          <div className="relative">
                            <label className="block mb-2 text-sm">
                              Token reward fee (%)
                            </label>
                            <input
                              type="number"
                              className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                              placeholder="1"
                              required
                            />
                            <div className="text-orange-500 text-xs mt-2">
                              Token reward fee is a required field
                            </div>
                          </div>
                        </div>
                        <div className="relative col-span-1 max-md:col-span-2">
                          <div className="relative">
                            <label className="block mb-2 text-sm">
                              Auto add liquidity (%)
                            </label>
                            <input
                              type="number"
                              className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                              placeholder="1"
                              required
                            />
                            <div className="text-orange-500 text-xs mt-2">
                              Auto add liquidity is a required field
                            </div>
                          </div>
                        </div>
                        <div className="relative col-span-1 max-md:col-span-2">
                          <div className="relative">
                            <label className="block mb-2 text-sm">
                              Marketing fee (%)
                            </label>
                            <input
                              type="number"
                              className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                              placeholder="1"
                              required
                            />
                            <div className="text-orange-500 text-xs mt-2">
                              Marketing fee is a required field
                            </div>
                          </div>
                        </div>
                        <div className="relative col-span-1 max-md:col-span-2">
                          <div className="relative">
                            <label className="block mb-2 text-sm">
                              Marketing wallet
                            </label>
                            <input
                              type="text"
                              className="w-full h-11 p-3 rounded-xl border border-black dark:border-white bg-transparent outline-none text-sm"
                              placeholder="0x..."
                              required
                            />
                            <div className="text-orange-500 text-xs mt-2">
                              Address is invalid
                            </div>
                            <span className="text-[#9333ea] text-xs">
                              Owner and marketing wallet cannot be the same
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* <div className="relative col-span-2">
                  <div className="form-control">
                    <label className="cursor-pointer justify-start gap-2 label">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox checkbox-sm custom-checkbox"
                      />
                      <span className="text-sm">
                        Implement Pink Anti-Bot System
                      </span>
                    </label>
                  </div>
                </div> */}
                    <div className="relative col-span-2 text-center">
                      <button
                        type="submit"
                        className="button button-primary"
                        disabled={tokenType === "BabyToken"}
                        onClick={(e) => {
                          DeployToken(e);
                        }}
                      >
                        Create Token
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </BackgroundGradient>
          </Container>
        </section>
      </LandingWrapper>
    </>
  );
};

export default page;
