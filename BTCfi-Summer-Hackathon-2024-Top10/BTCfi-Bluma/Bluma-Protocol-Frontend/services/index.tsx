import { ethers } from "ethers";
import BLUMA_CT_ABI from "@/json/bluma.json";
import BLUMA_TOKEN_ABI from "@/json/bluma-token.json";
import BLUMA_NFT_ABI from "@/json/bluma-nft.json";

let ethereum: any;
if (typeof window !== "undefined") ethereum = (window as any).ethereum;

const BLUMA_CA = process.env.NEXT_PUBLIC_BLUMA_CA!;
const TOKEN_CA = process.env.NEXT_PUBLIC_TOKEN_CA!;
const NFT_CA = process.env.NEXT_PUBLIC_NFT_CA!;

export const getRequiredSigner = async () => {
  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  if (typeof ethereum.request !== "function") {
    throw new Error("MetaMask does not support ethereum.request method");
  }

  try {
    const accounts = await ethereum.request({ method: "eth_accounts" });

    let provider;
    let signer;

    if (accounts?.length > 0) {
      provider = new ethers.BrowserProvider(ethereum);
      signer = await provider.getSigner();
      return signer;
    } else {
      provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      // provider = new ethers.WebSocketProvider(
      //   process.env.NEXT_PUBLIC_WEB_SOCKET!
      // );
      const wallet = ethers.Wallet.createRandom();
      signer = wallet.connect(provider);
      return signer;
    }
  } catch (error) {
    console.error("Error getting SIGNER:", error);
    throw new Error("Failed to get SIGNER");
  }
};

export const getBlumaContracts = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const signer = await getRequiredSigner();

    const contracts = new ethers.Contract(BLUMA_CA, BLUMA_CT_ABI.abi, signer);
    return contracts;
  } catch (error) {
    console.error("Error getting Ethereum contracts:", error);
    throw new Error("Failed to get Ethereum contracts");
  }
};

export const getBlumaTokenContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const signer = await getRequiredSigner();

    const contracts = new ethers.Contract(
      TOKEN_CA,
      BLUMA_TOKEN_ABI.abi,
      signer
    );
    return contracts;
  } catch (error) {
    console.error("Error getting Ethereum contracts:", error);
    throw new Error("Failed to get Ethereum contracts");
  }
};

export const getBlumaNFTContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const signer = await getRequiredSigner();

    const contracts = new ethers.Contract(NFT_CA, BLUMA_NFT_ABI.abi, signer);
    return contracts;
  } catch (error) {
    console.error("Error getting Ethereum contracts:", error);
    throw new Error("Failed to get Ethereum contracts");
  }
};
