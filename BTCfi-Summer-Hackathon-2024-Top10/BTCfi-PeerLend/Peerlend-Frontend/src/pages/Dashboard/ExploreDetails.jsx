import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MakeOffer from '../../components/MakeOffer';
import ServiceRequest from '../../components/ServiceRequest';
import UseFetchRequests from '../../Hooks/UseFetchRequests';
import LoadingSpinner from '../../components/LoadingSpinner';

import { formatUnits } from 'ethers';
import TokenList from '../../constants/tokenList';
import requestImage from '../../assets/request.jpeg';
import { convertOfferStatus } from '../../utility';

import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { getProtocolContract } from "../../constants/contract";
import { getProvider } from "../../constants/providers";
import { toast } from 'react-toastify';


const ExploreDetails = () => {
    const { id } = useParams();
    const allRequests = UseFetchRequests()
    const [transaction, setTransaction] = useState(null);

    const { address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();


    useEffect(() => {
        if (allRequests.length > 0) {
            const foundTransaction = allRequests.find(data => String(data?.id) === id);
            setTransaction(foundTransaction);
            console.log("Transaction:", foundTransaction);
        }
    }, [allRequests, id]);

    async function handleRespondToOffer(offerId, status) {
        if (id === "" || id === "0" || id === undefined) {
            return toast.error("Request Id is required", {
                position: "top-center",
            });
        }

        if (offerId === "" || offerId === undefined) {
            return toast.error("Offer Id is required", {
                position: "top-center",
            });
        }

        if (status !== "1" && status !== "2") {
            return toast.error("Invalid status", {
                position: "top-center",
            });
        }

        const provider = getProvider(walletProvider);
        const signer = await provider.getSigner();

        const contract = await getProtocolContract(signer);

        try {
            const transaction = await contract.respondToLendingOffer(id, offerId, status);
            const receipt = await transaction.wait();
            console.log(receipt);

            if (status === "1") {
                toast.success("Offer rejected", {
                    position: "top-center",
                });
            } else if (status === "2") {
                toast.success("Offer accepted", {
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error("Offer transaction failed", {
                position: "top-center",
            });
            console.log(error);
        }
    }

    return (
        <main>
            <h2 className="lg:text-[26px] md:text-[26px] text-[20px] mb-6 font-bold">Transaction Details</h2>
            {transaction ? (<div className="w-[100%] flex flex-col lg:flex-row  md:flex-row justify-between rounded-lg border border-bg-ash/35 bg-bg-gray p-4 mt-6">
                <img src={requestImage} alt="" className="w-[100%] lg:w-[50%] md:w-[50%] rounded-lg h-[200px] object-cover object-center mb-4" />
                <div className="w-[100%] lg:w-[47%] md:w-[47%]">
                    <p>Amount: {formatUnits(transaction?.amount, TokenList[transaction?.loanReq]?.decimals)}</p>
                    <p>Rate: {transaction?.interest.toString()}<span>&#37;</span></p>
                    <p>Repayment: {formatUnits(transaction?.repayment, TokenList[transaction?.loanReq]?.decimals)}</p>
                    <p>Return date: <span>{(new Date(Number(transaction?.rDate) * 1000)).toLocaleDateString()}</span></p>
                    <h2 className='my-4 text-[#E0BB83] font-bold'>Manage Requests</h2>
                    <div className='flex justify-between'>
                        <MakeOffer id={id} request={transaction} />
                        <ServiceRequest id={id} request={transaction} />
                    </div>
                </div>
            </div>) : <div>
                <LoadingSpinner />
            </div>}
            <section>
                <h2 className="lg:text-[26px] md:text-[26px] text-[20px] my-6 font-bold">Transaction Offers</h2>
                <div className="flex justify-between">
                    {
                        transaction?.Offer.map((offer, index) => {
                            return (
                                <div key={index} className="w-[100%] lg:w-[31%] md:w-[31%] rounded-lg border border-bg-ash/35 bg-bg-gray p-4 mt-6">
                                    <img src="https://img.freepik.com/free-photo/3d-render-businessman-hand-holding-money-banknotes_107791-17027.jpg?size=626&ext=jpg" alt="" className="w-[100%] rounded-lg h-[200px] object-cover object-center mb-4" />
                                    <p className="truncate">Lender: {offer.author}</p>
                                    <p>Amount: {formatUnits(offer.loanAmount, TokenList[offer?.tokenAdd]?.decimals)} </p>
                                    <p>Rate: {offer.loanInt.toString()}</p>
                                    <p>Status: {convertOfferStatus(offer.offerStat.toString())}</p>
                                    <p>Return date: <span>{new Date(Number(offer.rDate) * 1000).toLocaleDateString()}</span></p>
                                    {address === transaction?.address && (<div className="flex justify-between flex-col lg:flex-row md:flex-row flex-wrap">
                                        <button
                                            onClick={() => { handleRespondToOffer(offer.offerId.toString(), "2") }}
                                            className="bg-bg-ash text-darkGrey py-2 px-4 rounded-lg lg:text-[18px] md:text-[18px] text-[16px] w-[40%] my-4 mx-auto text-center font-bold truncate flex">
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => { handleRespondToOffer(offer.offerId.toString(), "1") }}
                                            className="bg-bg-ash text-darkGrey py-2 px-4 rounded-lg lg:text-[18px] md:text-[18px] text-[16px] w-[40%] my-4 mx-auto text-center font-bold truncate flex">
                                            Reject
                                        </button>
                                    </div>)}
                                </div >

                            )
                        })
                    }
                </div >
            </section>
        </main >
    );
}

export default ExploreDetails;
