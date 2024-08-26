import { useCallback, useEffect, useState } from "react";
import { readOnlyProvider } from "../constants/providers";
import { getProtocolContract } from "../constants/contract";
import { wssProvider } from "../constants/providers";
import { ethers } from "ethers";

const UseFetchRequests = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [count, setCount] = useState(0);


    const fetchAllRequests = useCallback(async () => {
        try {
            const contract = getProtocolContract(readOnlyProvider);
            const res = await contract.getAllRequest();
            const converted = res?.map((item) => {
                return {
                    id: item[0],
                    address: item[1],
                    amount: item[2],
                    interest: item[3],
                    repayment: item[4],
                    Offer: item[5]?.map((ite) => {
                        return {
                            offerId: ite[0],
                            tokenAdd: ite[1],
                            author: ite[2],
                            loanAmount: ite[3],
                            loanInt: ite[4],
                            rDate: ite[5],
                            offerStat: ite[6]
                        }
                    }),
                    rDate: item[6],
                    lender: item[7],
                    loanReq: item[8],
                    loanStatus: item[9]

                }
            })
            setAllRequests(converted)
        } catch (error) {
            console.error(error);
        }
    }, []);

    const trackingRequests = useCallback(() => {
        setCount((prevValue) => prevValue + 1);
        fetchAllRequests();
    }, [fetchAllRequests]);


    useEffect(() => {
        fetchAllRequests();

        const filter = {
            address: import.meta.env.VITE_CONTRACT_ADDRESS,
            topics: [ethers.id("RequestCreated(address,uint,uint,uint)")],
        };

        wssProvider.getLogs({ ...filter, fromBlock: 5833274 }).then((events) => {
            setCount(events.length + 1);
        });

        const provider = new ethers.WebSocketProvider(
            import.meta.env.VITE_WSS_RPC_URL
        );
        provider.on(filter, trackingRequests);

        return () => {
            // Perform cleanup
            provider.off(filter, trackingRequests);
        };

    }, [fetchAllRequests, trackingRequests, count]);

    return allRequests;
}

export default UseFetchRequests