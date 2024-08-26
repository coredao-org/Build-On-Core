import { ethers } from "ethers";
import protocolABI from "./protocolABI.json"
import governanceABI from './governance.json'
import erc20ABI from './peertokenABI.json'

export const getProtocolContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        protocolABI,
        providerOrSigner
    );

export const getGovernanceContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_DAO_CONTRACT_ADDRESS,
        governanceABI,
        providerOrSigner
    );

export const getErc20TokenContract = (providerOrSigner, tokenAddress) =>
    new ethers.Contract(tokenAddress, erc20ABI, providerOrSigner);