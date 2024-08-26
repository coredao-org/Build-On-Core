import { SUPPORTED_CHAIN } from "../connection";
import { getProtocolContract } from "../constants/contract";
import { getProvider } from "../constants/providers";

export const isSupportedChain = (chainId) =>
    Number(chainId) === SUPPORTED_CHAIN;

export const getWriteProtocolContract = async (provider) => {
    const readWriteProvider = getProvider(provider);

    const signer = await readWriteProvider.getSigner();

    return getProtocolContract(signer);
};

export const isAdmin = (address) => {
    return address === import.meta.env.VITE_ADMIN_ADDRESS;
}

export const convertStatus = (status) => {
    switch (status) {
        case "0":
            return "PENDING"
        case "1":
            return "ACTIVE"
        case "2":
            return "SUCCEEDED"
        case "3":
            return "EXPIRED"
        case "4":
            return "EXECUTED"
        case "5":
            return "DEFEATED"
    }
}

export const convertService = (service) => {
    switch (service) {
        case "0":
            return "OPEN"
        case "1":
            return "SERVICED"
        case "2":
            return "CLOSED"
    }
}

export const convertOfferStatus = (status) => {
    switch (status) {
        case "0":
            return "OPEN"
        case "1":
            return "REJECTED"
        case "2":
            return "ACCEPTED"
    }
}
